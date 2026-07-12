/// Conduit Core — Event Ticketing on Sui
/// 
/// This module implements the core ticketing logic for Conduit:
/// - Event creation and management
/// - NFT ticket minting
/// - Price cap enforcement on resale
/// - Automatic royalty distribution
/// - Sui Kiosk integration for secondary marketplace
module conduit_core::conduit_core {
    use std::string::{Self, String};
    use sui::object::{Self, ID, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::clock::{Self, Clock};
    use sui::event;
    use sui::coin::{Self, Coin};
    use sui::balance::{Self, Balance};
    use sui::sui::SUI;
    use sui::kiosk::{Self, Kiosk, KioskOwnerCap};

    // ─── Errors ───────────────────────────────────────────────
    
    const ENotOrganizer: u64 = 0;
    const EEventNotActive: u64 = 1;
    const EEventSoldOut: u64 = 2;
    const EInvalidPrice: u64 = 3;
    const EPriceCapExceeded: u64 = 4;
    const ENotTicketOwner: u64 = 5;
    const EInsufficientPayment: u64 = 6;
    const EInvalidRoyalty: u64 = 7;
    const EEventNotStarted: u64 = 8;
    const EEventAlreadyEnded: u64 = 9;

    // ─── Constants ────────────────────────────────────────────
    
    const MAX_ROYALTY_BPS: u64 = 1500; // 15% max royalty
    const BPS_DENOMINATOR: u64 = 10000;

    // ─── Structs ──────────────────────────────────────────────

    /// One-time witness for package initialization
    public struct CONDUIT_CORE has drop {}

    /// Capability授予给平台管理员
    public struct AdminCap has key, store {
        id: UID,
    }

    /// Represents an event created by an organizer
    public struct Event has key, store {
        id: UID,
        /// Name of the event
        name: String,
        /// Description
        description: String,
        /// Event image URL (IPFS/Walrus)
        image_url: String,
        /// Event start time (unix timestamp ms)
        start_time: u64,
        /// Event end time (unix timestamp ms)
        end_time: u64,
        /// Venue name or location
        venue: String,
        /// Organizer address
        organizer: address,
        /// Ticket price in MIST (0 for free events)
        ticket_price: u64,
        /// Maximum resale price cap in MIST (0 = no cap)
        resale_price_cap: u64,
        /// Royalty percentage in basis points (e.g., 500 = 5%)
        royalty_bps: u64,
        /// Total ticket supply
        total_supply: u64,
        /// Tickets sold
        tickets_sold: u64,
        /// Event category (conference, meetup, party, etc.)
        category: String,
        /// Is the event active?
        is_active: bool,
        /// Platform fee in basis points
        platform_fee_bps: u64,
    }

    /// Represents a ticket NFT
    public struct Ticket has key, store {
        id: UID,
        /// Event ID this ticket belongs to
        event_id: ID,
        /// Ticket number (1-indexed)
        ticket_number: u64,
        /// Ticket tier (GA, VIP, etc.)
        tier: String,
        /// Original purchase price
        purchase_price: u64,
        /// Original owner (for tracking)
        original_owner: address,
        /// Is this ticket checked in?
        checked_in: bool,
        /// Is this ticket used?
        is_used: bool,
    }

    /// Organizer capability - allows creating events
    public struct OrganizerCap has key, store {
        id: UID,
        /// The address of the organizer
        organizer: address,
        /// Organizer name
        name: String,
    }

    // ─── Events ───────────────────────────────────────────────

    public struct EventCreated has copy, drop {
        event_id: ID,
        organizer: address,
        name: String,
        start_time: u64,
        total_supply: u64,
    }

    public struct TicketMinted has copy, drop {
        ticket_id: ID,
        event_id: ID,
        ticket_number: u64,
        tier: String,
        buyer: address,
        price: u64,
    }

    public struct TicketPurchased has copy, drop {
        ticket_id: ID,
        event_id: ID,
        seller: address,
        buyer: address,
        price: u64,
        royalty_paid: u64,
    }

    public struct TicketCheckedIn has copy, drop {
        ticket_id: ID,
        event_id: ID,
        timestamp: u64,
    }

    public struct RoyaltyDistributed has copy, drop {
        event_id: ID,
        organizer: address,
        amount: u64,
    }

    // ─── Init ─────────────────────────────────────────────────

    /// Initialize the module and create admin capability
    fun init(witness: CONDUIT_CORE, ctx: &mut TxContext) {
        // Create and transfer admin capability to deployer
        transfer::transfer(
            AdminCap {
                id: object::new(ctx),
            },
            tx_context::sender(ctx)
        );
    }

    // ─── Organizer Functions ───────────────────────────────────

    /// Register as an organizer
    public fun register_organizer(
        name: String,
        ctx: &mut TxContext
    ) {
        let cap = OrganizerCap {
            id: object::new(ctx),
            organizer: tx_context::sender(ctx),
            name,
        };
        transfer::transfer(cap, tx_context::sender(ctx));
    }

    /// Create a new event
    public fun create_event(
        _cap: &OrganizerCap,
        name: String,
        description: String,
        image_url: String,
        start_time: u64,
        end_time: u64,
        venue: String,
        ticket_price: u64,
        resale_price_cap: u64,
        royalty_bps: u64,
        total_supply: u64,
        category: String,
        ctx: &mut TxContext
    ): ID {
        // Validate royalty
        assert!(royalty_bps <= MAX_ROYALTY_BPS, EInvalidRoyalty);

        let event = Event {
            id: object::new(ctx),
            name,
            description,
            image_url,
            start_time,
            end_time,
            venue,
            organizer: tx_context::sender(ctx),
            ticket_price,
            resale_price_cap,
            royalty_bps,
            total_supply,
            tickets_sold: 0,
            category,
            is_active: true,
            platform_fee_bps: 250, // 2.5% default platform fee
        };

        let event_id = object::id(&event);

        event::emit(EventCreated {
            event_id,
            organizer: tx_context::sender(ctx),
            name,
            start_time,
            total_supply,
        });

        transfer::share_object(event);
        event_id
    }

    /// Update event details (organizer only)
    public fun update_event(
        event: &mut Event,
        _cap: &OrganizerCap,
        is_active: bool,
        ctx: &mut TxContext
    ) {
        assert!(event.organizer == tx_context::sender(ctx), ENotOrganizer);
        event.is_active = is_active;
    }

    // ─── Ticket Minting ───────────────────────────────────────

    /// Mint a ticket for a free event (claim)
    public fun claim_free_ticket(
        event: &mut Event,
        tier: String,
        clock: &Clock,
        ctx: &mut TxContext
    ): Ticket {
        // Verify event is active
        assert!(event.is_active, EEventNotActive);
        
        // Verify tickets available
        assert!(event.tickets_sold < event.total_supply, EEventSoldOut);
        assert!(event.ticket_price == 0, EInvalidPrice);

        event.tickets_sold = event.tickets_sold + 1;

        let ticket = Ticket {
            id: object::new(ctx),
            event_id: object::id(event),
            ticket_number: event.tickets_sold,
            tier,
            purchase_price: 0,
            original_owner: tx_context::sender(ctx),
            checked_in: false,
            is_used: false,
        };

        event::emit(TicketMinted {
            ticket_id: object::id(&ticket),
            event_id: object::id(event),
            ticket_number: event.tickets_sold,
            tier,
            buyer: tx_context::sender(ctx),
            price: 0,
        });

        ticket
    }

    /// Purchase a ticket for a paid event
    public fun purchase_ticket(
        event: &mut Event,
        payment: Coin<SUI>,
        tier: String,
        clock: &Clock,
        ctx: &mut TxContext
    ): Ticket {
        // Verify event is active
        assert!(event.is_active, EEventNotActive);
        
        // Verify tickets available
        assert!(event.tickets_sold < event.total_supply, EEventSoldOut);
        assert!(event.ticket_price > 0, EInvalidPrice);

        // Verify payment
        let price = event.ticket_price;
        assert!(coin::value(&payment) >= price, EInsufficientPayment);

        event.tickets_sold = event.tickets_sold + 1;

        // Calculate platform fee
        let platform_fee = (price * event.platform_fee_bps) / BPS_DENOMINATOR;
        let organizer_amount = price - platform_fee;

        // Split payment
        let payment_balance = coin::into_balance(payment);
        
        // Pay organizer
        let organizer_payment = coin::from_balance(
            balance::split(&mut payment_balance, organizer_amount),
            ctx
        );
        transfer::public_transfer(organizer_payment, event.organizer);

        // Platform fee (sent to admin/treasury)
        let platform_payment = coin::from_balance(
            balance::split(&mut payment_balance, platform_fee),
            ctx
        );
        // In production, this goes to platform treasury
        transfer::public_transfer(platform_payment, event.organizer);

        // Handle any overpayment (refund)
        if (balance::value(&payment_balance) > 0) {
            let refund_coin = coin::from_balance(payment_balance, ctx);
            transfer::public_transfer(refund_coin, tx_context::sender(ctx));
        } else {
            balance::destroy_zero(payment_balance);
        };

        let ticket = Ticket {
            id: object::new(ctx),
            event_id: object::id(event),
            ticket_number: event.tickets_sold,
            tier,
            purchase_price: price,
            original_owner: tx_context::sender(ctx),
            checked_in: false,
            is_used: false,
        };

        event::emit(TicketMinted {
            ticket_id: object::id(&ticket),
            event_id: object::id(event),
            ticket_number: event.tickets_sold,
            tier,
            buyer: tx_context::sender(ctx),
            price,
        });

        ticket
    }

    // ─── Secondary Market (Kiosk) ─────────────────────────────

    /// List a ticket for resale on Sui Kiosk
    public fun list_for_resale(
        kiosk: &mut Kiosk,
        kiosk_cap: &KioskOwnerCap,
        ticket: Ticket,
        event: &Event,
        list_price: u64,
        _ctx: &mut TxContext
    ) {
        // Verify price cap
        assert!(
            event.resale_price_cap == 0 || list_price <= event.resale_price_cap,
            EPriceCapExceeded
        );

        // Verify event is still active
        assert!(event.is_active, EEventNotActive);

        // Place ticket in kiosk for sale
        kiosk::list<Ticket>(kiosk, kiosk_cap, object::id(&ticket), list_price);
        
        // Transfer ticket to kiosk
        transfer::public_transfer(ticket, kiosk::uid(kiosk));
    }

    /// Buy a ticket from the secondary market (Kiosk)
    public fun buy_from_resale(
        kiosk: &mut Kiosk,
        ticket_id: ID,
        event: &Event,
        payment: Coin<SUI>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        // Verify event is active
        assert!(event.is_active, EEventNotActive);

        // Get the listing price
        let list_price = kiosk::price(kiosk, ticket_id);
        
        // Verify payment
        assert!(coin::value(&payment) >= list_price, EInsufficientPayment);

        // Calculate royalties and fees
        let royalty_amount = (list_price * event.royalty_bps) / BPS_DENOMINATOR;
        let platform_fee = (list_price * event.platform_fee_bps) / BPS_DENOMINATOR;
        let seller_proceeds = list_price - royalty_amount - platform_fee;

        // Split payment
        let payment_balance = coin::into_balance(payment);
        
        // Pay seller (using kiosk withdrawal)
        let seller_payment = coin::from_balance(
            balance::split(&mut payment_balance, seller_proceeds),
            ctx
        );
        // In production, we'd need to get seller address from kiosk
        // For now, we'll transfer to a placeholder
        transfer::public_transfer(seller_payment, event.organizer);

        // Pay royalty to organizer/artist
        if (royalty_amount > 0) {
            let royalty_payment = coin::from_balance(
                balance::split(&mut payment_balance, royalty_amount),
                ctx
            );
            transfer::public_transfer(royalty_payment, event.organizer);
            
            event::emit(RoyaltyDistributed {
                event_id: object::id(event),
                organizer: event.organizer,
                amount: royalty_amount,
            });
        };

        // Platform fee
        if (platform_fee > 0) {
            let platform_payment = coin::from_balance(
                balance::split(&mut payment_balance, platform_fee),
                ctx
            );
            transfer::public_transfer(platform_payment, event.organizer);
        };

        // Clean up remaining balance
        balance::destroy_zero(payment_balance);

        event::emit(TicketPurchased {
            ticket_id,
            event_id: object::id(event),
            seller: event.organizer,
            buyer: tx_context::sender(ctx),
            price: list_price,
            royalty_paid: royalty_amount,
        });
    }

    // ─── Check-in ─────────────────────────────────────────────

    /// Check in a ticket (organizer only)
    public fun check_in_ticket(
        event: &Event,
        ticket: &mut Ticket,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        // Verify organizer
        assert!(event.organizer == tx_context::sender(ctx), ENotOrganizer);
        
        // Verify ticket belongs to this event
        assert!(ticket.event_id == object::id(event), ENotTicketOwner);
        
        // Verify not already checked in
        assert!(!ticket.checked_in, EEventAlreadyEnded);

        ticket.checked_in = true;
        ticket.is_used = true;

        event::emit(TicketCheckedIn {
            ticket_id: object::id(ticket),
            event_id: object::id(event),
            timestamp: clock::timestamp_ms(clock),
        });
    }

    // ─── View Functions ───────────────────────────────────────

    /// Get event details
    public fun get_event_info(event: &Event): (
        String, String, String, u64, u64, String, address, u64, u64, u64, u64, String, bool
    ) {
        (
            event.name,
            event.description,
            event.image_url,
            event.start_time,
            event.end_time,
            event.venue,
            event.organizer,
            event.ticket_price,
            event.resale_price_cap,
            event.royalty_bps,
            event.total_supply,
            event.category,
            event.is_active,
        )
    }

    /// Get ticket details
    public fun get_ticket_info(ticket: &Ticket): (ID, u64, String, u64, address, bool, bool) {
        (
            ticket.event_id,
            ticket.ticket_number,
            ticket.tier,
            ticket.purchase_price,
            ticket.original_owner,
            ticket.checked_in,
            ticket.is_used,
        )
    }

    /// Check if event has available tickets
    public fun has_available_tickets(event: &Event): bool {
        event.tickets_sold < event.total_supply
    }

    /// Get remaining tickets
    public fun remaining_tickets(event: &Event): u64 {
        event.total_supply - event.tickets_sold
    }
}
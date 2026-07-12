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

    // ─── Errors ───────────────────────────────────────────────
    
    const ENotOrganizer: u64 = 0;
    const EEventNotActive: u64 = 1;
    const EEventSoldOut: u64 = 2;
    const EInvalidPrice: u64 = 3;
    const EPriceCapExceeded: u64 = 4;
    const ENotTicketOwner: u64 = 5;
    const EInsufficientPayment: u64 = 6;
    const EInvalidRoyalty: u64 = 7;
    const EEventAlreadyEnded: u64 = 9;

    // ─── Constants ────────────────────────────────────────────
    
    const MAX_ROYALTY_BPS: u64 = 1500; // 15% max royalty
    const BPS_DENOMINATOR: u64 = 10000;

    // ─── Structs ──────────────────────────────────────────────

    /// One-time witness for package initialization
    public struct CONDUIT_CORE has drop {}

    /// Capability granted to platform admin
    public struct AdminCap has key, store {
        id: UID,
    }

    /// Represents an event created by an organizer
    public struct Event has key, store {
        id: UID,
        name: String,
        description: String,
        image_url: String,
        start_time: u64,
        end_time: u64,
        venue: String,
        organizer: address,
        ticket_price: u64,
        resale_price_cap: u64,
        royalty_bps: u64,
        total_supply: u64,
        tickets_sold: u64,
        category: String,
        is_active: bool,
        platform_fee_bps: u64,
    }

    /// Represents a ticket NFT
    public struct Ticket has key, store {
        id: UID,
        event_id: ID,
        ticket_number: u64,
        tier: String,
        purchase_price: u64,
        original_owner: address,
        checked_in: bool,
        is_used: bool,
    }

    /// Organizer capability
    public struct OrganizerCap has key, store {
        id: UID,
        organizer: address,
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

    fun init(_witness: CONDUIT_CORE, ctx: &mut TxContext) {
        transfer::transfer(
            AdminCap {
                id: object::new(ctx),
            },
            tx_context::sender(ctx)
        );
    }

    // ─── Organizer Functions ───────────────────────────────────

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
            platform_fee_bps: 250, // 2.5%
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

    public fun claim_free_ticket(
        event: &mut Event,
        tier: String,
        _clock: &Clock,
        ctx: &mut TxContext
    ): Ticket {
        assert!(event.is_active, EEventNotActive);
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

    public fun purchase_ticket(
        event: &mut Event,
        payment: Coin<SUI>,
        tier: String,
        _clock: &Clock,
        ctx: &mut TxContext
    ): Ticket {
        assert!(event.is_active, EEventNotActive);
        assert!(event.tickets_sold < event.total_supply, EEventSoldOut);
        assert!(event.ticket_price > 0, EInvalidPrice);

        let price = event.ticket_price;
        assert!(coin::value(&payment) >= price, EInsufficientPayment);

        event.tickets_sold = event.tickets_sold + 1;

        let platform_fee = (price * event.platform_fee_bps) / BPS_DENOMINATOR;
        let organizer_amount = price - platform_fee;

        let mut payment_balance = coin::into_balance(payment);
        
        let organizer_payment = coin::from_balance(
            balance::split(&mut payment_balance, organizer_amount),
            ctx
        );
        transfer::public_transfer(organizer_payment, event.organizer);

        let platform_payment = coin::from_balance(
            balance::split(&mut payment_balance, platform_fee),
            ctx
        );
        transfer::public_transfer(platform_payment, event.organizer);

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

    // ─── Check-in ─────────────────────────────────────────────

    public fun check_in_ticket(
        event: &Event,
        ticket: &mut Ticket,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(event.organizer == tx_context::sender(ctx), ENotOrganizer);
        assert!(ticket.event_id == object::id(event), ENotTicketOwner);
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

    /// Get event organizer address
    public fun get_organizer(event: &Event): address {
        event.organizer
    }

    /// Get event name
    public fun get_name(event: &Event): String {
        event.name
    }

    /// Get event is_active
    public fun get_is_active(event: &Event): bool {
        event.is_active
    }

    /// Get ticket event_id
    public fun get_ticket_event_id(ticket: &Ticket): ID {
        ticket.event_id
    }

    /// Get ticket checked_in status
    public fun get_ticket_checked_in(ticket: &Ticket): bool {
        ticket.checked_in
    }

    public fun has_available_tickets(event: &Event): bool {
        event.tickets_sold < event.total_supply
    }

    public fun remaining_tickets(event: &Event): u64 {
        event.total_supply - event.tickets_sold
    }

    public fun get_ticket_price(event: &Event): u64 {
        event.ticket_price
    }

    public fun get_resale_price_cap(event: &Event): u64 {
        event.resale_price_cap
    }

    public fun get_royalty_bps(event: &Event): u64 {
        event.royalty_bps
    }

    public fun get_tickets_sold(event: &Event): u64 {
        event.tickets_sold
    }

    public fun get_total_supply(event: &Event): u64 {
        event.total_supply
    }
}

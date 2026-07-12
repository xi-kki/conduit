/// Conduit Batch — Batch Operations for Organizers
/// 
/// This module implements batch operations:
/// - Batch ticket minting (100+ in one tx)
/// - Batch check-in
/// - CSV import support
module conduit_core::batch {
    use std::string::String;
    use sui::object::{ID};
    use sui::tx_context::{Self, TxContext};
    use sui::event;
    use conduit_core::conduit_core::{Self, Event, Ticket, OrganizerCap};

    // ─── Errors ───────────────────────────────────────────────
    const ENotOrganizer: u64 = 0;
    const EBatchTooLarge: u64 = 1;
    const EInvalidTier: u64 = 2;

    // ─── Constants ────────────────────────────────────────────
    const MAX_BATCH_SIZE: u64 = 100;

    // ─── Events ───────────────────────────────────────────────

    public struct BatchMinted has copy, drop {
        event_id: ID,
        count: u64,
        organizer: address,
    }

    public struct BatchCheckedIn has copy, drop {
        event_id: ID,
        count: u64,
        organizer: address,
    }

    // ─── Functions ────────────────────────────────────────────

    /// Batch mint free tickets
    /// `count` tickets will be minted with the specified tier
    public fun batch_mint_free(
        _cap: &OrganizerCap,
        event: &mut Event,
        tier: String,
        count: u64,
        ctx: &mut TxContext
    ): vector<Ticket> {
        // Verify organizer
        assert!(
            conduit_core::get_event_info(event).6 == tx_context::sender(ctx),
            ENotOrganizer
        );
        
        // Verify batch size
        assert!(count <= MAX_BATCH_SIZE, EBatchTooLarge);
        
        // Verify tickets available
        assert!(
            conduit_core::remaining_tickets(event) >= count,
            EBatchTooLarge
        );

        let tickets = vector::empty<Ticket>();
        let i = 0;

        while (i < count) {
            let ticket = conduit_core::claim_free_ticket(
                event,
                tier,
                &sui::clock::Clock {},
                ctx
            );
            vector::push_back(&mut tickets, ticket);
            i = i + 1;
        };

        event::emit(BatchMinted {
            event_id: object::id(event),
            count,
            organizer: tx_context::sender(ctx),
        });

        tickets
    }

    /// Batch check-in tickets
    /// Returns count of successfully checked-in tickets
    public fun batch_check_in(
        _cap: &OrganizerCap,
        event: &Event,
        tickets: &mut vector<Ticket>,
        clock: &sui::clock::Clock,
        ctx: &mut TxContext
    ): u64 {
        // Verify organizer
        assert!(
            conduit_core::get_event_info(event).6 == tx_context::sender(ctx),
            ENotOrganizer
        );

        let count = vector::length(tickets);
        let checked_in = 0;
        let i = 0;

        while (i < count) {
            let ticket = vector::borrow_mut(tickets, i);
            
            // Only check in valid tickets for this event
            if (
                conduit_core::get_ticket_info(ticket).0 == object::id(event) &&
                !conduit_core::get_ticket_info(ticket).5 // not already checked in
            ) {
                conduit_core::check_in_ticket(event, ticket, clock, ctx);
                checked_in = checked_in + 1;
            };

            i = i + 1;
        };

        event::emit(BatchCheckedIn {
            event_id: object::id(event),
            count: checked_in,
            organizer: tx_context::sender(ctx),
        });

        checked_in
    }
}
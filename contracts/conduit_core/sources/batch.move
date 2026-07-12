/// Conduit Batch — Batch Operations for Organizers
module conduit_core::batch {
    use std::string::String;
    use sui::object::ID;
    use sui::tx_context::{Self, TxContext};
    use sui::event;
    use sui::clock::Clock;
    use conduit_core::conduit_core::{Self, Event, Ticket, OrganizerCap};

    const ENotOrganizer: u64 = 0;
    const EBatchTooLarge: u64 = 1;
    const MAX_BATCH_SIZE: u64 = 100;

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

    public fun batch_mint_free(
        _cap: &OrganizerCap,
        event: &mut Event,
        tier: String,
        count: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ): vector<Ticket> {
        assert!(
            conduit_core::get_organizer(event) == tx_context::sender(ctx),
            ENotOrganizer
        );
        assert!(count <= MAX_BATCH_SIZE, EBatchTooLarge);
        assert!(conduit_core::remaining_tickets(event) >= count, EBatchTooLarge);

        let mut tickets = vector[];
        let mut i = 0;

        while (i < count) {
            let ticket = conduit_core::claim_free_ticket(event, tier, clock, ctx);
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

    public fun batch_check_in(
        _cap: &OrganizerCap,
        event: &Event,
        tickets: &mut vector<Ticket>,
        clock: &Clock,
        ctx: &mut TxContext
    ): u64 {
        assert!(
            conduit_core::get_organizer(event) == tx_context::sender(ctx),
            ENotOrganizer
        );

        let count = vector::length(tickets);
        let mut checked_in = 0;
        let mut i = 0;

        while (i < count) {
            let ticket = vector::borrow_mut(tickets, i);
            if (
                conduit_core::get_ticket_event_id(ticket) == object::id(event) &&
                !conduit_core::get_ticket_checked_in(ticket)
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

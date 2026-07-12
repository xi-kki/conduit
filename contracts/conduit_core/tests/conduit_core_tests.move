#[test_only]
module conduit_core::conduit_core_tests {
    use std::string;
    use sui::test_scenario::{Self, Scenario};
    use sui::clock::{Self, Clock};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::kiosk::{Self, Kiosk, KioskOwnerCap};
    use conduit_core::conduit_core::{Self, Event, Ticket, AdminCap, OrganizerCap};

    // ─── Test Constants ───────────────────────────────────────
    
    const ORGANIZER: address = @0x1;
    const BUYER: address = @0x2;
    const BUYER2: address = @0x3;
    const ONE_SUI: u64 = 1_000_000_000;
    const EVENT_START: u64 = 1700000000000; // Some future timestamp
    const EVENT_END: u64 = 1700003600000; // 1 hour later

    // ─── Helper Functions ─────────────────────────────────────

    fun setup(): Scenario {
        let scenario = test_scenario::begin(ORGANIZER);
        scenario
    }

    fun create_organizer_cap(scenario: &mut Scenario) {
        test_scenario::next_tx(scenario, ORGANIZER);
        {
            let ctx = test_scenario::ctx(scenario);
            conduit_core::register_organizer(
                string::utf8(b"Test Organizer"),
                ctx
            );
        };
    }

    fun create_free_event(scenario: &mut Scenario): ID {
        test_scenario::next_tx(scenario, ORGANIZER);
        {
            let cap = test_scenario::take_from_sender<OrganizerCap>(scenario);
            let ctx = test_scenario::ctx(scenario);
            
            let event_id = conduit_core::create_event(
                &cap,
                string::utf8(b"Free Web3 Meetup"),
                string::utf8(b"A fun Web3 meetup"),
                string::utf8(b"https://example.com/image.jpg"),
                EVENT_START,
                EVENT_END,
                string::utf8(b"Virtual"),
                0, // Free
                0, // No resale cap
                500, // 5% royalty
                100, // 100 tickets
                string::utf8(b"meetup"),
                ctx
            );
            
            test_scenario::return_to_sender(scenario, cap);
            event_id
        }
    }

    fun create_paid_event(scenario: &mut Scenario): ID {
        test_scenario::next_tx(scenario, ORGANIZER);
        {
            let cap = test_scenario::take_from_sender<OrganizerCap>(scenario);
            let ctx = test_scenario::ctx(scenario);
            
            let event_id = conduit_core::create_event(
                &cap,
                string::utf8(b"Premium Conference"),
                string::utf8(b"A premium Web3 conference"),
                string::utf8(b"https://example.com/image.jpg"),
                EVENT_START,
                EVENT_END,
                string::utf8(b"San Francisco"),
                ONE_SUI / 10, // 0.1 SUI
                ONE_SUI / 5, // 0.2 SUI resale cap
                1000, // 10% royalty
                50, // 50 tickets
                string::utf8(b"conference"),
                ctx
            );
            
            test_scenario::return_to_sender(scenario, cap);
            event_id
        }
    }

    // ─── Organizer Tests ──────────────────────────────────────

    #[test]
    fun test_register_organizer() {
        let scenario = setup();
        create_organizer_cap(&mut scenario);
        
        test_scenario::next_tx(&mut scenario, ORGANIZER);
        {
            let cap = test_scenario::take_from_sender<OrganizerCap>(&scenario);
            // Verify cap exists
            test_scenario::return_to_sender(&scenario, cap);
        };
        
        test_scenario::end(scenario);
    }

    #[test]
    fun test_create_free_event() {
        let scenario = setup();
        create_organizer_cap(&mut scenario);
        let event_id = create_free_event(&mut scenario);
        
        test_scenario::next_tx(&mut scenario, ORGANIZER);
        {
            let event = test_scenario::take_shared<Event>(event_id);
            let (name, _, _, _, _, _, _, price, _, _, supply, _, active) = 
                conduit_core::get_event_info(&event);
            
            assert!(name == string::utf8(b"Free Web3 Meetup"), 0);
            assert!(price == 0, 1);
            assert!(supply == 100, 2);
            assert!(active == true, 3);
            
            test_scenario::return_shared(event);
        };
        
        test_scenario::end(scenario);
    }

    #[test]
    fun test_create_paid_event() {
        let scenario = setup();
        create_organizer_cap(&mut scenario);
        let event_id = create_paid_event(&mut scenario);
        
        test_scenario::next_tx(&mut scenario, ORGANIZER);
        {
            let event = test_scenario::take_shared<Event>(event_id);
            let (name, _, _, _, _, _, _, price, resale_cap, royalty, supply, _, active) = 
                conduit_core::get_event_info(&event);
            
            assert!(name == string::utf8(b"Premium Conference"), 0);
            assert!(price == ONE_SUI / 10, 1);
            assert!(resale_cap == ONE_SUI / 5, 2);
            assert!(royalty == 1000, 3);
            assert!(supply == 50, 4);
            assert!(active == true, 5);
            
            test_scenario::return_shared(event);
        };
        
        test_scenario::end(scenario);
    }

    // ─── Ticket Tests ─────────────────────────────────────────

    #[test]
    fun test_claim_free_ticket() {
        let scenario = setup();
        create_organizer_cap(&mut scenario);
        let event_id = create_free_event(&mut scenario);
        
        // Buyer claims a ticket
        test_scenario::next_tx(&mut scenario, BUYER);
        {
            let event = test_scenario::take_shared<Event>(event_id);
            let clock = test_scenario::take_shared<Clock>();
            let ctx = test_scenario::ctx(scenario);
            
            let ticket = conduit_core::claim_free_ticket(
                &mut event,
                string::utf8(b"GA"),
                &clock,
                ctx
            );
            
            let (event_id_ticket, ticket_num, tier, price, _, _, _) = 
                conduit_core::get_ticket_info(&ticket);
            
            assert!(event_id_ticket == event_id, 0);
            assert!(ticket_num == 1, 1);
            assert!(tier == string::utf8(b"GA"), 2);
            assert!(price == 0, 3);
            
            // Transfer ticket to buyer
            transfer::public_transfer(ticket, BUYER);
            
            test_scenario::return_shared(event);
            test_scenario::return_shared(clock);
        };
        
        test_scenario::end(scenario);
    }

    #[test]
    fun test_purchase_ticket() {
        let scenario = setup();
        create_organizer_cap(&mut scenario);
        let event_id = create_paid_event(&mut scenario);
        
        // Buyer purchases a ticket
        test_scenario::next_tx(&mut scenario, BUYER);
        {
            let event = test_scenario::take_shared<Event>(event_id);
            let clock = test_scenario::take_shared<Clock>();
            let ctx = test_scenario::ctx(scenario);
            
            // Create payment coin
            let payment = coin::mint_for_testing<SUI>(ONE_SUI / 10, ctx);
            
            let ticket = conduit_core::purchase_ticket(
                &mut event,
                payment,
                string::utf8(b"GA"),
                &clock,
                ctx
            );
            
            let (_, _, _, price, _, _, _) = conduit_core::get_ticket_info(&ticket);
            assert!(price == ONE_SUI / 10, 0);
            
            transfer::public_transfer(ticket, BUYER);
            
            test_scenario::return_shared(event);
            test_scenario::return_shared(clock);
        };
        
        test_scenario::end(scenario);
    }

    // ─── Check-in Tests ───────────────────────────────────────

    #[test]
    fun test_check_in_ticket() {
        let scenario = setup();
        create_organizer_cap(&mut scenario);
        let event_id = create_free_event(&mut scenario);
        
        // Buyer claims a ticket
        test_scenario::next_tx(&mut scenario, BUYER);
        {
            let event = test_scenario::take_shared<Event>(event_id);
            let clock = test_scenario::take_shared<Clock>();
            let ctx = test_scenario::ctx(scenario);
            
            let ticket = conduit_core::claim_free_ticket(
                &mut event,
                string::utf8(b"GA"),
                &clock,
                ctx
            );
            
            transfer::public_transfer(ticket, BUYER);
            test_scenario::return_shared(event);
            test_scenario::return_shared(clock);
        };
        
        // Organizer checks in the ticket
        test_scenario::next_tx(&mut scenario, ORGANIZER);
        {
            let event = test_scenario::take_shared<Event>(event_id);
            let clock = test_scenario::take_shared<Clock>();
            let ctx = test_scenario::ctx(scenario);
            
            let mut ticket = test_scenario::take_from_address<Ticket>(&scenario, BUYER);
            
            conduit_core::check_in_ticket(&event, &mut ticket, &clock, ctx);
            
            let (_, _, _, _, _, checked_in, is_used) = conduit_core::get_ticket_info(&ticket);
            assert!(checked_in == true, 0);
            assert!(is_used == true, 1);
            
            test_scenario::return_to_address(BUYER, ticket);
            test_scenario::return_shared(event);
            test_scenario::return_shared(clock);
        };
        
        test_scenario::end(scenario);
    }

    // ─── View Function Tests ──────────────────────────────────

    #[test]
    fun test_has_available_tickets() {
        let scenario = setup();
        create_organizer_cap(&mut scenario);
        let event_id = create_free_event(&mut scenario);
        
        test_scenario::next_tx(&mut scenario, BUYER);
        {
            let event = test_scenario::take_shared<Event>(event_id);
            
            assert!(conduit_core::has_available_tickets(&event) == true, 0);
            assert!(conduit_core::remaining_tickets(&event) == 100, 1);
            
            test_scenario::return_shared(event);
        };
        
        test_scenario::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = conduit_core::conduit_core::EEventSoldOut)]
    fun test_claim_when_sold_out() {
        let scenario = setup();
        create_organizer_cap(&mut scenario);
        
        // Create event with only 1 ticket
        test_scenario::next_tx(&mut scenario, ORGANIZER);
        {
            let cap = test_scenario::take_from_sender<OrganizerCap>(&scenario);
            let ctx = test_scenario::ctx(scenario);
            
            let _event_id = conduit_core::create_event(
                &cap,
                string::utf8(b"Tiny Event"),
                string::utf8(b"Only one ticket"),
                string::utf8(b"https://example.com/image.jpg"),
                EVENT_START,
                EVENT_END,
                string::utf8(b"Virtual"),
                0,
                0,
                500,
                1, // Only 1 ticket
                string::utf8(b"meetup"),
                ctx
            );
            
            test_scenario::return_to_sender(&scenario, cap);
        };
        
        // First buyer claims the only ticket
        test_scenario::next_tx(&mut scenario, BUYER);
        {
            let mut event = test_scenario::take_shared<Event>(_event_id);
            let clock = test_scenario::take_shared<Clock>();
            let ctx = test_scenario::ctx(&scenario);
            
            let ticket = conduit_core::claim_free_ticket(
                &mut event,
                string::utf8(b"GA"),
                &clock,
                ctx
            );
            
            transfer::public_transfer(ticket, BUYER);
            test_scenario::return_shared(event);
            test_scenario::return_shared(clock);
        };
        
        // Second buyer tries to claim - should fail
        test_scenario::next_tx(&mut scenario, BUYER2);
        {
            let mut event = test_scenario::take_shared<Event>(_event_id);
            let clock = test_scenario::take_shared<Clock>();
            let ctx = test_scenario::ctx(&scenario);
            
            let _ticket = conduit_core::claim_free_ticket(
                &mut event,
                string::utf8(b"GA"),
                &clock,
                ctx
            );
            
            // This should never be reached
            abort 999
        };
        
        test_scenario::end(scenario);
    }
}
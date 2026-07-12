/// Conduit Loyalty — Cross-Event Points & Rewards
/// 
/// This module implements the loyalty points system for Conduit:
/// - Points earned per ticket claim/purchase
/// - Cross-event point accumulation
/// - Reward redemption
/// - Leaderboard tracking
module conduit_core::loyalty {
    use std::string::String;
    use sui::object::{Self, ID, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::table::{Self, Table};
    use sui::event;

    // ─── Errors ───────────────────────────────────────────────
    const EInsufficientPoints: u64 = 0;
    const EInvalidReward: u64 = 1;
    const EAlreadyRegistered: u64 = 2;

    // ─── Constants ────────────────────────────────────────────
    const POINTS_PER_CLAIM: u64 = 10;      // Free ticket claim
    const POINTS_PER_PURCHASE: u64 = 50;   // Paid ticket purchase
    const POINTS_PER_CHECKIN: u64 = 25;    // Attended event
    const POINTS_PER_RESALE: u64 = 5;      // Resold ticket

    // ─── Structs ──────────────────────────────────────────────

    /// Global loyalty registry (shared object)
    public struct LoyaltyRegistry has key, store {
        id: UID,
        /// User address -> loyalty account
        accounts: Table<address, LoyaltyAccount>,
        /// Total points distributed
        total_points_distributed: u64,
        /// Available rewards
        rewards: vector<Reward>,
    }

    /// User's loyalty account
    public struct LoyaltyAccount has store, drop {
        /// Total points earned
        points: u64,
        /// Points redeemed
        points_redeemed: u64,
        /// Events attended
        events_attended: u64,
        /// Tickets purchased
        tickets_purchased: u64,
        /// Tier level (bronze, silver, gold, platinum)
        tier: u8,
    }

    /// Reward definition
    public struct Reward has store {
        id: u64,
        name: String,
        description: String,
        points_cost: u64,
        /// How many available
        supply: u64,
        /// How many claimed
        claimed: u64,
    }

    /// Reward claim receipt
    public struct RewardClaim has key, store {
        id: UID,
        user: address,
        reward_id: u64,
        timestamp: u64,
    }

    // ─── Events ───────────────────────────────────────────────

    public struct PointsEarned has copy, drop {
        user: address,
        points: u64,
        reason: String,
        total_points: u64,
    }

    public struct TierUpgraded has copy, drop {
        user: address,
        old_tier: u8,
        new_tier: u8,
    }

    public struct RewardClaimed has copy, drop {
        user: address,
        reward_id: u64,
        points_spent: u64,
    }

    // ─── Init ─────────────────────────────────────────────────

    fun init(ctx: &mut TxContext) {
        let registry = LoyaltyRegistry {
            id: object::new(ctx),
            accounts: table::new(ctx),
            total_points_distributed: 0,
            rewards: vector[],
        };
        transfer::share_object(registry);
    }

    // ─── Core Functions ───────────────────────────────────────

    /// Register a user for the loyalty program
    public fun register_user(
        registry: &mut LoyaltyRegistry,
        ctx: &mut TxContext
    ) {
        let user = tx_context::sender(ctx);
        assert!(!table::contains(&registry.accounts, user), EAlreadyRegistered);

        let account = LoyaltyAccount {
            points: 0,
            points_redeemed: 0,
            events_attended: 0,
            tickets_purchased: 0,
            tier: 0, // bronze
        };

        table::add(&mut registry.accounts, user, account);
    }

    /// Award points for ticket claim (free event)
    public fun award_claim_points(
        registry: &mut LoyaltyRegistry,
        user: address,
        ctx: &mut TxContext
    ) {
        ensure_user_registered(registry, user, ctx);
        
        let account = table::borrow_mut(&mut registry.accounts, user);
        account.points = account.points + POINTS_PER_CLAIM;
        account.events_attended = account.events_attended + 1;
        
        registry.total_points_distributed = registry.total_points_distributed + POINTS_PER_CLAIM;

        let total = account.points;
        let old_tier = account.tier;
        
        // Update tier
        update_tier(account);

        event::emit(PointsEarned {
            user,
            points: POINTS_PER_CLAIM,
            reason: std::string::utf8(b"ticket_claim"),
            total_points: total,
        });

        if (account.tier > old_tier) {
            event::emit(TierUpgraded {
                user,
                old_tier,
                new_tier: account.tier,
            });
        };
    }

    /// Award points for ticket purchase (paid event)
    public fun award_purchase_points(
        registry: &mut LoyaltyRegistry,
        user: address,
        ctx: &mut TxContext
    ) {
        ensure_user_registered(registry, user, ctx);

        let account = table::borrow_mut(&mut registry.accounts, user);
        account.points = account.points + POINTS_PER_PURCHASE;
        account.tickets_purchased = account.tickets_purchased + 1;
        account.events_attended = account.events_attended + 1;
        
        registry.total_points_distributed = registry.total_points_distributed + POINTS_PER_PURCHASE;

        let total = account.points;
        let old_tier = account.tier;

        update_tier(account);

        event::emit(PointsEarned {
            user,
            points: POINTS_PER_PURCHASE,
            reason: std::string::utf8(b"ticket_purchase"),
            total_points: total,
        });

        if (account.tier > old_tier) {
            event::emit(TierUpgraded {
                user,
                old_tier,
                new_tier: account.tier,
            });
        };
    }

    /// Award points for check-in
    public fun award_checkin_points(
        registry: &mut LoyaltyRegistry,
        user: address,
        ctx: &mut TxContext
    ) {
        ensure_user_registered(registry, user, ctx);

        let account = table::borrow_mut(&mut registry.accounts, user);
        account.points = account.points + POINTS_PER_CHECKIN;
        
        registry.total_points_distributed = registry.total_points_distributed + POINTS_PER_CHECKIN;

        event::emit(PointsEarned {
            user,
            points: POINTS_PER_CHECKIN,
            reason: std::string::utf8(b"event_checkin"),
            total_points: account.points,
        });
    }

    /// Redeem points for a reward
    public fun redeem_reward(
        registry: &mut LoyaltyRegistry,
        reward_index: u64,
        clock: &sui::clock::Clock,
        ctx: &mut TxContext
    ) {
        let user = tx_context::sender(ctx);
        assert!(table::contains(&registry.accounts, user), EAlreadyRegistered);

        let reward = vector::borrow_mut(&mut registry.rewards, reward_index);
        assert!(reward.claimed < reward.supply, EInvalidReward);

        let account = table::borrow_mut(&mut registry.accounts, user);
        assert!(account.points >= reward.points_cost, EInsufficientPoints);

        account.points = account.points - reward.points_cost;
        account.points_redeemed = account.points_redeemed + reward.points_cost;
        reward.claimed = reward.claimed + 1;

        let claim = RewardClaim {
            id: object::new(ctx),
            user,
            reward_id: reward.id,
            timestamp: sui::clock::timestamp_ms(clock),
        };

        transfer::transfer(claim, user);

        event::emit(RewardClaimed {
            user,
            reward_id: reward.id,
            points_spent: reward.points_cost,
        });
    }

    // ─── View Functions ───────────────────────────────────────

    /// Get user's loyalty info
    public fun get_user_info(
        registry: &LoyaltyRegistry,
        user: address
    ): (u64, u64, u64, u64, u8) {
        if (!table::contains(&registry.accounts, user)) {
            return (0, 0, 0, 0, 0)
        };

        let account = table::borrow(&registry.accounts, user);
        (
            account.points,
            account.points_redeemed,
            account.events_attended,
            account.tickets_purchased,
            account.tier,
        )
    }

    /// Check if user is registered
    public fun is_registered(registry: &LoyaltyRegistry, user: address): bool {
        table::contains(&registry.accounts, user)
    }

    // ─── Internal Functions ───────────────────────────────────

    fun ensure_user_registered(
        registry: &mut LoyaltyRegistry,
        user: address,
        ctx: &mut TxContext
    ) {
        if (!table::contains(&registry.accounts, user)) {
            let account = LoyaltyAccount {
                points: 0,
                points_redeemed: 0,
                events_attended: 0,
                tickets_purchased: 0,
                tier: 0,
            };
            table::add(&mut registry.accounts, user, account);
        };
    }

    fun update_tier(account: &mut LoyaltyAccount) {
        if (account.points >= 1000) {
            account.tier = 3; // platinum
        } else if (account.points >= 500) {
            account.tier = 2; // gold
        } else if (account.points >= 200) {
            account.tier = 1; // silver
        } else {
            account.tier = 0; // bronze
        };
    }
}
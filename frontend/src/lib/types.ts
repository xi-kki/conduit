export interface Event {
  id: string;
  name: string;
  description: string;
  image_url: string;
  start_time: number;
  end_time: number;
  venue: string;
  organizer: string;
  ticket_price: number;
  resale_price_cap: number;
  royalty_bps: number;
  total_supply: number;
  tickets_sold: number;
  category: string;
  is_active: boolean;
}

export interface Ticket {
  id: string;
  event_id: string;
  ticket_number: number;
  tier: string;
  purchase_price: number;
  original_owner: string;
  checked_in: boolean;
  is_used: boolean;
}

export type EventCategory = 
  | "conference"
  | "meetup"
  | "hackathon"
  | "party"
  | "workshop"
  | "virtual";

export const EVENT_CATEGORIES: { value: EventCategory; label: string; emoji: string }[] = [
  { value: "conference", label: "Conference", emoji: "🎤" },
  { value: "meetup", label: "Meetup", emoji: "🤝" },
  { value: "hackathon", label: "Hackathon", emoji: "💻" },
  { value: "party", label: "Party", emoji: "🎉" },
  { value: "workshop", label: "Workshop", emoji: "🔧" },
  { value: "virtual", label: "Virtual", emoji: "🌐" },
];
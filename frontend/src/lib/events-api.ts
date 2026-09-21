/**
 * Multi-Chain Event Discovery API
 * Aggregates Web3/blockchain events from across ecosystems:
 * - Luma (crypto/Web3 focused, no API key needed)
 * - Eventbrite (free search API, largest event platform)
 * - Solana ecosystem events
 * - Stellar ecosystem events  
 * - ETHGlobal hackathons
 * - Avalanche ecosystem events
 * - Bitcoin conferences
 * - Cross-chain DeFi/NFT events
 */

// ============================================================
// TYPES
// ============================================================

export interface ExternalEvent {
  id: string;
  name: string;
  description: string;
  date: string;
  endDate?: string;
  location: string;
  city: string;
  country: string;
  url: string;
  cover: string;
  attending: number;
  category: EventCategory;
  chain: ChainTag;
  isFree: boolean;
  price?: string;
  source: EventSource;
  lat?: number;
  lng?: number;
}

export type EventSource = 'luma' | 'eventbrite' | 'ethglobal' | 'solana' | 'stellar' | 'avalanche' | 'bitcoin' | 'conduit' | 'lisk' | 'polkadot';

export type ChainTag = 
  | 'multi' | 'solana' | 'ethereum' | 'sui' | 'avalanche' 
  | 'stellar' | 'bitcoin' | 'polkadot' | 'cosmos' | 'near' 
  | 'cardano' | 'lisk' | 'base' | 'arbitrum' | 'polygon'
  | 'ton' | 'sepolia' | 'other';

export type EventCategory = 
  | 'hackathon' | 'conference' | 'meetup' | 'workshop'
  | 'defi' | 'nft' | 'dao' | 'ai' | 'crypto' | 'web3'
  | 'food' | 'arts' | 'climate' | 'fitness' | 'wellness'
  | 'social' | ' networking' | 'developer' | 'all';

// ============================================================
// CHAIN METADATA
// ============================================================

export const CHAIN_INFO: Record<ChainTag, { name: string; color: string; icon: string }> = {
  multi:       { name: 'Multi-Chain',   color: '#8B5CF6', icon: '🌐' },
  solana:      { name: 'Solana',        color: '#9945FF', icon: '◎' },
  ethereum:    { name: 'Ethereum',      color: '#627EEA', icon: '⟠' },
  sui:         { name: 'Sui',           color: '#4DA2FF', icon: 'Sui' },
  avalanche:   { name: 'Avalanche',     color: '#E84142', icon: '🔺' },
  stellar:     { name: 'Stellar',       color: '#14B6E7', icon: '✦' },
  bitcoin:     { name: 'Bitcoin',       color: '#F7931A', icon: '₿' },
  polkadot:    { name: 'Polkadot',      color: '#E6007A', icon: '●' },
  cosmos:      { name: 'Cosmos',        color: '#2E3148', icon: '⚛' },
  near:        { name: 'NEAR',          color: '#00C08B', icon: 'Ⓝ' },
  cardano:     { name: 'Cardano',       color: '#0033AD', icon: '◇' },
  lisk:        { name: 'Lisk',          color: '#0D3DF7', icon: 'L' },
  base:        { name: 'Base',          color: '#0052FF', icon: '🅱' },
  arbitrum:    { name: 'Arbitrum',      color: '#28A0F0', icon: 'ARB' },
  polygon:     { name: 'Polygon',       color: '#8247E5', icon: '⬡' },
  ton:         { name: 'TON',           color: '#0098EA', icon: '💎' },
  sepolia:     { name: 'Sepolia',       color: '#627EEA', icon: 'S' },
  other:       { name: 'Other',         color: '#6B7280', icon: '?' },
};

// ============================================================
// LUMA API (already integrated, enhanced)
// ============================================================

async function fetchLumaEvents(category: string = 'crypto'): Promise<ExternalEvent[]> {
  try {
    const res = await fetch(
      `https://lu.ma/discover?category=${category}`,
      { next: { revalidate: 300 } }
    );
    const html = await res.text();
    
    // Extract __NEXT_DATA__ JSON
    const match = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
    if (!match) return [];

    const data = JSON.parse(match[1]);
    const items = data?.props?.pageProps?.items || [];
    
    return items.map((item: any, i: number) => {
      const event = item.event || item;
      const venue = event.venue || {};
      const geo = venue.geolocation || {};
      
      return {
        id: `luma-${event.id || i}`,
        name: event.name || 'Untitled Event',
        description: (event.description || '').slice(0, 200),
        date: event.start_date || event.date || '',
        endDate: event.end_date || '',
        location: venue.name || 'Online',
        city: venue.city || geo.city || '',
        country: venue.country || geo.country || '',
        url: event.url ? `https://lu.ma/${event.url}` : 'https://lu.ma/discover',
        cover: event.cover_url || event.image_url || '',
        attending: event.attendee_count || event.going_count || 0,
        category: mapLumaCategory(event.category || category),
        chain: detectChain(event.name + ' ' + (event.description || '')),
        isFree: !event.ticket_url || event.ticket_price === 0,
        price: event.ticket_price ? `$${event.ticket_price}` : undefined,
        source: 'luma',
        lat: geo.latitude,
        lng: geo.longitude,
      };
    });
  } catch {
    return [];
  }
}

function mapLumaCategory(cat: string): EventCategory {
  const c = cat.toLowerCase();
  if (c.includes('hack') || c.includes('build')) return 'hackathon';
  if (c.includes('conf') || c.includes('summit')) return 'conference';
  if (c.includes('meetup') || c.includes('mixer')) return 'meetup';
  if (c.includes('workshop') || c.includes('bootcamp')) return 'workshop';
  if (c.includes('defi') || c.includes('finance')) return 'defi';
  if (c.includes('nft') || c.includes('art')) return 'nft';
  if (c.includes('dao') || c.includes('governance')) return 'dao';
  if (c.includes('ai') || c.includes('ml')) return 'ai';
  if (c.includes('food')) return 'food';
  if (c.includes('climate') || c.includes('green')) return 'climate';
  return 'crypto';
}

// ============================================================
// EVENTBRITE API (free search, no API key needed)
// ============================================================

async function fetchEventbriteEvents(query: string = 'blockchain web3'): Promise<ExternalEvent[]> {
  try {
    // Eventbrite's public search endpoint — returns HTML with embedded JSON-LD
    const res = await fetch(
      `https://www.eventbrite.com/d/online/blockchain--web3/`,
      { next: { revalidate: 600 } }
    );
    const html = await res.text();
    
    const events: ExternalEvent[] = [];
    
    // Extract JSON-LD structured data
    const jsonLdPattern = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
    let jsonMatch;
    while ((jsonMatch = jsonLdPattern.exec(html)) !== null) {
      try {
        const ld = JSON.parse(jsonMatch[1]);
        if (ld['@type'] === 'Event' || ld['@type'] === 'EventSeries') {
          events.push({
            id: `eb-${ld.identifier || events.length}`,
            name: ld.name || '',
            description: (ld.description || '').slice(0, 200),
            date: ld.startDate || '',
            endDate: ld.endDate || '',
            location: ld.location?.name || ld.location?.address?.addressLocality || 'Online',
            city: ld.location?.address?.addressLocality || '',
            country: ld.location?.address?.addressCountry || '',
            url: ld.url || 'https://www.eventbrite.com',
            cover: ld.image || '',
            attending: ld.offers?.availability || 0,
            category: detectCategory(ld.name + ' ' + (ld.description || '')),
            chain: detectChain(ld.name + ' ' + (ld.description || '')),
            isFree: ld.offers?.price === '0' || ld.offers?.price === 0,
            price: ld.offers?.price ? `$${ld.offers.price}` : undefined,
            source: 'eventbrite',
          });
        }
      } catch {}
    }
    
    // Also extract from data-event-id cards
    const cardPattern = /data-event-id="([^"]+)"/g;
    let idMatch;
    while ((idMatch = cardPattern.exec(html)) !== null) {
      if (!events.find(e => e.id.includes(idMatch![1]))) {
        // Try to find associated title nearby
        const idx = idMatch.index;
        const nearby = html.slice(idx, idx + 2000);
        const titleMatch = nearby.match(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/);
        const title = titleMatch ? titleMatch[1].replace(/<[^>]*>/g, '').trim() : '';
        
        if (title) {
          events.push({
            id: `eb-${idMatch[1]}`,
            name: title,
            description: `Eventbrite event: ${title}`,
            date: '',
            location: 'Online',
            city: '',
            country: '',
            url: `https://www.eventbrite.com/e/${idMatch[1]}`,
            cover: '',
            attending: 0,
            category: detectCategory(title),
            chain: detectChain(title),
            isFree: true,
            source: 'eventbrite',
          });
        }
      }
    }
    
    return events;
  } catch {
    return [];
  }
}

// ============================================================
// ETHGLOBAL (scrape upcoming hackathons)
// ============================================================

async function fetchETHGlobalEvents(): Promise<ExternalEvent[]> {
  try {
    const res = await fetch('https://ethglobal.com/events', {
      next: { revalidate: 600 }
    });
    const html = await res.text();
    
    const events: ExternalEvent[] = [];
    
    // Look for event data in the page
    const eventPattern = /<a[^>]*href="\/events\/([^"]+)"[^>]*>[\s\S]*?<\/a>/g;
    let match;
    const seen = new Set<string>();
    
    while ((match = eventPattern.exec(html)) !== null) {
      const slug = match[1];
      if (seen.has(slug) || slug.includes('api') || slug.includes('past')) continue;
      seen.add(slug);
      
      // Extract title from the link content
      const titleMatch = match[0].match(/<[^>]*class="[^"]*text[^"]*"[^>]*>([\s\S]*?)<\/[^>]*>/);
      const title = titleMatch ? titleMatch[1].replace(/<[^>]*>/g, '').trim() : slug.replace(/-/g, ' ');
      
      events.push({
        id: `ethglobal-${slug}`,
        name: title.charAt(0).toUpperCase() + title.slice(1),
        description: `ETHGlobal ${title} — premier Web3 hackathon`,
        date: '',
        location: 'Global',
        city: '',
        country: '',
        url: `https://ethglobal.com/events/${slug}`,
        cover: '',
        attending: 0,
        category: 'hackathon',
        chain: 'ethereum',
        isFree: true,
        source: 'ethglobal',
      });
      
      if (events.length >= 6) break;
    }
    
    return events;
  } catch {
    return [];
  }
}

// ============================================================
// SOLANA ECOSYSTEM EVENTS
// ============================================================

async function fetchSolanaEvents(): Promise<ExternalEvent[]> {
  try {
    const res = await fetch('https://solana.com/events', {
      next: { revalidate: 600 }
    });
    const html = await res.text();
    
    const events: ExternalEvent[] = [];
    
    // Look for event cards/links
    const eventPattern = /<a[^>]*href="(https?:\/\/[^"]*event[^"]*)"[^>]*>([\s\S]*?)<\/a>/gi;
    let match;
    const seen = new Set<string>();
    
    while ((match = eventPattern.exec(html)) !== null) {
      const url = match[1];
      const text = match[2].replace(/<[^>]*>/g, '').trim();
      if (seen.has(url) || text.length < 3) continue;
      seen.add(url);
      
      events.push({
        id: `solana-${events.length}`,
        name: text,
        description: `Solana ecosystem event`,
        date: '',
        location: '',
        city: '',
        country: '',
        url,
        cover: '',
        attending: 0,
        category: detectCategory(text),
        chain: 'solana',
        isFree: true,
        source: 'solana',
      });
      
      if (events.length >= 5) break;
    }
    
    // Add known Solana events
    const knownEvents = [
      { name: 'Solana Breakpoint 2025', url: 'https://solana.com/breakpoint', desc: 'Annual Solana conference' },
      { name: 'Solana Hackathons', url: 'https://solana.com/developers/hackathons', desc: 'Ongoing Solana builder hackathons' },
    ];
    
    for (const ke of knownEvents) {
      if (!events.find(e => e.url === ke.url)) {
        events.push({
          id: `solana-known-${events.length}`,
          name: ke.name,
          description: ke.desc,
          date: '',
          location: 'Global',
          city: '',
          country: '',
          url: ke.url,
          cover: '',
          attending: 0,
          category: ke.name.includes('Hack') ? 'hackathon' : 'conference',
          chain: 'solana',
          isFree: true,
          source: 'solana',
        });
      }
    }
    
    return events;
  } catch {
    return [];
  }
}

// ============================================================
// STELLAR ECOSYSTEM EVENTS
// ============================================================

async function fetchStellarEvents(): Promise<ExternalEvent[]> {
  try {
    const res = await fetch('https://stellar.org/ecosystem/events', {
      next: { revalidate: 600 }
    });
    const html = await res.text();
    
    const events: ExternalEvent[] = [];
    
    const eventPattern = /<a[^>]*href="(https?:\/\/[^"]*)"[^>]*>([\s\S]*?)<\/a>/gi;
    let match;
    const seen = new Set<string>();
    
    while ((match = eventPattern.exec(html)) !== null) {
      const url = match[1];
      const text = match[2].replace(/<[^>]*>/g, '').trim();
      if (seen.has(url) || text.length < 5 || url.includes('#')) continue;
      if (!url.includes('stellar') && !url.includes('events')) continue;
      seen.add(url);
      
      events.push({
        id: `stellar-${events.length}`,
        name: text,
        description: 'Stellar ecosystem event',
        date: '',
        location: '',
        city: '',
        country: '',
        url: url.startsWith('http') ? url : `https://stellar.org${url}`,
        cover: '',
        attending: 0,
        category: detectCategory(text),
        chain: 'stellar',
        isFree: true,
        source: 'stellar',
      });
      
      if (events.length >= 5) break;
    }
    
    return events;
  } catch {
    return [];
  }
}

// ============================================================
// AVALANCHE ECOSYSTEM EVENTS
// ============================================================

async function fetchAvalancheEvents(): Promise<ExternalEvent[]> {
  try {
    const res = await fetch('https://www.avax.network/events', {
      next: { revalidate: 600 }
    });
    const html = await res.text();
    
    const events: ExternalEvent[] = [];
    
    const eventPattern = /<a[^>]*href="(https?:\/\/[^"]*)"[^>]*>([\s\S]*?)<\/a>/gi;
    let match;
    const seen = new Set<string>();
    
    while ((match = eventPattern.exec(html)) !== null) {
      const url = match[1];
      const text = match[2].replace(/<[^>]*>/g, '').trim();
      if (seen.has(url) || text.length < 5) continue;
      seen.add(url);
      
      events.push({
        id: `avax-${events.length}`,
        name: text,
        description: 'Avalanche ecosystem event',
        date: '',
        location: '',
        city: '',
        country: '',
        url: url.startsWith('http') ? url : `https://www.avax.network${url}`,
        cover: '',
        attending: 0,
        category: detectCategory(text),
        chain: 'avalanche',
        isFree: true,
        source: 'avalanche',
      });
      
      if (events.length >= 5) break;
    }
    
    // Known Avalanche events
    events.push({
      id: 'avax-summit',
      name: 'Avalanche Summit',
      description: 'Annual Avalanche ecosystem conference',
      date: '',
      location: 'Global',
      city: '',
      country: '',
      url: 'https://www.avax.network/events',
      cover: '',
      attending: 0,
      category: 'conference',
      chain: 'avalanche',
      isFree: true,
      source: 'avalanche',
    });
    
    return events;
  } catch {
    return [];
  }
}

// ============================================================
// BITCOIN ECOSYSTEM EVENTS
// ============================================================

async function fetchBitcoinEvents(): Promise<ExternalEvent[]> {
  try {
    // Check Bitcoin conference sources
    const res = await fetch('https://btcconference.com', {
      next: { revalidate: 600 }
    });
    const html = await res.text();
    
    const events: ExternalEvent[] = [];
    
    // Known Bitcoin events always shown
    const knownBitcoinEvents = [
      { name: 'Bitcoin 2025 Conference', url: 'https://btcconference.com', desc: 'World\'s largest Bitcoin conference' },
      { name: 'Bitcoin Miami', url: 'https://btcconference.com', desc: 'Bitcoin conference in Miami' },
      { name: 'Lightning Conference', url: 'https://lightningconferences.com', desc: 'Lightning Network focused events' },
      { name: 'BitBlockBoom', url: 'https://bitblockboom.com', desc: 'Bitcoin conference series' },
    ];
    
    for (const ke of knownBitcoinEvents) {
      events.push({
        id: `btc-${events.length}`,
        name: ke.name,
        description: ke.desc,
        date: '',
        location: '',
        city: '',
        country: '',
        url: ke.url,
        cover: '',
        attending: 0,
        category: 'conference',
        chain: 'bitcoin',
        isFree: true,
        source: 'bitcoin',
      });
    }
    
    return events;
  } catch {
    return [];
  }
}

// ============================================================
// LISK ECOSYSTEM EVENTS
// ============================================================

async function fetchLiskEvents(): Promise<ExternalEvent[]> {
  const events: ExternalEvent[] = [];
  
  const knownLisk = [
    { name: 'Lisk Developer Meetups', url: 'https://lisk.com/ecosystem', desc: 'Lisk ecosystem developer events' },
    { name: 'Lisk Builders Program', url: 'https://lisk.com/builders', desc: 'Building on Lisk L2' },
  ];
  
  for (const ke of knownLisk) {
    events.push({
      id: `lisk-${events.length}`,
      name: ke.name,
      description: ke.desc,
      date: '',
      location: 'Global',
      city: '',
      country: '',
      url: ke.url,
      cover: '',
      attending: 0,
      category: 'developer',
      chain: 'lisk',
      isFree: true,
      source: 'lisk',
    });
  }
  
  return events;
}

// ============================================================
// POLKADOT ECOSYSTEM EVENTS
// ============================================================

async function fetchPolkadotEvents(): Promise<ExternalEvent[]> {
  const events: ExternalEvent[] = [];
  
  const knownPolkadot = [
    { name: 'Polkadot Decoded', url: 'https://decoded.polkadot.network', desc: 'Annual Polkadot conference' },
    { name: 'Sub0 Conference', url: 'https://sub0.polkadot.network', desc: 'Substrate developer conference' },
    { name: 'Polkadot Hackathons', url: 'https://polkadot.com/grants', desc: 'Polkadot ecosystem hackathons' },
  ];
  
  for (const ke of knownPolkadot) {
    events.push({
      id: `dot-${events.length}`,
      name: ke.name,
      description: ke.desc,
      date: '',
      location: 'Global',
      city: '',
      country: '',
      url: ke.url,
      cover: '',
      attending: 0,
      category: ke.name.includes('Hack') ? 'hackathon' : 'conference',
      chain: 'polkadot',
      isFree: true,
      source: 'conduit',
    });
  }
  
  return events;
}

// ============================================================
// COSMOS ECOSYSTEM EVENTS
// ============================================================

async function fetchCosmosEvents(): Promise<ExternalEvent[]> {
  const events: ExternalEvent[] = [];
  
  const knownCosmos = [
    { name: 'Cosmoverse', url: 'https://cosmoverse.org', desc: 'Annual Cosmos ecosystem conference' },
    { name: 'Cosmos Hackatom', url: 'https://cosmos.network/events', desc: 'Cosmos ecosystem hackathon' },
    { name: 'ICF Community Calls', url: 'https://cosmos.network', desc: 'Interchain Foundation community events' },
  ];
  
  for (const ke of knownCosmos) {
    events.push({
      id: `cosmos-${events.length}`,
      name: ke.name,
      description: ke.desc,
      date: '',
      location: 'Global',
      city: '',
      country: '',
      url: ke.url,
      cover: '',
      attending: 0,
      category: ke.name.includes('Hack') ? 'hackathon' : 'conference',
      chain: 'cosmos',
      isFree: true,
      source: 'conduit',
    });
  }
  
  return events;
}

// ============================================================
// NEAR PROTOCOL ECOSYSTEM EVENTS
// ============================================================

async function fetchNEAREvents(): Promise<ExternalEvent[]> {
  const events: ExternalEvent[] = [];
  
  const knownNEAR = [
    { name: 'NEARCON', url: 'https://near.org/events', desc: 'Annual NEAR Protocol conference' },
    { name: 'NEAR Hackathons', url: 'https://near.org/build', desc: 'NEAR ecosystem hackathons' },
  ];
  
  for (const ke of knownNEAR) {
    events.push({
      id: `near-${events.length}`,
      name: ke.name,
      description: ke.desc,
      date: '',
      location: 'Global',
      city: '',
      country: '',
      url: ke.url,
      cover: '',
      attending: 0,
      category: ke.name.includes('Hack') ? 'hackathon' : 'conference',
      chain: 'near',
      isFree: true,
      source: 'conduit',
    });
  }
  
  return events;
}

// ============================================================
// CARDANO ECOSYSTEM EVENTS
// ============================================================

async function fetchCardanoEvents(): Promise<ExternalEvent[]> {
  const events: ExternalEvent[] = [];
  
  const knownCardano = [
    { name: 'Cardano Summit', url: 'https://summit.cardano.org', desc: 'Annual Cardano summit' },
    { name: 'Cardano Hackathons', url: 'https://cardano.org/developers', desc: 'Cardano developer hackathons' },
    { name: 'Catalyst Fund', url: 'https://catalyst.io', desc: 'Project Catalyst community events' },
  ];
  
  for (const ke of knownCardano) {
    events.push({
      id: `ada-${events.length}`,
      name: ke.name,
      description: ke.desc,
      date: '',
      location: 'Global',
      city: '',
      country: '',
      url: ke.url,
      cover: '',
      attending: 0,
      category: ke.name.includes('Hack') ? 'hackathon' : 'conference',
      chain: 'cardano',
      isFree: true,
      source: 'conduit',
    });
  }
  
  return events;
}

// ============================================================
// TON ECOSYSTEM EVENTS
// ============================================================

async function fetchTONEvents(): Promise<ExternalEvent[]> {
  const events: ExternalEvent[] = [];
  
  const knownTON = [
    { name: 'TON Hackathon', url: 'https://ton.org/hackathons', desc: 'TON ecosystem hackathons' },
    { name: 'TON Dev Meetups', url: 'https://ton.org/community', desc: 'TON developer community events' },
  ];
  
  for (const ke of knownTON) {
    events.push({
      id: `ton-${events.length}`,
      name: ke.name,
      description: ke.desc,
      date: '',
      location: 'Global',
      city: '',
      country: '',
      url: ke.url,
      cover: '',
      attending: 0,
      category: ke.name.includes('Hack') ? 'hackathon' : 'meetup',
      chain: 'ton',
      isFree: true,
      source: 'conduit',
    });
  }
  
  return events;
}

// ============================================================
// HELPER: Detect chain from event text
// ============================================================

function detectChain(text: string): ChainTag {
  const t = text.toLowerCase();
  
  if (t.includes('solana') || t.includes('sol ') || t.includes('phantom')) return 'solana';
  if (t.includes('ethereum') || t.includes('eth ') || t.includes('vitalik') || t.includes('erigon')) return 'ethereum';
  if (t.includes('sui') || t.includes('move language')) return 'sui';
  if (t.includes('avalanche') || t.includes('avax') || t.includes('subnet')) return 'avalanche';
  if (t.includes('stellar') || t.includes('xlm') || t.includes('soroban')) return 'stellar';
  if (t.includes('bitcoin') || t.includes('btc') || t.includes('lightning') || t.includes('ordinals') || t.includes('brc-20')) return 'bitcoin';
  if (t.includes('polkadot') || t.includes('dot ') || t.includes('substrate') || t.includes('parachain')) return 'polkadot';
  if (t.includes('cosmos') || t.includes('atom') || t.includes('ibc') || t.includes('cosmwasm')) return 'cosmos';
  if (t.includes('near ') || t.includes('near protocol') || t.includes('aurora')) return 'near';
  if (t.includes('cardano') || t.includes('ada ') || t.includes('plutus')) return 'cardano';
  if (t.includes('lisk')) return 'lisk';
  if (t.includes('base ') || t.includes('base chain')) return 'base';
  if (t.includes('arbitrum') || t.includes('arb ')) return 'arbitrum';
  if (t.includes('polygon') || t.includes('matic')) return 'polygon';
  if (t.includes('ton ') || t.includes('toncoin') || t.includes('telegram open')) return 'ton';
  if (t.includes('web3') || t.includes('blockchain') || t.includes('defi') || t.includes('nft') || t.includes('crypto')) return 'multi';
  
  return 'other';
}

function detectCategory(text: string): EventCategory {
  const t = text.toLowerCase();
  if (t.includes('hack') || t.includes('build') || t.includes('hackathon')) return 'hackathon';
  if (t.includes('conf') || t.includes('summit') || t.includes('convention')) return 'conference';
  if (t.includes('meetup') || t.includes('mixer') || t.includes('social')) return 'meetup';
  if (t.includes('workshop') || t.includes('bootcamp') || t.includes('learn')) return 'workshop';
  if (t.includes('defi') || t.includes('finance') || t.includes('yield')) return 'defi';
  if (t.includes('nft') || t.includes('art') || t.includes('collectible')) return 'nft';
  if (t.includes('dao') || t.includes('governance')) return 'dao';
  if (t.includes('ai ') || t.includes('machine learn')) return 'ai';
  if (t.includes('developer') || t.includes('dev ')) return 'developer';
  return 'crypto';
}

// ============================================================
// MAIN AGGREGATOR
// ============================================================

export async function fetchAllExternalEvents(filters?: {
  chains?: ChainTag[];
  categories?: EventCategory[];
  cities?: string[];
  search?: string;
  source?: EventSource;
  limit?: number;
}): Promise<ExternalEvent[]> {
  const limit = filters?.limit || 50;
  
  // Fetch from all sources in parallel
  const [
    lumaEvents,
    ethglobalEvents,
    solanaEvents,
    stellarEvents,
    avalancheEvents,
    bitcoinEvents,
    liskEvents,
    polkadotEvents,
    cosmosEvents,
    nearEvents,
    cardanoEvents,
    tonEvents,
  ] = await Promise.allSettled([
    fetchLumaEvents('crypto'),
    fetchETHGlobalEvents(),
    fetchSolanaEvents(),
    fetchStellarEvents(),
    fetchAvalancheEvents(),
    fetchBitcoinEvents(),
    fetchLiskEvents(),
    fetchPolkadotEvents(),
    fetchCosmosEvents(),
    fetchNEAREvents(),
    fetchCardanoEvents(),
    fetchTONEvents(),
  ]);
  
  // Combine all results
  let allEvents: ExternalEvent[] = [
    ...(lumaEvents.status === 'fulfilled' ? lumaEvents.value : []),
    ...(ethglobalEvents.status === 'fulfilled' ? ethglobalEvents.value : []),
    ...(solanaEvents.status === 'fulfilled' ? solanaEvents.value : []),
    ...(stellarEvents.status === 'fulfilled' ? stellarEvents.value : []),
    ...(avalancheEvents.status === 'fulfilled' ? avalancheEvents.value : []),
    ...(bitcoinEvents.status === 'fulfilled' ? bitcoinEvents.value : []),
    ...(liskEvents.status === 'fulfilled' ? liskEvents.value : []),
    ...(polkadotEvents.status === 'fulfilled' ? polkadotEvents.value : []),
    ...(cosmosEvents.status === 'fulfilled' ? cosmosEvents.value : []),
    ...(nearEvents.status === 'fulfilled' ? nearEvents.value : []),
    ...(cardanoEvents.status === 'fulfilled' ? cardanoEvents.value : []),
    ...(tonEvents.status === 'fulfilled' ? tonEvents.value : []),
  ];
  
  // Apply filters
  if (filters?.chains?.length) {
    allEvents = allEvents.filter(e => filters.chains!.includes(e.chain));
  }
  if (filters?.categories?.length) {
    allEvents = allEvents.filter(e => filters.categories!.includes(e.category));
  }
  if (filters?.cities?.length) {
    allEvents = allEvents.filter(e => 
      filters.cities!.some(c => e.city.toLowerCase().includes(c.toLowerCase()))
    );
  }
  if (filters?.source) {
    allEvents = allEvents.filter(e => e.source === filters.source);
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    allEvents = allEvents.filter(e => 
      e.name.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      e.chain.toLowerCase().includes(q)
    );
  }
  
  // Dedupe by similar name
  const seen = new Set<string>();
  allEvents = allEvents.filter(e => {
    const key = e.name.toLowerCase().slice(0, 40);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  
  return allEvents.slice(0, limit);
}

// ============================================================
// SEARCH SPECIFIC CHAINS
// ============================================================

export async function fetchEventsByChain(chain: ChainTag): Promise<ExternalEvent[]> {
  return fetchAllExternalEvents({ chains: [chain], limit: 20 });
}

export async function fetchHackathons(): Promise<ExternalEvent[]> {
  return fetchAllExternalEvents({ categories: ['hackathon'], limit: 20 });
}

export async function fetchNearbyEvents(lat: number, lng: number, radiusKm: number = 50): Promise<ExternalEvent[]> {
  const all = await fetchAllExternalEvents({ limit: 100 });
  
  return all
    .filter(e => {
      if (!e.lat || !e.lng) return false;
      const dist = haversine(lat, lng, e.lat, e.lng);
      return dist <= radiusKm;
    })
    .sort((a, b) => {
      const distA = haversine(lat, lng, a.lat!, a.lng!);
      const distB = haversine(lat, lng, b.lat!, b.lng!);
      return distA - distB;
    });
}

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

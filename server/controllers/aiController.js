// aiController.js - yeh controller AI Smart Booking Assistant ka logic handle karta hai
// IMPORTANT: yeh mostly rule-based hai (90%), AI sirf keyword matching karta hai
const Room = require('../models/Room');

// ============ KEYWORD MAPPING ============
// yeh keywords natural language se room type aur price range match karte hain
const KEYWORD_MAP = {
  // budget/cheap keywords -> Single room, low price
  budget: { types: ['Single'], maxPrice: 3000, label: 'Budget' },
  cheap: { types: ['Single'], maxPrice: 3000, label: 'Budget' },
  sasta: { types: ['Single'], maxPrice: 3000, label: 'Budget' },
  affordable: { types: ['Single'], maxPrice: 3000, label: 'Budget' },
  economy: { types: ['Single'], maxPrice: 3000, label: 'Budget' },

  // medium/standard keywords -> Double room, mid price
  medium: { types: ['Double'], maxPrice: 7000, minPrice: 2000, label: 'Standard' },
  normal: { types: ['Double'], maxPrice: 7000, minPrice: 2000, label: 'Standard' },
  standard: { types: ['Double'], maxPrice: 7000, minPrice: 2000, label: 'Standard' },
  moderate: { types: ['Double'], maxPrice: 7000, minPrice: 2000, label: 'Standard' },

  // luxury/premium keywords -> Deluxe room, high price
  luxury: { types: ['Deluxe'], minPrice: 5000, label: 'Luxury' },
  deluxe: { types: ['Deluxe'], minPrice: 5000, label: 'Luxury' },
  premium: { types: ['Deluxe'], minPrice: 5000, label: 'Luxury' },
  mehenga: { types: ['Deluxe'], minPrice: 5000, label: 'Luxury' },
  best: { types: ['Deluxe'], minPrice: 5000, label: 'Luxury' },
  vip: { types: ['Deluxe'], minPrice: 5000, label: 'Luxury' },

  // family/group keywords -> Double ya Deluxe
  family: { types: ['Double', 'Deluxe'], label: 'Family' },
  group: { types: ['Double', 'Deluxe'], label: 'Family/Group' },
  bada: { types: ['Double', 'Deluxe'], label: 'Family' },
  couple: { types: ['Double', 'Deluxe'], label: 'Couple' },

  // single/solo keywords -> Single room
  single: { types: ['Single'], label: 'Solo' },
  akela: { types: ['Single'], label: 'Solo' },
  solo: { types: ['Single'], label: 'Solo' },
  one: { types: ['Single'], label: 'Solo' },
};

// ============ SMART SEARCH ============
// POST /api/ai/smart-search - natural language se room suggest karo
const smartSearch = async (req, res) => {
  try {
    const { query } = req.query;

    // agar query nahi di to error do
    if (!query || query.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Search query dena zaroori hai'
      });
    }

    // query ko lowercase mein convert karo aur words mein split karo
    const words = query.toLowerCase().split(/\s+/);

    // matched keywords track karo
    let matchedTypes = new Set();
    let minPrice = null;
    let maxPrice = null;
    let matchedLabels = [];

    // har word ko keyword map se match karo
    words.forEach(word => {
      if (KEYWORD_MAP[word]) {
        const mapping = KEYWORD_MAP[word];
        mapping.types.forEach(t => matchedTypes.add(t));
        if (mapping.minPrice) minPrice = mapping.minPrice;
        if (mapping.maxPrice) maxPrice = mapping.maxPrice;
        if (mapping.label) matchedLabels.push(mapping.label);
      }
    });

    // agar koi match nahi mila to default suggestion do
    if (matchedTypes.size === 0) {
      matchedTypes = new Set(['Single', 'Double', 'Deluxe']);
      matchedLabels.push('General');
    }

    // database se matching available rooms find karo
    let filter = {
      status: 'Available',
      type: { $in: Array.from(matchedTypes) }
    };

    // price range filter lagao agar available hai
    if (minPrice) filter.price = { ...filter.price, $gte: minPrice };
    if (maxPrice) filter.price = { ...filter.price, $lte: maxPrice };

    const availableRooms = await Room.find(filter).sort({ price: 1 });

    // price range calculate karo suggestions ke liye
    let priceRange = '';
    if (minPrice && maxPrice) priceRange = `Rs. ${minPrice} - Rs. ${maxPrice}`;
    else if (maxPrice) priceRange = `Rs. ${maxPrice} tak`;
    else if (minPrice) priceRange = `Rs. ${minPrice} se zyada`;
    else priceRange = 'Koi bhi range';

    // AI response banao
    const aiResponse = {
      query: query,
      category: matchedLabels.join(', ') || 'General',
      suggestedTypes: Array.from(matchedTypes),
      estimatedPriceRange: priceRange,
      availableRooms: availableRooms,
      totalFound: availableRooms.length,
      message: availableRooms.length > 0
        ? `${availableRooms.length} rooms milein hain aapki zaroorat ke mutabiq!`
        : 'Afsos, is waqt koi matching room available nahi hai.'
    };

    res.json({ success: true, result: aiResponse });
  } catch (error) {
    console.error('AI Smart Search error:', error);
    res.status(500).json({
      success: false,
      message: 'AI search mein error aa gaya'
    });
  }
};

module.exports = { smartSearch };

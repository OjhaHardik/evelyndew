/*
  Evelyn Dew product data. Single source for the website and the packaging studio.
  Copy comes from 01/02/03-*-Carton.md. Prices are SAMPLE MRPs: replace before launch.
  Carton sizes (mm) come from the same docs, read as width x height (portrait).
  Depth is not confirmed yet, so `d` is an assumption for drawing the dieline.
  heroIngredients[].tag/inci/about are website-only copy for the Science and product
  pages: plain descriptions of what each ingredient is, with no new claims.
*/
(function (root) {
  const common = {
    manufacturer: [
      'Manufactured By:',
      'ROYAL INDUSTRIES',
      'Plot No. 103, Yusufpur Manota,',
      'Muradnagar, Ghaziabad (U.P.), India - 201206',
      'Mfg. Lic. No.: UP14320000007'
    ],
    marketer: [
      'Marketed By:',
      '[Company name + full address]'
    ],
    care: [
      'For queries / feedback / complaints:',
      'Customer Care: [Phone]',
      'Email: [Email]',
      'Web: [Website]'
    ],
    epr: 'EPR Reg. No.: [__________]',
    origin: 'MADE IN INDIA',
    batch: ['Batch No.', 'Mfg. Date', 'Use Before', 'MRP ₹', 'USP']
  };

  // Gradients are lifted from the Figma file:
  //  ultraviolet  -> sunscreen prototype ("Frame 13")
  //  aqua         -> "Untitled-1 2" brand gradient (#ffffff, #19b0cd, #2896cd, #1d25c2)
  //  ember        -> "Frame 30" (#ee3a3a, #e0881c, #e7e42b)
  const gradients = {
    ultraviolet: {
      name: 'Ultraviolet',
      core: '#07061a',
      stops: ['#fff4fd', '#f2a6ee', '#e23ad6', '#8b2cf2', '#3612d9', '#07061a'],
      tint: '#8b2cf2'
    },
    aqua: {
      name: 'Aqua Dew',
      core: '#040a2c',
      stops: ['#ffffff', '#a8ecf2', '#19b0cd', '#2896cd', '#1d25c2', '#040a2c'],
      tint: '#2896cd'
    },
    ember: {
      name: 'Ember',
      core: '#1a0608',
      stops: ['#fffbe0', '#e7e42b', '#e0881c', '#ee3a3a', '#7a1030', '#1a0608'],
      tint: '#e0881c'
    }
  };

  const products = [
    {
      id: 'sunscreen',
      slug: 'sunscreen-cream-spf-50',
      name: 'Sunscreen Cream SPF 50',
      shortName: 'Sunscreen',
      display: 'SUNSCREEN',
      descriptor: 'Cream',
      category: 'Skin',
      gradient: 'ultraviolet',
      actives: 'Zinc Oxide + Alpha Arbutin + Hyaluronic Acid',
      claims: ['BROAD SPECTRUM', 'SPF 50', 'PA+++'],
      line1: 'UVA + UVB Protection',
      line2: 'Brightening · Hydrating · Non-Greasy',
      forType: 'FOR ALL SKIN TYPES',
      net: 'Net Wt.: 100 g',
      qty: '100 g',
      unit: 'g',
      price: 549, // sample MRP
      carton: { w: 78, h: 120, d: 40 },
      container: 'tube',
      // Website art direction: the product's gradient (assets/img/gradients) is the only colour on its pages.
      site: { art: 'sunscreen', accent: '#4b4b48', glow: '#d9d9d6' },
      // Black-and-white stock placeholders in assets/img/photos (see CREDITS.md); swap for real Evelyn Dew shoots before launch.
      photos: { product: 'sunscreen-tube', model: 'sun-model', gallery: ['sunscreen-tube', 'sun-model', 'sunscreen-flat', 'sun-shade'] },
      topFlap: 'SUNSCREEN CREAM · SPF 50 PA+++',
      headline: 'Everyday sun protection with a brightening boost.',
      description:
        'A hydrating sunscreen cream that combines mineral filters (Zinc Oxide, Titanium Dioxide) with UV filters for broad-spectrum UVA and UVB protection. Alpha Arbutin, Licorice and Papaya help brighten and even out skin tone. Hyaluronic Acid and Aloe Vera keep skin soft, hydrated and comfortable all day.',
      benefits: [
        'SPF 50 PA+++ broad-spectrum protection',
        'Helps prevent tanning, sunburn and dark spots',
        'Brightens and evens out skin tone',
        'Hydrates and soothes skin',
        'Lightweight and non-greasy'
      ],
      howTo: [
        'Use as the last step of your morning skincare routine.',
        'Apply generously on the face, neck and other exposed areas.',
        'Apply 15 minutes before sun exposure.',
        'Reapply every 2-3 hours, and after swimming, sweating or towel-drying.'
      ],
      heroIngredients: [
        { name: 'Zinc Oxide + Titanium Dioxide', desc: 'mineral UV protection', tag: 'Mineral filters',
          inci: 'Zinc Oxide, Titanium Dioxide',
          about: 'Mineral UV filters. They sit on the surface of the skin and help shield it from UVA and UVB rays.' },
        { name: 'Alpha Arbutin + Licorice', desc: 'brighten and fade dark spots', tag: 'Brightening',
          inci: 'Alpha-Arbutin, Glycyrrhiza Glabra (Licorice) Root Extract',
          about: 'Alpha Arbutin is a brightening active that works on uneven tone. Licorice root extract is a botanical long used to calm and brighten skin.' },
        { name: 'Hyaluronic Acid + Aloe Vera', desc: 'hydrate and soothe', tag: 'Hydration',
          inci: 'Sodium Hyaluronate, Aloe Barbadensis Leaf Extract',
          about: 'Hyaluronic Acid is a humectant: it draws water into the skin and helps hold it there. Aloe Vera soothes and softens.' },
        { name: 'Vitamin E', desc: 'antioxidant protection', tag: 'Antioxidant',
          inci: 'Tocopheryl Acetate',
          about: 'A stable form of Vitamin E that helps protect skin from everyday oxidative stress.' }
      ],
      ingredients:
        'Aqua, Glycerin, Propanediol, Titanium Dioxide, Zinc Oxide, Ethylhexyl Methoxycinnamate, Benzophenone-3, C12-15 Alkyl Benzoate, Dimethicone, Glyceryl Stearate, Butylene Glycol, Helianthus Annuus (Sunflower) Seed Oil, Glyceryl Glucoside, Sodium Acrylates Copolymer, Lecithin, Phospholipids, Alpha-Arbutin, Allantoin, Aloe Barbadensis Leaf Extract, Glycyrrhiza Glabra (Licorice) Root Extract, Carica Papaya Fruit Extract, Sodium Hyaluronate, Tocopheryl Acetate, Phenoxyethanol, Ethylhexylglycerin, Fragrance.',
      freeFrom: ['Paraben Free', 'Mineral Oil Free', 'Cruelty Free'],
      caution:
        'For external use only. Avoid contact with eyes; if contact occurs, rinse immediately with water. Do a patch test before first use. Discontinue use if irritation occurs. Keep out of reach of children.',
      storage:
        'Store in a cool, dry place below 30°C, away from direct sunlight. Close the cap tightly after use.',
      ritual: { when: 'Every morning', verb: 'Protect' },
      insideFlap: ["Sun's out, glow's on.", 'Thank you for choosing Evelyn Dew.', 'Share your glow with us: @evelyndew']
    },
    {
      id: 'serum',
      slug: 'anti-dandruff-hair-serum',
      name: 'Anti Dandruff Hair Serum',
      shortName: 'Hair Serum',
      display: 'HAIR SERUM',
      descriptor: 'Anti Dandruff',
      category: 'Scalp',
      gradient: 'aqua',
      actives: 'Redensyl® + Procapil™ + Rosemary',
      claims: ['SOOTHES SCALP', 'STRENGTHENS ROOTS', 'REDUCES HAIR FALL'],
      line1: '',
      line2: 'Lightweight · Non-Sticky',
      forType: 'FOR ALL HAIR TYPES',
      net: 'Net Vol.: 30 ml',
      qty: '30 ml',
      unit: 'ml',
      price: 699, // sample MRP
      carton: { w: 45, h: 110, d: 45 },
      container: 'dropper',
      site: { art: 'serum', accent: '#6d28d9', glow: '#c9a2ff' },
      photos: { product: 'serum-bottle', model: 'serum-model', gallery: ['serum-bottle', 'serum-model', 'serum-profile', 'dropper'] },
      topFlap: 'HAIR SERUM · ANTI DANDRUFF',
      headline: 'Healthy scalp, stronger roots.',
      description:
        'A lightweight scalp serum powered by Redensyl®, Procapil™, Anagain™ and Baicapil™, plant-based actives that work at the root to reduce hair fall and support thicker-looking hair. Rosemary, Caffeine, Centella and Green Tea soothe and refresh the scalp. Biotin, Keratin and Pea Protein strengthen every strand.',
      benefits: [
        'Reduces hair fall',
        'Strengthens hair from the roots',
        'Soothes and refreshes the scalp',
        'Lightweight, non-sticky, non-greasy'
      ],
      howTo: [
        'Part your hair and apply 5-6 drops directly to the scalp.',
        'Massage gently with your fingertips for 2-3 minutes.',
        'Do not rinse. Use daily, preferably at night.'
      ],
      heroIngredients: [
        // INCI names for the trade-name actives are still pending from the supplier, so `inci` is left out.
        { name: 'Redensyl® + Procapil™ + Anagain™ + Baicapil™', desc: 'reduce hair fall at the root', tag: 'Root actives',
          about: 'A group of plant-derived actives, each developed by its supplier to work at the hair root.' },
        { name: 'Rosemary + Caffeine', desc: 'stimulate and refresh the scalp', tag: 'Scalp care',
          inci: 'Rosmarinus Officinalis (Rosemary) Leaf Oil, Caffeine',
          about: 'Rosemary is one of the best-known botanicals in scalp care. Caffeine gives the scalp a fresh, awake feel.' },
        { name: 'Biotin + Keratin + Pea Protein', desc: 'strengthen hair strands', tag: 'Strength',
          inci: 'Biotin, Plant-Derived Keratin, Hydrolyzed Pea Protein',
          about: 'Biotin is a B vitamin. Keratin and pea protein are proteins that coat and condition each strand.' }
      ],
      ingredients:
        'Aqua, Propanediol, Glycerin, Redensyl®, Anagain™, Procapil™, Capilia Longa™, Baicapil™, Serenoa Serrulata (Saw Palmetto) Fruit Extract, Caffeine, Arginine, Copper Tripeptide-1, Fermented Rice Water, Centella Asiatica Extract, Camellia Sinensis (Green Tea) Leaf Extract, Plant-Derived Keratin, Hydrolyzed Pea Protein, Biotin, Tocopheryl Acetate, Rosmarinus Officinalis (Rosemary) Leaf Oil, Rosmarinus Officinalis (Rosemary) Leaf Extract, Pentavitin®, Betaine, Cetrimonium Chloride, Carbomer, Xanthan Gum, Polysorbate 20, Sodium Benzoate, Potassium Sorbate, Phenoxyethanol, Ethylhexylglycerin.',
      freeFrom: ['Paraben Free', 'Sulphate Free', 'Cruelty Free'],
      caution:
        'For external use only. Avoid contact with eyes; if contact occurs, rinse with water. Do a patch test before first use. Discontinue use if irritation occurs. Keep out of reach of children.',
      storage:
        'Store in a cool, dry place away from direct sunlight. Close the cap tightly after use.',
      ritual: { when: 'Every night', verb: 'Soothe' },
      insideFlap: ['Good hair days, every day.', 'Thank you for choosing Evelyn Dew.', 'Share your shine with us: @evelyndew']
    },
    {
      id: 'oil',
      slug: 'hair-growth-massage-oil',
      name: 'Hair Growth Massage Oil',
      shortName: 'Hair Oil',
      display: 'HAIR OIL',
      descriptor: 'Hair Growth Massage Oil',
      category: 'Hair',
      gradient: 'ember',
      actives: 'Rosemary + Onion + Bhringraj',
      claims: ['NOURISH', 'STRENGTHEN', 'REDUCE HAIR FALL'],
      line1: 'Blend of 16 Natural Oils',
      line2: 'Non-Sticky · Lightweight',
      forType: 'FOR ALL HAIR TYPES',
      net: 'Net Vol.: 100 ml',
      qty: '100 ml',
      unit: 'ml',
      price: 449, // sample MRP
      carton: { w: 70, h: 120, d: 50 },
      container: 'bottle',
      site: { art: 'oil', accent: '#a8590d', glow: '#f2b45c' },
      photos: { product: 'oil-bottles', model: 'oil-model', gallery: ['oil-bottles', 'oil-model', 'heritage'] },
      topFlap: 'HAIR GROWTH OIL · 16 NATURAL OILS',
      headline: 'Rooted in nature, made for strength.',
      description:
        'A nourishing blend of 16 Ayurvedic and natural oils, including Rosemary, Onion Seed, Bhringraj, Jatamansi, Amla and Black Seed, that strengthens hair from root to tip and supports healthy hair growth. Salicylic Acid helps keep the scalp clean and flake-free, while Almond, Jojoba and Avocado oils leave hair soft and shiny.',
      benefits: [
        'Supports healthy hair growth',
        'Reduces hair fall from breakage',
        'Strengthens hair from root to tip',
        'Nourishes a dry, flaky scalp',
        'Adds softness and natural shine'
      ],
      howTo: [
        'Part your hair into sections.',
        'Apply the oil directly to the scalp.',
        'Massage gently with your fingertips for 5-10 minutes.',
        'Run the remaining oil through the lengths of your hair.',
        'Leave on for at least 1 hour, or overnight for best results.',
        'Wash off with a mild shampoo. Use 2-3 times a week.'
      ],
      heroIngredients: [
        { name: 'Rosemary Oil', desc: 'stimulates the scalp and supports hair growth', tag: 'Scalp care',
          inci: 'Rosmarinus Officinalis (Rosemary) Leaf Oil',
          about: 'An essential oil traditionally massaged into the scalp, carried here in a blend of natural oils.' },
        { name: 'Onion Seed Oil', desc: 'helps reduce hair fall', tag: 'Hair fall',
          inci: 'Allium Cepa (Onion) Seed Oil',
          about: 'Pressed from onion seeds, and a long-standing ingredient in Indian hair oils.' },
        { name: 'Bhringraj', desc: 'nourishes the hair roots', tag: 'Traditional',
          inci: 'Eclipta Prostrata (Bhringraj) Extract',
          about: 'A herb traditionally used in Indian hair care to nourish the roots.' },
        { name: 'Jatamansi + Amla', desc: 'strengthen hair and add shine', tag: 'Shine',
          inci: 'Nardostachys Jatamansi (Jatamansi) Root Oil, Emblica Officinalis (Amla) Fruit Extract',
          about: 'Jatamansi is a Himalayan root. Amla, the Indian gooseberry, is naturally rich in Vitamin C.' }
      ],
      ingredients:
        'Sesamum Indicum (Sesame) Seed Oil, Cocos Nucifera (Coconut) Oil, Ricinus Communis (Castor) Seed Oil, Persea Gratissima (Avocado) Oil, Emblica Officinalis (Amla) Fruit Extract, Rosmarinus Officinalis (Rosemary) Leaf Oil, Azadirachta Indica (Neem) Seed Oil, Olea Europaea (Olive) Fruit Oil, Helianthus Annuus (Sunflower) Seed Oil, Nardostachys Jatamansi (Jatamansi) Root Oil, Allium Cepa (Onion) Seed Oil, Caprylic/Capric Triglyceride, Prunus Amygdalus Dulcis (Sweet Almond) Oil, Lavandula Angustifolia (Lavender) Oil, Simmondsia Chinensis (Jojoba) Seed Oil, Nigella Sativa (Black Seed) Oil, Eclipta Prostrata (Bhringraj) Extract, Salicylic Acid, Tocopheryl Acetate, BHT, Fragrance.',
      freeFrom: ['Mineral Oil Free', 'Paraben Free', 'Silicone Free', 'Cruelty Free'],
      caution:
        'For external use only. Avoid contact with eyes. Do a patch test 24 hours before first use. Discontinue use if irritation occurs. Keep out of reach of children. Not to be used on children under 3 years of age.',
      storage:
        'Store in a cool, dry place away from direct sunlight. Close the cap tightly after use.',
      ritual: { when: 'Twice a week', verb: 'Nourish' },
      insideFlap: ['Strong roots, happy hair.', 'Thank you for choosing Evelyn Dew.', 'Share your hair journey with us: @evelyndew']
    }
  ];

  // CSS radial gradient used on cartons, containers and site surfaces.
  // Light blooms from the top-right corner, like sun through a dew drop.
  function dewGradient(key, at) {
    const g = gradients[key].stops;
    return `radial-gradient(130% 120% at ${at || '100% 0%'}, ${g[0]} 0%, ${g[1]} 9%, ${g[2]} 27%, ${g[3]} 46%, ${g[4]} 64%, ${g[5]} 86%)`;
  }

  root.ED = { products, gradients, common, dewGradient };
})(typeof window !== 'undefined' ? window : globalThis);

/**
 * Product categories.
 * `id` is used in URLs (/products/dona) and in each product's `category` field.
 * `icon` is a Lucide icon name (see src/components/ui/categoryIcons.js).
 */
const categories = [
  {
    id: 'dona',
    // Extra search words (Hinglish spellings people type)
    keywords: ['dona', 'donna', 'katora', 'bowl', 'दोना', 'दोने'],
    nameEn: 'Dona',
    nameHi: 'दोना',
    descriptionEn: 'Leaf, paper and silver-coated dona in small, medium and large sizes.',
    descriptionHi: 'पत्ते, कागज़ और सिल्वर कोटेड दोना — छोटे, मध्यम और बड़े साइज़ में।',
    image: '/images/categories/dona.webp',
    imageAltEn: 'Stack of silver and leaf dona bowls',
    imageAltHi: 'सिल्वर और पत्तों के दोने का ढेर',
  },
  {
    id: 'pattal',
    // Extra search words (Hinglish spellings people type)
    keywords: ['pattal', 'pattel', 'patal', 'plate', 'plates', 'paper plate', 'पत्तल', 'प्लेट'],
    nameEn: 'Pattal / Plates',
    nameHi: 'पत्तल',
    descriptionEn: 'Leaf pattal, paper plates and silver-coated plates in many sizes.',
    descriptionHi: 'पत्तों की पत्तल, कागज़ की प्लेट और सिल्वर कोटेड प्लेट — कई साइज़ में।',
    image: '/images/categories/pattal.webp',
    imageAltEn: 'Stack of round silver-coated paper plates and leaf plates',
    imageAltHi: 'गोल सिल्वर कोटेड प्लेट और पत्तों की पत्तल का ढेर',
  },
  {
    id: 'thali',
    // Extra search words (Hinglish spellings people type)
    keywords: ['thali', 'thaal', 'thal', 'bhojan', 'compartment', 'थाली', 'थाल', 'भोजन'],
    nameEn: 'Bhojan Thali',
    nameHi: 'भोजन थाल',
    descriptionEn: '4, 5 and 6-compartment meal plates for buffets and langar.',
    descriptionHi: 'बुफे और लंगर के लिए 4, 5 और 6 खाने वाली थाली।',
    image: '/images/categories/thali.webp',
    imageAltEn: 'Grey and white 5-compartment disposable meal thali',
    imageAltHi: 'ग्रे और सफ़ेद 5 खाने वाली डिस्पोजल थाली',
  },
  {
    id: 'glasses',
    // Extra search words (Hinglish spellings people type)
    keywords: ['glass', 'gilas', 'gilaas', 'cup', 'cups', 'kap', 'tea', 'chai', 'disposal', 'गिलास', 'कप', 'चाय'],
    nameEn: 'Disposable Glasses & Cups',
    nameHi: 'डिस्पोजल गिलास',
    descriptionEn: 'Paper cups, plastic glasses and tea cups in every ml size.',
    descriptionHi: 'कागज़ के कप, प्लास्टिक गिलास और चाय के कप — हर ml में।',
    image: '/images/categories/glasses.webp',
    imageAltEn: 'Colorful printed paper cups and clear plastic glasses',
    imageAltHi: 'रंगीन प्रिंटेड पेपर कप और पारदर्शी प्लास्टिक गिलास',
  },
  {
    id: 'foil',
    // Extra search words (Hinglish spellings people type)
    keywords: ['foil', 'aluminium', 'aluminum', 'almonium', 'file', 'fail', 'container', 'फाइल', 'फॉयल', 'डिब्बा'],
    nameEn: 'Aluminium Foil',
    nameHi: 'अल्मोनियम फाइल',
    descriptionEn: 'Foil rolls and foil containers with lids for packing food.',
    descriptionHi: 'खाना पैक करने के लिए फाइल रोल और ढक्कन वाले फाइल डिब्बे।',
    image: '/images/categories/foil.webp',
    imageAltEn: 'Aluminium foil roll and foil containers with lids',
    imageAltHi: 'अल्मोनियम फाइल रोल और ढक्कन वाले फाइल डिब्बे',
  },
  {
    id: 'bowls',
    // Extra search words (Hinglish spellings people type)
    keywords: ['bowl', 'bowls', 'katori', 'katoori', 'कटोरी', 'कटोरा'],
    nameEn: 'Bowls & Katori',
    nameHi: 'कटोरी',
    descriptionEn: 'Paper bowls and plastic katori for sabzi, dal and sweets.',
    descriptionHi: 'सब्ज़ी, दाल और मिठाई के लिए कागज़ की कटोरी और प्लास्टिक कटोरी।',
    image: '/images/categories/bowls.webp',
    imageAltEn: 'White paper bowls and plastic katori',
    imageAltHi: 'सफ़ेद कागज़ की कटोरी और प्लास्टिक कटोरी',
  },
  {
    id: 'spoons',
    // Extra search words (Hinglish spellings people type)
    keywords: ['spoon', 'spoons', 'chammach', 'chamach', 'chamch', 'fork', 'kanta', 'cutlery', 'चम्मच', 'काँटा'],
    nameEn: 'Spoons & Cutlery',
    nameHi: 'चम्मच',
    descriptionEn: 'Plastic and wooden disposable spoons and forks.',
    descriptionHi: 'प्लास्टिक और लकड़ी के डिस्पोजल चम्मच और काँटे।',
    image: '/images/categories/spoons.webp',
    imageAltEn: 'Plastic and wooden disposable spoons',
    imageAltHi: 'प्लास्टिक और लकड़ी के डिस्पोजल चम्मच',
  },
  {
    id: 'combo',
    // Extra search words (Hinglish spellings people type)
    keywords: ['combo', 'pack', 'party', 'kit', 'set', 'पैक', 'पार्टी', 'किट'],
    nameEn: 'Party Combo Packs',
    nameHi: 'पार्टी कॉम्बो पैक',
    descriptionEn: 'Complete kits for 50, 100, 250 and 500 guests.',
    descriptionHi: '50, 100, 250 और 500 मेहमानों के लिए पूरी किट।',
    image: '/images/categories/combo.webp',
    imageAltEn: 'Complete party pack: plate, dona, glass and spoon arranged neatly',
    imageAltHi: 'पूरा पार्टी पैक: प्लेट, दोना, गिलास और चम्मच सजे हुए',
  },
];

export const getCategory = (id) => categories.find((c) => c.id === id);

export default categories;

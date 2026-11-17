/**
 * Design options customers can pick before adding a product to the cart
 * (plate border, cup print, thali colour…).
 *
 * `swatch` is any CSS background value shown in the little round colour chip.
 * To add a design: add it here, then list its id in a product's `designs` array
 * in src/data/products.js.
 */
const designs = {
  // Silver-coated items
  'plain-silver': {
    nameEn: 'Plain Silver',
    nameHi: 'सादा सिल्वर',
    swatch: 'linear-gradient(135deg, #F7F8FA 0%, #C3C8CF 55%, #EEF0F2 100%)',
  },
  'golden-border': {
    nameEn: 'Golden Border',
    nameHi: 'सुनहरा बॉर्डर',
    swatch: 'radial-gradient(circle, #E9ECEF 0 48%, #D4A017 50% 66%, #C9CED4 68%)',
  },
  'red-border': {
    nameEn: 'Red Border',
    nameHi: 'लाल बॉर्डर',
    swatch: 'radial-gradient(circle, #F4F5F7 0 48%, #C62828 50% 66%, #D7DADF 68%)',
  },
  'floral-print': {
    nameEn: 'Floral Print',
    nameHi: 'फूलदार प्रिंट',
    swatch:
      'radial-gradient(circle at 30% 32%, #EC407A 0 16%, transparent 18%), radial-gradient(circle at 68% 62%, #F9A825 0 15%, transparent 17%), radial-gradient(circle at 34% 72%, #66BB6A 0 10%, transparent 12%), #FFFFFF',
  },

  // Paper / plastic colours
  'plain-white': { nameEn: 'Plain White', nameHi: 'सादा सफ़ेद', swatch: '#FFFFFF' },
  grey: { nameEn: 'Grey', nameHi: 'ग्रे', swatch: '#BFC3C8' },
  black: { nameEn: 'Black (Premium)', nameHi: 'काला (प्रीमियम)', swatch: '#2B2B2B' },
  clear: {
    nameEn: 'Clear',
    nameHi: 'पारदर्शी',
    swatch: 'linear-gradient(135deg, #E3F0F7 0%, #FFFFFF 50%, #D3E4EE 100%)',
  },
  frosted: { nameEn: 'Frosted', nameHi: 'फ़्रॉस्टेड', swatch: 'linear-gradient(135deg, #EEF1F3, #DCE1E5)' },
  'mixed-colours': {
    nameEn: 'Mixed Colours',
    nameHi: 'मिले-जुले रंग',
    swatch: 'conic-gradient(#C62828 0 25%, #F9A825 0 50%, #2E7D32 0 75%, #1E88E5 0)',
  },

  // Cup prints
  'red-stripes': {
    nameEn: 'Red Stripes',
    nameHi: 'लाल धारियाँ',
    swatch: 'repeating-linear-gradient(45deg, #C62828 0 4px, #FFFFFF 4px 8px)',
  },
  'yellow-dots': {
    nameEn: 'Yellow Dots',
    nameHi: 'पीली बिंदियाँ',
    swatch: 'radial-gradient(#F9A825 0 28%, transparent 31%) 0 0 / 9px 9px, #FFFFFF',
  },
  'green-leaf': {
    nameEn: 'Green Leaf Print',
    nameHi: 'हरा पत्ता प्रिंट',
    swatch: 'radial-gradient(ellipse 30% 18% at 50% 50%, #2E7D32 0 95%, transparent 100%) 0 0 / 12px 12px, #F1F8E9',
  },
  'kulhad-print': { nameEn: 'Kulhad Look', nameHi: 'कुल्हड़ लुक', swatch: 'linear-gradient(135deg, #C47A45, #8D4A22)' },

  // Party pack plate sets
  'silver-set': {
    nameEn: 'Silver Set',
    nameHi: 'सिल्वर सेट',
    swatch: 'linear-gradient(135deg, #F7F8FA 0%, #C3C8CF 55%, #EEF0F2 100%)',
  },
  'leaf-set': { nameEn: 'Eco Leaf Set', nameHi: 'इको पत्ता सेट', swatch: 'linear-gradient(135deg, #8DBA52, #4F7E2A)' },
  'paper-set': { nameEn: 'Printed Paper Set', nameHi: 'प्रिंटेड पेपर सेट', swatch: 'repeating-linear-gradient(45deg, #C62828 0 3px, #FFFFFF 3px 7px)' },
};

export const getDesign = (id) => (id && designs[id] ? { id, ...designs[id] } : null);

export default designs;

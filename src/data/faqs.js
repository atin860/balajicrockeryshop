/**
 * Frequently asked questions (FAQ page). Answers about delivery areas come
 * from src/config/shop.js so they stay in sync with the shop settings.
 *
 * NOTE FOR OWNER: the return policy and advance-booking times below are
 * sensible defaults — please confirm or edit them to match how you work.
 */
import shop from '../config/shop';

const faqs = [
  {
    id: 'delivery-areas',
    questionEn: 'Which areas do you deliver to?',
    questionHi: 'आप किन जगहों पर डिलीवरी करते हैं?',
    answerEn: `${shop.delivery.areas.en} Store pickup is always available at our shop opposite TVS Agency, Gola Road.`,
    answerHi: `${shop.delivery.areas.hi} टी.वी.एस. एजेंसी के सामने, गोला रोड वाली हमारी दुकान से सामान लेने की सुविधा भी हमेशा है।`,
  },
  {
    id: 'how-to-order',
    questionEn: 'How do I place an order?',
    questionHi: 'ऑर्डर कैसे करें?',
    answerEn:
      'Browse our products and designs, then tap "Enquire on WhatsApp" (fill your name, mobile and what you need) or simply call us. Tell us the items, designs and quantity — we confirm the rate, stock and delivery with you.',
    answerHi:
      'हमारे प्रोडक्ट्स और डिज़ाइन देखें, फिर "व्हाट्सऐप पर पूछताछ करें" दबाएँ (नाम, मोबाइल और ज़रूरत लिखें) या सीधे कॉल करें। सामान, डिज़ाइन और मात्रा बताइए — हम रेट, स्टॉक और डिलीवरी आपसे तय कर लेंगे।',
  },
  {
    id: 'minimum-order',
    questionEn: 'Is there a minimum order?',
    questionHi: 'क्या कोई न्यूनतम ऑर्डर है?',
    answerEn:
      'No. You can order even a single packet from the shop. For home delivery of very small orders, we will confirm the delivery arrangement with you on WhatsApp.',
    answerHi:
      'नहीं। आप दुकान से एक पैकेट भी ले सकते हैं। बहुत छोटे ऑर्डर की होम डिलीवरी के लिए हम व्हाट्सऐप पर आपसे डिलीवरी तय कर लेंगे।',
  },
  {
    id: 'wholesale-rates',
    questionEn: 'Why are prices not shown on the website? Do you give wholesale rates?',
    questionHi: 'वेबसाइट पर दाम क्यों नहीं दिखते? क्या होलसेल रेट मिलता है?',
    answerEn:
      'Rates depend on the quantity and design you choose, and bulk orders get better wholesale rates. So we share the best rate for your exact order personally on WhatsApp — usually within a few minutes during shop hours.',
    answerHi:
      'रेट आपकी चुनी हुई मात्रा और डिज़ाइन पर निर्भर करता है, और थोक ऑर्डर पर होलसेल रेट और भी अच्छा मिलता है। इसलिए आपके ऑर्डर का सबसे अच्छा रेट हम व्हाट्सऐप पर खुद बताते हैं — दुकान के समय में आमतौर पर कुछ ही मिनटों में।',
  },
  {
    id: 'advance-booking',
    questionEn: 'How early should I book for a wedding or bhandara?',
    questionHi: 'शादी या भंडारे के लिए कितने दिन पहले बुकिंग करें?',
    answerEn:
      'For large events (300+ guests) please book 7–10 days in advance, especially in the wedding season, so we can keep your stock and designs reserved. Small orders are usually ready the same day.',
    answerHi:
      'बड़े आयोजनों (300+ मेहमान) के लिए कृपया 7–10 दिन पहले बुकिंग करें, खासकर शादी के सीज़न में, ताकि आपका स्टॉक और डिज़ाइन रिज़र्व रखा जा सके। छोटे ऑर्डर आमतौर पर उसी दिन तैयार हो जाते हैं।',
  },
  {
    id: 'payment',
    questionEn: 'How do I pay? Is payment on delivery available?',
    questionHi: 'भुगतान कैसे करें? क्या डिलीवरी पर भुगतान होता है?',
    answerEn:
      'Yes. There is no online payment on this website. Pay by cash or UPI when your order is delivered or when you pick it up from the shop. For very large bookings we may ask for a small advance.',
    answerHi:
      'हाँ। इस वेबसाइट पर कोई ऑनलाइन पेमेंट नहीं है। ऑर्डर मिलने पर या दुकान से लेते समय नकद या UPI से भुगतान करें। बहुत बड़ी बुकिंग पर थोड़ा एडवांस लिया जा सकता है।',
  },
  {
    id: 'returns',
    questionEn: 'Can I return extra or unused items?',
    questionHi: 'क्या बचा हुआ या बिना इस्तेमाल सामान वापस हो सकता है?',
    answerEn:
      'Sealed, unused packets can be returned within 3 days of your event with the bill. Opened packets and printed/custom items cannot be returned for hygiene reasons.',
    answerHi:
      'बंद, बिना इस्तेमाल किए पैकेट आयोजन के 3 दिन के भीतर बिल के साथ वापस हो सकते हैं। खुले पैकेट और प्रिंटेड/कस्टम सामान साफ़-सफ़ाई के कारण वापस नहीं होते।',
  },
  {
    id: 'designs',
    questionEn: 'Can I see the designs before ordering?',
    questionHi: 'क्या ऑर्डर से पहले डिज़ाइन देख सकते हैं?',
    answerEn:
      'Yes — every product shows its available designs. If you want to see real photos of a design or stock, ask us on WhatsApp and we will send pictures, or visit the shop.',
    answerHi:
      'हाँ — हर प्रोडक्ट पर उसके उपलब्ध डिज़ाइन दिखते हैं। किसी डिज़ाइन या स्टॉक की असली फ़ोटो देखनी हो तो व्हाट्सऐप पर पूछें, हम फ़ोटो भेज देंगे, या दुकान पर आएँ।',
  },
];

export default faqs;

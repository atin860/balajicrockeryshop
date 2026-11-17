/**
 * Occasions shown on the Home page. `id` matches an event type (eventTypes.* in i18n)
 * so the Bulk Order form can be pre-filled: /bulk-order?event=wedding
 */
const occasions = [
  {
    id: 'wedding',
    nameEn: 'Wedding',
    nameHi: 'शादी-विवाह',
    image: '/images/occasions/wedding.webp',
    altEn: 'Decorated Indian wedding buffet with disposable thali and glasses',
    altHi: 'सजी हुई भारतीय शादी का बुफे, डिस्पोजल थाली और गिलास के साथ',
  },
  {
    id: 'namkaran',
    nameEn: 'Naming Ceremony',
    nameHi: 'नामकरण',
    image: '/images/occasions/namkaran.webp',
    altEn: 'Naming ceremony table with sweets on a silver plate',
    altHi: 'नामकरण समारोह में सिल्वर प्लेट पर मिठाई',
  },
  {
    id: 'bhandara',
    nameEn: 'Bhandara',
    nameHi: 'भंडारा',
    image: '/images/occasions/bhandara.webp',
    altEn: 'Bhandara langar rows with leaf pattal and dona',
    altHi: 'भंडारे में पत्तल और दोने की पंगत',
  },
  {
    id: 'birthday',
    nameEn: 'Birthday Party',
    nameHi: 'जन्मदिन',
    image: '/images/occasions/birthday.webp',
    altEn: 'Birthday party with printed paper plates, cups and balloons',
    altHi: 'प्रिंटेड पेपर प्लेट, कप और गुब्बारों के साथ जन्मदिन पार्टी',
  },
  {
    id: 'puja',
    nameEn: 'Puja & Path',
    nameHi: 'पूजा-पाठ',
    image: '/images/occasions/puja.webp',
    altEn: 'Puja thali with diya, flowers and leaf dona',
    altHi: 'दीया, फूल और पत्ते के दोने के साथ पूजा की थाली',
  },
  {
    id: 'catering',
    nameEn: 'Catering & Events',
    nameHi: 'कैटरिंग',
    image: '/images/occasions/catering.webp',
    altEn: 'Catering buffet setup with stacks of plates and glasses',
    altHi: 'प्लेट और गिलास के ढेर के साथ कैटरिंग बुफे',
  },
];

export default occasions;

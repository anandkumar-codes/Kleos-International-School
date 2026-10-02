// Single source of truth for the school's identity.
// Items marked "confirm" are sensible placeholders to verify with school management.

export const SCHOOL = {
  name: 'Kleos International School',
  shortName: 'Kleos',
  board: 'CBSE',
  affiliationNo: '3630XXX', // confirm
  schoolCode: '5XXXX', // confirm
  founded: 2014, // confirm
  grades: 'Nursery – Grade XII',
  meaning: 'Kleos (κλέος) is the ancient Greek word for glory — the renown earned through excellence.',
  tagline: 'Where Curiosity Meets Excellence',
  address: {
    line1: '117/1, Jaya Prakash Narayan Nagar',
    line2: 'Miyapur, Hyderabad',
    state: 'Telangana',
    pin: '500049',
  },
  phone: '+91 80085 59442',
  phoneHref: 'tel:+918008559442',
  admissionsPhone: '+91 80085 59442',
  emergencyPhone: '+91 80085 59442', // confirm
  email: 'info@kleosschool.in', // confirm
  admissionsEmail: 'admissions@kleosschool.in', // confirm
  hours: [
    { day: 'Monday – Friday', time: '8:30 AM – 4:30 PM' },
    { day: 'Saturday', time: '8:30 AM – 1:00 PM' },
    { day: 'Sunday & Holidays', time: 'Closed' },
  ],
  mapEmbed:
    'https://maps.google.com/maps?q=Kleos%20International%20School%2C%20Miyapur%2C%20Hyderabad&t=&z=15&ie=UTF8&iwloc=&output=embed',
  mapLink: 'https://www.google.com/maps/search/?api=1&query=Kleos+International+School+Miyapur+Hyderabad',
  social: {
    facebook: '#',
    instagram: '#',
    youtube: '#',
    linkedin: '#',
  },
  academicYear: '2026–27',
  admissionYear: '2027–28',
};

export const fullAddress = `${SCHOOL.address.line1}, ${SCHOOL.address.line2}, ${SCHOOL.address.state} ${SCHOOL.address.pin}`;

// Curated photography. SmartImage falls back to a branded illustration if any URL fails.
const u = (id, w = 1200) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=75`;

export const IMG = {
  hero: u('photo-1580582932707-520aed937b7b', 2000),
  campus: u('photo-1509062522246-3755977927d7', 1600),
  classroom: u('photo-1509062522246-3755977927d7'),
  smartClass: u('photo-1577896851231-70ef18881754'),
  kidsClass: u('photo-1588072432836-e10032774350'),
  library: u('photo-1481627834876-b7833e8f5570'),
  books: u('photo-1497633762265-9d179a990aa6'),
  scienceLab: u('photo-1532094349884-543bc11b234d'),
  computerLab: u('photo-1517694712202-14dd9538aa97'),
  sports: u('photo-1546519638-68e109498ffc'),
  playground: u('photo-1575361204480-aadea25e6e68'),
  auditorium: u('photo-1503095396549-807759245b35'),
  transport: u('photo-1557223562-6c77ef16210f'),
  cafeteria: u('photo-1567521464027-f127ff144326'),
  medical: u('photo-1576091160550-2173dba999ef'),
  art: u('photo-1513364776144-60967b0f800f'),
  music: u('photo-1511379938547-c1f69419868d'),
  dance: u('photo-1503095396549-807759245b35'),
  graduation: u('photo-1541339907198-e08756dedf3f'),
  students: u('photo-1571260899304-425eee4c7efc'),
  childStudy: u('photo-1544776193-352d25ca82cd'),
  kids: u('photo-1497486751825-1233686d5d80'),
  teacher: u('photo-1588075592446-265fd1e6e76f'),
  security: u('photo-1557597774-9d273605dfa9'),
  celebration: u('photo-1530103862676-de8c9debad1d'),
  yoga: u('photo-1544367567-0f2fcb009e0b'),
  robotics: u('photo-1485827404703-89b55fcc595e'),
  chess: u('photo-1529699211952-734e80c4d42b'),
  football: u('photo-1431324155629-1a6deb1dec8d'),
  stage: u('photo-1507676184212-d03ab07a01bf'),
};

export const face = (seed) => `https://i.pravatar.cc/300?u=kleos-${encodeURIComponent(seed)}`;

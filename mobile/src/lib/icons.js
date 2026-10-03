import Feather from '@expo/vector-icons/Feather';

// Website content stores lucide icon names; map them to the closest Feather glyph.
const MAP = {
  Presentation: 'monitor', Library: 'book', Monitor: 'cpu', FlaskConical: 'droplet', Trophy: 'award', Bus: 'truck',
  ShieldCheck: 'shield', HeartPulse: 'heart', UtensilsCrossed: 'coffee', Palette: 'feather', Theater: 'film',
  GraduationCap: 'book-open', MonitorSmartphone: 'smartphone', School: 'home', Sparkles: 'star',
};
export const facilityIcon = (name) => MAP[name] || (Feather.glyphMap[name] ? name : 'star');

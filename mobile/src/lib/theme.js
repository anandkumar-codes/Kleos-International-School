// Kleos design tokens for the mobile app — the same palette and type pairing as the website.
import { Platform } from 'react-native';

export const colors = {
  green950: '#05281E',
  green900: '#083A2C',
  green800: '#0B4D3A',
  green700: '#10624A',
  green600: '#177A5B',
  green500: '#24946F',
  green200: '#BFE0D1',
  green100: '#DFF0E8',
  green50: '#F0F8F4',
  gold600: '#B9761A',
  gold500: '#E8A53B',
  gold400: '#F1BD66',
  gold100: '#FCEFD6',
  red600: '#A8262F',
  red500: '#C8323C',
  red100: '#FBE3E4',
  blue600: '#1D5EA5',
  blue500: '#2D7DD2',
  blue100: '#E2EEFB',
  purple500: '#7F56C8',
  purple100: '#EEE7FA',
  amber500: '#D98A10',
  amber100: '#FDF0D8',
  teal500: '#0E7490',
  teal100: '#DFF3F7',

  cream: '#FBF8F1',
  cream2: '#F3EEE2',
  canvas: '#F3F6F4',
  paper: '#FFFFFF',
  ink900: '#13201B',
  ink800: '#22322C',
  ink700: '#3B4C46',
  ink500: '#64746E',
  ink400: '#8B9893',
  ink300: '#B7C1BD',
  line: '#E7E2D6',
  lineCool: '#E3E9E6',
};

// Each signed-in role gets its own accent so the three apps feel distinct.
export const roleTheme = {
  guest: { accent: colors.green800, soft: colors.green50, canvas: colors.cream, label: 'Visitor' },
  parent: { accent: colors.green700, soft: colors.green50, canvas: '#F5F7F3', label: 'Parent' },
  student: { accent: '#2D5FD2', soft: '#EAF0FD', canvas: '#F4F6FB', label: 'Student' },
  staff: { accent: colors.green900, soft: colors.gold100, canvas: colors.canvas, label: 'Staff' },
};

export const fonts = {
  display: 'Fraunces_600SemiBold',
  displayMedium: 'Fraunces_500Medium',
  displayItalic: 'Fraunces_400Regular_Italic',
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semibold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
  extrabold: 'PlusJakartaSans_800ExtraBold',
};

export const radius = { xs: 8, sm: 12, md: 16, lg: 20, xl: 28, full: 999 };
export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 28 };

export const shadow = (level = 1) =>
  Platform.select({
    ios: {
      shadowColor: '#0F2820',
      shadowOpacity: level === 1 ? 0.06 : 0.12,
      shadowRadius: level === 1 ? 6 : 16,
      shadowOffset: { width: 0, height: level === 1 ? 2 : 8 },
    },
    android: { elevation: level === 1 ? 1.5 : 6 },
    default: { boxShadow: level === 1 ? '0 2px 6px rgba(15,40,32,0.06)' : '0 10px 24px rgba(15,40,32,0.12)' },
  });

export const type = {
  hero: { fontFamily: fonts.display, fontSize: 34, lineHeight: 38, color: '#fff', letterSpacing: -0.6 },
  h1: { fontFamily: fonts.display, fontSize: 28, lineHeight: 33, color: colors.ink900, letterSpacing: -0.4 },
  h2: { fontFamily: fonts.display, fontSize: 22, lineHeight: 27, color: colors.ink900, letterSpacing: -0.2 },
  h3: { fontFamily: fonts.bold, fontSize: 16, lineHeight: 21, color: colors.ink900 },
  body: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 22, color: colors.ink700 },
  small: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 18, color: colors.ink500 },
  tiny: { fontFamily: fonts.semibold, fontSize: 11, lineHeight: 14, color: colors.ink500, letterSpacing: 0.4 },
  eyebrow: { fontFamily: fonts.bold, fontSize: 11.5, letterSpacing: 1.6, textTransform: 'uppercase', color: colors.green600 },
  number: { fontFamily: fonts.extrabold, fontSize: 24, color: colors.ink900, letterSpacing: -0.5 },
};

// Status → badge colours (mirrors the web Badge tones)
export const tones = {
  green: [colors.green700, colors.green100],
  gold: ['#9A5D00', colors.amber100],
  red: [colors.red600, colors.red100],
  blue: [colors.blue600, colors.blue100],
  purple: ['#5D3A9E', colors.purple100],
  gray: [colors.ink500, '#EEF1F0'],
};

export const statusTone = {
  Paid: 'green', Active: 'green', Confirmed: 'green', Approved: 'green', Published: 'green', Present: 'green', Submitted: 'green', Success: 'green',
  Pending: 'gold', Partial: 'gold', Late: 'gold', 'On Leave': 'gold', Upcoming: 'blue', Scheduled: 'blue', Open: 'blue',
  Overdue: 'red', Rejected: 'red', Absent: 'red',
  Enquiry: 'gray', Application: 'blue', 'Document Verification': 'purple', Assessment: 'gold', Interaction: 'purple', Closed: 'gray',
};

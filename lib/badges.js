// Badge definitions live in code, not the database — same pattern as the animal
// and artist lists. Each badge gets its own festive gradient (3 colors, dark to
// light) so rarer/higher-tier badges visually stand out from common ones.
export const BADGES = {
  pre_debut: {
    id: 'pre_debut',
    name: 'Pre-Debut',
    description: 'Joined during the beta period.',
    emoji: '🌱',
    colors: ['#1B4332', '#2D6A4F', '#84A98C'],
  },
  welcome: {
    id: 'welcome',
    name: 'Welcome to the Community',
    description: 'Created an ENGENEUS account.',
    emoji: '🎉',
    colors: ['#9D174D', '#DB2777', '#F9A8D4'],
  },
  one_year: {
    id: 'one_year',
    name: '1 Year Anniversary',
    description: 'Been part of ENGENEUS for a full year.',
    emoji: '🎂',
    colors: ['#9A3412', '#EA580C', '#FDBA74'],
  },
  follow_1: {
    id: 'follow_1',
    name: 'Baby Stan',
    description: 'Followed your first artist.',
    emoji: '⭐',
    colors: ['#78350F', '#B87333', '#E8B888'],
  },
  follow_5: {
    id: 'follow_5',
    name: 'Multi Stan',
    description: 'Followed 5 artists.',
    emoji: '✨',
    colors: ['#374151', '#9CA3AF', '#E5E7EB'],
  },
  follow_10: {
    id: 'follow_10',
    name: 'Super Stan',
    description: 'Followed 10 artists.',
    emoji: '💫',
    colors: ['#92400E', '#D97706', '#FDE68A'],
  },
  follow_20: {
    id: 'follow_20',
    name: 'Top-Tier Stan',
    description: 'Followed 20 artists.',
    emoji: '🌟',
    colors: ['#1E293B', '#64748B', '#E2E8F0'],
  },
  follow_50: {
    id: 'follow_50',
    name: 'Legendary Stan',
    description: 'Followed 50 artists.',
    emoji: '👑',
    colors: ['#0C4A6E', '#0EA5E9', '#BAE6FD'],
  },
  follow_100: {
    id: 'follow_100',
    name: 'Ultimate Stan',
    description: 'Followed 100 artists.',
    emoji: '💎',
    colors: ['#6D28D9', '#DB2777', '#F59E0B'],
  },
};

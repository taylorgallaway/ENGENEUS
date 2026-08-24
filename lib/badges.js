// Badge definitions live in code, not the database — same pattern as the animal
// and artist lists. Adding a new badge later just means adding an entry here.
export const BADGES = {
  pre_debut: {
    id: 'pre_debut',
    name: 'Pre-Debut',
    description: 'Joined during the beta period.',
    emoji: '🌱',
  },
  welcome: {
    id: 'welcome',
    name: 'Welcome to the Community',
    description: 'Created an ENGENEUS account.',
    emoji: '🎉',
  },
  one_year: {
    id: 'one_year',
    name: '1 Year Anniversary',
    description: 'Been part of ENGENEUS for a full year.',
    emoji: '🎂',
  },
  follow_1: {
    id: 'follow_1',
    name: 'Baby Stan',
    description: 'Followed your first artist.',
    emoji: '⭐',
  },
  follow_5: {
    id: 'follow_5',
    name: 'Multi Stan',
    description: 'Followed 5 artists.',
    emoji: '✨',
  },
  follow_10: {
    id: 'follow_10',
    name: 'Super Stan',
    description: 'Followed 10 artists.',
    emoji: '💫',
  },
  follow_20: {
    id: 'follow_20',
    name: 'Top-Tier Stan',
    description: 'Followed 20 artists.',
    emoji: '🌟',
  },
  follow_50: {
    id: 'follow_50',
    name: 'Legendary Stan',
    description: 'Followed 50 artists.',
    emoji: '👑',
  },
  follow_100: {
    id: 'follow_100',
    name: 'Ultimate Stan',
    description: 'Followed 100 artists.',
    emoji: '💎',
  },
};

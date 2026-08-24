// Badge definitions live in code, not the database — same pattern as the animal
// and artist lists. "image" points to the real artwork sitting directly in
// /public (not /public/badges — that's just where the files actually landed).
export const BADGES = {
  pre_debut: {
    id: 'pre_debut',
    name: 'Pre-Debut',
    description: 'Joined during the beta period.',
    image: '/pre_debut.png',
  },
  welcome: {
    id: 'welcome',
    name: 'Welcome!',
    description: 'Created an ENGENEUS account.',
    image: '/welcome.png',
  },
  one_year: {
    id: 'one_year',
    name: '1 Year Anniversary',
    description: 'Been part of ENGENEUS for a full year.',
    image: '/one_year.png',
  },
  follow_1: {
    id: 'follow_1',
    name: 'Baby Stan',
    description: 'Followed your first artist.',
    image: '/follow_1.png',
  },
  follow_5: {
    id: 'follow_5',
    name: 'Multi Stan',
    description: 'Followed 5 artists.',
    image: '/follow_5.png',
  },
  follow_10: {
    id: 'follow_10',
    name: 'Super Stan',
    description: 'Followed 10 artists.',
    image: '/follow_10.png',
  },
  follow_20: {
    id: 'follow_20',
    name: 'Top-Tier Stan',
    description: 'Followed 20 artists.',
    image: '/follow_20.png',
  },
  follow_50: {
    id: 'follow_50',
    name: 'Legendary Stan',
    description: 'Followed 50 artists.',
    image: '/follow_50.png',
  },
  follow_100: {
    id: 'follow_100',
    name: 'Ultimate Stan',
    description: 'Followed 100 artists.',
    image: '/follow_100.png',
  },
};

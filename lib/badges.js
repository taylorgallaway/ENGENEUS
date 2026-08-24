// Badge definitions live in code, not the database — same pattern as the animal
// and artist lists. "image" points to the real artwork in /public/badges — the
// full 50-badge set is uploaded there, this just wires up the ones actually
// awarded right now. Adding a new badge later is just adding an entry here.
export const BADGES = {
  pre_debut: {
    id: 'pre_debut',
    name: 'Pre-Debut',
    description: 'Joined during the beta period.',
    image: '/badges/pre_debut.png',
  },
  welcome: {
    id: 'welcome',
    name: 'Welcome to the Community',
    description: 'Created an ENGENEUS account.',
    image: '/badges/welcome.png',
  },
  one_year: {
    id: 'one_year',
    name: '1 Year Anniversary',
    description: 'Been part of ENGENEUS for a full year.',
    image: '/badges/one_year.png',
  },
  follow_1: {
    id: 'follow_1',
    name: 'Baby Stan',
    description: 'Followed your first artist.',
    image: '/badges/follow_1.png',
  },
  follow_5: {
    id: 'follow_5',
    name: 'Multi Stan',
    description: 'Followed 5 artists.',
    image: '/badges/follow_5.png',
  },
  follow_10: {
    id: 'follow_10',
    name: 'Super Stan',
    description: 'Followed 10 artists.',
    image: '/badges/follow_10.png',
  },
  follow_20: {
    id: 'follow_20',
    name: 'Top-Tier Stan',
    description: 'Followed 20 artists.',
    image: '/badges/follow_20.png',
  },
  follow_50: {
    id: 'follow_50',
    name: 'Legendary Stan',
    description: 'Followed 50 artists.',
    image: '/badges/follow_50.png',
  },
  follow_100: {
    id: 'follow_100',
    name: 'Ultimate Stan',
    description: 'Followed 100 artists.',
    image: '/badges/follow_100.png',
  },
};

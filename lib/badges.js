// Badge definitions live in code, not the database — same pattern as the animal
// and artist lists. Adding a new badge later just means adding an entry here.
export const BADGES = {
  pre_debut: {
    id: 'pre_debut',
    name: 'Pre-Debut',
    description: 'One of the very first users on ENGENEUS, before the site even properly launched.',
    emoji: '🌱',
  },
  first_artist: {
    id: 'first_artist',
    name: 'New Fan',
    description: 'Followed your very first artist on ENGENEUS.',
    emoji: '⭐',
  },
  one_year: {
    id: 'one_year',
    name: '1 Year Anniversary',
    description: 'Been part of ENGENEUS for a full year.',
    emoji: '🎂',
  },
};

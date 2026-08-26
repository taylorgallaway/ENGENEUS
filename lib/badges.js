// Badge definitions live in code, not the database — same pattern as the animal
// and artist lists. "image" points to the real artwork in /public/badges.
export const BADGES = {
  pre_debut: { id: 'pre_debut', name: 'Pre-Debut', description: 'Joined during the beta period.', image: '/badges/pre_debut.png' },
  welcome: { id: 'welcome', name: 'Welcome!', description: 'Created an ENGENEUS account.', image: '/badges/welcome.png' },
  one_year: { id: 'one_year', name: '1 Year Anniversary', description: 'Been part of ENGENEUS for a full year.', image: '/badges/one_year.png' },

  follow_1: { id: 'follow_1', name: 'Baby Stan', description: 'Followed your first artist.', image: '/badges/follow_1.png' },
  follow_5: { id: 'follow_5', name: 'Multi Stan', description: 'Followed 5 artists.', image: '/badges/follow_5.png' },
  follow_10: { id: 'follow_10', name: 'Super Stan', description: 'Followed 10 artists.', image: '/badges/follow_10.png' },
  follow_20: { id: 'follow_20', name: 'Top-Tier Stan', description: 'Followed 20 artists.', image: '/badges/follow_20.png' },
  follow_50: { id: 'follow_50', name: 'Legendary Stan', description: 'Followed 50 artists.', image: '/badges/follow_50.png' },
  follow_100: { id: 'follow_100', name: 'Ultimate Stan', description: 'Followed 100 artists.', image: '/badges/follow_100.png' },

  streak_3: { id: 'streak_3', name: 'Getting Started', description: 'Maintained a 3-day streak.', image: '/badges/streak_3.png' },
  streak_7: { id: 'streak_7', name: 'On a Roll', description: 'Maintained a 7-day streak.', image: '/badges/streak_7.png' },
  streak_30: { id: 'streak_30', name: 'Dedicated', description: 'Maintained a 30-day streak.', image: '/badges/streak_30.png' },
  streak_100: { id: 'streak_100', name: 'Unstoppable', description: 'Maintained a 100-day streak.', image: '/badges/streak_100.png' },
  streak_365: { id: 'streak_365', name: 'Legendary', description: 'Maintained a 365-day streak.', image: '/badges/streak_365.png' },

  first_song: { id: 'first_song', name: 'First Song', description: 'Learned your first song.', image: '/badges/first_song.png' },
  songs_10: { id: 'songs_10', name: '10 Songs', description: 'Learned 10 songs.', image: '/badges/songs_10.png' },
  songs_20: { id: 'songs_20', name: '20 Songs', description: 'Learned 20 songs.', image: '/badges/songs_20.png' },
  songs_50: { id: 'songs_50', name: '50 Songs', description: 'Learned 50 songs.', image: '/badges/songs_50.png' },
  songs_100: { id: 'songs_100', name: '100 Songs', description: 'Learned 100 songs.', image: '/badges/songs_100.png' },
  songs_1000: { id: 'songs_1000', name: '1,000 Songs', description: 'Learned 1,000 songs.', image: '/badges/songs_1000.png' },
  new_artist: { id: 'new_artist', name: 'New Artist', description: 'Learned a song from an artist for the first time.', image: '/badges/new_artist.png' },

  comeback: { id: 'comeback', name: 'Comeback', description: "Was an ENGENEUS user during an artist's comeback.", image: '/badges/comeback.png' },
  comeback_veteran: { id: 'comeback_veteran', name: 'Comeback Veteran', description: 'Experienced 5 comebacks.', image: '/badges/comeback_veteran.png' },
  comeback_historian: { id: 'comeback_historian', name: 'Comeback Historian', description: 'Experienced 10 comebacks.', image: '/badges/comeback_historian.png' },
};

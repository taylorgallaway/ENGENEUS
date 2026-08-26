// Badge definitions live in code, not the database — same pattern as the animal
// and artist lists. "image" points to the real artwork in /public/badges.
export const BADGES = {
  pre_debut: { id: 'pre_debut', name: 'Pre-Debut', description: 'Joined during the beta period.', image: '/badges/pre_debut.png' },
  welcome: { id: 'welcome', name: 'Welcome!', description: 'Created an ENGENEUS account.', image: '/badges/welcome.png' },
  one_year: { id: 'one_year', name: '1 Year Anniversary', description: 'Been part of ENGENEUS for a full year.', image: '/badges/one_year.png' },
  five_year: { id: 'five_year', name: '5 Year Anniversary', description: 'Been part of ENGENEUS for 5 years.', image: '/badges/five_year.png' },
  ten_year: { id: 'ten_year', name: '10 Year Anniversary', description: 'Been part of ENGENEUS for 10 years.', image: '/badges/ten_year.png' },
  twenty_year: { id: 'twenty_year', name: '20 Year Anniversary', description: 'Been part of ENGENEUS for 20 years.', image: '/badges/twenty_year.png' },
  thirty_year: { id: 'thirty_year', name: '30 Year Anniversary', description: 'Been part of ENGENEUS for 30 years.', image: '/badges/thirty_year.png' },

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
  artist_explorer_1: { id: 'artist_explorer_1', name: 'Artist Explorer', description: 'Learned songs from 1 artist.', image: '/badges/artist_explorer_1.png' },
  artist_collector_5: { id: 'artist_collector_5', name: 'Artist Collector', description: 'Learned songs from 5 artists.', image: '/badges/artist_collector_5.png' },
  artist_connoisseur_10: { id: 'artist_connoisseur_10', name: 'Artist Connoisseur', description: 'Learned songs from 10 artists.', image: '/badges/artist_connoisseur_10.png' },
  artist_legend_20: { id: 'artist_legend_20', name: 'Artist Legend', description: 'Learned songs from 20 artists.', image: '/badges/artist_legend_20.png' },
  ultimate_explorer_50: { id: 'ultimate_explorer_50', name: 'Ultimate Explorer', description: 'Learned songs from 50 artists.', image: '/badges/ultimate_explorer_50.png' },

  comeback: { id: 'comeback', name: 'Comeback', description: "Was an ENGENEUS user during an artist's comeback.", image: '/badges/comeback.png' },
  comeback_veteran: { id: 'comeback_veteran', name: 'Comeback Veteran', description: 'Experienced 5 comebacks.', image: '/badges/comeback_veteran.png' },
  comeback_historian: { id: 'comeback_historian', name: 'Comeback Historian', description: 'Experienced 10 comebacks.', image: '/badges/comeback_historian.png' },

  new_years: { id: 'new_years', name: "New Year's", description: "Was a member during New Year's.", image: '/badges/new_years.png' },
  valentines: { id: 'valentines', name: "Valentine's", description: "Was a member during Valentine's Day.", image: '/badges/valentines.png' },
  st_patricks: { id: 'st_patricks', name: "St. Patrick's", description: "Was a member during St. Patrick's Day.", image: '/badges/st_patricks.png' },
  easter: { id: 'easter', name: 'Easter', description: 'Was a member during Easter.', image: '/badges/easter.png' },
  halloween: { id: 'halloween', name: 'Halloween', description: 'Was a member during Halloween.', image: '/badges/halloween.png' },
  thanksgiving: { id: 'thanksgiving', name: 'Thanksgiving', description: 'Was a member during Thanksgiving.', image: '/badges/thanksgiving.png' },
  christmas: { id: 'christmas', name: 'Christmas', description: 'Was a member during Christmas.', image: '/badges/christmas.png' },
  korean_independence_day: { id: 'korean_independence_day', name: 'Korean Independence Day', description: "Was a member during South Korea's Liberation Day.", image: '/badges/korean_independence_day.png' },

  birthday_1: { id: 'birthday_1', name: '1st Birthday', description: "Celebrated ENGENEUS's 1st birthday.", image: '/badges/birthday_1.png' },
  birthday_5: { id: 'birthday_5', name: '5th Birthday', description: "Celebrated ENGENEUS's 5th birthday.", image: '/badges/birthday_5.png' },

  first_member: { id: 'first_member', name: 'First Member', description: 'The very first person to support ENGENEUS.', image: '/badges/first_member.png' },

  top_fandom: { id: 'top_fandom', name: 'Top Fandom', description: "Your fandom reached #1 on the activity leaderboard.", image: '/badges/top_fandom.png' },
  top_five: { id: 'top_five', name: 'Top Five', description: 'Reached the top 5 on the learner leaderboard.', image: '/badges/top_five.png' },
  one_percent_contributor: { id: 'one_percent_contributor', name: '1% Contributor', description: 'Among the most active chat contributors.', image: '/badges/one_percent_contributor.png' },
};

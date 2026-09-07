// Maps artist names to their label's official YouTube channel handle, so
// music video searches can be scoped to a verified channel instead of
// searching all of YouTube (which risks matching fan covers, dance
// practices, or reaction videos instead of the real MV).
//
// Only includes artists whose label is known with real confidence — every
// other artist in the directory simply won't have a video yet, which is
// safer than guessing. Add more entries here as labels get confirmed.

export const YOUTUBE_CHANNELS = {
  // HYBE
  'BTS': '@BANGTANTV',
  'TOMORROW X TOGETHER': '@TXT-BIGHIT',
  'ENHYPEN': '@ENHYPEN',
  'SEVENTEEN': '@pledis17',
  'fromis_9': '@fromis9',
  'LE SSERAFIM': '@LESSERAFIM',
  'NewJeans': '@NewJeans',
  '&TEAM': '@andTEAM_HYBE_LABELS_JAPAN',
  'BOYNEXTDOOR': '@BOYNEXTDOOR',
  'ILLIT': '@ILLIT',

  // SM Entertainment
  'EXO': '@SMTOWN',
  'Red Velvet': '@SMTOWN',
  'NCT': '@NCT',
  'NCT DREAM': '@NCT',
  'NCT 127': '@NCT',
  'NCT WISH': '@NCT',
  'WayV': '@WayV',
  'aespa': '@aespa',
  'SHINee': '@SMTOWN',
  'SUPER JUNIOR': '@SMTOWN',
  "Girls' Generation": '@GIRLSGENERATION',
  'f(x)': '@SMTOWN',
  'BoA': '@SMTOWN',
  'TVXQ!': '@SMTOWN',
  'RIIZE': '@RIIZE',

  // JYP Entertainment
  'Stray Kids': '@StrayKids',
  'TWICE': '@JYPETwice',
  'ITZY': '@ITZY',
  'NMIXX': '@NMIXX',
  'GOT7': '@GOT7',
  '2PM': '@JYPEnter',
  'miss A': '@JYPEnter',
  'Wonder Girls': '@JYPEnter',
  'DAY6': '@day6official',
  'Xdinary Heroes': '@XdinaryHeroes',

  // YG Entertainment
  'BLACKPINK': '@BLACKPINK',
  'BIGBANG': '@ygentertainment',
  'WINNER': '@WINNER',
  'iKON': '@iKONofficial',
  'TREASURE': '@treasuremembers',
  'BABYMONSTER': '@BABYMONSTER',
  '2NE1': '@ygentertainment',
  'PSY': '@officialpsy',

  // Smaller/independent labels
  'MONSTA X': '@OfficialMonstaX',
  'IVE': '@IVEstarship',
  '(G)I-DLE': '@GI_DLE',
  'PENTAGON': '@CUBEENT',
  'BTOB': '@CUBEENT',
  'CNBLUE': '@fncent',
  'FTISLAND': '@fncent',
  'SF9': '@fncent',
  'MAMAMOO': '@rbwtwt',
  'ONEUS': '@RBW_ONEUS',
  'ONEWE': '@RBW_ONEWE',
  'Oh My Girl': '@WMent',
  'B1A4': '@WMent',
  'KARA': '@DSPMEDIA',
  'VIXX': '@jellyfish_ent',
  'TEEN TOP': '@toptvmusic',
  'INFINITE': '@WoollimEnt',
  'Golden Child': '@WoollimEnt',
};

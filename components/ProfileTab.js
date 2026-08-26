'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';
import BadgeCelebration from './BadgeCelebration';
import { getActiveDateBadges } from '../lib/dateBadges';

const STICKER_OPTIONS = [
  { emoji: '🐱', label: 'Cat' }, { emoji: '🐯', label: 'Tiger' }, { emoji: '🦁', label: 'Lion' },
  { emoji: '🐆', label: 'Cheetah' }, { emoji: '🐆', label: 'Panther' }, { emoji: '🐆', label: 'Leopard' },
  { emoji: '🐺', label: 'Wolf' }, { emoji: '🦊', label: 'Fox' }, { emoji: '🐶', label: 'Dog' },
  { emoji: '🐶', label: 'Puppy' },
  { emoji: '🐰', label: 'Bunny' }, { emoji: '🐰', label: 'Rabbit' }, { emoji: '🐹', label: 'Hamster' },
  { emoji: '🐿️', label: 'Squirrel' }, { emoji: '🐿️', label: 'Chipmunk' }, { emoji: '🦫', label: 'Quokka' },
  { emoji: '🦡', label: 'Ferret' }, { emoji: '🦦', label: 'Otter' }, { emoji: '🦫', label: 'Beaver' },
  { emoji: '🦫', label: 'Capybara' }, { emoji: '🐭', label: 'Mouse' }, { emoji: '🐀', label: 'Rat' },
  { emoji: '🦙', label: 'Alpaca' }, { emoji: '🦙', label: 'Llama' }, { emoji: '🐑', label: 'Sheep' },
  { emoji: '🐑', label: 'Lamb' }, { emoji: '🐐', label: 'Goat' }, { emoji: '🐮', label: 'Cow' },
  { emoji: '🐮', label: 'Calf' }, { emoji: '🐷', label: 'Pig' }, { emoji: '🐴', label: 'Horse' },
  { emoji: '🐴', label: 'Donkey' },
  { emoji: '🐻', label: 'Bear' }, { emoji: '🐼', label: 'Panda' }, { emoji: '🐵', label: 'Monkey' },
  { emoji: '🦍', label: 'Gorilla' },
  { emoji: '🐘', label: 'Elephant' }, { emoji: '🦌', label: 'Deer' }, { emoji: '🦌', label: 'Fawn' },
  { emoji: '🦌', label: 'Gazelle' }, { emoji: '🐨', label: 'Koala' }, { emoji: '🦥', label: 'Sloth' },
  { emoji: '🦔', label: 'Hedgehog' }, { emoji: '🦝', label: 'Raccoon' }, { emoji: '🦨', label: 'Skunk' },
  { emoji: '🐔', label: 'Chicken' }, { emoji: '🐥', label: 'Chick' }, { emoji: '🐓', label: 'Rooster' },
  { emoji: '🦆', label: 'Duck' }, { emoji: '🦢', label: 'Swan' }, { emoji: '🦃', label: 'Turkey' },
  { emoji: '🦚', label: 'Peacock' },
  { emoji: '🦅', label: 'Eagle' }, { emoji: '🦅', label: 'Falcon' }, { emoji: '🦅', label: 'Hawk' },
  { emoji: '🦉', label: 'Owl' },
  { emoji: '🐧', label: 'Penguin' }, { emoji: '🕊️', label: 'Dove' }, { emoji: '🕊️', label: 'Pigeon' },
  { emoji: '🦜', label: 'Parrot' }, { emoji: '🐦', label: 'Crow' }, { emoji: '🐦', label: 'Raven' },
  { emoji: '🐦', label: 'Sparrow' }, { emoji: '🐦', label: 'Hummingbird' },
  { emoji: '🐢', label: 'Turtle' }, { emoji: '🐢', label: 'Tortoise' }, { emoji: '🐊', label: 'Crocodile' },
  { emoji: '🐊', label: 'Alligator' }, { emoji: '🐍', label: 'Snake' }, { emoji: '🦎', label: 'Lizard' },
  { emoji: '🦎', label: 'Chameleon' }, { emoji: '🐸', label: 'Frog' }, { emoji: '🐸', label: 'Toad' },
  { emoji: '🦈', label: 'Shark' }, { emoji: '🐬', label: 'Dolphin' }, { emoji: '🐳', label: 'Whale' },
  { emoji: '🦭', label: 'Seal' }, { emoji: '🦭', label: 'Sea Lion' }, { emoji: '🦭', label: 'Walrus' },
  { emoji: '🐙', label: 'Octopus' }, { emoji: '🦑', label: 'Squid' }, { emoji: '🪼', label: 'Jellyfish' },
  { emoji: '🦀', label: 'Crab' }, { emoji: '🦞', label: 'Lobster' }, { emoji: '🐠', label: 'Seahorse' },
  { emoji: '🦑', label: 'Axolotl' },
  { emoji: '🐉', label: 'Dragon' }, { emoji: '🦅', label: 'Phoenix' }, { emoji: '🦄', label: 'Unicorn' },
  { emoji: '🧜', label: 'Mermaid' }, { emoji: '🦁', label: 'Griffin' }, { emoji: '🦄', label: 'Pegasus' },
  { emoji: '🦖', label: 'T-Rex' }, { emoji: '🦕', label: 'Brachiosaurus' },
  { emoji: '🦋', label: 'Butterfly' }, { emoji: '🐝', label: 'Bee' }, { emoji: '🐝', label: 'Bumblebee' },
  { emoji: '🐞', label: 'Ladybug' }, { emoji: '🐜', label: 'Ant' }, { emoji: '🐛', label: 'Dragonfly' },
  { emoji: '🕷️', label: 'Spider' },
];

const ARTIST_DATABASE = [
  "1Team", "1the9", "1TYM", "1Verse",
  "2AM", "2Eyes", "2NB", "2NE1",
  "2PM", "2Yoon", "3YE", "4L",
  "4Men", "4Minute", "4Ten", "5urprise",
  "8Eight", "8Turn", "14U", "15&",
  "015B", "24Hours", "24K+", "82Major",
  "100%", "2000 Won", "A-Jax", "A-Prince",
  "A.C.E", "A.cian", "AA", "AB6IX",
  "Ablume", "Acid Angel from Asia", "aespa", "After School",
  "AHOF", "Aimers", "AKMU", "ALFA",
  "Alice", "All(H)Ours", "AllDay Project", "Almeng",
  "Alpha Drive One", "Am8ic", "Ampers&One", "And2ble",
  "AOA", "AOA Cream", "Apink", "April",
  "Argon", "Ariaz", "ARrC", "Artms",
  "As One", "Astro", "ATBO", "ATEEZ",
  "AtHeart", "AxMxP", "B.A.P", "B.D.U",
  "B.I.G", "B.O.Y", "B1A4", "Baby Dont Cry",
  "Baby Vox", "Baby Vox Re.V", "BABYMONSTER", "Badvillain",
  "BAE173", "Baechigi", "Bastarz", "Battle",
  "BB Girls", "BDC", "Be.A", "Beatwin",
  "Berry Good", "Bestie", "BIGBANG", "Big Brain",
  "Big Mama", "Big Ocean", "Big Star", "Bigflo",
  "Billlie", "Black Beat", "Black Pearl", "BLACKPINK",
  "Blackswan", "Blady", "Blank2y", "Blitzers",
  "Block B", "Bob Girls", "Bohemian", "BOL4",
  "The Boss", "Botopass", "Boyfriend", "BOYNEXTDOOR",
  "Boys Generally Asian", "Boys Republic", "The Boyz", "Brave Girls",
  "Brown Eyed Girls", "Brown Eyed Soul", "Brown Eyes", "BSS",
  "BtoB", "BtoB 4U", "BtoB Blue", "BTS",
  "BugAboo", "Bulldog Mansion", "Busters", "Buzz",
  "Bvndit", "BXB", "Bye Bye Sea", "C-REAL",
  "Can", "Candy Shop", "Chakra", "Champs",
  "Cherry Bullet", "Cherry Filter", "Chocolat", "Cignature",
  "Ciipher", "CIX", "Classy", "CLC",
  "Cleo", "Click-B", "Close Your Eyes", "Clover",
  "CNBLUE", "CocoSori", "Coed School", "Cool",
  "CORTIS", "Cravity", "Craxy", "Crayon Pop",
  "Cross Gene", "CSR", "D-Crunch", "D-Unit",
  "D.Holic", "D1ce", "Daily:Direction", "Dal Shabet",
  "Davichi", "Day6", "Deux", "DIA",
  "Diva", "DK X Seungkwan", "DKB", "DKZ",
  "DMTN", "Double S 301", "Dreamcatcher", "DreamNote",
  "Drippin", "Dxmon", "Dynamic Duo", "E'Last",
  "El7z Up", "ENHYPEN", "ENOi", "Epex",
  "Eternity", "Everglow", "Evnne", "EvoL",
  "EXID", "EXO", "EXO-CBX", "EXO-SC",
  "F-ve Dolls", "F.Cuz", "F.T. Island", "f(x)",
  "Fanatics", "Fantasy Boys", "Fanxy Red", "Favorite",
  "Fiestar", "Fifty Fifty", "Fin.K.L", "Flare U",
  "Fly to the Sky", "Forte di Quattro", "Fromis_9", "Gangkiz",
  "Gavy NJ", "GD & TOP", "GD X Taeyang", "Geenius",
  "Genblue", "GFriend", "Ghost9", "GI",
  "Girl Friends", "Girl's Day", "Girls' Generation", "Girls' Generation-TTS",
  "Glam", "Golden Child", "Golden Girls", "Goofy",
  "Got the Beat", "GOT7", "GP Basic", "The Grace",
  "GreatGuys", "Gugudan", "Gugudan SeMiNa", "GWSN",
  "H.O.T.", "H1-KEY", "HALO", "H&D",
  "HeartB", "Hearts2Hearts", "Hello Venus", "Hi Suhyun",
  "Highlight", "Hiipe Princess", "Hinapia", "History",
  "HITGS", "HNB", "Homme", "Honey Popcorn",
  "Hooni Yongi", "Hoshi X Woozi", "Hot Issue", "Hotshot",
  "Humming Urban Stereo", "Hyeongseop X Euiwoong", "Hyukoh", "I.B.I",
  "I.O.I", "Ichillin'", "Idid", "idntt",
  "Ifeye", "iKON", "ILLIT", "ILY:1",
  "Imfact", "Infinite", "Infinite F", "Infinite H",
  "Irris", "ITZY", "IVE", "IZ",
  "Iz*One", "IZNA", "J-Walk", "JBJ",
  "Jeonghan X Wonwoo", "Jewelry", "Jinjin & Rocky", "JJ Project",
  "JJCC", "JQT", "JtL", "Jus2",
  "Just B", "JX", "JYJ", "K/DA",
  "Kaachi", "Kangta & Vanness", "KARA", "Kard",
  "Kenta Sanggyun", "Kep1er", "Keyveatz", "KickFlip",
  "KiiiKiii", "Kiiras", "Kim Heechul & Kim Jungmo", "The KingDom",
  "Kiss", "Kiss of Life", "KNK", "Koyote",
  "Krystal Eyes", "Laboum", "Ladies' Code", "Lady",
  "Lapillus", "Latency", "Laysha", "LE SSERAFIM",
  "Led Apple", "The Legend", "Lightsum", "Lip Service",
  "Lngshot", "Longguo & Shihyun", "LOONA", "Loossemble",
  "Lovelyz", "Luminous", "Lun8", "Lunafly",
  "Lunarsolar", "Luv", "M.O.N.T", "M4M",
  "Madein", "Madtown", "MAMAMOO", "MAP6",
  "Mave:", "Maywish", "MBLAQ", "MCND",
  "Meovv", "Milk", "Mimiirose", "Mirae",
  "Miss A", "Miss S", "MODYSSEY", "Momoland",
  "Monday Kiz", "MONSTA X", "Moonbin & Sanha", "Mr.Mr",
  "MSG Wannabe", "MustB", "MXM", "MyB",
  "Myname", "Myteen", "N-Sonic", "N-Train",
  "N.Flying", "N.SSign", "Namgida Band", "Nasty Nasty",
  "Nature", "NCT", "NCT DoJaeJung", "NCT JNJM",
  "NCT U", "NCT 127", "NCT DREAM", "WayV",
  "NeonPunch", "Newbeat", "NewJeans", "Newkidd",
  "Nine Muses", "Nine Muses A", "Nmixx", "Noel",
  "Noir", "NOMAD", "Nouera", "Nowz",
  "NTB", "NTX", "NU'EST", "NU'EST W",
  "Odd Youth", "Oh My Girl", "Oh!GG", "Omega X",
  "One Day", "One Pact", "ONEUS", "Onewe",
  "ONF", "OnlyOneOf", "Orange Caramel", "Ourbirthday",
  "OWIS", "P1Harmony", "Page", "Papaya",
  "PENTAGON", "Peppertones", "Pink Fantasy", "Pixy",
  "PLAVE", "Play the Siren", "Playback", "Primrose",
  "Pristin", "Pristin V", "Project K", "Puretty",
  "Purple Kiss", "Purplebeck", "QWER", "R.ef",
  "Rainbow", "Rainz", "Red Velvet", "Red Velvet – Irene & Seulgi",
  "Redsquare", "Refund Sisters", "Rescene", "Rhythm Power",
  "RIIZE", "Rocket Punch", "Romeo", "Roo'ra",
  "The Rose", "Royal Pirates", "Rubber Soul", "S.Coups X Mingyu",
  "S.E.S.", "S.I.S", "Saturday", "Say My Name",
  "Second Moon", "Secret", "Secret Number", "Seo Taiji and Boys",
  "Seven O'Clock", "SEVENTEEN", "Sevenus", "SG Wannabe",
  "Sharp", "She'z", "SHINee", "Shinhwa",
  "Shinvi", "Shownu X Hyungwon", "Shu-I", "Sistar",
  "Sistar19", "Skarf", "Skye", "SM Rookies",
  "SM the Ballad", "SM The Performance", "SM Town", "Snuper",
  "Sobangcha", "Sonamoo", "Soohyun & Hoon", "Sorea Band",
  "SOS", "Soul People", "Spectrum", "Speed",
  "Spica", "SS501", "SSAK3", "STAYC",
  "Stellar", "Strawberry Milk", "Stray Kids", "Sunny Hill",
  "Super Junior", "Super Junior-D&E", "Super Junior-K.R.Y.", "Super Junior-M",
  "Super Junior-T", "Superkind", "Supernova", "T-ara",
  "T-max", "Tahiti", "TAN", "Target",
  "Tasty", "TDYA", "Teen Teen", "Teen Top",
  "TEMPEST", "TFN", "Tin Tin Five", "Tiny-G",
  "TIOT", "TNX", "TO1", "Toheart",
  "TXT", "Tomorrow X Together", "Topp Dogg", "Touch",
  "Toy", "A Train To Autumn", "Trainee A", "TRCNG",
  "Treasure", "TRENDZ", "Tri.be", "Triple H",
  "tripleS", "Tritops", "Trouble Maker", "Troy",
  "TST", "Tuide", "TVXQ", "TWICE",
  "Two X", "TWS", "Typhoon", "U-KISS",
  "UAU", "UN", "UNB", "Unchild",
  "Uni.T", "Unicorn", "Uniq", "Unis",
  "UNVS", "Up10tion", "Urban Zakapa", "V8",
  "Vanner", "Varsity", "VAV", "Verivery",
  "Victon", "Viviz", "VIXX", "VIXX LR",
  "Vromance", "VVUP", "W24", "Waker",
  "Wanna One", "Wanted", "Wassup", "Waterfire",
  "We Girls", "We in the Zone", "Weeekly", "WEi",
  "Weki Meki", "The Wind", "Wings", "WINNER",
  "WJMK", "WJSN", "Wonder Boyz", "Wonder Girls",
  "Wooah", "Wooseok x Kuanlin", "WSG Wannabe", "X:IN",
  "X1", "Xdinary Heroes", "Xikers", "XG",
  "Xlov", "Xodiac", "Year 7 Class 1", "Young Posse",
  "Young Turks Club", "Younite", "Yuhz", "Yurisangja",
  "ZE:A", "ZEROBASEONE", "Katseye", "KEYVITUP",
  "WAYF BOYS", "Klass", "Park Byeong Hoon", "AKUGETSU",
  "BL8M", "from20", "OVUS", "idoltillidie",
  "NBG", "NEXZ", "&TEAM", "IU",
  "Taeyeon", "BoA", "Rain", "PSY",
  "Sunmi", "Chungha", "Hwasa", "Zico",
  "G-Dragon", "CL", "Heize", "Crush",
  "Dean", "Jay Park", "Jessi", "Somi",
  "Se7en", "Wheesung", "Epik High", "Dawn",
  "Loco", "AOMG", "Simon Dominic", "Gray",
  "pH-1", "Sik-K", "Kang Daniel", "Ha Sung-woon",
  "Kim Jaehwan", "Ong Seong-wu", "Yoon Ji-sung", "Kang Yuchan",
  "Taemin", "Baekhyun", "Chen", "Kai",
  "Suho", "D.O.", "Xiumin", "Lay",
  "Sakura Miyawaki", "Kwon Eun-bi", "Jang Won-young", "Miyeon",
  "Soyeon", "Yuqi", "Minnie", "Shuhua",
  "Rubyeye", "6FU", "C!naH"
];

function toCodePoint(emoji) {
  return [...emoji]
    .map((c) => c.codePointAt(0).toString(16))
    .filter((cp) => cp !== 'fe0f')
    .join('-');
}

function StickerImg({ emoji, size = 20 }) {
  const cp = toCodePoint(emoji);
  const base = cp === '1fabc'
    ? 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/72x72'
    : 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72';
  return (
    <img
      src={`${base}/${cp}.png`}
      alt={emoji}
      width={size}
      height={size}
      style={{ display: 'inline-block' }}
    />
  );
}

export default function ProfileTab({ user }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [favSong, setFavSong] = useState('');
  const [favArtist, setFavArtist] = useState('');
  const [followedArtists, setFollowedArtists] = useState([]);
  const [artistInput, setArtistInput] = useState('');
  const [biasSticker, setBiasSticker] = useState('🐥');
  const [stickerSearch, setStickerSearch] = useState('');
  const [newBadges, setNewBadges] = useState([]);

  const awardBadge = async (badgeId) => {
    const { error } = await supabase.from('user_badges').insert({ user_id: user.id, badge_id: badgeId });
    if (!error) {
      setNewBadges((prev) => [...prev, badgeId]);
    } else if (error.code !== '23505') {
      // 23505 = duplicate key, meaning they already had it — anything else is a
      // real problem worth surfacing instead of silently swallowing.
      setMessage(`Badge error: ${error.message}`);
    }
  };

  useEffect(() => {
    async function loadProfile() {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        setMessage(`Error loading profile: ${error.message}`);
      } else {
        setProfile(data);
        setUsername(data.username || '');
        setBio(data.bio || '');
        setFavSong(data.fav_song || '');
        setFavArtist(data.fav_artist || '');
        setFollowedArtists(data.followed_artists || []);
        setBiasSticker(data.bias_sticker || '🐥');

        await awardBadge('welcome');

        const accountAgeDays = (Date.now() - new Date(data.created_at).getTime()) / (1000 * 60 * 60 * 24);
        if (accountAgeDays >= 365) {
          await awardBadge('one_year');
        }

        // Daily streak: same day = no change, exactly one day later = +1,
        // any bigger gap (or first-ever visit) = reset to 1.
        const todayStr = new Date().toISOString().slice(0, 10);
        const yesterdayStr = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        if (data.last_active_date !== todayStr) {
          const newStreak = data.last_active_date === yesterdayStr ? (data.current_streak || 0) + 1 : 1;
          await supabase
            .from('profiles')
            .update({ last_active_date: todayStr, current_streak: newStreak })
            .eq('id', user.id);

          const streakThresholds = [3, 7, 30, 100, 365];
          for (const t of streakThresholds) {
            if (newStreak >= t) {
              await awardBadge(`streak_${t}`);
            }
          }
        }

        for (const badgeId of getActiveDateBadges()) {
          await awardBadge(badgeId);
        }
      }
      setLoading(false);
    }
    loadProfile();
  }, [user.id]);

  const handleSave = async () => {
    setMessage('Saving...');
    const { error } = await supabase
      .from('profiles')
      .update({
        username,
        bio,
        fav_song: favSong,
        fav_artist: favArtist,
        followed_artists: followedArtists,
        bias_sticker: biasSticker,
      })
      .eq('id', user.id);

    if (error) {
      setMessage(`Error saving: ${error.message}`);
    } else {
      setMessage('Saved!');
      setProfile((prev) => ({ ...prev, username, bio, fav_song: favSong, fav_artist: favArtist, bias_sticker: biasSticker }));

      const followThresholds = [1, 5, 10, 20, 50, 100];
      for (const threshold of followThresholds) {
        if (followedArtists.length >= threshold) {
          await awardBadge(`follow_${threshold}`);
        }
      }
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'This permanently deletes your account and everything tied to it. This cannot be undone. Are you sure?'
    );
    if (!confirmed) return;

    setMessage('Deleting account...');
    const res = await fetch('/api/delete-account', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id }),
    });

    if (res.ok) {
      await supabase.auth.signOut();
      window.location.href = '/';
    } else {
      const data = await res.json();
      setMessage(`Error deleting account: ${data.error || 'unknown error'}`);
    }
  };

  const addArtist = (name) => {
    const trimmed = name.trim();
    if (trimmed && !followedArtists.some((a) => a.toLowerCase() === trimmed.toLowerCase())) {
      setFollowedArtists([...followedArtists, trimmed]);
    }
    setArtistInput('');
  };

  const removeArtist = (name) => {
    setFollowedArtists(followedArtists.filter((a) => a !== name));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage('Uploading photo...');

    const filePath = `${user.id}/avatar.${file.name.split('.').pop()}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      setMessage(`Error uploading: ${uploadError.message}`);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
    const avatarUrl = `${urlData.publicUrl}?t=${Date.now()}`;

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: avatarUrl })
      .eq('id', user.id);

    if (updateError) {
      setMessage(`Error saving photo: ${updateError.message}`);
    } else {
      setProfile((prev) => ({ ...prev, avatar_url: avatarUrl }));
      setMessage('Photo updated!');
    }
    setUploading(false);
  };

  if (loading) return <p>Loading...</p>;
  if (!profile) return <p>{message}</p>;

  const inputStyle = { display: 'block', width: '100%', padding: 10, marginTop: 5, marginBottom: 15, boxSizing: 'border-box' };

  const filteredStickers = stickerSearch.trim()
    ? STICKER_OPTIONS.filter((s) => s.label.toLowerCase().includes(stickerSearch.toLowerCase()))
    : [];

  const filteredArtists = artistInput.trim()
    ? ARTIST_DATABASE.filter(
        (a) =>
          a.toLowerCase().includes(artistInput.toLowerCase()) &&
          !followedArtists.some((f) => f.toLowerCase() === a.toLowerCase())
      ).slice(0, 8)
    : [];

  const exactMatchExists = ARTIST_DATABASE.some((a) => a.toLowerCase() === artistInput.trim().toLowerCase());

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 20 }}>
        <div
          onClick={handleAvatarClick}
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: '#f3f4f6',
            border: '2px solid #e5e7eb',
            cursor: 'pointer',
            overflow: 'hidden',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontSize: 11, color: '#9ca3af', textAlign: 'center' }}>Add photo</span>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          style={{ display: 'none' }}
        />
        <div>
          <h1
            style={{
              color: '#1B4332',
              margin: 0,
              fontSize: 36,
              fontWeight: 900,
              textTransform: 'uppercase',
              WebkitTextStroke: '1px #1B4332',
            }}
          >
            Edit Profile
          </h1>
          {uploading && <p style={{ fontSize: 12, color: '#9ca3af', margin: '4px 0 0' }}>Uploading...</p>}
        </div>
      </div>

      {profile.current_streak > 0 && (
        <div
          style={{
            display: 'flex',
            width: 'fit-content',
            alignItems: 'center',
            gap: 6,
            background: '#FEF3C7',
            color: '#92400E',
            fontSize: 12,
            fontWeight: 700,
            padding: '6px 12px',
            borderRadius: 999,
            marginBottom: 40,
          }}
        >
          🔥 {profile.current_streak} day{profile.current_streak === 1 ? '' : 's'} streak
        </div>
      )}

      <label style={{ fontSize: 14 }}>Username</label>
      <input value={username} onChange={(e) => setUsername(e.target.value)} style={inputStyle} />

      <label style={{ fontSize: 14, display: 'block', marginTop: 8 }}>Bias Sticker</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5, marginBottom: 8 }}>
        <StickerImg emoji={biasSticker} size={24} />
        <span style={{ fontSize: 12, color: '#6b7280' }}>Current pick — search below to change</span>
      </div>
      <input
        value={stickerSearch}
        onChange={(e) => setStickerSearch(e.target.value)}
        placeholder="Search animals..."
        style={{ ...inputStyle, marginTop: 0, marginBottom: stickerSearch.trim() ? 0 : 15 }}
      />
      {stickerSearch.trim() && (
        <div
          style={{
            border: '1px solid #f3f4f6',
            borderRadius: 10,
            marginBottom: 15,
            maxHeight: 220,
            overflowY: 'auto',
          }}
        >
          {filteredStickers.map(({ emoji, label }) => (
            <button
              key={label}
              type="button"
              onClick={() => {
                setBiasSticker(emoji);
                setStickerSearch('');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                width: '100%',
                padding: '8px 12px',
                border: 'none',
                borderBottom: '1px solid #f9fafb',
                background: biasSticker === emoji ? '#2D6A4F1A' : 'white',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <StickerImg emoji={emoji} />
              <span style={{ fontSize: 13, color: '#374151' }}>{label}</span>
            </button>
          ))}
          {filteredStickers.length === 0 && (
            <p style={{ fontSize: 12, color: '#9ca3af', padding: 8 }}>No animals match that search.</p>
          )}
        </div>
      )}

      <label style={{ fontSize: 14, display: 'block', marginTop: 8 }}>Bio</label>
      <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} style={inputStyle} />

      <label style={{ fontSize: 14, display: 'block', marginTop: 8 }}>Favorite Song</label>
      <input value={favSong} onChange={(e) => setFavSong(e.target.value)} style={inputStyle} />

      <label style={{ fontSize: 14, display: 'block', marginTop: 8 }}>Favorite Artist</label>
      <input value={favArtist} onChange={(e) => setFavArtist(e.target.value)} style={inputStyle} />

      <label style={{ fontSize: 14, display: 'block', marginTop: 8 }}>Following</label>
      <input
        value={artistInput}
        onChange={(e) => setArtistInput(e.target.value)}
        placeholder="Search for an artist..."
        style={{ ...inputStyle, marginBottom: artistInput.trim() ? 0 : 10 }}
      />
      {artistInput.trim() && (
        <div
          style={{
            border: '1px solid #f3f4f6',
            borderRadius: 10,
            marginBottom: 10,
            maxHeight: 200,
            overflowY: 'auto',
          }}
        >
          {filteredArtists.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => addArtist(name)}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '8px 12px',
                border: 'none',
                borderBottom: '1px solid #f9fafb',
                background: 'white',
                cursor: 'pointer',
                fontSize: 13,
                color: '#374151',
              }}
            >
              {name}
            </button>
          ))}
          {filteredArtists.length === 0 && !exactMatchExists && (
            <button
              type="button"
              onClick={() => addArtist(artistInput)}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '8px 12px',
                border: 'none',
                background: 'white',
                cursor: 'pointer',
                fontSize: 13,
                color: '#2D6A4F',
                fontWeight: 600,
              }}
            >
              Add "{artistInput.trim()}" anyway
            </button>
          )}
        </div>
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 15 }}>
        {followedArtists.length === 0 && (
          <span style={{ fontSize: 12, color: '#9ca3af' }}>Not following anyone yet — search above to add.</span>
        )}
        {followedArtists.map((artist) => (
          <span
            key={artist}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: '#2D6A4F1A',
              color: '#1B4332',
              fontSize: 12,
              fontWeight: 600,
              padding: '6px 10px',
              borderRadius: 999,
            }}
          >
            {artist}
            <button
              type="button"
              onClick={() => removeArtist(artist)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1B4332', fontWeight: 900, padding: 0, lineHeight: 1 }}
            >
              ×
            </button>
          </span>
        ))}
      </div>

      <button
        onClick={handleSave}
        style={{ padding: '10px 20px', background: '#2D6A4F', color: 'white', border: 'none', borderRadius: 8 }}
      >
        Save
      </button>
      <p style={{ marginTop: 15 }}>{message}</p>

      <div style={{ marginTop: 40, paddingTop: 20, borderTop: '1px solid #eee' }}>
        <h2
          style={{
            color: '#1B4332',
            margin: '0 0 12px',
            fontSize: 20,
            fontWeight: 900,
            textTransform: 'uppercase',
          }}
        >
          Account
        </h2>
        <button
          onClick={handleLogout}
          style={{
            display: 'block',
            width: '100%',
            padding: '10px 20px',
            background: '#f3f4f6',
            color: '#374151',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            marginBottom: 8,
          }}
        >
          Log Out
        </button>
        <p style={{ fontSize: 11, color: '#9ca3af', margin: '0 0 32px' }}>
          To switch accounts, log out, then log back in with the other account.
        </p>
        <button
          onClick={handleDeleteAccount}
          style={{
            display: 'block',
            width: '100%',
            padding: '10px 20px',
            background: 'white',
            color: '#dc2626',
            border: '1px solid #dc2626',
            borderRadius: 8,
            cursor: 'pointer',
          }}
        >
          Delete Account
        </button>
      </div>

      <BadgeCelebration badgeIds={newBadges} onDismiss={() => setNewBadges([])} />
    </div>
  );
}

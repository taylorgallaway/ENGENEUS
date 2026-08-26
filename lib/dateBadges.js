// Standard "anonymous Gregorian algorithm" for computing Easter Sunday.
function calculateEaster(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31); // 3 = March, 4 = April
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return { month, day };
}

// US Thanksgiving: 4th Thursday of November.
function fourthThursdayNovember(year) {
  const firstOfNov = new Date(year, 10, 1);
  const firstDay = firstOfNov.getDay();
  const offsetToFirstThursday = (4 - firstDay + 7) % 7;
  const firstThursday = 1 + offsetToFirstThursday;
  return firstThursday + 21;
}

// Returns badge IDs that should be awarded based on today's real date.
export function getActiveDateBadges(now = new Date()) {
  const active = [];
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed
  const day = now.getDate();

  if ((month === 11 && day === 31) || (month === 0 && day === 1)) active.push('new_years');
  if (month === 1 && day === 14) active.push('valentines');
  if (month === 2 && day === 17) active.push('st_patricks');
  if (month === 9 && day === 31) active.push('halloween');
  if (month === 11 && (day === 24 || day === 25)) active.push('christmas');
  if (month === 7 && day === 15) active.push('korean_independence_day');

  const easter = calculateEaster(year);
  if (month === easter.month - 1 && day === easter.day) active.push('easter');

  const thanksgivingDay = fourthThursdayNovember(year);
  if (month === 10 && day === thanksgivingDay) active.push('thanksgiving');

  // Platform birthdays — October 1st each year, starting with the 1st
  // anniversary in 2027. Only 1st and 5th have real artwork right now, so
  // those are the only ones wired up (10th/20th/30th would just reuse the
  // personal-anniversary badges anyway, which already cover that milestone).
  if (month === 9 && day === 1 && year >= 2027) active.push('birthday_1');
  if (month === 9 && day === 1 && year >= 2031) active.push('birthday_5');

  return active;
}

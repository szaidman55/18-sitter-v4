const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const sharp = require('sharp');
const ffmpegPath = require('ffmpeg-static');

const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'marketing', 'videos');
const framesDir = path.join(outDir, '_frames');
const tmpDir = path.join(outDir, '_tmp');

const assets = {
  logoIvory: path.join(root, 'public', 'brand', '18-sitters-primary-on-ivory-clean.png'),
  logoNavy: path.join(root, 'public', 'brand', '18-sitters-primary-on-navy-clean.png'),
  icon: path.join(root, 'public', 'icons', 'icon-1024.png'),
  app: path.join(root, 'deploy-smoke-mobile.png'),
  discover: path.resolve(root, '..', '18sitters-v4-check-mobile-discover.png'),
  payment: path.resolve(root, '..', '18sitters-v4-check-mobile-payment.png'),
  desktop: path.resolve(root, '..', '18sitters-v4-check-desktop.png')
};

const colors = {
  navy: '#0D1B33',
  gold: '#C8A66A',
  goldDark: '#9A773E',
  ivory: '#FAF8F3',
  sand: '#E7E4DD',
  mute: '#6E6A61',
  white: '#FFFFFF'
};

const videos = [
  {
    file: 'instagram-reel-01-friday-text-spiral.mp4',
    title: 'IG Reel 1 - The Friday Text Spiral',
    size: [1080, 1920],
    scenes: [
      { bg: 'navy', kicker: 'FRIDAY · 3:07 PM', headline: 'Still no sitter?', body: 'The group-chat scramble is real.', visual: 'logoNavy', duration: 2.2 },
      { bg: 'ivory', kicker: 'A CALMER WAY', headline: 'Find caregivers in your community', body: 'Profiles, response rates, reviews, and values-based filters.', visual: 'discover', duration: 3 },
      { bg: 'ivory', kicker: 'FILTER BY WHAT MATTERS', headline: 'Shabbat · Hebrew · Kosher home · Nearby', body: 'Care that understands the home it enters.', visual: 'app', duration: 3 },
      { bg: 'navy', kicker: '18 SITTERS', headline: 'Trusted care. Jewish values.', body: 'Join the launch.', visual: 'icon', duration: 2.4 }
    ]
  },
  {
    file: 'instagram-reel-02-great-match.mp4',
    title: 'IG Reel 2 - What Makes A Great Match',
    size: [1080, 1920],
    scenes: [
      { bg: 'ivory', kicker: 'A SITTER MATCH', headline: 'More than availability', body: 'Trust, language, experience, reviews, and shared values.', visual: 'discover', duration: 3 },
      { bg: 'navy', kicker: 'MATCH SIGNALS', headline: 'Response rate. Reviews. Skills. Languages.', body: 'Better context before you message.', visual: 'logoNavy', duration: 3 },
      { bg: 'ivory', kicker: 'BOOK WITH CALM', headline: 'Message, book, and keep the record', body: 'One place for family care.', visual: 'app', duration: 3 },
      { bg: 'navy', kicker: 'DOWNLOAD AT LAUNCH', headline: '18 Sitters', body: 'Trusted care. Jewish values.', visual: 'icon', duration: 2 }
    ]
  },
  {
    file: 'instagram-reel-03-caregiver-recruitment.mp4',
    title: 'IG Reel 3 - Caregiver Recruitment',
    size: [1080, 1920],
    scenes: [
      { bg: 'navy', kicker: 'BABYSITTERS', headline: 'Families are looking for you', body: 'Build a profile that shows your care experience.', visual: 'logoNavy', duration: 2.7 },
      { bg: 'ivory', kicker: 'SHOW YOUR SKILLS', headline: 'Languages, infant care, tutoring, Shabbat experience', body: 'Help families understand what you bring.', visual: 'app', duration: 3.2 },
      { bg: 'ivory', kicker: 'GROW YOUR HISTORY', headline: 'Requests, messages, sessions, stats', body: 'A calmer way to connect with families.', visual: 'discover', duration: 3 },
      { bg: 'navy', kicker: 'JOIN AS A CAREGIVER', headline: 'Create your 18 Sitters profile', body: 'Launching now.', visual: 'icon', duration: 2.3 }
    ]
  },
  {
    file: 'instagram-reel-04-calm-app-tour.mp4',
    title: 'IG Reel 4 - The Calm App Tour',
    size: [1080, 1920],
    scenes: [
      { bg: 'navy', kicker: 'INSIDE 18 SITTERS', headline: 'One calmer place for care', body: 'Find care, message, book, log, and refer.', visual: 'logoNavy', duration: 2.6 },
      { bg: 'ivory', kicker: 'FAMILIES', headline: 'Discover caregivers nearby', body: 'Filter by the details that matter.', visual: 'discover', duration: 3 },
      { bg: 'ivory', kicker: 'BOOKINGS', headline: 'Keep sessions organized', body: 'Confirmed, pending, completed, and reviewed.', visual: 'app', duration: 3 },
      { bg: 'navy', kicker: 'REFERRALS', headline: 'Trusted care grows through trusted people', body: 'Invite your community.', visual: 'icon', duration: 2.8 }
    ]
  },
  {
    file: 'instagram-reel-05-community-referral.mp4',
    title: 'IG Reel 5 - Community Referral',
    size: [1080, 1920],
    scenes: [
      { bg: 'ivory', kicker: 'COMMUNITY FIRST', headline: 'The best sitter recommendations already travel through trust', body: '18 Sitters gives that trust a better home.', visual: 'logoIvory', duration: 3.2 },
      { bg: 'navy', kicker: 'SHARE YOUR CODE', headline: 'Invite families. Invite caregivers.', body: 'Build the network together.', visual: 'icon', duration: 3 },
      { bg: 'ivory', kicker: 'ONE COMMUNITY', headline: 'Profiles, referrals, and shared values', body: 'Trusted care can scale without losing its heart.', visual: 'discover', duration: 3 },
      { bg: 'navy', kicker: '18 SITTERS', headline: 'Share with one family today', body: 'Trusted care. Jewish values.', visual: 'logoNavy', duration: 2.2 }
    ]
  },
  {
    file: 'instagram-reel-06-launch-announcement.mp4',
    title: 'IG Reel 6 - Launch Announcement',
    size: [1080, 1920],
    scenes: [
      { bg: 'navy', kicker: 'NOW LAUNCHING', headline: '18 Sitters', body: 'Trusted care. Jewish values.', visual: 'logoNavy', duration: 2.5 },
      { bg: 'ivory', kicker: 'FOR FAMILIES', headline: 'Find caregivers who understand your home', body: 'Nearby care, profiles, filters, and reviews.', visual: 'discover', duration: 3 },
      { bg: 'ivory', kicker: 'FOR CAREGIVERS', headline: 'Get discovered by the right families', body: 'Build your profile and care history.', visual: 'app', duration: 3 },
      { bg: 'navy', kicker: 'JOIN THE LAUNCH', headline: 'Families and caregivers welcome', body: '18 Sitters', visual: 'icon', duration: 2.5 }
    ]
  },
  {
    file: 'tiktok-01-pov-friday-panic.mp4',
    title: 'TikTok 1 - POV Friday Panic',
    size: [1080, 1920],
    scenes: [
      { bg: 'navy', kicker: 'POV', headline: 'Shabbat starts soon and your sitter canceled', body: 'The old way: panic texting everyone.', visual: 'logoNavy', duration: 2.5 },
      { bg: 'ivory', kicker: 'THE NEW WAY', headline: 'Open 18 Sitters', body: 'Find caregivers in your community.', visual: 'discover', duration: 2.8 },
      { bg: 'ivory', kicker: 'FILTER FAST', headline: 'Shabbat · Hebrew · Kosher home', body: 'Then message and book.', visual: 'app', duration: 2.8 },
      { bg: 'navy', kicker: 'LAUNCHING NOW', headline: 'Trusted care. Jewish values.', body: 'Follow 18 Sitters.', visual: 'icon', duration: 2 }
    ]
  },
  {
    file: 'tiktok-02-things-parents-search-for.mp4',
    title: 'TikTok 2 - Things Jewish Parents Search For',
    size: [1080, 1920],
    scenes: [
      { bg: 'ivory', kicker: 'THINGS PARENTS SEARCH FOR', headline: 'A sitter who gets the details', body: 'Shabbat timing. Kosher home. Hebrew help.', visual: 'logoIvory', duration: 3 },
      { bg: 'navy', kicker: 'ALSO IMPORTANT', headline: 'Actually replies', body: 'Response rates, reviews, and profiles help.', visual: 'icon', duration: 2.6 },
      { bg: 'ivory', kicker: 'NOT PICKY', headline: 'Just thoughtful', body: 'Care should fit the home.', visual: 'discover', duration: 3 },
      { bg: 'navy', kicker: '18 SITTERS', headline: 'Built for Jewish families', body: 'Join the launch.', visual: 'logoNavy', duration: 2 }
    ]
  },
  {
    file: 'tiktok-03-babysitter-profile-glow-up.mp4',
    title: 'TikTok 3 - Babysitter Profile Glow-Up',
    size: [1080, 1920],
    scenes: [
      { bg: 'navy', kicker: 'CAREGIVERS', headline: 'Your profile should work harder for you', body: 'Not just a name in a group chat.', visual: 'logoNavy', duration: 2.8 },
      { bg: 'ivory', kicker: 'SHOW THE RIGHT DETAILS', headline: 'Skills, languages, experience, response history', body: 'Help families choose with confidence.', visual: 'app', duration: 3 },
      { bg: 'ivory', kicker: 'BUILD YOUR RECORD', headline: 'Requests, sessions, stats, referrals', body: 'Grow through community trust.', visual: 'discover', duration: 3 },
      { bg: 'navy', kicker: 'JOIN AS A CAREGIVER', headline: '18 Sitters', body: 'Create your profile.', visual: 'icon', duration: 2.2 }
    ]
  },
  {
    file: 'tiktok-04-rate-old-sitter-search.mp4',
    title: 'TikTok 4 - Rate The Old Sitter Search',
    size: [1080, 1920],
    scenes: [
      { bg: 'navy', kicker: 'RATING THE OLD SITTER SEARCH', headline: '2 out of 10', body: 'Too many chats. Too little context.', visual: 'logoNavy', duration: 2.7 },
      { bg: 'ivory', kicker: 'WHAT WAS MISSING', headline: 'Availability, reviews, rates, response speed', body: 'And the values that matter at home.', visual: 'discover', duration: 3 },
      { bg: 'ivory', kicker: 'THE UPGRADE', headline: '18 Sitters', body: 'A calmer way for families and caregivers to connect.', visual: 'app', duration: 3 },
      { bg: 'navy', kicker: 'FOLLOW FOR LAUNCH', headline: 'Trusted care. Jewish values.', body: '18 Sitters', visual: 'icon', duration: 2 }
    ]
  },
  {
    file: 'tiktok-05-date-night-math.mp4',
    title: 'TikTok 5 - Date Night Math',
    size: [1080, 1920],
    scenes: [
      { bg: 'ivory', kicker: 'DATE NIGHT MATH', headline: 'Reservation + bedtime + travel + sitter', body: 'And one very important question.', visual: 'logoIvory', duration: 3 },
      { bg: 'navy', kicker: 'THE QUESTION', headline: 'Do we feel good leaving the kids?', body: 'Trust is the point.', visual: 'icon', duration: 2.8 },
      { bg: 'ivory', kicker: '18 SITTERS', headline: 'Find caregivers with context', body: 'Profiles, reviews, messages, and bookings.', visual: 'discover', duration: 3 },
      { bg: 'navy', kicker: 'DOWNLOAD AT LAUNCH', headline: 'Care that gives parents breathing room', body: 'Trusted care. Jewish values.', visual: 'logoNavy', duration: 2.4 }
    ]
  },
  {
    file: 'tiktok-06-app-in-10-seconds.mp4',
    title: 'TikTok 6 - App In 10 Seconds',
    size: [1080, 1920],
    scenes: [
      { bg: 'navy', kicker: '18 SITTERS IN 10 SECONDS', headline: 'Find care', body: 'Jewish community caregivers nearby.', visual: 'logoNavy', duration: 2 },
      { bg: 'ivory', kicker: 'REVIEW', headline: 'Profiles, response rates, reviews', body: 'Then message and book.', visual: 'discover', duration: 2.6 },
      { bg: 'ivory', kicker: 'GROW', headline: 'Log sessions and refer your community', body: 'One calmer care network.', visual: 'app', duration: 2.6 },
      { bg: 'navy', kicker: 'JOIN THE LAUNCH', headline: 'Trusted care. Jewish values.', body: '18 Sitters', visual: 'icon', duration: 2 }
    ]
  },
  {
    file: 'youtube-short-01-problem.mp4',
    title: 'YouTube Short 1 - The Problem',
    size: [1080, 1920],
    scenes: [
      { bg: 'navy', kicker: 'THE BABYSITTER SEARCH', headline: 'Needed a calmer home', body: 'No more searching old texts and five group chats.', visual: 'logoNavy', duration: 3 },
      { bg: 'ivory', kicker: 'INTRODUCING', headline: '18 Sitters', body: 'A babysitting app for Jewish families and caregivers.', visual: 'discover', duration: 3 },
      { bg: 'ivory', kicker: 'BUILT AROUND TRUST', headline: 'Profiles, filters, messages, bookings, referrals', body: 'One community care network.', visual: 'app', duration: 3 },
      { bg: 'navy', kicker: 'NOW LAUNCHING', headline: 'Trusted care. Jewish values.', body: 'Join the launch.', visual: 'icon', duration: 2.2 }
    ]
  },
  {
    file: 'youtube-short-02-product-demo.mp4',
    title: 'YouTube Short 2 - Product Demo',
    size: [1080, 1920],
    scenes: [
      { bg: 'navy', kicker: 'HOW IT WORKS', headline: 'Choose family or caregiver', body: 'Then start building your care network.', visual: 'logoNavy', duration: 2.5 },
      { bg: 'ivory', kicker: 'FAMILIES', headline: 'Discover, filter, review, message, book', body: 'Find care with more context.', visual: 'discover', duration: 3.2 },
      { bg: 'ivory', kicker: 'CAREGIVERS', headline: 'Build a profile and receive requests', body: 'Track sessions and grow referrals.', visual: 'app', duration: 3.2 },
      { bg: 'navy', kicker: '18 SITTERS', headline: 'Trusted care. Jewish values.', body: 'Subscribe for launch updates.', visual: 'icon', duration: 2.2 }
    ]
  },
  {
    file: 'youtube-short-03-caregiver-recruitment.mp4',
    title: 'YouTube Short 3 - Caregiver Recruitment',
    size: [1080, 1920],
    scenes: [
      { bg: 'navy', kicker: 'CAREGIVERS', headline: 'Join 18 Sitters', body: 'Connect with Jewish families looking for trusted care.', visual: 'logoNavy', duration: 3 },
      { bg: 'ivory', kicker: 'YOUR PROFILE', headline: 'Experience, skills, languages, reviews', body: 'Let families understand your strengths.', visual: 'app', duration: 3 },
      { bg: 'ivory', kicker: 'YOUR WORK', headline: 'Requests, messages, sessions, stats', body: 'Build a care history.', visual: 'discover', duration: 3 },
      { bg: 'navy', kicker: 'CREATE YOUR PROFILE', headline: '18 Sitters', body: 'Launching now.', visual: 'icon', duration: 2.2 }
    ]
  },
  {
    file: 'youtube-launch-film-16x9.mp4',
    title: 'YouTube Launch Film - 16x9',
    size: [1920, 1080],
    scenes: [
      { bg: 'navy', kicker: 'INTRODUCING', headline: '18 Sitters', body: 'Trusted care. Jewish values.', visual: 'logoNavy', duration: 4 },
      { bg: 'ivory', kicker: 'THE MOMENT', headline: 'Plans are set. The sitter search is not.', body: 'Every family knows the scramble.', visual: 'logoIvory', duration: 4 },
      { bg: 'ivory', kicker: 'FOR JEWISH FAMILIES', headline: 'Care can come with extra context', body: 'Shabbat timing, kosher homes, Hebrew, holidays, and community trust.', visual: 'discover', duration: 5 },
      { bg: 'ivory', kicker: 'ONE CALM APP', headline: 'Discover caregivers nearby', body: 'Review profiles, skills, languages, response rates, and reviews.', visual: 'desktop', duration: 5 },
      { bg: 'navy', kicker: 'FOR CAREGIVERS', headline: 'Be found by families who value your experience', body: 'Build your profile, receive requests, and track sessions.', visual: 'icon', duration: 5 },
      { bg: 'ivory', kicker: 'COMMUNITY', headline: 'Trusted care grows through trusted people', body: 'Referrals help the network grow naturally.', visual: 'app', duration: 5 },
      { bg: 'navy', kicker: 'NOW LAUNCHING', headline: '18 Sitters', body: 'Families and caregivers welcome.', visual: 'logoNavy', duration: 4 }
    ]
  },
  {
    file: 'youtube-founder-walkthrough-16x9.mp4',
    title: 'YouTube Founder Walkthrough - 16x9',
    size: [1920, 1080],
    scenes: [
      { bg: 'navy', kicker: 'APP WALKTHROUGH', headline: '18 Sitters', body: 'A babysitting app for Jewish families and caregivers.', visual: 'logoNavy', duration: 4 },
      { bg: 'ivory', kicker: 'WHY IT EXISTS', headline: 'Trusted care needs better context', body: 'Families need more than a name in a chat thread.', visual: 'logoIvory', duration: 5 },
      { bg: 'ivory', kicker: 'FAMILY FLOW', headline: 'Find care, filter, review profiles', body: 'Then message, book, and log sessions.', visual: 'discover', duration: 6 },
      { bg: 'ivory', kicker: 'CAREGIVER FLOW', headline: 'Create a profile and receive requests', body: 'Show skills, languages, experience, and response signals.', visual: 'app', duration: 6 },
      { bg: 'navy', kicker: 'REFERRALS', headline: 'Community is the growth engine', body: 'Invite families and caregivers you trust.', visual: 'icon', duration: 5 },
      { bg: 'navy', kicker: 'JOIN 18 SITTERS', headline: 'Trusted care. Jewish values.', body: 'Now launching.', visual: 'logoNavy', duration: 4 }
    ]
  }
];

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function esc(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function wrapText(text, maxChars) {
  const words = String(text || '').split(/\s+/).filter(Boolean);
  const lines = [];
  let line = '';
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function svgText(lines, x, y, size, fill, weight, anchor = 'middle', lineHeight = 1.18, family = 'Georgia, serif') {
  return lines.map((line, i) => {
    const dy = i === 0 ? 0 : size * lineHeight;
    return `<text x="${x}" y="${y + dy}" text-anchor="${anchor}" font-family="${family}" font-size="${size}" font-weight="${weight}" fill="${fill}">${esc(line)}</text>`;
  }).join('\n');
}

function imageHref(name) {
  const file = assets[name];
  if (!file || !fs.existsSync(file)) return '';
  const ext = path.extname(file).toLowerCase().includes('jpg') ? 'jpeg' : 'png';
  const data = fs.readFileSync(file).toString('base64');
  return `data:image/${ext};base64,${data}`;
}

function frameSvg(width, height, scene) {
  const dark = scene.bg === 'navy';
  const bg = dark ? colors.navy : colors.ivory;
  const fg = dark ? colors.ivory : colors.navy;
  const body = dark ? '#D7D0C3' : colors.mute;
  const accent = colors.gold;
  const horizontal = width > height;
  const headlineChars = horizontal ? 34 : 22;
  const bodyChars = horizontal ? 56 : 34;
  const headlineLines = wrapText(scene.headline, headlineChars);
  const bodyLines = wrapText(scene.body, bodyChars);
  const img = imageHref(scene.visual);
  const hSize = horizontal ? 74 : 86;
  const bodySize = horizontal ? 34 : 34;
  const kickerSize = horizontal ? 22 : 24;
  const logoTop = horizontal ? 56 : 82;
  const artW = horizontal ? 610 : 640;
  const artH = horizontal ? 650 : 720;
  const artX = horizontal ? width - artW - 120 : (width - artW) / 2;
  const artY = horizontal ? 240 : 900;
  const textX = horizontal ? 120 : width / 2;
  const textAnchor = horizontal ? 'start' : 'middle';
  const textY = horizontal ? 255 : 255;
  const phoneMode = ['app', 'discover', 'payment'].includes(scene.visual);

  const visual = img ? `
    <g>
      <rect x="${artX - 18}" y="${artY - 18}" width="${artW + 36}" height="${artH + 36}" rx="42" fill="${dark ? 'rgba(250,248,243,0.06)' : '#FFFFFF'}" stroke="${dark ? 'rgba(250,248,243,0.18)' : '#DDD6C9'}" stroke-width="2"/>
      ${phoneMode ? `<rect x="${artX + artW * 0.18}" y="${artY - 12}" width="${artW * 0.64}" height="${artH + 24}" rx="58" fill="${colors.navy}" opacity="0.96"/>` : ''}
      <clipPath id="clip"><rect x="${phoneMode ? artX + artW * 0.22 : artX}" y="${phoneMode ? artY + 28 : artY}" width="${phoneMode ? artW * 0.56 : artW}" height="${phoneMode ? artH - 56 : artH}" rx="${phoneMode ? 36 : 28}"/></clipPath>
      <image href="${img}" x="${phoneMode ? artX + artW * 0.22 : artX}" y="${phoneMode ? artY + 28 : artY}" width="${phoneMode ? artW * 0.56 : artW}" height="${phoneMode ? artH - 56 : artH}" preserveAspectRatio="xMidYMid slice" clip-path="url(#clip)"/>
    </g>` : '';

  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="${width}" height="${height}" fill="${bg}"/>
    <circle cx="${horizontal ? width - 180 : 930}" cy="${horizontal ? 170 : 230}" r="${horizontal ? 145 : 180}" fill="${accent}" opacity="${dark ? 0.10 : 0.16}"/>
    <circle cx="${horizontal ? width - 70 : 110}" cy="${horizontal ? height - 80 : height - 120}" r="${horizontal ? 115 : 160}" fill="${accent}" opacity="${dark ? 0.08 : 0.12}"/>
    <text x="${horizontal ? 120 : width / 2}" y="${logoTop}" text-anchor="${horizontal ? 'start' : 'middle'}" font-family="Arial, sans-serif" font-size="${horizontal ? 20 : 22}" font-weight="700" letter-spacing="6" fill="${accent}">18 SITTERS</text>
    <line x1="${horizontal ? 120 : 210}" x2="${horizontal ? 540 : 870}" y1="${logoTop + 30}" y2="${logoTop + 30}" stroke="${accent}" stroke-width="2" opacity="0.5"/>
    <text x="${textX}" y="${textY}" text-anchor="${textAnchor}" font-family="Arial, sans-serif" font-size="${kickerSize}" font-weight="700" letter-spacing="5" fill="${accent}">${esc(scene.kicker)}</text>
    ${svgText(headlineLines, textX, textY + (horizontal ? 95 : 115), hSize, fg, 500, textAnchor, 1.08)}
    ${svgText(bodyLines, textX, textY + (horizontal ? 115 + headlineLines.length * hSize * 1.08 : 145 + headlineLines.length * hSize * 1.08), bodySize, body, 400, textAnchor, 1.35, 'Arial, sans-serif')}
    ${visual}
    <text x="${horizontal ? width - 120 : width / 2}" y="${height - (horizontal ? 58 : 92)}" text-anchor="${horizontal ? 'end' : 'middle'}" font-family="Arial, sans-serif" font-size="${horizontal ? 21 : 24}" font-weight="600" fill="${dark ? colors.ivory : colors.navy}" opacity="0.82">Trusted care. Jewish values.</text>
  </svg>`;
}

async function renderFrame(video, scene, index) {
  const [width, height] = video.size;
  const dir = path.join(framesDir, path.basename(video.file, '.mp4'));
  ensureDir(dir);
  const file = path.join(dir, `scene-${String(index).padStart(2, '0')}.png`);
  await sharp(Buffer.from(frameSvg(width, height, scene))).png().toFile(file);
  return file;
}

function concatPathFor(file) {
  return file.replace(/\\/g, '/').replace(/'/g, "'\\''");
}

async function renderVideo(video) {
  const sceneFiles = [];
  for (let i = 0; i < video.scenes.length; i += 1) {
    sceneFiles.push(await renderFrame(video, video.scenes[i], i));
  }

  ensureDir(tmpDir);
  const concatFile = path.join(tmpDir, `${path.basename(video.file, '.mp4')}.txt`);
  const lines = [];
  sceneFiles.forEach((file, i) => {
    lines.push(`file '${concatPathFor(file)}'`);
    lines.push(`duration ${video.scenes[i].duration}`);
  });
  lines.push(`file '${concatPathFor(sceneFiles[sceneFiles.length - 1])}'`);
  fs.writeFileSync(concatFile, lines.join('\n'));

  const out = path.join(outDir, video.file);
  execFileSync(ffmpegPath, [
    '-y',
    '-f', 'concat',
    '-safe', '0',
    '-i', concatFile,
    '-vf', 'fps=30,format=yuv420p',
    '-movflags', '+faststart',
    out
  ], { stdio: 'inherit' });

  const thumb = path.join(outDir, video.file.replace(/\.mp4$/, '.png'));
  fs.copyFileSync(sceneFiles[0], thumb);
  return out;
}

async function main() {
  ensureDir(outDir);
  ensureDir(framesDir);
  fs.writeFileSync(path.join(outDir, 'video-manifest.json'), JSON.stringify(videos.map(v => ({
    file: v.file,
    title: v.title,
    size: `${v.size[0]}x${v.size[1]}`,
    durationSeconds: v.scenes.reduce((sum, s) => sum + s.duration, 0)
  })), null, 2));

  for (const video of videos) {
    console.log(`\nRendering ${video.file}`);
    await renderVideo(video);
  }
  console.log(`\nDone. Videos written to ${outDir}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

/**
 * Ausmalbilder-SVG-Generator für alle 24 Tage von Rexi & Tobi
 * Dicke, saubere schwarze Linien auf weißem Hintergrund zum Ausmalen für Kinder.
 */
window.ColoringSVGs = (function () {
  // Reusable cute T-Rex (Rexi)
  function rexi(x, y, s = 1, flip = false, happy = true) {
    const t = `translate(${x},${y}) scale(${flip ? -s : s},${s})`;
    return `<g transform="${t}" stroke="#111" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" fill="#fff">
      <!-- Tail -->
      <path d="M-25,15 C-65,20 -85,-5 -95,-15 C-80,5 -60,42 -22,38 Z"/>
      <!-- Back Leg -->
      <path d="M-15,40 L-22,72 L-35,75 C-38,75 -38,82 -30,82 L-10,82 C-6,82 -5,75 -8,72 L-3,42"/>
      <!-- Body -->
      <ellipse cx="0" cy="18" rx="34" ry="32"/>
      <!-- Belly stripe -->
      <path d="M12,-8 C26,5 26,35 12,46" fill="none" stroke-width="2.2"/>
      <!-- Front Leg -->
      <path d="M8,42 L5,75 L-8,78 C-12,78 -12,85 -4,85 L18,85 C22,85 23,78 19,75 L22,40"/>
      <!-- Tiny T-Rex Arm -->
      <path d="M24,10 L42,16 L46,12 M42,16 L47,20" fill="none"/>
      <!-- Neck & Head -->
      <path d="M-8,-8 C-6,-35 8,-52 32,-52 C52,-52 62,-42 62,-28 C62,-18 52,-14 35,-14 L20,-14 C16,-5 16,5 12,10"/>
      <!-- Smile / Jaw -->
      ${happy
        ? `<path d="M36,-22 Q48,-18 58,-24" fill="none" stroke-width="2.5"/>
           <path d="M40,-21 L42,-16 L45,-20 M50,-21 L52,-16 L55,-22" fill="#fff" stroke-width="2"/>`
        : `<path d="M36,-20 Q48,-24 58,-20" fill="none" stroke-width="2.5"/>`
      }
      <!-- Eye -->
      <circle cx="36" cy="-38" r="6" fill="#fff"/>
      <circle cx="38" cy="-38" r="2.5" fill="#111"/>
      <!-- Nostril -->
      <circle cx="54" cy="-37" r="1.5" fill="#111"/>
      <!-- Cute back spikes -->
      <path d="M-12,-22 L-22,-26 L-14,-14 M-18,-8 L-29,-10 L-20,0 M-24,6 L-35,6 L-25,14" fill="#fff" stroke-width="2.5"/>
    </g>`;
  }

  // Reusable cute Triceratops (Tobi)
  function tobi(x, y, s = 1, flip = false) {
    const t = `translate(${x},${y}) scale(${flip ? -s : s},${s})`;
    return `<g transform="${t}" stroke="#111" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" fill="#fff">
      <!-- Tail -->
      <path d="M-34,12 C-58,15 -72,5 -80,-2 C-68,14 -55,28 -32,26 Z"/>
      <!-- Back Legs -->
      <path d="M-24,30 L-28,62 L-14,62 L-12,32"/>
      <path d="M12,30 L10,62 L24,62 L24,32"/>
      <!-- Body -->
      <ellipse cx="-2" cy="14" rx="38" ry="26"/>
      <!-- Front Legs -->
      <path d="M-14,32 L-16,66 L-2,66 L0,34"/>
      <path d="M22,32 L22,66 L36,66 L34,32"/>
      <!-- Frill (Krause) -->
      <path d="M22,-18 C16,-45 40,-55 52,-38 C60,-28 54,-8 36,-4 Z"/>
      <!-- Frill scallops -->
      <path d="M24,-34 Q30,-42 36,-38 Q42,-44 48,-36" fill="none" stroke-width="2.2"/>
      <!-- Head -->
      <path d="M32,-18 C48,-22 68,-14 70,2 C70,12 58,16 38,14 L26,10 Z"/>
      <!-- Three Horns -->
      <path d="M44,-16 L66,-36 L50,-10 Z"/>
      <path d="M38,-20 L52,-42 L44,-16 Z"/>
      <path d="M62,-8 L74,-18 L66,-2 Z"/>
      <!-- Eye & Smile -->
      <circle cx="48" cy="-4" r="5" fill="#fff"/>
      <circle cx="49" cy="-4" r="2.2" fill="#111"/>
      <path d="M50,6 Q60,10 67,4" fill="none" stroke-width="2.4"/>
    </g>`;
  }

  // Reusable cute Pteranodon (Fips)
  function fips(x, y, s = 1) {
    return `<g transform="translate(${x},${y}) scale(${s})" stroke="#111" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="#fff">
      <!-- Wings -->
      <path d="M-5,0 C-30,-35 -70,-25 -80,-5 C-55,-5 -30,5 -8,10 Z"/>
      <path d="M5,0 C30,-35 70,-25 80,-5 C55,-5 30,5 8,10 Z"/>
      <!-- Body -->
      <ellipse cx="0" cy="8" rx="12" ry="18"/>
      <!-- Head & Crest -->
      <path d="M-6,-8 L-28,-22 L-4,-16 C4,-18 12,-14 14,-8 L36,-4 L12,2 Z"/>
      <circle cx="6" cy="-10" r="3.5" fill="#fff"/>
      <circle cx="7" cy="-10" r="1.5" fill="#111"/>
      <!-- Feet -->
      <path d="M-5,25 L-8,36 M5,25 L8,36" fill="none"/>
    </g>`;
  }

  // Reusable Fern & Ground
  function groundAndFerns() {
    return `
      <path d="M0,335 Q150,318 300,335 T600,335" fill="none" stroke="#111" stroke-width="3"/>
      <g stroke="#111" stroke-width="2.5" fill="#fff">
        <path d="M40,335 C30,305 15,290 10,275 C25,285 38,300 45,335 Z"/>
        <path d="M45,335 C50,300 65,285 75,272 C65,295 55,315 50,335 Z"/>
        <path d="M555,335 C545,305 530,290 525,275 C540,285 553,300 560,335 Z"/>
        <path d="M560,335 C565,300 580,285 590,272 C580,295 570,315 565,335 Z"/>
      </g>
    `;
  }

  function clouds() {
    return `
      <g stroke="#111" stroke-width="2.5" fill="#fff">
        <path d="M70,70 C55,70 50,50 65,45 C70,30 95,28 105,42 C120,40 130,58 118,70 Z"/>
        <path d="M460,65 C445,65 440,48 455,43 C460,28 485,26 495,40 C510,38 518,55 506,65 Z"/>
      </g>
    `;
  }

  // 24 Scene-specific details
  const scenes = {
    1: () => `
      ${clouds()}${groundAndFerns()}
      <!-- Glowing Rainbow Stone in the center -->
      <g transform="translate(300,290)" stroke="#111" stroke-width="3" fill="#fff">
        <polygon points="0,-42 30,-18 22,25 -22,25 -30,-18"/>
        <path d="M-20,-10 L0,-25 L20,-10 M-14,12 L0,-2 L14,12" fill="none" stroke-width="2.2"/>
        <!-- Sparkle rays -->
        <path d="M0,-62 L0,-50 M-45,-35 L-35,-28 M45,-35 L35,-28 M-52,0 L-40,0 M52,0 L40,0" stroke-width="2.5"/>
      </g>
      ${rexi(155, 252, 0.92, false)}
      ${tobi(440, 268, 0.92, true)}
    `,
    2: () => `
      ${clouds()}${groundAndFerns()}
      <!-- Finish line banner -->
      <line x1="500" y1="150" x2="500" y2="335" stroke="#111" stroke-width="4"/>
      <path d="M450,155 L500,170 L450,185 Z" fill="#fff" stroke="#111" stroke-width="3"/>
      <!-- Little Brachiosaurus Paul -->
      <g transform="translate(320,250)" stroke="#111" stroke-width="3" fill="#fff">
        <path d="M-30,25 C-55,30 -70,20 -80,10 C-65,25 -50,40 -25,38 Z"/>
        <ellipse cx="0" cy="22" rx="34" ry="22"/>
        <path d="M-22,40 L-22,82 L-10,82 L-10,42 M12,40 L12,82 L24,82 L24,42"/>
        <path d="M18,8 C22,-40 28,-85 38,-95 C52,-98 58,-88 52,-78 C42,-72 34,-35 32,12"/>
        <circle cx="42" cy="-86" r="3" fill="#111"/>
        <path d="M44,-78 Q50,-75 54,-80" fill="none" stroke-width="2"/>
      </g>
      ${rexi(135, 255, 0.85, false)}
      ${tobi(215, 275, 0.78, false)}
    `,
    3: () => `
      ${clouds()}${groundAndFerns()}
      <!-- Sneezing Volcano -->
      <g transform="translate(300,260)" stroke="#111" stroke-width="3" fill="#fff">
        <path d="M-110,75 L-40,-110 L40,-110 L110,75 Z"/>
        <ellipse cx="0" cy="-110" rx="40" ry="10"/>
        <!-- Smoke rings & flowers -->
        <ellipse cx="0" cy="-145" rx="22" ry="9" fill="none"/>
        <ellipse cx="-15" cy="-175" rx="30" ry="11" fill="none"/>
        <!-- Flying Petals / Flowers -->
        <g transform="translate(-85,-140)"><circle cx="0" cy="0" r="6"/><circle cx="10" cy="0" r="6"/><circle cx="5" cy="-9" r="6"/><circle cx="5" cy="9" r="6"/><circle cx="5" cy="0" r="4"/></g>
        <g transform="translate(80,-155)"><circle cx="0" cy="0" r="6"/><circle cx="10" cy="0" r="6"/><circle cx="5" cy="-9" r="6"/><circle cx="5" cy="9" r="6"/><circle cx="5" cy="0" r="4"/></g>
        <g transform="translate(10,-205)"><circle cx="0" cy="0" r="5"/><circle cx="8" cy="0" r="5"/><circle cx="4" cy="-7" r="5"/><circle cx="4" cy="7" r="5"/><circle cx="4" cy="0" r="3"/></g>
      </g>
      ${rexi(115, 260, 0.82, false)}
      ${tobi(485, 272, 0.82, true)}
    `,
    4: () => `
      ${clouds()}${groundAndFerns()}
      <!-- Empty Berry Bush -->
      <g transform="translate(110,275)" stroke="#111" stroke-width="3" fill="#fff">
        <path d="M-45,60 C-55,30 -35,5 -15,15 C-5,-10 30,-5 35,18 C55,15 65,45 45,60 Z"/>
      </g>
      <!-- Sleeping round Ankylosaurus -->
      <g transform="translate(360,290)" stroke="#111" stroke-width="3" fill="#fff">
        <path d="M-50,25 C-50,-25 50,-25 50,25 Z"/>
        <path d="M-35,-8 L-42,-22 L-22,-14 M-10,-18 L-12,-32 L2,-18 M18,-14 L26,-28 L32,-10" fill="#fff"/>
        <!-- Tail club -->
        <path d="M50,22 L85,18" stroke-width="4"/><circle cx="92" cy="18" r="11"/>
        <!-- Sleeping eyes & Zzz -->
        <path d="M-45,12 Q-38,18 -32,12" fill="none"/>
        <text x="-55" y="-20" font-family="sans-serif" font-size="22" font-weight="bold" fill="#111" stroke="none">Zzz</text>
      </g>
      <!-- Berry crumbs -->
      <circle cx="190" cy="330" r="4" fill="#fff" stroke="#111" stroke-width="2"/>
      <circle cx="225" cy="328" r="4" fill="#fff" stroke="#111" stroke-width="2"/>
      <circle cx="265" cy="332" r="4" fill="#fff" stroke="#111" stroke-width="2"/>
      ${tobi(215, 265, 0.8, false)}
      ${rexi(490, 255, 0.8, true)}
    `,
    5: () => `
      ${clouds()}
      <!-- High Cliff & Moss Bed -->
      <path d="M0,140 L165,140 L195,335 L0,335 Z" fill="#fff" stroke="#111" stroke-width="3"/>
      <path d="M195,335 Q380,320 600,335" fill="none" stroke="#111" stroke-width="3"/>
      <!-- Soft Moss Bed -->
      <path d="M295,335 C295,305 335,295 365,305 C395,290 440,305 445,335 Z" fill="#fff" stroke="#111" stroke-width="3"/>
      ${fips(270, 120, 1.15)}
      ${rexi(100, 75, 0.72, false)}
      ${tobi(500, 275, 0.85, true)}
    `,
    6: () => `
      <!-- Crystal Cave Arch -->
      <path d="M0,335 L0,40 L600,40 L600,335" fill="none" stroke="#111" stroke-width="3"/>
      <path d="M35,335 C35,90 565,90 565,335" fill="none" stroke="#111" stroke-width="3"/>
      <!-- Hanging & Standing Crystals -->
      <g stroke="#111" stroke-width="2.8" fill="#fff">
        <polygon points="150,120 165,175 180,120"/>
        <polygon points="285,95 300,165 315,95"/>
        <polygon points="415,120 430,170 445,120"/>
        <polygon points="65,335 80,255 100,335"/>
        <polygon points="500,335 520,250 540,335"/>
      </g>
      <!-- Music Notes for Echo -->
      <text x="240" y="210" font-size="30" fill="#111">♪</text>
      <text x="330" y="190" font-size="34" fill="#111">♫</text>
      ${rexi(195, 258, 0.85, false)}
      ${tobi(400, 272, 0.85, true)}
    `,
    7: () => `
      ${clouds()}
      <!-- River & Log Bridge -->
      <path d="M0,295 L180,295 L210,360 L0,360 Z" fill="#fff" stroke="#111" stroke-width="3"/>
      <path d="M420,295 L600,295 L600,360 L390,360 Z" fill="#fff" stroke="#111" stroke-width="3"/>
      <!-- River waves -->
      <path d="M210,330 Q255,315 300,330 T390,330" fill="none" stroke="#111" stroke-width="2.5"/>
      <path d="M215,350 Q260,335 305,350 T395,350" fill="none" stroke="#111" stroke-width="2.5"/>
      <!-- Mammoth Tree Log Bridge -->
      <rect x="155" y="268" width="290" height="34" rx="12" fill="#fff" stroke="#111" stroke-width="3"/>
      <ellipse cx="445" cy="285" rx="8" ry="17" fill="#fff" stroke="#111" stroke-width="2.5"/>
      ${tobi(110, 232, 0.82, false)}
      ${rexi(490, 222, 0.82, true)}
    `,
    8: () => `
      ${clouds()}${groundAndFerns()}
      <!-- Shy Stegosaurus Stella -->
      <g transform="translate(385,275)" stroke="#111" stroke-width="3" fill="#fff">
        <!-- Plates -->
        <polygon points="-35,-15 -28,-48 -15,-22"/>
        <polygon points="-15,-22 -2,-58 12,-24"/>
        <polygon points="12,-24 28,-50 34,-15"/>
        <!-- Body -->
        <ellipse cx="0" cy="10" rx="45" ry="26"/>
        <!-- Tail with spikes -->
        <path d="M42,10 L82,5 L78,18 L40,22 Z"/>
        <path d="M72,5 L84,-10 L78,7 M80,6 L94,-4 L82,12" fill="#fff"/>
        <!-- Head -->
        <path d="M-42,6 C-62,6 -70,18 -64,26 C-56,32 -40,26 -35,20"/>
        <circle cx="-54" cy="16" r="3" fill="#111"/>
        <!-- Legs -->
        <path d="M-28,32 L-30,60 L-16,60 L-14,34 M18,32 L18,60 L32,60 L30,32"/>
      </g>
      ${rexi(165, 255, 0.88, false)}
    `,
    9: () => `
      ${clouds()}${groundAndFerns()}
      <!-- Giant Footprint Pond -->
      <g transform="translate(300,305)" stroke="#111" stroke-width="3" fill="#fff">
        <ellipse cx="0" cy="10" rx="95" ry="30"/>
        <ellipse cx="-65" cy="-25" rx="18" ry="12"/>
        <ellipse cx="0" cy="-35" rx="20" ry="13"/>
        <ellipse cx="65" cy="-25" rx="18" ry="12"/>
        <!-- Tiny Dino bathing inside -->
        <circle cx="-15" cy="5" r="14"/><circle cx="-20" cy="2" r="2.5" fill="#111"/>
        <circle cx="28" cy="10" r="11"/><circle cx="24" cy="7" r="2" fill="#111"/>
      </g>
      ${rexi(115, 245, 0.82, false)}
      ${tobi(485, 260, 0.82, true)}
    `,
    10: () => `
      <!-- Starry Night Sky -->
      <path d="M0,335 Q300,315 600,335" fill="none" stroke="#111" stroke-width="3"/>
      <!-- Crescent Moon -->
      <path d="M480,55 A35,35 0 1,0 520,105 A28,28 0 1,1 480,55 Z" fill="#fff" stroke="#111" stroke-width="3"/>
      <!-- Stars -->
      <polygon points="100,60 106,75 122,75 110,85 114,100 100,90 86,100 90,85 78,75 94,75" fill="#fff" stroke="#111" stroke-width="2.2"/>
      <polygon points="280,45 285,58 298,58 288,66 292,79 280,71 268,79 272,66 262,58 275,58" fill="#fff" stroke="#111" stroke-width="2.2"/>
      <circle cx="190" cy="95" r="4" fill="#fff" stroke="#111" stroke-width="2"/>
      <circle cx="380" cy="80" r="4" fill="#fff" stroke="#111" stroke-width="2"/>
      <!-- Sleeping Rexi & Tobi -->
      ${rexi(190, 268, 0.85, false, false)}
      ${tobi(405, 278, 0.85, true)}
      <text x="235" y="195" font-family="sans-serif" font-size="24" font-weight="bold" fill="#111">Zzz</text>
    `,
    11: () => `
      ${clouds()}${groundAndFerns()}
      <!-- Mud Pit -->
      <ellipse cx="340" cy="325" rx="115" ry="25" fill="#fff" stroke="#111" stroke-width="3"/>
      <!-- Vine (Liane) -->
      <path d="M165,245 Q250,295 315,250" fill="none" stroke="#111" stroke-width="4.5" stroke-dasharray="none"/>
      ${tobi(125, 265, 0.85, false)}
      ${rexi(360, 245, 0.85, true)}
    `,
    12: () => `
      ${clouds()}
      <!-- Lake shore -->
      <path d="M0,295 Q250,280 600,305" fill="none" stroke="#111" stroke-width="3"/>
      <!-- 3 Turtles with drums -->
      <g transform="translate(270,300)" stroke="#111" stroke-width="2.8" fill="#fff">
        <path d="M-30,10 C-30,-20 30,-20 30,10 Z"/>
        <circle cx="-38" cy="4" r="9"/><circle cx="-41" cy="2" r="2" fill="#111"/>
        <line x1="-10" y1="-25" x2="10" y2="-8"/><line x1="15" y1="-25" x2="-5" y2="-8"/>
      </g>
      <g transform="translate(385,308)" stroke="#111" stroke-width="2.8" fill="#fff">
        <path d="M-26,10 C-26,-16 26,-16 26,10 Z"/>
        <circle cx="-33" cy="4" r="8"/><circle cx="-36" cy="2" r="2" fill="#111"/>
      </g>
      <text x="315" y="235" font-size="30" fill="#111">♪ ♫</text>
      ${rexi(120, 245, 0.85, false)}
      ${tobi(500, 262, 0.82, true)}
    `,
    13: () => `
      ${clouds()}
      <!-- 4 Forking Paths -->
      <path d="M300,350 L300,260" fill="none" stroke="#111" stroke-width="4"/>
      <path d="M300,260 L80,210 M300,260 L210,180 M300,260 L390,180 M300,260 L520,210" fill="none" stroke="#111" stroke-width="3.5"/>
      <!-- Signpost -->
      <line x1="300" y1="130" x2="300" y2="260" stroke="#111" stroke-width="4"/>
      <polygon points="245,140 310,140 325,155 310,170 245,170" fill="#fff" stroke="#111" stroke-width="2.5"/>
      <polygon points="355,175 290,175 275,190 290,205 355,205" fill="#fff" stroke="#111" stroke-width="2.5"/>
      ${tobi(170, 275, 0.85, false)}
      ${rexi(435, 260, 0.85, true)}
    `,
    14: () => `
      ${clouds()}${groundAndFerns()}
      <!-- Sleeping Diplodocus blocking path -->
      <g transform="translate(335,280)" stroke="#111" stroke-width="3" fill="#fff">
        <ellipse cx="0" cy="10" rx="75" ry="38"/>
        <path d="M68,15 C110,15 135,-15 130,-40 C125,-55 105,-50 105,-35"/>
        <path d="M-70,15 C-110,20 -135,35 -150,45"/>
        <text x="80" y="-60" font-family="sans-serif" font-size="22" font-weight="bold" fill="#111">Zzz</text>
      </g>
      <!-- Feather in Rexi's hand -->
      <path d="M180,255 C200,235 225,235 235,245 C220,255 200,260 180,255 Z" fill="#fff" stroke="#111" stroke-width="2.5"/>
      ${rexi(120, 255, 0.82, false)}
    `,
    15: () => `
      ${clouds()}${groundAndFerns()}
      <!-- Hollow Tree Trunk with Nuts -->
      <g transform="translate(440,240)" stroke="#111" stroke-width="3" fill="#fff">
        <path d="M-55,95 L-45,-75 L45,-75 L55,95 Z"/>
        <ellipse cx="0" cy="35" rx="26" ry="34"/>
        <!-- Nuts inside -->
        <circle cx="-10" cy="52" r="8"/><circle cx="8" cy="50" r="8"/><circle cx="0" cy="38" r="8"/>
      </g>
      <!-- Bark Treasure Map -->
      <g transform="translate(270,295)" stroke="#111" stroke-width="2.5" fill="#fff">
        <path d="M-40,-20 L40,-25 L45,20 L-35,25 Z"/>
        <path d="M-25,0 Q0,-10 20,5" fill="none" stroke-dasharray="4,4"/>
        <path d="M15,-5 L25,5 M25,-5 L15,5"/>
      </g>
      ${rexi(120, 255, 0.82, false)}
      ${tobi(215, 272, 0.8, false)}
    `,
    16: () => `
      ${groundAndFerns()}
      <!-- Snowflakes -->
      <g stroke="#111" stroke-width="2.5">
        <path d="M120,60 L120,90 M105,75 L135,75 M110,65 L130,85 M130,65 L110,85"/>
        <path d="M300,45 L300,75 M285,60 L315,60 M290,50 L310,70 M310,50 L290,70"/>
        <path d="M470,65 L470,95 M455,80 L485,80 M460,70 L480,90 M480,70 L460,90"/>
      </g>
      <!-- Snow-Dino -->
      <g transform="translate(300,285)" stroke="#111" stroke-width="3" fill="#fff">
        <circle cx="0" cy="25" r="28"/>
        <circle cx="0" cy="-15" r="20"/>
        <circle cx="-6" cy="-20" r="2.5" fill="#111"/>
        <circle cx="6" cy="-20" r="2.5" fill="#111"/>
        <path d="M-8,-8 Q0,-2 8,-8" fill="none"/>
      </g>
      ${rexi(130, 255, 0.85, false)}
      ${tobi(465, 272, 0.85, true)}
    `,
    17: () => `
      ${groundAndFerns()}
      <!-- Bright Noon Sun directly above -->
      <g transform="translate(300,75)" stroke="#111" stroke-width="3" fill="#fff">
        <circle cx="0" cy="0" r="34"/>
        <path d="M0,-52 L0,-40 M0,40 L0,52 M-52,0 L-40,0 M40,0 L52,0 M-36,-36 L-28,-28 M28,28 L36,36 M36,-36 L28,-28 M-28,28 L-36,36"/>
      </g>
      ${rexi(200, 255, 0.9, false)}
      ${tobi(415, 270, 0.88, true)}
    `,
    18: () => `
      ${clouds()}${groundAndFerns()}
      <!-- Quicksand circle -->
      <ellipse cx="325" cy="325" rx="95" ry="22" fill="#fff" stroke="#111" stroke-width="3"/>
      <!-- Flat Rescue Branch -->
      <path d="M180,310 L350,318" stroke="#111" stroke-width="8" stroke-linecap="round"/>
      <!-- Little Compsognathus -->
      <g transform="translate(345,295)" stroke="#111" stroke-width="2.8" fill="#fff">
        <ellipse cx="0" cy="10" rx="14" ry="10"/>
        <circle cx="-12" cy="-5" r="9"/><circle cx="-15" cy="-7" r="2" fill="#111"/>
      </g>
      ${tobi(130, 265, 0.85, false)}
      ${rexi(480, 255, 0.85, true)}
    `,
    19: () => `
      ${clouds()}${groundAndFerns()}
      <!-- Giant Pile of Leaves -->
      <path d="M170,335 C190,235 410,235 430,335 Z" fill="#fff" stroke="#111" stroke-width="3"/>
      <!-- Floating Autumn Leaves -->
      <g stroke="#111" stroke-width="2.2" fill="#fff">
        <ellipse cx="220" cy="180" rx="14" ry="8" transform="rotate(-25 220 180)"/>
        <ellipse cx="310" cy="145" rx="15" ry="9" transform="rotate(20 310 145)"/>
        <ellipse cx="390" cy="185" rx="14" ry="8" transform="rotate(-15 390 185)"/>
        <ellipse cx="265" cy="215" rx="13" ry="7" transform="rotate(35 265 215)"/>
      </g>
      ${rexi(120, 255, 0.82, false)}
      ${tobi(480, 270, 0.82, true)}
    `,
    20: () => `
      <path d="M0,335 Q300,315 600,335" fill="none" stroke="#111" stroke-width="3"/>
      <!-- Glowing Firefly Tunnel -->
      <g stroke="#111" stroke-width="2.2" fill="#fff">
        <circle cx="150" cy="140" r="8"/><circle cx="210" cy="105" r="8"/><circle cx="300" cy="90" r="9"/>
        <circle cx="390" cy="105" r="8"/><circle cx="450" cy="140" r="8"/><circle cx="250" cy="155" r="7"/>
        <circle cx="350" cy="155" r="7"/>
      </g>
      ${rexi(205, 260, 0.85, false)}
      ${tobi(395, 274, 0.85, true)}
    `,
    21: () => `
      ${clouds()}${groundAndFerns()}
      <!-- Giant Soap Bubble -->
      <circle cx="300" cy="175" r="72" fill="#fff" stroke="#111" stroke-width="3"/>
      <path d="M255,145 Q275,120 305,122" fill="none" stroke="#111" stroke-width="2.5"/>
      ${fips(445, 115, 0.9)}
      ${rexi(145, 255, 0.85, false)}
      ${tobi(465, 272, 0.82, true)}
    `,
    22: () => `
      <!-- Cave & Moss Mound -->
      <path d="M25,335 C25,85 575,85 575,335" fill="none" stroke="#111" stroke-width="3"/>
      <path d="M0,335 Q300,320 600,335" fill="none" stroke="#111" stroke-width="3"/>
      <path d="M190,335 C200,285 400,285 410,335 Z" fill="#fff" stroke="#111" stroke-width="3"/>
      <!-- Lightning outside -->
      <polygon points="75,65 55,110 75,110 60,150 95,100 75,100" fill="#fff" stroke="#111" stroke-width="2.5"/>
      ${rexi(235, 245, 0.78, false)}
      ${tobi(365, 258, 0.78, true)}
    `,
    23: () => `
      ${clouds()}${groundAndFerns()}
      <!-- Decorated Festive Tree -->
      <g transform="translate(300,220)" stroke="#111" stroke-width="3" fill="#fff">
        <rect x="-15" y="65" width="30" height="50"/>
        <polygon points="0,-130 -75,-30 75,-30"/>
        <polygon points="0,-80 -95,20 95,20"/>
        <polygon points="0,-30 -110,75 110,75"/>
        <!-- Ornaments -->
        <circle cx="-25" cy="-45" r="9"/><circle cx="25" cy="-10" r="9"/>
        <circle cx="-40" cy="40" r="9"/><circle cx="35" cy="45" r="9"/>
        <circle cx="0" cy="10" r="9"/>
        <!-- Star on top -->
        <polygon points="0,-155 6,-140 22,-140 10,-130 14,-115 0,-125 -14,-115 -10,-130 -22,-140 -6,-140"/>
      </g>
      ${rexi(120, 255, 0.82, false)}
      ${tobi(480, 270, 0.82, true)}
    `,
    24: () => `
      <!-- Grand Cave with Glowing Rainbow Stone & Stars everywhere! -->
      <path d="M25,335 C25,75 575,75 575,335" fill="none" stroke="#111" stroke-width="3"/>
      <path d="M0,335 Q300,320 600,335" fill="none" stroke="#111" stroke-width="3"/>
      <!-- Light Stars on Ceiling -->
      <g stroke="#111" stroke-width="2.2" fill="#fff">
        <polygon points="150,145 154,157 166,157 156,164 160,176 150,169 140,176 144,164 134,157 146,157"/>
        <polygon points="300,110 305,125 320,125 308,134 312,148 300,139 288,148 292,134 280,125 295,125"/>
        <polygon points="450,145 454,157 466,157 456,164 460,176 450,169 440,176 444,164 434,157 446,157"/>
      </g>
      <!-- Rainbow Stone in Center -->
      <g transform="translate(300,285)" stroke="#111" stroke-width="3" fill="#fff">
        <polygon points="0,-40 28,-16 20,24 -20,24 -28,-16"/>
        <path d="M0,-60 L0,-46 M-42,-30 L-32,-22 M42,-30 L32,-22" stroke-width="2.5"/>
      </g>
      ${rexi(165, 255, 0.85, false)}
      ${tobi(435, 268, 0.85, true)}
      ${fips(300, 185, 0.72)}
    `
  };

  function getSVG(day) {
    const drawFn = scenes[day] || scenes[1];
    return `<svg viewBox="0 0 600 360" xmlns="http://www.w3.org/2000/svg" class="coloring-svg">
      <rect width="600" height="360" fill="#ffffff"/>
      ${drawFn()}
    </svg>`;
  }

  return { getSVG };
})();

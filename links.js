/* ─────────────────────────────────────────────────────────────────────
   MET∃OR — the links.

   THIS IS THE ONLY FILE YOU EDIT TO ADD A LINK.

   Paste the URL between the quotes on the `url:` line. Save, commit, push.
   A row with an empty url does not render — so the not-yet-live platforms
   can sit here and appear the moment you fill them in.

   `icon` picks the glyph from the set drawn in index.html. Available:
     youtube · instagram · facebook · x · tiktok · soundcloud
     spotify · apple · bandcamp
   `sign` tints the icon on hover, from the canon palette:
     "+" amber 590nm · "−" blue 470nm · "0" green 530nm
   The six live links carry the colour palindrome +−00−+ in order.
   ───────────────────────────────────────────────────────────────────── */

const LINKS = [
  { label: "YouTube",     icon: "youtube",    sign: "+", url: "https://www.youtube.com/@ro3tem.met3or/videos" },
  { label: "Instagram",   icon: "instagram",  sign: "−", url: "https://www.instagram.com/ro3tem.met3or/?hl=en" },
  { label: "Facebook",    icon: "facebook",   sign: "0", url: "https://www.facebook.com/profile.php?id=61593023540225" },
  { label: "X",           icon: "x",          sign: "0", url: "https://x.com/ro3tem_met3or" },
  { label: "TikTok",      icon: "tiktok",     sign: "−", url: "https://www.tiktok.com/@ro3tem.met3or" },
  { label: "SoundCloud",  icon: "soundcloud", sign: "+", url: "https://soundcloud.com/ro3tem-met3or" },

  // not live yet — fill the url in and the icon appears
  { label: "Spotify",     icon: "spotify",    sign: "0", url: "" },
  { label: "Apple Music", icon: "apple",      sign: "0", url: "" },
  { label: "Bandcamp",    icon: "bandcamp",   sign: "+", url: "" },
];

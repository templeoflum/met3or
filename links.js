/* ─────────────────────────────────────────────────────────────────────
   MET∃OR — the links.

   THIS IS THE ONLY FILE YOU EDIT TO ADD A LINK.

   Paste the URL between the quotes on the `url:` line. Save, commit, push.
   A row with an empty url is not live and does not render — so you can
   leave the whole list in place and it fills in as accounts come up.

   Handles are from brand/docs/met3or_profile_sheet.md:
     ro3tem.met3or everywhere · ro3tem_met3or on X.

   `sign` tints the row from the canon palette:
     "+" amber 590nm · "−" blue 470nm · "0" green 530nm
   ───────────────────────────────────────────────────────────────────── */

const LINKS = [
  { label: "Spotify",     handle: "ro3tem.met3or",  sign: "0", url: "" },
  { label: "Apple Music", handle: "ro3tem.met3or",  sign: "0", url: "" },
  { label: "SoundCloud",  handle: "ro3tem.met3or",  sign: "+", url: "" },
  { label: "YouTube",     handle: "@ro3tem.met3or", sign: "+", url: "" },
  { label: "Instagram",   handle: "@ro3tem.met3or", sign: "−", url: "" },
  { label: "TikTok",      handle: "@ro3tem.met3or", sign: "−", url: "" },
  { label: "X",           handle: "@ro3tem_met3or", sign: "0", url: "" },
  { label: "Threads",     handle: "@ro3tem.met3or", sign: "−", url: "" },
  { label: "Bandcamp",    handle: "met3or",         sign: "+", url: "" },
];

/* The line under the wordmark. Empty string = no line. */
const BIO = "the reflection first. the surface second. the seam between.";

/* Shown when every url above is still empty. */
const HOLDING = "contact pending.";

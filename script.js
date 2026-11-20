/* =========================================================
   Rider Panda Birthday – script
   ✏️  EDIT THESE DETAILS — everything on the page updates.
   ========================================================= */
const CONFIG = {
  babyName: "Neerav C Akshay",       // child's name
  age: "1",                           // birthday number
  time: "11:00 AM",                   // party start time (shown on page)
  mother: "Chandhana Bhaiju",         // mother's name
  father: "Akshay Shibu",             // father's name
  hosts: "Chandhana Bhaiju & Akshay Shibu", // footer sign-off
  // Party start in India time (used by countdown + calendar). Keep the +05:30.
  partyStart: "2026-12-05T11:00:00+05:30",
  partyEnd:   "2026-12-05T15:00:00+05:30",
  venueName: "Coconut Groves Convention Centre",
  venueAddress: "Millungal - Gamma Jct Rd, Kanjiramattom, Kerala 682315",
  mapsLink: "https://maps.app.goo.gl/ohfbbwuBJB6Yi3AD7",
  // countdown progress bar starts from this date
  inviteSent: "2026-11-20T00:00:00+05:30"
};

/* ---------- Apply config to page ---------- */
document.querySelectorAll("[data-config]").forEach(el => {
  const key = el.dataset.config;
  if (CONFIG[key]) el.textContent = CONFIG[key];
});
document.querySelectorAll("[data-config-svg]").forEach(el => {
  const key = el.dataset.configSvg;
  if (CONFIG[key]) el.textContent = CONFIG[key];
});
document.title = `${CONFIG.babyName}'s Rider Panda Birthday 🐼🛵`;

/* ---------- Splash + music ---------- */
const splash = document.getElementById("splash");
const startBtn = document.getElementById("startBtn");
const bgm = document.getElementById("bgm");
const musicBtn = document.getElementById("musicBtn");
const toast = document.getElementById("musicToast");
let musicMissing = false;

document.body.classList.add("locked");

function showToast(msg, ms = 3000) {
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("show"), ms);
}

bgm.volume = 0.6;
bgm.addEventListener("error", () => { musicMissing = true; musicBtn.classList.remove("playing"); });
bgm.addEventListener("play", () => musicBtn.classList.add("playing"));
bgm.addEventListener("pause", () => musicBtn.classList.remove("playing"));

function playMusic() {
  if (musicMissing) { showToast("🎵 Add music.mp3 to the site folder to play a song."); return; }
  bgm.play().catch(() => {
    musicMissing = bgm.error != null;
    if (musicMissing) showToast("🎵 Add music.mp3 to the site folder to play a song.");
  });
}

startBtn.addEventListener("click", () => {
  splash.classList.add("gone");
  document.body.classList.remove("locked");
  playMusic();
  burstConfetti();
});

musicBtn.addEventListener("click", () => {
  if (bgm.paused) playMusic(); else bgm.pause();
});

/* ---------- Falling bamboo leaves ---------- */
const leavesBox = document.querySelector(".leaves");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
function spawnLeaf() {
  const leaf = document.createElement("span");
  leaf.className = "leaf";
  leaf.style.left = Math.random() * 100 + "vw";
  const dur = 7 + Math.random() * 6;
  leaf.style.animationDuration = dur + "s";
  leaf.style.setProperty("--drift", (Math.random() * 160 - 80) + "px");
  leaf.style.setProperty("--rot", (Math.random() * 720 - 360) + "deg");
  const s = 0.6 + Math.random() * 0.8;
  leaf.style.width = 22 * s + "px";
  leaf.style.height = 10 * s + "px";
  if (Math.random() > 0.6) leaf.style.background = "#a8dba0";
  leavesBox.appendChild(leaf);
  setTimeout(() => leaf.remove(), dur * 1000);
}
if (!reduceMotion) setInterval(spawnLeaf, 1100);

/* ---------- Confetti burst (black, white, green, yellow) ---------- */
function burstConfetti() {
  if (reduceMotion) return;
  const colors = ["#1e1e1e", "#ffffff", "#7cc576", "#f7b733", "#e8474c", "#4aa3df"];
  for (let i = 0; i < 90; i++) {
    const c = document.createElement("span");
    const size = 6 + Math.random() * 8;
    Object.assign(c.style, {
      position: "fixed", left: "50vw", top: "45vh", zIndex: 120,
      width: size + "px", height: size * 0.6 + "px",
      background: colors[i % colors.length],
      border: "1px solid rgba(0,0,0,.15)",
      borderRadius: Math.random() > 0.5 ? "50%" : "2px",
      pointerEvents: "none"
    });
    document.body.appendChild(c);
    const angle = Math.random() * Math.PI * 2;
    const dist = 150 + Math.random() * 350;
    c.animate([
      { transform: "translate(0,0) rotate(0)", opacity: 1 },
      { transform: `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist + 300}px) rotate(${Math.random() * 900}deg)`, opacity: 0 }
    ], { duration: 1600 + Math.random() * 900, easing: "cubic-bezier(.2,.7,.4,1)" }).onfinish = () => c.remove();
  }
}

/* ---------- Countdown ---------- */
const target = new Date(CONFIG.partyStart).getTime();
const startRef = new Date(CONFIG.inviteSent).getTime();
const $ = id => document.getElementById(id);
const pad = n => String(n).padStart(2, "0");

function tick() {
  const now = Date.now();
  let diff = target - now;
  if (diff <= 0) {
    $("countdownBox").classList.add("hidden");
    $("partyNow").classList.remove("hidden");
    diff = 0;
  }
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  $("cdDays").textContent = pad(d);
  $("cdHours").textContent = pad(h);
  $("cdMins").textContent = pad(m);
  $("cdSecs").textContent = pad(s);

  // progress road
  const total = target - startRef;
  const pct = Math.min(100, Math.max(3, ((now - startRef) / total) * 100));
  $("progressFill").style.width = pct + "%";
  $("miniPanda").style.left = `calc((100% - 40px) * ${pct / 100})`;
}
tick();
setInterval(tick, 1000);

/* ---------- Reveal on scroll ---------- */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); } });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

/* ---------- Lightbox ---------- */
const figures = [...document.querySelectorAll(".polaroid")];
const lb = $("lightbox"), lbImg = $("lbImg"), lbCap = $("lbCap");
let current = 0;
function openLB(i) {
  current = (i + figures.length) % figures.length;
  const img = figures[current].querySelector("img");
  lbImg.src = img.src; lbImg.alt = img.alt;
  lbCap.textContent = figures[current].querySelector("figcaption").textContent;
  lb.classList.add("open"); lb.setAttribute("aria-hidden", "false");
}
function closeLB() { lb.classList.remove("open"); lb.setAttribute("aria-hidden", "true"); }
figures.forEach((f, i) => f.addEventListener("click", () => openLB(i)));
lb.querySelector(".lb-close").addEventListener("click", closeLB);
lb.querySelector(".lb-prev").addEventListener("click", e => { e.stopPropagation(); openLB(current - 1); });
lb.querySelector(".lb-next").addEventListener("click", e => { e.stopPropagation(); openLB(current + 1); });
lb.addEventListener("click", e => { if (e.target === lb) closeLB(); });
document.addEventListener("keydown", e => {
  if (!lb.classList.contains("open")) return;
  if (e.key === "Escape") closeLB();
  if (e.key === "ArrowLeft") openLB(current - 1);
  if (e.key === "ArrowRight") openLB(current + 1);
});
// swipe on mobile
let touchX = null;
lb.addEventListener("touchstart", e => { touchX = e.touches[0].clientX; }, { passive: true });
lb.addEventListener("touchend", e => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 50) openLB(current + (dx < 0 ? 1 : -1));
  touchX = null;
});

/* ---------- Add to calendar (.ics download) ---------- */
function toICSDate(iso) {
  return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}
$("calBtn").addEventListener("click", () => {
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//RiderPanda//Birthday//EN",
    "BEGIN:VEVENT",
    "UID:riderpanda-" + Date.now() + "@birthday",
    "DTSTAMP:" + toICSDate(new Date().toISOString()),
    "DTSTART:" + toICSDate(CONFIG.partyStart),
    "DTEND:" + toICSDate(CONFIG.partyEnd),
    `SUMMARY:${CONFIG.babyName}'s Rider Panda Birthday 🐼`,
    `LOCATION:${CONFIG.venueName}\\, ${CONFIG.venueAddress.replace(/,/g, "\\,")}`,
    `DESCRIPTION:Directions: ${CONFIG.mapsLink}`,
    "END:VEVENT", "END:VCALENDAR"
  ].join("\r\n");
  const blob = new Blob([ics], { type: "text/calendar" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "rider-panda-birthday.ics";
  document.body.appendChild(a); a.click(); a.remove();
});

/* ---------- Share ---------- */
$("shareBtn").addEventListener("click", async () => {
  const text = `🐼🛵 You're invited to ${CONFIG.babyName}'s Rider Panda Birthday!\n📅 Saturday, December 5, 2026 · ${CONFIG.time}\n📍 ${CONFIG.venueName}, Kanjiramattom\n`;
  const url = location.href.startsWith("http") ? location.href : "";
  if (navigator.share) {
    try { await navigator.share({ title: document.title, text, url }); } catch (_) {}
  } else {
    window.open("https://wa.me/?text=" + encodeURIComponent(text + url), "_blank");
  }
});

// ============================================================
//  Saint-Cyr-sur-Mer · Visite virtuelle 360° — logique de jeu
// ============================================================
import { Viewer } from "@photo-sphere-viewer/core";
import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";

const TOUR = window.TOUR;
const STORE_KEY = "stcyr-secrets-found";
const QUIZ_KEY = "stcyr-quiz-solved";

/* ---------- état ---------- */
const totalSecrets = TOUR.scenes.reduce((n, s) => n + s.secrets.length, 0);
let found = loadFound();          // Set de "sceneId/secretId"
let quizSolved = loadQuizSolved();// Set de "sceneId/quizId"
let viewer = null;
let markers = null;
let currentScene = null;

function loadFound() {
  try { return new Set(JSON.parse(localStorage.getItem(STORE_KEY)) || []); }
  catch { return new Set(); }
}
function saveFound() {
  localStorage.setItem(STORE_KEY, JSON.stringify([...found]));
}
function loadQuizSolved() {
  try { return new Set(JSON.parse(localStorage.getItem(QUIZ_KEY)) || []); }
  catch { return new Set(); }
}
function saveQuizSolved() {
  localStorage.setItem(QUIZ_KEY, JSON.stringify([...quizSolved]));
}
const key = (sceneId, secretId) => `${sceneId}/${secretId}`;
const sceneFoundCount = (s) => s.secrets.filter((x) => found.has(key(s.id, x.id))).length;
const sceneById = (id) => TOUR.scenes.find((s) => s.id === id);
const sceneName = (id) => (sceneById(id) || {}).name || id;

/* ---------- éléments DOM ---------- */
const $ = (sel) => document.querySelector(sel);
const homeEl = $("#home");
const tourEl = $("#tour");
const deckEl = $("#sceneDeck");
const railEl = $("#sceneRail");

/* ===========================================================
   ÉCRAN D'ACCUEIL
=========================================================== */
function renderDeck() {
  deckEl.innerHTML = "";
  TOUR.scenes.forEach((s) => {
    const fc = sceneFoundCount(s);
    const complete = fc === s.secrets.length;
    const card = document.createElement("article");
    card.className = "scene-card" + (complete ? " is-complete" : "");
    card.innerHTML = `
      <div class="scene-card__img" style="background-image:url('${s.thumb}')"></div>
      <div class="scene-card__veil"></div>
      <div class="scene-card__play">▶</div>
      <div class="scene-card__count"><span class="gem">${complete ? "★" : "◆"}</span>${fc}/${s.secrets.length}</div>
      <div class="scene-card__body">
        <div class="scene-card__tags">${s.tags.map((t) => `<span class="tag">${t}</span>`).join("")}</div>
        <div class="scene-card__name">${s.name}</div>
        <div class="scene-card__teaser">${s.teaser}</div>
      </div>`;
    card.addEventListener("click", () => openTour(s.id));
    deckEl.appendChild(card);
  });
  renderMap();
  renderRewards();
  renderLeaderboard();
  updateProgressRing();
}

/* ---------- score du joueur ---------- */
const PTS_SECRET = 100;
const PTS_QUIZ = 50;
function playerScore() {
  return found.size * PTS_SECRET + quizSolved.size * PTS_QUIZ;
}

/* ---- classement : le joueur « Toi » s'insère selon son score ---- */
function renderLeaderboard() {
  const box = $("#leaderList");
  if (!box) return;
  const base = (window.LEADERBOARD || []).map((p) => ({ ...p }));
  const me = { name: "Toi", score: playerScore(), me: true };
  const all = [...base, me].sort((a, b) => b.score - a.score);
  const total = all.reduce((n, p) => n + p.score, 0) || 1;
  const maxScore = all[0].score || 1;

  box.innerHTML = "";
  all.forEach((p, i) => {
    const rank = i + 1;
    const medal = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : rank;
    const chance = Math.round((p.score / total) * 100);
    const li = document.createElement("li");
    li.className = "lb" + (p.me ? " is-me" : "");
    li.innerHTML = `
      <span class="lb__rank">${medal}</span>
      <div class="lb__info">
        <span class="lb__name">${p.name}</span>
        <span class="lb__pts">${p.score} pts</span>
      </div>
      <div class="lb__chance">
        <span class="lb__pct">${chance}%</span>
        <span class="lb__bar"><i style="width:${Math.round((p.score / maxScore) * 100)}%"></i></span>
      </div>`;
    box.appendChild(li);
  });

  const youEl = $("#drawYou");
  if (youEl) {
    const myRank = all.findIndex((p) => p.me) + 1;
    const myChance = Math.round((me.score / total) * 100);
    youEl.textContent = `Toi : ${me.score} pts · ${myChance}% · #${myRank}`;
  }
}

/* ---- compte à rebours du prochain tirage ---- */
function nextDrawDate() {
  const now = new Date();
  // 1er du mois prochain à 18h00
  return new Date(now.getFullYear(), now.getMonth() + 1, 1, 18, 0, 0);
}
function renderCountdown() {
  const el = $("#drawCountdown");
  if (!el) return;
  const target = nextDrawDate();
  const diff = Math.max(0, target.getTime() - Date.now());
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  const blocks = [["J", d], ["H", h], ["M", m], ["S", s]];
  el.innerHTML = blocks
    .map(
      ([lbl, v]) =>
        `<div class="cd"><span class="cd__num">${String(v).padStart(2, "0")}</span><span class="cd__lbl">${lbl}</span></div>`
    )
    .join("");
  const dateEl = $("#drawDate");
  if (dateEl) {
    dateEl.textContent = target.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
    }) + " · 18h";
  }
}

/* ---- récompenses partenaires (débloquées selon les secrets) ---- */
function renderRewards() {
  const deck = $("#rewardDeck");
  if (!deck) return;
  const rewards = window.REWARDS || [];
  deck.innerHTML = "";
  rewards.forEach((r) => {
    const unlocked = found.size >= r.need;
    const remaining = Math.max(0, r.need - found.size);
    const card = document.createElement("article");
    card.className = "reward" + (unlocked ? " is-unlocked" : "");
    card.innerHTML = `
      <div class="reward__icon">${r.icon}</div>
      <div class="reward__body">
        <div class="reward__title">${r.title}</div>
        <div class="reward__desc">${r.desc}</div>
        <div class="reward__status">${
          unlocked
            ? '<span class="reward__badge">✓ Débloqué</span>'
            : `<span class="reward__lock">🔒 Encore ${remaining} secret${remaining > 1 ? "s" : ""}</span>`
        }</div>
      </div>`;
    deck.appendChild(card);
  });
}

/* ---- carte touristique gamifiée ---- */
function renderMap() {
  const pins = $("#mapPins");
  if (!pins) return;
  pins.innerHTML = "";

  TOUR.scenes.forEach((s, idx) => {
    if (!s.map) return;
    const fc = sceneFoundCount(s);
    const complete = fc === s.secrets.length;
    const pin = document.createElement("button");
    pin.className = "pin" + (complete ? " is-complete" : "");
    pin.style.left = s.map.x + "%";
    pin.style.top = s.map.y + "%";
    pin.style.setProperty("--d", idx * 0.09 + "s");
    pin.innerHTML = `
      <span class="pin__marker">
        <span class="pin__icon">${s.icon || "📍"}</span>
        <span class="pin__count">${fc}/${s.secrets.length}</span>
        ${complete ? '<span class="pin__star">★</span>' : ""}
      </span>
      <span class="pin__label">${s.name}</span>`;
    pin.addEventListener("click", () => openTour(s.id));
    pins.appendChild(pin);
  });

  // parcours reliant les lieux (ligne + ombre)
  const pts = TOUR.scenes.filter((s) => s.map).map((s) => `${s.map.x},${s.map.y}`).join(" ");
  const line = $("#mapPathLine");
  const shadow = $("#mapPathShadow");
  if (line) line.setAttribute("points", pts);
  if (shadow) shadow.setAttribute("points", pts);
}

function updateProgressRing() {
  const pct = totalSecrets ? found.size / totalSecrets : 0;
  $("#ringFg").style.strokeDashoffset = String(100 - pct * 100);
  $("#progressNum").textContent = `${found.size}/${totalSecrets}`;
}

/* ===========================================================
   VISIONNEUSE
=========================================================== */
function ensureViewer(initialPanorama) {
  if (viewer) return;
  viewer = new Viewer({
    container: $("#viewer"),
    panorama: initialPanorama,
    navbar: false,
    defaultZoomLvl: 5,
    maxFov: 90,
    minFov: 30,
    mousewheelCtrlKey: false,
    loadingTxt: "Chargement…",
    plugins: [[MarkersPlugin, {}]],
  });
  markers = viewer.getPlugin(MarkersPlugin);
  markers.addEventListener("select-marker", (e) => onMarkerClick(e.marker));
}

function buildMarkers(scene) {
  const list = [];

  // points VIOLETS : secrets cachés
  scene.secrets.forEach((sec) => {
    const isFound = found.has(key(scene.id, sec.id));
    list.push({
      id: sec.id,
      position: { yaw: `${sec.yaw}deg`, pitch: `${sec.pitch}deg` },
      html: '<div class="pt"></div>',
      size: { width: 22, height: 22 },
      anchor: "center center",
      className: "hidden-dot secret" + (isFound ? " found" : ""),
      data: { ...sec, kind: "secret" },
    });
  });

  // points BLANCS : infos sur un élément de l'image
  (scene.infos || []).forEach((info) => {
    list.push({
      id: info.id,
      position: { yaw: `${info.yaw}deg`, pitch: `${info.pitch}deg` },
      html: '<div class="pt"></div>',
      size: { width: 20, height: 20 },
      anchor: "center center",
      className: "hidden-dot info",
      data: { ...info, kind: "info" },
    });
  });

  // points QUIZ : questions ludiques (logo « ? »)
  (scene.quizzes || []).forEach((q) => {
    const done = quizSolved.has(key(scene.id, q.id));
    list.push({
      id: q.id,
      position: { yaw: `${q.yaw}deg`, pitch: `${q.pitch}deg` },
      html: '<div class="pt"></div>',
      size: { width: 24, height: 24 },
      anchor: "center center",
      className: "hidden-dot quiz" + (done ? " done" : ""),
      tooltip: { content: "🧠 Quiz", position: "top center" },
      data: { ...q, kind: "quiz" },
    });
  });

  // points ORANGE : portails de navigation (infobulle = nom du lieu)
  (scene.portals || []).forEach((p) => {
    list.push({
      id: p.id,
      position: { yaw: `${p.yaw}deg`, pitch: `${p.pitch}deg` },
      html: '<div class="pt"></div>',
      size: { width: 30, height: 30 },
      anchor: "center center",
      className: "hidden-dot portal",
      tooltip: { content: `➜ ${sceneName(p.to)}`, position: "top center" },
      data: { ...p, kind: "portal" },
    });
  });

  return list;
}

function showLoader(scene) {
  const el = $("#ploader");
  if (!el) return;
  const sub = $("#ploaderSub");
  if (sub) sub.textContent = scene?.name || "";
  const bg = $("#ploaderBg");
  if (bg) bg.style.backgroundImage = scene?.thumb ? `url("${scene.thumb}")` : "";
  el.hidden = false;
  requestAnimationFrame(() => el.classList.add("show"));
}

function hideLoader() {
  const el = $("#ploader");
  if (!el) return;
  el.classList.remove("show");
  setTimeout(() => {
    el.hidden = true;
  }, 460);
}

async function loadScene(sceneId, withTransition = true) {
  const scene = sceneById(sceneId);
  if (!scene) return;
  currentScene = scene;

  showLoader(scene);

  if (!viewer) {
    ensureViewer(scene.panorama);
    viewer.addEventListener("ready", () => hideLoader(), { once: true });
  } else {
    try {
      await viewer.setPanorama(scene.panorama, {
        transition: withTransition,
        showLoader: false,
      });
    } finally {
      hideLoader();
    }
  }
  markers.setMarkers(buildMarkers(scene));

  paintSceneInfo(scene);
  paintRail();
  renderRiddles(scene);
}

function paintSceneInfo(scene) {
  $("#sceneTags").innerHTML = scene.tags.map((t) => `<span class="tag">${t}</span>`).join("");
  $("#sceneName").textContent = scene.name;
  $("#sceneDesc").textContent = scene.intro;
  updateHintLine(scene);
  const info = $("#sceneInfo");
  info.style.animation = "none";
  void info.offsetWidth;
  info.style.animation = "";
}

function updateHintLine(scene) {
  const fc = sceneFoundCount(scene);
  const n = scene.secrets.length;
  const line = $("#hintLine");
  if (fc === n) {
    line.innerHTML = `<span class="dot-inline" style="background:#19b3c6;box-shadow:0 0 0 4px rgba(25,179,198,.3)"></span> Tous les secrets de ce lieu sont trouvés !`;
  } else {
    line.innerHTML = `<span class="dot-inline"></span> ${n - fc} secret(s) violet(s) caché(s) ici · les points orange mènent ailleurs`;
  }
  $("#foundTxt").textContent = `${fc}/${n}`;
}

function paintRail() {
  railEl.innerHTML = "";
  TOUR.scenes.forEach((s) => {
    const complete = sceneFoundCount(s) === s.secrets.length;
    const item = document.createElement("div");
    item.className =
      "rail-item" +
      (s.id === currentScene.id ? " is-active" : "") +
      (complete ? " is-complete" : "");
    item.style.backgroundImage = `url('${s.thumb}')`;
    item.innerHTML = `
      <div class="rail-item__chk">✓</div>
      <div class="rail-item__label">${s.name}</div>`;
    item.addEventListener("click", () => {
      if (s.id !== currentScene.id) loadScene(s.id, true);
    });
    railEl.appendChild(item);
  });
}

/* ===========================================================
   PANNEAU DES ÉNIGMES (aide à trouver les points violets)
=========================================================== */
function yawHint(yaw) {
  const y = ((yaw % 360) + 360) % 360;
  if (y >= 315 || y < 45) return { label: "devant toi", arrow: "↑" };
  if (y < 135) return { label: "sur ta droite", arrow: "→" };
  if (y < 225) return { label: "derrière toi", arrow: "↓" };
  return { label: "sur ta gauche", arrow: "←" };
}

function renderRiddles(scene) {
  const list = $("#riddleList");
  list.innerHTML = "";
  scene.secrets.forEach((sec, idx) => {
    const solved = found.has(key(scene.id, sec.id));
    const dir = yawHint(sec.yaw);
    const li = document.createElement("li");
    li.className = "riddle" + (solved ? " is-solved" : "");
    li.innerHTML = solved
      ? `<span class="riddle__no">${idx + 1}</span>
         <div class="riddle__body">
           <div class="riddle__q solved">${sec.title}</div>
           <div class="riddle__a">${sec.text}</div>
         </div>
         <span class="riddle__chk">✓</span>`
      : `<span class="riddle__no">${idx + 1}</span>
         <div class="riddle__body">
           <div class="riddle__q">${sec.riddle}</div>
           <div class="riddle__dir">${dir.arrow} ${dir.label}</div>
         </div>`;
    list.appendChild(li);
  });
}

/* ===========================================================
   INTERACTION : clic sur un point
=========================================================== */
function markerId(marker) {
  return (
    marker.id ??
    (marker.config && marker.config.id) ??
    (marker.data && marker.data.id)
  );
}

function findItem(scene, id) {
  const p = (scene.portals || []).find((x) => x.id === id);
  if (p) return { kind: "portal", ...p };
  const q = (scene.quizzes || []).find((x) => x.id === id);
  if (q) return { kind: "quiz", ...q };
  const i = (scene.infos || []).find((x) => x.id === id);
  if (i) return { kind: "info", ...i };
  const s = scene.secrets.find((x) => x.id === id);
  if (s) return { kind: "secret", ...s };
  return null;
}

function onMarkerClick(marker) {
  if (!currentScene) return;
  const item = findItem(currentScene, markerId(marker));
  if (!item) return;

  // PORTAIL : on se téléporte directement vers l'autre lieu
  if (item.kind === "portal") {
    const dest = sceneById(item.to);
    if (dest) {
      toast(`➜ ${dest.name}`);
      loadScene(dest.id, true);
    }
    return;
  }

  // QUIZ : question ludique
  if (item.kind === "quiz") {
    openQuiz(item);
    return;
  }

  // INFO : simple info sur un élément de l'image
  if (item.kind === "info") {
    showReveal({
      title: item.title,
      text: item.text,
      badge: "Bon à savoir",
      variant: "info",
    });
    return;
  }

  // SECRET : on dévoile l'anecdote
  const alreadyFound = found.has(key(currentScene.id, item.id));
  if (!alreadyFound) registerFound(item, marker);
  showReveal({
    title: item.title,
    text: item.text,
    badge: alreadyFound ? "Déjà découvert" : "Secret trouvé !",
    variant: "secret",
  });
}

function registerFound(sec, marker) {
  found.add(key(currentScene.id, sec.id));
  saveFound();
  markers.updateMarker({ id: sec.id, className: "hidden-dot secret found" });
  updateHintLine(currentScene);
  updateProgressRing();
  paintRail();
  renderRiddles(currentScene);

  const reward = (window.REWARDS || []).find((r) => r.need === found.size);
  const fc = sceneFoundCount(currentScene);
  if (reward) {
    toast(`🎁 Récompense débloquée : ${reward.title} !`);
  } else if (fc === currentScene.secrets.length) {
    toast(`✨ Bravo ! « ${currentScene.name} » : tous les secrets trouvés !`);
  } else {
    toast(`◆ Secret ${found.size}/${totalSecrets} découvert !`);
  }
}

/* ===========================================================
   POPUP DE DÉCOUVERTE
=========================================================== */
const revealEl = $("#reveal");
function showReveal({ title, text, badge, variant }) {
  const badgeEl = $("#revealBadge");
  badgeEl.textContent = badge || "Secret trouvé !";
  badgeEl.className = "reveal__badge" + (variant === "info" ? " info" : "");
  $("#revealTitle").textContent = title || "";
  $("#revealText").textContent = text || "";
  $("#revealCta").hidden = true;
  revealEl.hidden = false;
}
function hideReveal() { revealEl.hidden = true; }

$("#revealClose").addEventListener("click", hideReveal);
revealEl.addEventListener("click", (e) => { if (e.target === revealEl) hideReveal(); });

/* ===========================================================
   QUIZ
=========================================================== */
const quizEl = $("#quiz");
let quizState = null; // { quiz, idx, correct }

// normalise : un quiz peut être mono-question (ancien format) ou multi
function quizQuestions(q) {
  if (Array.isArray(q.questions)) return q.questions;
  return [{ q: q.question, options: q.options, answer: q.answer, explain: q.explain }];
}

function openQuiz(q) {
  quizState = { quiz: q, idx: 0, correct: 0 };
  renderQuizStep();
  quizEl.hidden = false;
}

function renderQuizStep() {
  const { quiz, idx } = quizState;
  const questions = quizQuestions(quiz);
  const total = questions.length;
  const cur = questions[idx];

  $("#quizTitle").textContent = quiz.title || "Quiz";
  $("#quizProgress").textContent = total > 1 ? `Question ${idx + 1}/${total}` : "";
  $("#quizQuestion").textContent = cur.q || "";

  const explain = $("#quizExplain");
  explain.hidden = true;
  explain.textContent = cur.explain || "";

  const next = $("#quizNext");
  next.hidden = true;

  const opts = $("#quizOptions");
  opts.innerHTML = "";
  (cur.options || []).forEach((label, i) => {
    const b = document.createElement("button");
    b.className = "quiz__opt";
    b.textContent = label;
    b.addEventListener("click", () => answerQuizStep(i));
    opts.appendChild(b);
  });
}

function answerQuizStep(choice) {
  const { quiz, idx } = quizState;
  const questions = quizQuestions(quiz);
  const cur = questions[idx];

  const opts = $("#quizOptions");
  [...opts.children].forEach((b, i) => {
    b.disabled = true;
    b.classList.add("is-disabled");
    if (i === cur.answer) b.classList.add("is-correct");
    if (i === choice && choice !== cur.answer) b.classList.add("is-wrong");
  });
  $("#quizExplain").hidden = false;
  if (choice === cur.answer) quizState.correct++;

  const isLast = idx >= questions.length - 1;
  const next = $("#quizNext");
  next.hidden = false;
  next.textContent = isLast ? "Voir le résultat" : "Question suivante →";
  next.onclick = isLast ? finishQuiz : nextQuizStep;
}

function nextQuizStep() {
  quizState.idx++;
  renderQuizStep();
}

function finishQuiz() {
  const { quiz, correct } = quizState;
  const total = quizQuestions(quiz).length;

  if (!quizSolved.has(key(currentScene.id, quiz.id))) {
    quizSolved.add(key(currentScene.id, quiz.id));
    saveQuizSolved();
    markers.updateMarker({ id: quiz.id, className: "hidden-dot quiz done" });
  }

  $("#quizProgress").textContent = "Terminé";
  $("#quizQuestion").textContent =
    `Tu as obtenu ${correct}/${total} bonne${correct > 1 ? "s" : ""} réponse${correct > 1 ? "s" : ""} !`;
  $("#quizOptions").innerHTML = "";
  $("#quizExplain").hidden = true;

  const next = $("#quizNext");
  next.hidden = false;
  next.textContent = "Fermer";
  next.onclick = hideQuiz;

  toast(correct === total ? "🧠 Sans faute ! Quiz réussi." : `Quiz terminé : ${correct}/${total}`);
}

function hideQuiz() { quizEl.hidden = true; }
$("#quizClose").addEventListener("click", hideQuiz);
quizEl.addEventListener("click", (e) => { if (e.target === quizEl) hideQuiz(); });

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") { hideReveal(); hideQuiz(); }
});

/* ===========================================================
   TOAST
=========================================================== */
let toastTimer = null;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.hidden = false;
  requestAnimationFrame(() => t.classList.add("show"));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    t.classList.remove("show");
    setTimeout(() => (t.hidden = true), 400);
  }, 2400);
}

/* ===========================================================
   BOUTON INDICE — fait scintiller les secrets non trouvés
=========================================================== */
$("#hintBtn").addEventListener("click", () => {
  const cont = $("#viewer");
  cont.classList.remove("reveal-hint");
  void cont.offsetWidth;
  cont.classList.add("reveal-hint");
  setTimeout(() => cont.classList.remove("reveal-hint"), 3200);
});

/* ===========================================================
   PANNEAU DES ÉNIGMES — ouverture / fermeture
=========================================================== */
function toggleRiddles(force) {
  const panel = $("#riddlePanel");
  const open = force !== undefined ? force : panel.classList.contains("is-hidden");
  panel.classList.toggle("is-hidden", !open);
  $("#riddleBtn").classList.toggle("is-active", open);
}
$("#riddleBtn").addEventListener("click", () => toggleRiddles());
$("#riddleClose").addEventListener("click", () => toggleRiddles(false));

/* ===========================================================
   NAVIGATION HOME <-> TOUR
=========================================================== */
async function openTour(sceneId) {
  tourEl.hidden = false;
  await loadScene(sceneId, false);
  homeEl.style.display = "none";
}

$("#backBtn").addEventListener("click", () => {
  homeEl.style.display = "";
  tourEl.hidden = true;
  renderDeck();
});

/* ===========================================================
   TOGGLE VUE CARTE / GRILLE
=========================================================== */
function setHomeView(view) {
  const map = $("#viewMap");
  const grid = $("#viewGrid");
  if (!map || !grid) return;
  const showGrid = view === "grid";
  grid.hidden = !showGrid;
  map.hidden = showGrid;
  document.querySelectorAll("#viewToggle .home__toggle-btn").forEach((b) => {
    b.classList.toggle("is-active", b.dataset.view === view);
  });
}
document.querySelectorAll("#viewToggle .home__toggle-btn").forEach((b) => {
  b.addEventListener("click", () => setHomeView(b.dataset.view));
});

/* ===========================================================
   INIT
=========================================================== */
renderDeck();
renderCountdown();
setInterval(renderCountdown, 1000);
setHomeView("map");

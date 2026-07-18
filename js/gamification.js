// ============================================================
// Gamificación: racha de días de práctica y medallas. Se carga en
// todas las páginas (inyectado por js/layout.js) y escucha el
// evento "ar:answer" que dispara AppProgress.record cada vez que
// se contesta una pregunta, en cualquier tema de Lengua o
// Matemáticas, sin que esos ~55 archivos necesiten saber que esto
// existe.
// ============================================================

const STREAK_STORAGE_KEY = "ar_racha";
const BADGES_STORAGE_KEY = "ar_medallas";

function loadStreakState() {
  try {
    const raw = localStorage.getItem(STREAK_STORAGE_KEY);
    return raw ? JSON.parse(raw) : { currentStreak: 0, longestStreak: 0, lastActiveDate: null };
  } catch (e) {
    return { currentStreak: 0, longestStreak: 0, lastActiveDate: null };
  }
}

function saveStreakState(state) {
  try {
    localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    // localStorage no disponible.
  }
}

function loadBadges() {
  try {
    const raw = localStorage.getItem(BADGES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveBadges(badges) {
  try {
    localStorage.setItem(BADGES_STORAGE_KEY, JSON.stringify(badges));
  } catch (e) {
    // localStorage no disponible.
  }
}

function todayStr() {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}

function daysBetween(a, b) {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((new Date(b) - new Date(a)) / msPerDay);
}

// Racha de aciertos seguidos SIN fallar, solo dentro de esta pestaña
// (no se guarda entre sesiones): es la condición de la medalla
// "Perfeccionista".
let sessionPerfectStreak = 0;

const BADGES = [
  {
    id: "primeros-pasos",
    label: "Primeros pasos",
    icon: "🌱",
    desc: "Has contestado tu primera pregunta.",
    check: (ctx) => ctx.totalAnswers >= 1,
  },
  {
    id: "racha-3",
    label: "Racha de 3 días",
    icon: "🔥",
    desc: "3 días seguidos practicando.",
    check: (ctx) => ctx.streak.currentStreak >= 3,
  },
  {
    id: "racha-7",
    label: "Racha de 7 días",
    icon: "🔥",
    desc: "7 días seguidos practicando.",
    check: (ctx) => ctx.streak.currentStreak >= 7,
  },
  {
    id: "racha-30",
    label: "Racha de hierro",
    icon: "🏆",
    desc: "30 días seguidos practicando.",
    check: (ctx) => ctx.streak.currentStreak >= 30,
  },
  {
    id: "perfeccionista",
    label: "Perfeccionista",
    icon: "🎯",
    desc: "10 aciertos seguidos sin fallar, en una misma sesión.",
    check: (ctx) => ctx.perfectStreak >= 10,
  },
  {
    id: "explorador",
    label: "Explorador",
    icon: "🧭",
    desc: "Has practicado 10 contenidos distintos.",
    check: (ctx) => ctx.topicsPracticed >= 10,
  },
  {
    id: "todoterreno",
    label: "Todoterreno",
    icon: "🌈",
    desc: "Al menos un tema practicado de cada bloque de Lengua y Matemáticas.",
    check: (ctx) => ctx.allGroupsCovered,
  },
  {
    id: "cien-aciertos",
    label: "100 aciertos",
    icon: "💯",
    desc: "100 respuestas correctas en total.",
    check: (ctx) => ctx.totalCorrect >= 100,
  },
];

function buildBadgeContext() {
  const progress = (typeof AppProgress !== "undefined" && AppProgress.getAll()) || {};
  let totalCorrect = 0;
  let totalAnswers = 0;
  let topicsPracticed = 0;
  Object.keys(progress).forEach((id) => {
    const t = progress[id];
    totalCorrect += t.aciertos || 0;
    totalAnswers += (t.aciertos || 0) + (t.fallos || 0);
    if ((t.aciertos || 0) + (t.fallos || 0) > 0) topicsPracticed++;
  });

  let allGroupsCovered = typeof NAV !== "undefined";
  if (allGroupsCovered) {
    NAV.forEach((section) => {
      (section.groups || []).forEach((group) => {
        const groupHasPractice = (group.items || []).some((item) => {
          const t = progress[item.id];
          return t && (t.aciertos || 0) + (t.fallos || 0) > 0;
        });
        if (!groupHasPractice) allGroupsCovered = false;
      });
    });
  }

  return {
    totalCorrect: totalCorrect,
    totalAnswers: totalAnswers,
    topicsPracticed: topicsPracticed,
    allGroupsCovered: allGroupsCovered,
    perfectStreak: sessionPerfectStreak,
    streak: loadStreakState(),
  };
}

function unlockNewBadges() {
  const ctx = buildBadgeContext();
  const badges = loadBadges();
  let changed = false;
  const newlyUnlocked = [];
  BADGES.forEach((b) => {
    if (!badges[b.id] && b.check(ctx)) {
      badges[b.id] = new Date().toISOString();
      changed = true;
      newlyUnlocked.push(b);
    }
  });
  if (changed) {
    saveBadges(badges);
    newlyUnlocked.forEach(showBadgeToast);
  }
}

function updateStreak() {
  const state = loadStreakState();
  const today = todayStr();
  if (state.lastActiveDate === today) return state;
  if (state.lastActiveDate) {
    const gap = daysBetween(state.lastActiveDate, today);
    if (gap === 1) state.currentStreak = (state.currentStreak || 0) + 1;
    else if (gap > 1) state.currentStreak = 1;
  } else {
    state.currentStreak = 1;
  }
  state.lastActiveDate = today;
  if (state.currentStreak > (state.longestStreak || 0)) state.longestStreak = state.currentStreak;
  saveStreakState(state);
  return state;
}

function showBadgeToast(badge) {
  let host = document.getElementById("ar-badge-toast-host");
  if (!host) {
    host = document.createElement("div");
    host.id = "ar-badge-toast-host";
    host.className = "ar-badge-toast-host";
    document.body.appendChild(host);
  }
  const toast = document.createElement("div");
  toast.className = "ar-badge-toast";
  toast.innerHTML =
    '<span class="ar-badge-toast-icon">' + badge.icon + "</span>" +
    "<span><strong>¡Medalla desbloqueada!</strong><br>" + badge.label + "</span>";
  host.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("show"));
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

document.addEventListener("ar:answer", (e) => {
  const detail = e.detail || {};
  if (detail.isCorrect) sessionPerfectStreak++;
  else sessionPerfectStreak = 0;
  updateStreak();
  unlockNewBadges();
});

window.Gamification = {
  getStreak: loadStreakState,
  getBadges: () => {
    const earned = loadBadges();
    return BADGES.map((b) => ({
      id: b.id,
      label: b.label,
      icon: b.icon,
      desc: b.desc,
      earned: !!earned[b.id],
      earnedAt: earned[b.id] || null,
    }));
  },
  reset: () => {
    saveStreakState({ currentStreak: 0, longestStreak: 0, lastActiveDate: null });
    saveBadges({});
  },
};

document.dispatchEvent(new CustomEvent("ar:gamification-ready"));

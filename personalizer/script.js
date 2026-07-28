const seasonInput = document.getElementById("season");
const darkModeInput = document.getElementById("darkMode");
const showClockInput = document.getElementById("showClock");
const clockThemeInput = document.getElementById("clockTheme");
const urlArea = document.getElementById("urlArea");
const copyButton = document.getElementById("copyButton");
const previewCard = document.getElementById("previewCard");
const previewPanel = document.querySelector(".preview-panel");
const previewWindow = document.querySelector(".preview-window");
const previewTitle = document.getElementById("previewTitle");
const previewSubtitle = document.getElementById("previewSubtitle");
const previewTime = document.getElementById("previewTime");
const sceneLayers = {
  sky: document.querySelector(".scene-layer.sky"),
  sea: document.querySelector(".scene-layer.sea"),
  clouds: document.querySelector(".scene-layer.clouds"),
  seagulls: document.querySelector(".scene-layer.seagulls-addon"),
  beach1: document.querySelector(".scene-layer.beach-1"),
  beach2: document.querySelector(".scene-layer.beach-2"),
  palm: document.querySelector(".scene-layer.palm"),
  ball: document.querySelector(".scene-layer.ball"),
  crab: document.querySelector(".scene-layer.crab"),
  window: document.querySelector(".scene-layer.window"),
  reflection: document.querySelector(".scene-layer.reflection"),
};

const summerScene = {
  sky: "../seasonalwindow-widget/assets/summer/sky.png",
  sea: "../seasonalwindow-widget/assets/summer/sea.png",
  clouds: "../seasonalwindow-widget/assets/summer/clouds.png",
  seagulls: "../seasonalwindow-widget/assets/summer/seagulls.png",
  beach1: "../seasonalwindow-widget/assets/summer/beach1.png",
  beach2: "../seasonalwindow-widget/assets/summer/beach2.png",
  palm: "../seasonalwindow-widget/assets/summer/palm.png",
  ball: "../seasonalwindow-widget/assets/summer/ball.png",
  crab: "../seasonalwindow-widget/assets/summer/crab.png",
  window: "../seasonalwindow-widget/assets/summer/window.png",
  reflection: "../seasonalwindow-widget/assets/summer/reflection.png",
};

const seasonSceneMap = {
  spring: summerScene,
  summer: summerScene,
  autumn: summerScene,
  winter: summerScene,
};

const seasonMap = {
  spring: { title: "A fresh little bloom" },
  summer: { title: "Sunshine and calm" },
  autumn: { title: "Cozy seasonal comfort" },
  winter: { title: "Soft winter light" },
};

function buildWidgetUrl() {
  const url = new URL("https://martagd.github.io/seasonalwindow-widget/seasonalwindow-widget/index.html");
  url.searchParams.set("season", seasonInput.value);
  url.searchParams.set("dark", darkModeInput.checked ? "1" : "0");
  url.searchParams.set("bg", "transparent");
  url.searchParams.set("clock", showClockInput && showClockInput.checked ? "1" : "0");
  url.searchParams.set("clockTheme", clockThemeInput ? clockThemeInput.value : "summer");
  return url.toString();
}

function applySceneForSeason(seasonKey) {
  const scene = seasonSceneMap[seasonKey] || seasonSceneMap.summer;

  Object.entries(sceneLayers).forEach(([layerKey, element]) => {
    if (!element || !scene[layerKey]) {
      return;
    }
    element.src = scene[layerKey];
  });
}

function applyPersonalization() {
  const season = seasonMap[seasonInput.value] || seasonMap.spring;
  const styleTarget = previewCard || previewWindow;

  applySceneForSeason(seasonInput.value);

  if (styleTarget) {
    styleTarget.classList.toggle("dark-mode", darkModeInput.checked);
  }
  if (previewPanel) {
    previewPanel.classList.toggle("dark-mode", darkModeInput.checked);
  }

  if (previewSubtitle) {
    previewSubtitle.textContent = season.title;
  }

  if (previewTime) {
    const shouldShowClock = !showClockInput || showClockInput.checked;
    previewTime.classList.toggle("is-hidden", !shouldShowClock);

    previewTime.classList.remove("theme-summer", "theme-sunset", "theme-ocean", "theme-mint");
    previewTime.classList.add(`theme-${clockThemeInput ? clockThemeInput.value : "summer"}`);
  }

  urlArea.value = buildWidgetUrl();
}

function updateClock() {
  const now = new Date();
  if (previewTime) {
    previewTime.textContent = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
}

async function copyUrl() {
  try {
    await navigator.clipboard.writeText(urlArea.value);
    copyButton.textContent = "Copied!";
    window.setTimeout(() => {
      copyButton.textContent = "Copy URL";
    }, 1400);
  } catch (error) {
    console.error(error);
  }
}

[seasonInput, darkModeInput, showClockInput, clockThemeInput].forEach((input) => {
  if (!input) {
    return;
  }
  input.addEventListener("input", applyPersonalization);
  input.addEventListener("change", applyPersonalization);
});

copyButton.addEventListener("click", copyUrl);

window.addEventListener("DOMContentLoaded", () => {
  applyPersonalization();
  updateClock();
  window.setInterval(updateClock, 1000);
});

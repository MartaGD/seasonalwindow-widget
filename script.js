const seasonInput = document.getElementById("season");
const darkModeInput = document.getElementById("darkMode");
const showClockInput = document.getElementById("showClock");
const clockThemeInput = document.getElementById("clockTheme");
const urlArea = document.getElementById("urlArea");
const copyButton = document.getElementById("copyButton");
const previewCard = document.getElementById("previewCard");
const previewPanel = document.querySelector(".preview-panel");
const previewWindow = document.querySelector(".preview-window");
const sceneStack = document.querySelector(".scene-stack");
const previewTitle = document.getElementById("previewTitle");
const previewSubtitle = document.getElementById("previewSubtitle");
const previewTime = document.getElementById("previewTime");
const sceneLayers = {
  sky: document.querySelector(".scene-layer.sky"),
  sea: document.querySelector(".scene-layer.sea"),
  clouds: document.querySelector(".scene-layer.clouds"),
  sun: document.querySelector(".scene-layer.sun"),
  seagulls: document.querySelector(".scene-layer.seagulls-addon"),
  beach1: document.querySelector(".scene-layer.beach-1"),
  beach2: document.querySelector(".scene-layer.beach-2"),
  bunny: document.querySelector(".scene-layer.bunny"),
  palm: document.querySelector(".scene-layer.palm"),
  ball: document.querySelector(".scene-layer.ball"),
  crab: document.querySelector(".scene-layer.crab"),
  window: document.querySelector(".scene-layer.window"),
  reflection: document.querySelector(".scene-layer.reflection"),
};

const summerScene = {
  sky: "./seasonalwindow-widget/assets/summer/sky.png",
  sea: "./seasonalwindow-widget/assets/summer/sea.png",
  clouds: "./seasonalwindow-widget/assets/summer/clouds.png",
  sun: null,
  seagulls: "./seasonalwindow-widget/assets/summer/seagulls.png",
  beach1: "./seasonalwindow-widget/assets/summer/beach1.png",
  beach2: "./seasonalwindow-widget/assets/summer/beach2.png",
  bunny: null,
  palm: "./seasonalwindow-widget/assets/summer/palm.png",
  ball: "./seasonalwindow-widget/assets/summer/ball.png",
  crab: "./seasonalwindow-widget/assets/summer/crab.png",
  window: "./seasonalwindow-widget/assets/window.png",
  reflection: "./seasonalwindow-widget/assets/reflection.png",
};

const springScene = {
  sky: "./seasonalwindow-widget/assets/spring/sky.png",
  sea: "./seasonalwindow-widget/assets/spring/hill.png",
  clouds: "./seasonalwindow-widget/assets/spring/clouds.png",
  sun: "./seasonalwindow-widget/assets/spring/sun.png",
  seagulls: "./seasonalwindow-widget/assets/spring/flowers.png",
  beach1: "./seasonalwindow-widget/assets/spring/tree.png",
  beach2: "./seasonalwindow-widget/assets/spring/bird.png",
  bunny: "./seasonalwindow-widget/assets/spring/bunny.png",
  palm: "./seasonalwindow-widget/assets/spring/butterfly.png",
  ball: "./seasonalwindow-widget/assets/spring/bee.png",
  crab: null,
  window: "./seasonalwindow-widget/assets/window.png",
  reflection: "./seasonalwindow-widget/assets/reflection.png",
};

const seasonSceneMap = {
  spring: springScene,
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

const springChainLayerKeys = ["ball", "palm"];
const springChainAnimationByLayer = {
  ball: "springBeeFlight",
  palm: "springButterflyDrift",
};
const springChainGapMs = 2000;
let springChainTimer = null;
let springChainToken = 0;

function restartElementAnimation(element) {
  if (!element) {
    return;
  }
  element.style.animation = "none";
  void element.offsetWidth;
  element.style.animation = "";
}

function setSpringChainLayerState(layerKey, state) {
  const element = sceneLayers[layerKey];
  if (!element) {
    return;
  }
  element.style.animationIterationCount = "1";
  element.style.animationFillMode = "both";
  element.style.animationPlayState = state;
}

function resetSpringChainStyles() {
  springChainLayerKeys.forEach((layerKey) => {
    const element = sceneLayers[layerKey];
    if (!element) {
      return;
    }
    element.style.animationIterationCount = "";
    element.style.animationFillMode = "";
    element.style.animationPlayState = "";
  });
}

function resetSpringChainScheduler() {
  springChainToken += 1;
  if (springChainTimer) {
    window.clearTimeout(springChainTimer);
    springChainTimer = null;
  }
}

function runSpringChainStep(layerIndex, token) {
  if (token !== springChainToken) {
    return;
  }
  if (!seasonInput || seasonInput.value !== "spring") {
    resetSpringChainScheduler();
    resetSpringChainStyles();
    return;
  }

  const activeLayerKey = springChainLayerKeys[layerIndex % springChainLayerKeys.length];
  const activeLayer = sceneLayers[activeLayerKey];
  if (!activeLayer || activeLayer.style.display === "none") {
    springChainTimer = window.setTimeout(() => {
      runSpringChainStep(layerIndex + 1, token);
    }, springChainGapMs);
    return;
  }

  springChainLayerKeys.forEach((layerKey) => {
    setSpringChainLayerState(layerKey, "paused");
  });

  restartElementAnimation(activeLayer);
  setSpringChainLayerState(activeLayerKey, "running");

  const expectedAnimationName = springChainAnimationByLayer[activeLayerKey];
  activeLayer.addEventListener(
    "animationend",
    (event) => {
      if (token !== springChainToken || event.animationName !== expectedAnimationName) {
        return;
      }

      setSpringChainLayerState(activeLayerKey, "paused");
      springChainTimer = window.setTimeout(() => {
        runSpringChainStep(layerIndex + 1, token);
      }, springChainGapMs);
    },
    { once: true },
  );
}

function syncSpringBeeButterflyChain() {
  resetSpringChainScheduler();

  if (!seasonInput || seasonInput.value !== "spring") {
    resetSpringChainStyles();
    return;
  }

  const token = springChainToken;
  runSpringChainStep(0, token);
}

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

  if (sceneStack) {
    sceneStack.classList.remove("season-spring", "season-summer", "season-autumn", "season-winter");
    sceneStack.classList.add(`season-${seasonKey}`);
  }

  Object.entries(sceneLayers).forEach(([layerKey, element]) => {
    if (!element) {
      return;
    }

    const layerSrc = scene[layerKey];
    if (!layerSrc) {
      element.style.display = "none";
      return;
    }

    element.style.display = "block";
    element.src = layerSrc;
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

    previewTime.classList.remove(
      "theme-summer",
      "theme-sunset",
      "theme-ocean",
      "theme-mint",
      "theme-spring",
      "theme-meadow",
      "theme-dew",
      "theme-petal",
    );
    previewTime.classList.add(`theme-${clockThemeInput ? clockThemeInput.value : "summer"}`);
  }

  urlArea.value = buildWidgetUrl();
  syncSpringBeeButterflyChain();
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

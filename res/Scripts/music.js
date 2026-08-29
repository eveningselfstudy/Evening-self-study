/* ============================================================
   音乐播放器 —— 真实音频播放
   数据来源：Resources/Music/playlist.js
   音乐文件放在 Resources/Music/ 目录下
   ============================================================ */
let musicPlaying = false;
let musicIndex = 0;
let audioEl = null;
let isSeeking = false;

/* ===== 初始化 ===== */
function initMusic() {
  audioEl = new Audio();
  audioEl.preload = "metadata";

  /* 音频事件 */
  audioEl.addEventListener("timeupdate", updateProgressUI);
  audioEl.addEventListener("loadedmetadata", onLoadedMetadata);
  audioEl.addEventListener("ended", onMusicEnded);
  audioEl.addEventListener("error", onMusicError);

  applyMusic();
  initSeekDrag();
}

/* ===== 播放/暂停 ===== */
function togglePlay() {
  var song = playlist[musicIndex];
  if (!audioEl || !song.file) {
    showMusicTip("请先添加音乐文件");
    return;
  }

  if (musicPlaying) {
    audioEl.pause();
    musicPlaying = false;
    updatePlayIcon(false);
  } else {
    audioEl.play().then(function() {
      musicPlaying = true;
      updatePlayIcon(true);
    }).catch(function(e) {
      showMusicTip("播放失败");
    });
  }
}

/* ===== 更新播放按钮图标 ===== */
function updatePlayIcon(playing) {
  var iconContainer = document.getElementById("musicPlayIcon");
  var cover = document.getElementById("musicCover");
  if (!iconContainer) return;
  if (playing) {
    iconContainer.innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
    if (cover) cover.classList.add("playing");
  } else {
    iconContainer.innerHTML = '<path d="M8 5v14l11-7z"/>';
    if (cover) cover.classList.remove("playing");
  }
}

/* ===== 更新进度条 ===== */
function updateProgressUI() {
  if (!audioEl || isSeeking) return;
  var cur = audioEl.currentTime || 0;
  var dur = audioEl.duration || 0;
  var percent = dur > 0 ? (cur / dur) * 100 : 0;
  var bar = document.getElementById("musicProgressBar");
  if (bar) bar.style.width = percent + "%";
  var curEl = document.getElementById("musicCurrent");
  if (curEl) curEl.textContent = formatTime(cur);
}

/* ===== 元数据加载完成 ===== */
function onLoadedMetadata() {
  if (audioEl.duration) {
    var totalEl = document.getElementById("musicTotal");
    if (totalEl) totalEl.textContent = formatTime(audioEl.duration);
  }
}

/* ===== 播放结束自动下一首 ===== */
function onMusicEnded() {
  nextMusic();
}

/* ===== 播放错误 ===== */
function onMusicError() {
  showMusicTip("音乐加载失败");
  musicPlaying = false;
  updatePlayIcon(false);
}

/* ===== 临时提示 ===== */
function showMusicTip(msg) {
  var titleEl = document.getElementById("musicTitle");
  if (!titleEl) return;
  var original = titleEl.textContent;
  titleEl.textContent = msg;
  setTimeout(function() {
    if (playlist[musicIndex]) titleEl.textContent = playlist[musicIndex].title;
  }, 2000);
}

/* ===== 时间格式化 ===== */
function formatTime(sec) {
  sec = Math.floor(sec || 0);
  var m = Math.floor(sec / 60).toString().padStart(2, "0");
  var s = (sec % 60).toString().padStart(2, "0");
  return m + ":" + s;
}

/* ===== 上一首 ===== */
function prevMusic() {
  musicIndex = (musicIndex - 1 + playlist.length) % playlist.length;
  var wasPlaying = musicPlaying;
  applyMusic();
  if (wasPlaying && audioEl && playlist[musicIndex].file) {
    audioEl.play().catch(function(){});
  }
}

/* ===== 下一首 ===== */
function nextMusic() {
  musicIndex = (musicIndex + 1) % playlist.length;
  var wasPlaying = musicPlaying;
  applyMusic();
  if (wasPlaying && audioEl && playlist[musicIndex].file) {
    audioEl.play().catch(function(){});
  }
}

/* ===== 应用当前歌曲 ===== */
function applyMusic() {
  var song = playlist[musicIndex];
  if (!song) return;

  var titleEl = document.getElementById("musicTitle");
  var artistEl = document.getElementById("musicArtist");
  if (titleEl) titleEl.textContent = song.title || "未知歌曲";
  if (artistEl) artistEl.textContent = song.artist || "未知歌手";

  /* 封面 */
  var coverImg = document.getElementById("musicCoverImg");
  if (coverImg) {
    if (song.cover) {
      coverImg.src = "Resources/Music/" + song.cover;
      coverImg.style.display = "block";
    } else {
      coverImg.style.display = "none";
    }
  }

  /* 加载音频 */
  if (audioEl && song.file) {
    audioEl.src = "Resources/Music/" + song.file;
    audioEl.load();
  }

  /* 重置进度 */
  var bar = document.getElementById("musicProgressBar");
  if (bar) bar.style.width = "0%";
  var curEl = document.getElementById("musicCurrent");
  if (curEl) curEl.textContent = "00:00";
  var totalEl = document.getElementById("musicTotal");
  if (totalEl) totalEl.textContent = "00:00";
}

/* ===== 进度条拖动 ===== */
function getSeekPercent(clientX) {
  var bar = document.getElementById("musicProgress");
  if (!bar) return 0;
  var r = bar.getBoundingClientRect();
  return Math.max(0, Math.min(1, (clientX - r.left) / r.width));
}

function seekMusic(e) {
  if (!audioEl || !audioEl.duration) return;
  var percent = getSeekPercent(e.clientX);
  audioEl.currentTime = percent * audioEl.duration;
}

function startSeek(e) {
  if (!audioEl || !audioEl.duration) return;
  isSeeking = true;
  var clientX = e.touches ? e.touches[0].clientX : e.clientX;
  var percent = getSeekPercent(clientX);
  audioEl.currentTime = percent * audioEl.duration;
  e.preventDefault();
}

function moveSeek(e) {
  if (!isSeeking || !audioEl || !audioEl.duration) return;
  var clientX = e.touches ? e.touches[0].clientX : e.clientX;
  var percent = getSeekPercent(clientX);
  audioEl.currentTime = percent * audioEl.duration;
  e.preventDefault();
}

function endSeek(e) {
  isSeeking = false;
}

/* 初始化进度条拖动事件 */
function initSeekDrag() {
  var bar = document.getElementById("musicProgress");
  if (!bar) return;
  bar.addEventListener("mousedown", startSeek);
  bar.addEventListener("touchstart", startSeek, { passive: false });
  document.addEventListener("mousemove", moveSeek);
  document.addEventListener("touchmove", moveSeek, { passive: false });
  document.addEventListener("mouseup", endSeek);
  document.addEventListener("touchend", endSeek);
}

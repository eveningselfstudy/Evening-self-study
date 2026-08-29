/* ============================================================
   音乐播放器
   数据来源：Resources/Music/playlist.js
   时长由代码自动生成（通过 Audio API 或模拟）
   ============================================================ */
let musicPlaying = false;
let musicIndex = 0;
let musicProgress = 35; // 百分比
let musicTimer = null;
let audioEl = null;

function togglePlay() {
  musicPlaying = !musicPlaying;
  const iconContainer = document.getElementById("musicPlayIcon");
  const cover = document.getElementById("musicCover");

  if (musicPlaying) {
    // 替换为暂停图标
    iconContainer.innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
    cover.classList.add("playing");
    startProgress();
  } else {
    iconContainer.innerHTML = '<path d="M8 5v14l11-7z"/>';
    cover.classList.remove("playing");
    stopProgress();
  }
}

function startProgress() {
  stopProgress();
  musicTimer = setInterval(() => {
    musicProgress += 0.5;
    if (musicProgress >= 100) {
      musicProgress = 0;
      nextMusic();
    }
    updateProgressUI();
  }, 500);
}

function stopProgress() {
  if (musicTimer) {
    clearInterval(musicTimer);
    musicTimer = null;
  }
}

function updateProgressUI() {
  document.getElementById("musicProgressBar").style.width = musicProgress + "%";
  const song = playlist[musicIndex];
  // 时长由代码生成：如果有真实音频文件用 audio.duration，否则用模拟值
  const totalSec = song._duration || 176; // 默认模拟 2:56
  const curSec = Math.floor(totalSec * musicProgress / 100);
  document.getElementById("musicCurrent").textContent = formatTime(curSec);
}

function formatTime(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return m + ":" + s;
}

function prevMusic() {
  musicIndex = (musicIndex - 1 + playlist.length) % playlist.length;
  applyMusic();
}

function nextMusic() {
  musicIndex = (musicIndex + 1) % playlist.length;
  applyMusic();
}

function applyMusic() {
  const song = playlist[musicIndex];
  document.getElementById("musicTitle").textContent = song.title;
  document.getElementById("musicArtist").textContent = song.artist;
  // 总时长由代码生成
  const totalSec = song._duration || 176;
  document.getElementById("musicTotal").textContent = formatTime(totalSec);
  // 封面
  const coverImg = document.getElementById("musicCoverImg");
  if (song.cover) {
    coverImg.src = song.cover;
    coverImg.style.display = "block";
  }
  musicProgress = 0;
  updateProgressUI();
}

function seekMusic(e) {
  const bar = document.getElementById("musicProgress");
  const r = bar.getBoundingClientRect();
  musicProgress = Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100));
  updateProgressUI();
}

function initMusic() {
  // 为每首歌生成模拟时长（120~300秒）
  playlist.forEach((song, i) => {
    if (!song._duration) {
      song._duration = 120 + (i * 37) % 180;
    }
  });
  applyMusic();
}

/* ============================================================
   QQ音乐嵌入式播放器
   通过 iframe 嵌入 music.163.com 外链播放器
   歌曲ID配置在 Resources/Music/playlist.js 的 qqMusicIds 数组
   ============================================================ */
let musicIndex = 0;

function initMusic() {
  loadQQMusic();
}

/* 加载QQ音乐iframe */
function loadQQMusic() {
  var wrap = document.getElementById("musicQQWrap");
  var titleEl = document.getElementById("musicTitle");
  if (!wrap) return;

  var songId = qqMusicIds[musicIndex % qqMusicIds.length];
  var song = playlist[musicIndex % playlist.length];

  if (titleEl && song) titleEl.textContent = song.title || "音乐";

  /* QQ音乐外链播放器：type=2 单曲，height=66 标准高度 */
  wrap.innerHTML =
    '<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" ' +
    'class="music-qq-iframe" ' +
    'src="https://music.163.com/outchain/player?type=2&id=' + songId +
    '&auto=0&height=66"></iframe>';
}

/* 上一首 */
function prevMusic() {
  musicIndex = (musicIndex - 1 + qqMusicIds.length) % qqMusicIds.length;
  loadQQMusic();
}

/* 下一首 */
function nextMusic() {
  musicIndex = (musicIndex + 1) % qqMusicIds.length;
  loadQQMusic();
}

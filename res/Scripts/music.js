/* ============================================================
   QQ音乐嵌入式播放器
   通过 iframe 嵌入 QQ音乐官方外嵌播放器
   歌曲mid配置在 Resources/Music/playlist.js 的 qqMusicMids 数组
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

  var songMid = qqMusicMids[musicIndex % qqMusicMids.length];
  var song = playlist[musicIndex % playlist.length];

  if (titleEl && song) titleEl.textContent = song.title || "音乐";

  /* QQ音乐官方外嵌播放器（portal/player.html 专门用于嵌入） */
  wrap.innerHTML =
    '<iframe frameborder="0" border="0" marginwidth="0" marginheight="0" ' +
    'class="music-qq-iframe" scrolling="no" allow="autoplay" ' +
    'src="https://y.qq.com/portal/player.html?songlist=' + songMid +
    '&mode=singlesong"></iframe>';
}

/* 上一首 */
function prevMusic() {
  musicIndex = (musicIndex - 1 + qqMusicMids.length) % qqMusicMids.length;
  loadQQMusic();
}

/* 下一首 */
function nextMusic() {
  musicIndex = (musicIndex + 1) % qqMusicMids.length;
  loadQQMusic();
}

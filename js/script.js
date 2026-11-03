/* ==========================================================
   1. Procedural Audio Synthesizer (Zero external dependencies)
========================================================== */
class ProceduralAudio {
    constructor() {
      this.ctx = null;
      this.isPlaying = false;
      this.timer = null;
      this.step = 0;
      this.score = [
        261.63, 329.63, 392.00, 523.25, 440.00, 392.00, 329.63, 293.66, 349.23, 440.00, 523.25
      ];
    }
    
    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
      }
      if (this.ctx.state === 'suspended') this.ctx.resume();
    }
  
    playNote(freq) {
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.12, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 1.4);
    }
  
    playChimeChord() {
      this.init();
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
        setTimeout(() => this.playNote(freq), idx * 110);
      });
    }
  
    start() {
      this.init();
      this.isPlaying = true;
      this.step = 0;
      const musicText = document.getElementById('music-text');
      if (musicText) musicText.textContent = 'Mute';
      this.loop();
    }
  
    loop() {
      if (!this.isPlaying) return;
      this.playNote(this.score[this.step % this.score.length]);
      this.step++;
      this.timer = setTimeout(() => this.loop(), 640);
    }
  
    stop() {
      this.isPlaying = false;
      if (this.timer) clearTimeout(this.timer);
      const musicText = document.getElementById('music-text');
      if (musicText) musicText.textContent = 'Play Music';
    }
  
    toggle() {
      // Pause MP3 if it's playing when turning on chimes
      if (!this.isPlaying) {
        pauseMp3Player();
        this.start();
      } else {
        this.stop();
      }
    }
  }
  
  const audio = new ProceduralAudio();
  const musicToggle = document.getElementById('music-toggle');
  if (musicToggle) {
    musicToggle.addEventListener('click', () => audio.toggle());
  }
  
  /* ==========================================================
     2. Falling Petals Canvas
  ========================================================== */
  const canvas = document.getElementById('petals-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
  
    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });
  
    const petals = Array.from({ length: 24 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height - height,
      size: Math.random() * 8 + 8,
      speedX: Math.random() * 1.5 - 0.75,
      speedY: Math.random() * 1 + 1,
      rotation: Math.random() * 360,
      rotSpeed: Math.random() * 1 - 0.5,
      opacity: Math.random() * 0.4 + 0.3
    }));
  
    function drawPetal(p) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size, p.size / 1.8, 0, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 182, 193, ${p.opacity})`;
      ctx.fill();
      ctx.restore();
    }
  
    function animatePetals() {
      ctx.clearRect(0, 0, width, height);
      petals.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotSpeed;
        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        drawPetal(p);
      });
      requestAnimationFrame(animatePetals);
    }
    animatePetals();
  }
  
  /* ==========================================================
     3. Two-Stage Envelope Transition & Typewriter Animation
  ========================================================== */
  const envelopeStage = document.getElementById('envelope-stage');
  const envelope = document.getElementById('envelope');
  const flap = document.getElementById('envelope-flap');
  const wax = document.getElementById('wax-seal');
  const tapHint = document.getElementById('tap-hint');
  const letterBox = document.getElementById('letter-container');
  const typewriter = document.getElementById('typewriter');
  
  const message = 
    "တစ်ကယ်တော့လေ ဘာပြောရမှန်းမသိဘူး အများကြီးပြောမိရင်လည်း စိတ်ရှုပ်မှာစိုးရိမ်တယ်. " +
    "တစ်ရက်ကလေးမှမမေ့ခဲ့ပါဘူးနော် ကုကုလေးကိုအများကြီးလွမ်းပြီး သတိရနေတာ🥺. " +
    "ပြောရင်တော့ရယ်စရာကြီး ဒါမဲ့ဝမ်ဝမ်း ကုကိုစလိုက်ရင် ကုဝမ်ဝမ်းကိုထိုးတာလေးလည်းလွမ်းတယ်🥹🙏. " +
    "အလုပ်လုပ်တာလည်း 加油👊🏻နော် အရမ်းလည်း ကိုယ့်ကိုယ်ကိုတွန်းအားမပေးနဲ့နော်✨. " +
    "ဒါကလေ ကုကုပျော်အောင်လို့လုပ်ထားတာပါနော်. " +
    "ကဲကဲ အများကြီးမပြောတော့ပါဘူး သဘောကျပြီးပြုံးသွားတာဆိုရင်ပဲအများကြီးကျေနပ်ပါပြီဗျာ ကုကု💞." +
    "များများပျော်ပျော်နေပြီး အများကြီးပြုံးနိုင်ပါစေနော်🥺💞. ";
  
  let opened = false;
  
  function triggerOpen(e) {
    if (e) e.stopPropagation();
    if (opened) return;
    opened = true;
  
    // Play sound & start background melody
    audio.playChimeChord();
    if (!audio.isPlaying) {
      audio.start();
    }
  
    // Visual open triggers
    if (wax) wax.classList.add('broken');
    if (flap) flap.classList.add('opened');
    if (tapHint) tapHint.style.opacity = '0';
  
    // Transition to stage 2
    setTimeout(() => {
      if (envelopeStage) envelopeStage.classList.add('fade-out');
      
      setTimeout(() => {
        if (envelopeStage) envelopeStage.style.display = 'none';
        if (letterBox) letterBox.classList.add('visible');
        window.scrollTo({ top: 0, behavior: 'smooth' });
  
        setTimeout(() => {
          if (letterBox) letterBox.classList.add('fade-in');
          typewrite();
          initScratch();
        }, 50);
      }, 600);
    }, 850);
  }
  
  if (envelope) envelope.addEventListener('click', triggerOpen);
  if (wax) wax.addEventListener('click', triggerOpen);
  
  function typewrite() {
    if (!typewriter) return;
    let i = 0;
    typewriter.textContent = "";
    const timer = setInterval(() => {
      if (i < message.length) {
        typewriter.textContent += message.charAt(i);
        i++;
      } else {
        clearInterval(timer);
      }
    }, 28);
  }
  
/* ==========================================================
   4. MP3 Playlist Controller (Fixed Audio Overlap)
========================================================== */
const mp3Player = document.getElementById('mp3-player');
const songButtons = document.querySelectorAll('.song-item');
const nowPlayingTitle = document.getElementById('now-playing-title');
const playPauseMain = document.getElementById('play-pause-main');
const progressBar = document.getElementById('progress-bar');
const topMusicText = document.getElementById('music-text');
const topMusicIcon = document.getElementById('music-icon');

let currentSongIndex = 0;
let isMp3Playing = false;

// Helper to pause MP3 when top button is used
function pauseMp3Player() {
  if (mp3Player && !mp3Player.paused) {
    mp3Player.pause();
  }
  isMp3Playing = false;
  songButtons.forEach(item => {
    item.classList.remove('active');
    item.querySelector('.song-icon').textContent = '▶️';
  });
  if (playPauseMain) playPauseMain.textContent = '▶️';
}

function loadAndPlaySong(index, autoPlay = true) {
  const btn = songButtons[index];
  if (!btn || !mp3Player) return;

  currentSongIndex = index;
  const src = btn.getAttribute('data-src');
  const title = btn.getAttribute('data-title');

  // Stop synthesized chimes so they don't overlap with real songs
  if (typeof audio !== 'undefined' && audio.isPlaying) {
    audio.stop();
  }

  // Update active button state
  songButtons.forEach(item => {
    item.classList.remove('active');
    item.querySelector('.song-icon').textContent = '▶️';
  });
  btn.classList.add('active');

  if (mp3Player.getAttribute('src') !== src) {
    mp3Player.setAttribute('src', src);
    mp3Player.load();
  }
  if (nowPlayingTitle) nowPlayingTitle.textContent = title;

  if (autoPlay) {
    mp3Player.play().then(() => {
      isMp3Playing = true;
      btn.querySelector('.song-icon').textContent = '⏸️';
      if (playPauseMain) playPauseMain.textContent = '⏸️';
      if (topMusicText) topMusicText.textContent = 'Mute';
      if (topMusicIcon) topMusicIcon.textContent = '🎵';
    }).catch(err => console.log("Make sure the MP3 file exists in the audio/ folder:", err));
  }
}

function toggleMp3Play() {
  if (!mp3Player) return;
  if (!mp3Player.getAttribute('src')) {
    loadAndPlaySong(0, true);
    return;
  }

  const activeBtn = songButtons[currentSongIndex];
  if (mp3Player.paused) {
    if (typeof audio !== 'undefined' && audio.isPlaying) audio.stop();
    mp3Player.play().then(() => {
      isMp3Playing = true;
      if (activeBtn) activeBtn.querySelector('.song-icon').textContent = '⏸️';
      if (playPauseMain) playPauseMain.textContent = '⏸️';
      if (topMusicText) topMusicText.textContent = 'Mute';
      if (topMusicIcon) topMusicIcon.textContent = '🎵';
    }).catch(err => console.log("MP3 play error:", err));
  } else {
    mp3Player.pause();
    isMp3Playing = false;
    if (activeBtn) activeBtn.querySelector('.song-icon').textContent = '▶️';
    if (playPauseMain) playPauseMain.textContent = '▶️';
    if (topMusicText) topMusicText.textContent = 'Play Music';
    if (topMusicIcon) topMusicIcon.textContent = '🎵';
  }
}

let notiTimer = null;

function showSongNoti() {
  const noti = document.getElementById('song-noti');
  if (!noti) return;
  noti.classList.add('show');

  if (notiTimer) clearTimeout(notiTimer);
  notiTimer = setTimeout(() => {
    noti.classList.remove('show');
  }, 10000); // Hide after 10 seconds
}

function closeSongNoti() {
  const noti = document.getElementById('song-noti');
  if (noti) noti.classList.remove('show');
  if (notiTimer) clearTimeout(notiTimer);
}

// Click a song button in the playlist
songButtons.forEach((btn, idx) => {
  btn.addEventListener('click', () => {
    const src = btn.getAttribute('data-src') || '';
    const title = btn.getAttribute('data-title') || 'သမုဒယနဲ့ ချည်တဲ့နွယ်';

    if (currentSongIndex === idx && !mp3Player.paused) {
      toggleMp3Play();
    } else {
      loadAndPlaySong(idx, true);

      // ONLY show notification & send Telegram alert when she manually clicks "thamudaya.mp3"
      if (src.includes('thamudaya.mp3')) {
        showSongNoti();
        sendTelegramAlert(`🎶 顾顾 started playing "${title}" on your letter web! 🥺💖\n⏰ Time: ${new Date().toLocaleString()}`);
      }
    }
  });
});

// Play/Pause button on the Now Playing bar
if (playPauseMain) {
  playPauseMain.addEventListener('click', toggleMp3Play);
}

// Sync progress bar as the song plays
if (mp3Player && progressBar) {
  mp3Player.addEventListener('timeupdate', () => {
    if (mp3Player.duration) {
      progressBar.value = (mp3Player.currentTime / mp3Player.duration) * 100;
    }
  });

  progressBar.addEventListener('input', () => {
    if (mp3Player.duration) {
      mp3Player.currentTime = (progressBar.value / 100) * mp3Player.duration;
    }
  });

  // Automatically play the next song in the list when a song finishes
  mp3Player.addEventListener('ended', () => {
    const nextIndex = (currentSongIndex + 1) % songButtons.length;
    loadAndPlaySong(nextIndex, true);
  });
}

/* ==========================================================
     5. Photo & Video Album Lightbox
  ========================================================== */
let currentAlbumMedia = [];
let currentMediaIndex = 0;

function isVideoFile(filename) {
  return /\.(mp4|webm|ogg|mov)$/i.test(filename);
}

// Automatically count how many photos/videos are in each card on load
document.querySelectorAll('.polaroid[data-images]').forEach(card => {
  const files = card.getAttribute('data-images').split(',').map(s => s.trim()).filter(Boolean);
  const badge = card.querySelector('.photo-count');
  if (badge) {
    const hasVideo = files.some(f => isVideoFile(f));
    badge.textContent = `${hasVideo ? '🎞️' : '📸'} ${files.length}`;
  }
});

function openAlbum(cardElement) {
  const mediaAttr = cardElement.getAttribute('data-images');
  const titleAttr = cardElement.getAttribute('data-title');
  if (!mediaAttr) return;

  currentAlbumMedia = mediaAttr.split(',').map(s => s.trim()).filter(Boolean);
  currentMediaIndex = 0;

  document.getElementById('album-title').textContent = titleAttr || 'Memories';
  updateAlbumView();
  document.getElementById('album-modal').classList.add('active');
}

function updateAlbumView() {
  const imgEl = document.getElementById('album-current-img');
  const videoEl = document.getElementById('album-current-video');
  const counterEl = document.getElementById('album-counter');
  const dotsContainer = document.getElementById('album-dots');

  const currentFile = currentAlbumMedia[currentMediaIndex];

  // Always pause and reset video when switching slides
  videoEl.pause();
  videoEl.removeAttribute('src');

  if (isVideoFile(currentFile)) {
    imgEl.style.display = 'none';
    videoEl.style.display = 'block';
    videoEl.src = currentFile;
    videoEl.load();
  } else {
    videoEl.style.display = 'none';
    imgEl.style.display = 'block';
    imgEl.style.opacity = '0';
    setTimeout(() => {
      imgEl.src = currentFile;
      imgEl.style.opacity = '1';
    }, 100);
  }

  counterEl.textContent = `${currentMediaIndex + 1} / ${currentAlbumMedia.length}`;

  // Render indicator dots
  dotsContainer.innerHTML = '';
  currentAlbumMedia.forEach((_, idx) => {
    const dot = document.createElement('span');
    dot.className = 'album-dot' + (idx === currentMediaIndex ? ' active' : '');
    dot.onclick = () => {
      currentMediaIndex = idx;
      updateAlbumView();
    };
    dotsContainer.appendChild(dot);
  });
}

function changePhoto(direction) {
  currentMediaIndex += direction;
  if (currentMediaIndex < 0) {
    currentMediaIndex = currentAlbumMedia.length - 1;
  } else if (currentMediaIndex >= currentAlbumMedia.length) {
    currentMediaIndex = 0;
  }
  updateAlbumView();
}

function closeAlbum(event) {
  if (!event || event.target.id === 'album-modal') {
    const videoEl = document.getElementById('album-current-video');
    if (videoEl) videoEl.pause();
    document.getElementById('album-modal').classList.remove('active');
  }
}

// Automatically pause background music/MP3 when an album video starts playing
const albumVideoEl = document.getElementById('album-current-video');
if (albumVideoEl) {
  albumVideoEl.addEventListener('play', () => {
    if (typeof audio !== 'undefined' && audio.isPlaying) {
      audio.stop();
    }
    if (mp3Player && !mp3Player.paused) {
      pauseMp3Player();
    }
  });
}

  /* ==========================================================
     6. Scratch-off Canvas
  ========================================================== */
  function initScratch() {
    const sCanvas = document.getElementById('scratch-canvas');
    if (!sCanvas) return;
    const sCtx = sCanvas.getContext('2d');
    const rect = sCanvas.getBoundingClientRect();
    sCanvas.width = rect.width || 300;
    sCanvas.height = rect.height || 120;
  
    sCtx.fillStyle = '#CBD5E1';
    sCtx.fillRect(0, 0, sCanvas.width, sCanvas.height);
    sCtx.fillStyle = '#64748B';
    sCtx.font = 'bold 13px sans-serif';
    sCtx.textAlign = 'center';
    sCtx.fillText('✨ Rub here to reveal ✨', sCanvas.width / 2, sCanvas.height / 2 + 5);
  
    let isScratching = false;
    function scratch(e) {
      if (!isScratching) return;
      const box = sCanvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const x = clientX - box.left;
      const y = clientY - box.top;
  
      sCtx.globalCompositeOperation = 'destination-out';
      sCtx.beginPath();
      sCtx.arc(x, y, 18, 0, Math.PI * 2);
      sCtx.fill();
    }
  
    sCanvas.addEventListener('mousedown', () => isScratching = true);
    sCanvas.addEventListener('touchstart', (e) => { isScratching = true; scratch(e); });
    window.addEventListener('mouseup', () => isScratching = false);
    window.addEventListener('touchend', () => isScratching = false);
    sCanvas.addEventListener('mousemove', scratch);
    sCanvas.addEventListener('touchmove', scratch);
  }

/* ==========================================================
   7. Silent Heart Reaction (Instant Telegram Bot Alert!)
========================================================== */
const TELEGRAM_BOT_TOKEN = "8832112215:AAGga3nuyOUKmOcTPjLs1FcU8zS9Rf7QCrc";
const TELEGRAM_CHAT_ID = "1694644020";

function sendTelegramAlert(textMessage) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: textMessage
    })
  }).catch(err => console.log("Telegram error:", err));
}

function sendReaction(reactionName, btnElement) {
  // Highlight the button she tapped
  document.querySelectorAll('.react-btn').forEach(btn => btn.classList.remove('selected'));
  btnElement.classList.add('selected');

  // Burst floating emoji animation where she tapped
  const rect = btnElement.getBoundingClientRect();
  const emoji = btnElement.querySelector('.react-emoji').textContent;
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      textBubble(
        emoji,
        rect.left + rect.width / 2 + (Math.random() - 0.5) * 50,
        rect.top
      );
    }, i * 90);
  }

  // Show gentle confirmation message on her screen
  const statusEl = document.getElementById('reaction-status');
  if (statusEl) {
    statusEl.textContent = "ကုကု reaction is sent to ဝမ်ဝမ်း 🤍✨";
    statusEl.classList.add('visible');
  }

  // Send instant message to your Telegram!
  const msg = `💌 顾顾 reacted to your letter!\n\n✨ Reaction: ${reactionName}\n⏰ Time: ${new Date().toLocaleString()}`;
  sendTelegramAlert(msg);
}

/* ==========================================================
   8. Runaway "No" Button & Success Modal
========================================================== */
const noBtn = document.getElementById('no-btn');
const yesBtn = document.getElementById('yes-btn');
const modal = document.getElementById('modal');
const modalCloseBtn = document.getElementById('modal-close-btn');

let escapeAttempts = 0;
const quips = [
  "ပြုံးနေတာ သိပါတယ်နော်! 😉", 
  "အပြုံးလေးကို ဖုံးမထားပါနဲ့! 🏃💨", 
  "ကုကု လိမ်လို့မရပါဘူး! 🌸", 
  "ဒီနေ့တော့ ပြုံးကိုပြုံးရမယ်! 💖",
  "မပြုံးဘူးဆိုတာ မယုံပါဘူး! 🙈",
  "နည်းနည်းတော့ ပြုံးလိုက်ပါနော်! ✨"
];

function evade(e) {
  if (e) e.preventDefault();
  escapeAttempts++;
  
  const rx = (Math.random() - 0.5) * 220;
  const ry = (Math.random() - 0.5) * 80;
  
  noBtn.style.transform = `translate(${rx}px, ${ry}px)`;
  showFloatingQuip(quips[escapeAttempts % quips.length], e);
}

function textBubble(text, clientX, clientY) {
  const bubble = document.createElement('div');
  bubble.textContent = text;
  bubble.style.position = 'fixed';
  bubble.style.left = `${clientX}px`;
  bubble.style.top = `${clientY - 20}px`;
  bubble.style.background = '#ffffff';
  bubble.style.color = '#E11D48';
  bubble.style.padding = '4px 10px';
  bubble.style.borderRadius = '12px';
  bubble.style.fontSize = '12px';
  bubble.style.fontWeight = 'bold';
  bubble.style.boxShadow = '0 4px 12px rgba(225,29,72,0.15)';
  bubble.style.zIndex = '1000';
  bubble.style.pointerEvents = 'none';
  bubble.style.transition = 'all 2s ease-out';
  
  document.body.appendChild(bubble);
  
  setTimeout(() => {
    bubble.style.transform = 'translateY(-30px)';
    bubble.style.opacity = '0';
  }, 50);

  setTimeout(() => {
    bubble.remove();
  }, 600);
}

function showFloatingQuip(text, e) {
  const clientX = e.clientX || (e.touches && e.touches[0].clientX) || window.innerWidth / 2;
  const clientY = e.clientY || (e.touches && e.touches[0].clientY) || window.innerHeight / 2;
  textBubble(text, clientX, clientY);
}

noBtn.addEventListener('mouseover', evade);
noBtn.addEventListener('touchstart', evade);
noBtn.addEventListener('click', evade);

yesBtn.addEventListener('click', () => {
  modal.style.display = 'flex';
  sendTelegramAlert(`💖 顾顾 clicked "ပြုံးမိသွားပြီ 🙄" at the bottom of your letter!\n⏰ Time: ${new Date().toLocaleString()}`);
});

modalCloseBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

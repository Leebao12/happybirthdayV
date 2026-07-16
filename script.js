const photos = [
  { src: "img/van1.jpg", title: "Khoảnh khắc đầu tiên" },
  { src: "img/van2.jpg", title: "Nụ cười xinh nhất" },
  { src: "img/van3.jpg", title: "Một ngày thật vui" },
  { src: "img/van4.jpg", title: "Kỷ niệm đáng yêu" },
  { src: "img/van5.jpg", title: "Tuổi mới rực rỡ" }
];

// Nếu bạn có ảnh thật, đổi thành như sau:
// { src: "img/anh1.jpg", title: "Tên ảnh bạn muốn" }

const mainPhoto = document.getElementById("mainPhoto");
const photoNumber = document.getElementById("photoNumber");
const photoTitle = document.getElementById("photoTitle");
const thumbs = document.getElementById("thumbs");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");
let current = 0;
let autoSlide;

function renderThumbs() {
  thumbs.innerHTML = photos
    .map((photo, index) => `
      <button class="${index === current ? "active" : ""}" data-index="${index}" type="button" aria-label="Xem ảnh ${index + 1}">
        <img src="${photo.src}" alt="Ảnh nhỏ ${index + 1}">
      </button>
    `)
    .join("");
}

function showPhoto(index) {
  current = (index + photos.length) % photos.length;
  mainPhoto.classList.add("switching");

  setTimeout(() => {
    mainPhoto.src = photos[current].src;
    mainPhoto.alt = `Ảnh sinh nhật ${current + 1}`;
    photoNumber.textContent = `${String(current + 1).padStart(2, "0")} / 05`;
    photoTitle.textContent = photos[current].title;
    renderThumbs();
    mainPhoto.classList.remove("switching");
  }, 220);
}

function startAutoSlide() {
  clearInterval(autoSlide);
  autoSlide = setInterval(() => showPhoto(current + 1), 4200);
}

prevBtn.addEventListener("click", () => {
  showPhoto(current - 1);
  startAutoSlide();
});

nextBtn.addEventListener("click", () => {
  showPhoto(current + 1);
  startAutoSlide();
});

thumbs.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  showPhoto(Number(button.dataset.index));
  startAutoSlide();
});

renderThumbs();
startAutoSlide();

// Hiệu ứng gõ chữ
const typingText = document.getElementById("typingText");
const message = "Chúc H.Vân tuổi mới thật nhiều niềm vui, luôn xênh gái, luôn may mắn và được yêu thương thật nhiều nha!";
let charIndex = 0;

function typeWriter() {
  if (charIndex <= message.length) {
    typingText.textContent = message.slice(0, charIndex);
    charIndex++;
    setTimeout(typeWriter, 45);
  }
}

typeWriter();

// Modal lời chúc
const wishBtn = document.getElementById("wishBtn");
const wishModal = document.getElementById("wishModal");
const closeModal = document.getElementById("closeModal");

wishBtn.addEventListener("click", () => {
  wishModal.classList.add("show");
  wishModal.setAttribute("aria-hidden", "false");
  launchConfetti(140);
});

closeModal.addEventListener("click", closeWishModal);
wishModal.addEventListener("click", (event) => {
  if (event.target === wishModal) closeWishModal();
});

function closeWishModal() {
  wishModal.classList.remove("show");
  wishModal.setAttribute("aria-hidden", "true");
}

// Reveal khi cuộn trang
const reveals = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("show");
  });
}, { threshold: 0.18 });

reveals.forEach(section => observer.observe(section));

// Confetti tự viết bằng JS thuần
const confettiBtn = document.getElementById("confettiBtn");
confettiBtn.addEventListener("click", () => launchConfetti(180));

function launchConfetti(amount = 120) {
  const colors = ["#ff4fa3", "#ffe66d", "#4dd8ff", "#8c52ff", "#ffffff", "#ff9f1c"];

  for (let i = 0; i < amount; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti";
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = `${2.4 + Math.random() * 2.6}s`;
    piece.style.animationDelay = `${Math.random() * 0.3}s`;
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 5400);
  }
}

const confettiStyle = document.createElement("style");
confettiStyle.textContent = `
  .confetti {
    position: fixed;
    top: -14px;
    z-index: 4;
    width: 10px;
    height: 18px;
    border-radius: 4px;
    pointer-events: none;
    animation: confettiFall linear forwards;
  }

  @keyframes confettiFall {
    to {
      transform: translateY(110vh) rotate(900deg);
      opacity: 0;
    }
  }
`;
document.head.appendChild(confettiStyle);

setTimeout(() => launchConfetti(110), 700);

// Nhạc nền
const musicBtn = document.getElementById("musicBtn");
const audio = document.getElementById("birthdayAudio");
let isPlaying = false;

musicBtn.addEventListener("click", async () => {
  try {
    if (!isPlaying) {
      await audio.play();
      musicBtn.textContent = "♫ Tắt nhạc";
    } else {
      audio.pause();
      musicBtn.textContent = "♫ Bật nhạc";
    }
    isPlaying = !isPlaying;
  } catch (error) {
    musicBtn.textContent = "Trình duyệt chặn nhạc";
  }
});

// Pháo hoa canvas
const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");
let fireworks = [];
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

class Firework {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + 20;
    this.targetY = Math.random() * canvas.height * 0.45 + 60;
    this.speed = Math.random() * 3 + 5;
    this.color = `hsl(${Math.random() * 360}, 100%, 68%)`;
  }

  update() {
    this.y -= this.speed;
    if (this.y <= this.targetY) {
      explode(this.x, this.y, this.color);
      return true;
    }
    return false;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 5 + 1.6;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.alpha = 1;
    this.color = color;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.035;
    this.alpha -= 0.014;
    return this.alpha <= 0;
  }

  draw() {
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2.2, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

function explode(x, y, color) {
  for (let i = 0; i < 42; i++) {
    particles.push(new Particle(x, y, color));
  }
}

function animateFireworks() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (Math.random() < 0.035) {
    fireworks.push(new Firework());
  }

  fireworks = fireworks.filter(firework => {
    firework.draw();
    return !firework.update();
  });

  particles = particles.filter(particle => {
    particle.draw();
    return !particle.update();
  });

  requestAnimationFrame(animateFireworks);
}

animateFireworks();

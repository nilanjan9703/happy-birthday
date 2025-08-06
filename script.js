// Global variables
let audio = null;
let stars = [];
let shootingStars = [];
let constellation = [];
let canvas, ctx;
let animationId;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeConfetti();
    initializeStarryNight();
});

// Confetti Animation
function initializeConfetti() {
    const container = document.getElementById('confettiContainer');
    if (!container) return;

    const colors = ['#ff6b9d', '#ff8fab', '#fecfef', '#fff5f5', '#ffd700'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.cssText = `
            position: absolute;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}%;
            top: -10px;
            opacity: ${Math.random()};
            transform: rotate(${Math.random() * 360}deg);
            animation: fall ${Math.random() * 3 + 2}s linear infinite;
        `;
        container.appendChild(confetti);
    }

    // Add CSS for falling animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fall {
            to {
                transform: translateY(100vh) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Open Card Function
function openCard() {
    const coverPage = document.getElementById('coverPage');
    const insidePage = document.getElementById('insidePage');
    
    // Add hidden class to cover page
    coverPage.classList.add('hidden');
    
    // Show inside page
    setTimeout(() => {
        insidePage.classList.add('visible');
        initializeStarryNight();
        playMusic();
    }, 1000);
}

// Music Control
function toggleMusic() {
    const audio = document.getElementById('birthdaySong');
    const musicIcon = document.getElementById('musicIcon');
    
    if (audio.paused) {
        audio.play();
        musicIcon.textContent = '🔊';
    } else {
        audio.pause();
        musicIcon.textContent = '🎵';
    }
}

function playMusic() {
    const audio = document.getElementById('birthdaySong');
    audio.play().catch(e => console.log('Audio play failed:', e));
}

// Starry Night Animation
function initializeStarryNight() {
    canvas = document.getElementById('starCanvas');
    if (!canvas) return;
    
    ctx = canvas.getContext('2d');
    resizeCanvas();
    
    // Create stars
    createStars();
    
    // Create constellation for name
    createConstellation();
    
    // Start animation
    animate();
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function createStars() {
    stars = [];
    const starCount = 200;
    
    for (let i = 0; i < starCount; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2 + 0.5,
            brightness: Math.random(),
            twinkleSpeed: Math.random() * 0.02 + 0.01
        });
    }
}

function createConstellation() {
    // Create constellation pattern for "HER NAME" - customize this
    const name = "HER NAME"; // Replace with actual name
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    constellation = [];
    const letters = name.split('');
    let xOffset = -((letters.length * 30) / 2);
    
    letters.forEach((letter, index) => {
        const x = centerX + xOffset + (index * 30);
        const y = centerY;
        
        // Create star pattern for each letter
        for (let i = 0; i < 5; i++) {
            constellation.push({
                x: x + (Math.random() - 0.5) * 20,
                y: y + (Math.random() - 0.5) * 20,
                radius: 2,
                brightness: 1,
                twinkleSpeed: 0.02
            });
        }
    });
}

function createShootingStar() {
    if (Math.random() < 0.01) {
        shootingStars.push({
            x: Math.random() * canvas.width,
            y: 0,
            length: Math.random() * 80 + 20,
            speed: Math.random() * 10 + 5,
            angle: Math.PI / 4 + (Math.random() * Math.PI / 4)
        });
    }
}

function drawStars() {
    stars.forEach(star => {
        star.brightness += star.twinkleSpeed;
        if (star.brightness > 1 || star.brightness < 0) {
            star.twinkleSpeed *= -1;
        }
        
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
        ctx.fill();
    });
    
    // Draw constellation stars
    constellation.forEach(star => {
        star.brightness += star.twinkleSpeed;
        if (star.brightness > 1 || star.brightness < 0.5) {
            star.twinkleSpeed *= -1;
        }
        
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
        ctx.fill();
    });
}

function drawShootingStars() {
    shootingStars.forEach((star, index) => {
        star.x += star.speed * Math.cos(star.angle);
        star.y += star.speed * Math.sin(star.angle);
        
        // Draw shooting star
        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(star.x - star.length * Math.cos(star.angle), 
                   star.y - star.length * Math.sin(star.angle));
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Add glow effect
        ctx.beginPath();
        ctx.arc(star.x, star.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fill();
        
        // Remove if off screen
        if (star.x < 0 || star.x > canvas.width || 
            star.y > canvas.height) {
            shootingStars.splice(index, 1);
        }
    });
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawStars();
    createShootingStar();
    drawShootingStars();
    
    animationId = requestAnimationFrame(animate);
}

// Window resize handler
window.addEventListener('resize', function() {
    if (canvas) {
        resizeCanvas();
        createStars();
        createConstellation();
    }
});

// Cleanup
window.addEventListener('beforeunload', function() {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    if (audio) {
        audio.pause();
    }
});

// Add some interactive features
document.addEventListener('click', function(e) {
    // Create a shooting star at click position
    if (e.target === canvas) {
        shootingStars.push({
            x: e.clientX,
            y: e.clientY,
            length: 50,
            speed: 15,
            angle: Math.random() * Math.PI * 2
        });
    }
});

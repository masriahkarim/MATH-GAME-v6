import confetti from 'canvas-confetti';

export function fireConfetti() {
  try {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#FACC15', '#38BDF8', '#4ADE80', '#F472B6', '#A78BFA'],
    });
  } catch {
    // Graceful fallback
  }
}

export function fireStarBurst() {
  try {
    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FFA500', '#FF4500', '#00E5FF'],
      shapes: ['star', 'circle'],
    });
  } catch {
    // Graceful fallback
  }
}

export function fireVictoryCelebration() {
  try {
    const duration = 2500;
    const end = Date.now() + duration;

    const interval = setInterval(() => {
      if (Date.now() > end) {
        return clearInterval(interval);
      }

      confetti({
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
        colors: ['#FACC15', '#EC4899', '#3B82F6', '#10B981', '#8B5CF6'],
      });
    }, 250);
  } catch {
    // Graceful fallback
  }
}

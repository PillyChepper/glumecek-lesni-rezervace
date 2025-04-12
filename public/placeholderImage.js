
// This script creates a forest-themed placeholder image
// It will be loaded by the HTML file
window.createPlaceholderImage = function() {
  const canvas = document.createElement('canvas');
  canvas.width = 900;
  canvas.height = 600; // 3:2 aspect ratio
  
  const ctx = canvas.getContext('2d');
  
  // Sky gradient
  const skyGradient = ctx.createLinearGradient(0, 0, 0, 300);
  skyGradient.addColorStop(0, '#87CEEB');
  skyGradient.addColorStop(1, '#E0F7FF');
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, 900, 300);
  
  // Ground
  const groundGradient = ctx.createLinearGradient(0, 300, 0, 600);
  groundGradient.addColorStop(0, '#228B22');
  groundGradient.addColorStop(1, '#006400');
  ctx.fillStyle = groundGradient;
  ctx.fillRect(0, 300, 900, 300);
  
  // Trees in background
  ctx.fillStyle = '#004d00';
  for (let i = 0; i < 20; i++) {
    const x = Math.random() * 900;
    const height = 80 + Math.random() * 120;
    ctx.beginPath();
    ctx.moveTo(x, 300);
    ctx.lineTo(x - 25, 300);
    ctx.lineTo(x - 12.5, 300 - height);
    ctx.fill();
  }
  
  // Cottage
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(350, 320, 200, 120);
  
  // Roof
  ctx.fillStyle = '#8B0000';
  ctx.beginPath();
  ctx.moveTo(330, 320);
  ctx.lineTo(450, 240);
  ctx.lineTo(570, 320);
  ctx.fill();
  
  // Window
  ctx.fillStyle = '#87CEFA';
  ctx.fillRect(380, 350, 40, 40);
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 4;
  ctx.strokeRect(380, 350, 40, 40);
  
  // Door
  ctx.fillStyle = '#654321';
  ctx.fillRect(460, 380, 40, 60);
  ctx.fillStyle = '#DAA520';
  ctx.beginPath();
  ctx.arc(470, 410, 3, 0, Math.PI * 2);
  ctx.fill();
  
  // Path
  ctx.fillStyle = '#C2B280';
  ctx.beginPath();
  ctx.moveTo(480, 440);
  ctx.lineTo(470, 600);
  ctx.lineTo(510, 600);
  ctx.lineTo(500, 440);
  ctx.fill();
  
  // Convert to data URL
  return canvas.toDataURL('image/jpeg');
};

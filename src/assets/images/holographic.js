// Create a canvas to generate a holographic texture
const canvas = document.createElement('canvas');
canvas.width = 512;
canvas.height = 512;
const ctx = canvas.getContext('2d');

// Fill background
ctx.fillStyle = '#000';
ctx.fillRect(0, 0, 512, 512);

// Create grid pattern
ctx.strokeStyle = 'rgba(0, 243, 255, 0.3)';
ctx.lineWidth = 1;

// Horizontal lines
for (let y = 0; y < 512; y += 20) {
  ctx.beginPath();
  ctx.moveTo(0, y);
  ctx.lineTo(512, y);
  ctx.stroke();
}

// Vertical lines
for (let x = 0; x < 512; x += 20) {
  ctx.beginPath();
  ctx.moveTo(x, 0);
  ctx.lineTo(x, 512);
  ctx.stroke();
}

// Add some random dots
ctx.fillStyle = 'rgba(123, 47, 247, 0.5)';
for (let i = 0; i < 100; i++) {
  const x = Math.random() * 512;
  const y = Math.random() * 512;
  const size = Math.random() * 5 + 2;
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fill();
}

// Convert to data URL
const dataURL = canvas.toDataURL('image/png');

// Export the data URL
export default dataURL;

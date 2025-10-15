// Create a canvas to generate a glow texture
const canvas = document.createElement('canvas');
canvas.width = 256;
canvas.height = 256;
const ctx = canvas.getContext('2d');

// Create radial gradient
const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.3)');
gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

// Fill with gradient
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, 256, 256);

// Convert to data URL
const dataURL = canvas.toDataURL('image/png');

// Export the data URL
export default dataURL;

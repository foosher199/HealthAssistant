const sharp = require('sharp');
const fs = require('fs');

// 确保 images 目录存在
if (!fs.existsSync('images')) {
  fs.mkdirSync('images');
}

const sizes = [16, 32, 48, 128];

// SVG 内容
const svgContent = `
<svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
  <circle cx="64" cy="64" r="60" fill="#4CAF50"/>
  <path d="M64 20 C64 20, 40 60, 40 80 C40 97.673112, 50.326888 108, 64 108 C77.673112 108, 88 97.673112, 88 80 C88 60, 64 20, 64 20Z" fill="#2196F3"/>
  <line x1="64" y1="64" x2="64" y2="40" stroke="white" stroke-width="4" stroke-linecap="round"/>
  <line x1="64" y1="64" x2="80" y2="64" stroke="white" stroke-width="4" stroke-linecap="round"/>
  <circle cx="64" cy="64" r="3" fill="white"/>
</svg>
`;

// 为每个尺寸生成图标
sizes.forEach(size => {
  sharp(Buffer.from(svgContent))
    .resize(size, size)
    .toFile(`images/icon${size}.png`)
    .then(() => console.log(`Generated ${size}x${size} icon`))
    .catch(err => console.error(`Error generating ${size}x${size} icon:`, err));
}); 
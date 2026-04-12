const fs = require('fs');
const path = require('path');

const backendUrl = process.env.BACKEND_URL || 'http://localhost:8080';
const envFile = path.join(__dirname, 'src', 'environments', 'environment.production.ts');

let content = fs.readFileSync(envFile, 'utf8');
content = content.replace('BACKEND_URL_PLACEHOLDER', backendUrl.replace(/\/$/, ''));
fs.writeFileSync(envFile, content, 'utf8');

console.log(`✅ API URL set to: ${backendUrl}/api`);

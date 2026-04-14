const fs = require('fs');
let content = fs.readFileSync('src/components/admin/AdminPlanosContent.tsx', 'utf8');

// I also noticed I didn't add "permissions" to handleSave so let's verify handleSave
console.log(content.match(/const handleSave = async \(\) => {[\s\S]*?};/)[0]);

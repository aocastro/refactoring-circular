import fs from 'fs';
const file = 'src/components/admin/AdminBlockchainContent.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  '    </motion.div>\n  </div>\n);\n}',
  '    </motion.div>\n  </div>\n  );\n};'
);

fs.writeFileSync(file, content);
console.log("Patched AdminBlockchainContent.tsx again");

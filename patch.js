const fs = require('fs');

const file = 'src/components/dashboard/SubestoquesContent.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /const refreshSubStocks = async \(\) => \{\n    try \{\n      const res = await api.get\('\/api\/subestoques'\);\n      setSubStocks\(res\.data\);\n      if \(selectedStock\) \{\n        const updated = res\.data\.find\(\(s: SubStock\) => s\.id === selectedStock\.id\);\n        if \(updated\) setSelectedStock\(updated\);\n      \}\n    \} catch \(err\) \{\n      console\.error\(err\);\n    \}\n  \};/g,
  `const refreshSubStocks = async () => {
    try {
      const res = await api.get('/api/subestoques');
      setSubStocks(res.data);
      if (selectedStock) {
        const updated = res.data.find((s: SubStock) => s.id === selectedStock.id);
        if (updated) setSelectedStock(updated);
      }
    } catch (err) {
      console.error(err);
    }
  };`
);
fs.writeFileSync(file, content);

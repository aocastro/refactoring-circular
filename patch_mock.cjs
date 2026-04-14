const fs = require('fs');
let content = fs.readFileSync('src/api/mock.ts', 'utf8');

// The existing mock correctly spreads `...newPlan` which will automatically include the `permissions` array if sent by the client.
// Same for `...updatedPlan` in PUT.
// Let's just make sure there's a fallback for permissions if it's missing in new plan creation.

content = content.replace(
  "status: newPlan.status || 'ativo',",
  "status: newPlan.status || 'ativo',\n    permissions: newPlan.permissions || [],"
);

fs.writeFileSync('src/api/mock.ts', content);

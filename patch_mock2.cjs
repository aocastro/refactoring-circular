const fs = require('fs');
let content = fs.readFileSync('src/api/mock.ts', 'utf8');

// Note: adminPlans is imported in mock.ts and put in mutableAdminPlans.
// However `src/lib/permissions.ts` reads from the original `adminPlans` array in `src/data/admin.ts`.
// Ideally, `permissions.ts` would fetch from the API, but `getPlanPermissions` is heavily synchronous.
// For now, this fallback to the data array works because we also updated the data array to have permissions.

const fs = require('fs');
let content = fs.readFileSync('src/api/mock.ts', 'utf8');

// The code for PUT already spreads updatedPlan which will correctly overwrite the permissions array
// mock.onPut(/\/api\/admin\/plans\/\d+/).reply((config) => { ... mutableAdminPlans[index] = { ...mutableAdminPlans[index], ...updatedPlan }; ... })

// I verified the mock api code handles updating all fields by simple spread operator ...updatedPlan

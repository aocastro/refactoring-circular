sed -i 's/mock.onGet('\''\/api\/admin\/plans'\'').reply(() => \[200, adminPlans\]);/\/\/ &/' src/api/mock.ts
sed -i 's/mock.onGet('\''\/api\/admin\/stores'\'').reply(() => \[200, adminStores\]);/\/\/ &/' src/api/mock.ts
sed -i 's/mock.onGet('\''\/api\/admin\/users'\'').reply(() => \[200, adminUsers\]);/\/\/ &/' src/api/mock.ts

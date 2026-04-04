## 2024-03-XX - [Promise.all Data Fetching Optimization]
**Learning:** Found sequential independent API requests fetching dashboard metrics inside a `useEffect` creating a network waterfall bottleneck.
**Action:** Replaced sequential `await` calls with `Promise.all` inside `DashboardContent.tsx` fetching logic to execute the independent fetches concurrently, significantly reducing load times.

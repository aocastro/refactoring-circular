## 2025-04-06 - [Performance Optimization: Reduce Array Iterations]
**Learning:** Found an anti-pattern where multiple `O(n)` `.filter()` calls were used to compute different summary statistics (counts of different statuses) from the same list array (`mockProducts`). This resulted in redundant array traversals `O(kn)`.
**Action:** Replaced multiple `.filter()` calls with a single `O(n)` loop using `.reduce()` inside `useMemo` to compute multiple metrics simultaneously in a single pass over the data.
## 2024-03-XX - [Promise.all Data Fetching Optimization]
**Learning:** Found sequential independent API requests fetching dashboard metrics inside a `useEffect` creating a network waterfall bottleneck.
**Action:** Replaced sequential `await` calls with `Promise.all` inside `DashboardContent.tsx` fetching logic to execute the independent fetches concurrently, significantly reducing load times.

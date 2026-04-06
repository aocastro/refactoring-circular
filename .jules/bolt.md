## 2025-04-06 - [Performance Optimization: Reduce Array Iterations]
**Learning:** Found an anti-pattern where multiple `O(n)` `.filter()` calls were used to compute different summary statistics (counts of different statuses) from the same list array (`mockProducts`). This resulted in redundant array traversals `O(kn)`.
**Action:** Replaced multiple `.filter()` calls with a single `O(n)` loop using `.reduce()` inside `useMemo` to compute multiple metrics simultaneously in a single pass over the data.

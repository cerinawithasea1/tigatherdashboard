# Requirements
## Summary
A single-page dark-theme dashboard for monitoring a fleet of AI "sister" agents (Sage, River, Wisp, Cerina). It provides at-a-glance system health (CPU, RAM, Disk), per-agent status cards with color-coded left borders, and five navigation tabs (Home, Tasks, Library, Sessions, Connections). All content is rendered statically using mock data — no async JS fetches — so the full page content is present on first paint.

## Use cases
- Main Dashboard Shell
  1) Render the dark-themed single-page app with a top tab bar containing Home, Tasks, Library, Sessions, Connections
  2) Display the active tab content below the tab bar; default active tab is Home
  3) Show a placeholder panel ("Coming Soon") for Tasks, Library, Sessions, and Connections tabs

- Home Tab — System Health Bar
  1) At the top of the Home tab, render a health bar row with three metric cards: CPU usage (%), RAM usage (%), and Disk usage (%)
  2) Each metric shows a label, current value, and a visual progress bar filled proportionally to the value
  3) Color the bar green below 60%, yellow 60–80%, red above 80%
  4) Use static mock values (CPU 42%, RAM 67%, Disk 81%)

- Home Tab — AI Sister Status Cards
  1) Below the health bar, render a row/grid of four agent status cards
  2) Sage card: green left border, status Online, model GPT-4o, uptime 14d 3h
  3) River card: blue left border, status Online, model Claude 3.5, uptime 7d 11h
  4) Wisp card: purple left border, status Offline, model Gemini 1.5, uptime 0d 0h
  5) Cerina card: pink left border, status Online, model Mistral-Large, uptime 2d 8h
  6) Each card shows agent name, colored status badge (green dot = online, grey dot = offline), model name, and uptime

## Plan
### Main Dashboard Shell
1. [x] Create the top-level App component with a dark background (`bg-gray-950 text-gray-100 min-h-screen`)
2. [x] Build a `TabBar` component rendering five tabs: Home, Tasks, Library, Sessions, Connections; use `useState` for active tab tracking
3. [x] Style active tab with a bottom border highlight and brighter text; inactive tabs with muted text
4. [x] Render a `<main>` content area that switches rendered child based on active tab
5. [x] Create a `PlaceholderPanel` component displaying a centered "Coming Soon" message for Tasks, Library, Sessions, Connections tabs

### Home Tab — System Health Bar
1. [x] Create a `HealthBar` component that accepts `{ label, value, max }` props
2. [x] Render a labelled progress track; fill color: green (`bg-green-500`) for < 60, yellow (`bg-yellow-400`) for 60–80, red (`bg-red-500`) for > 80
3. [x] Compose three `HealthBar` instances inside a `SystemHealth` section with static mock data: CPU 42%, RAM 67%, Disk 81%
4. [x] Wrap section in a card-style container (`bg-gray-900 rounded-xl p-4`) with a section heading "System Health"

### Home Tab — AI Sister Status Cards
1. [x] Define a static `AGENTS` array with objects for Sage, River, Wisp, Cerina (name, borderColor, status, model, uptime)
2. [x] Create an `AgentCard` component: dark card background, colored left border via inline style or Tailwind arbitrary value, agent name as heading
3. [x] Show status badge: green pulsing dot + "Online" or grey dot + "Offline"
4. [x] Display model name and uptime as labelled rows inside the card
5. [x] Render cards in a responsive grid (`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4`) inside a "AI Sisters" section heading
6. [x] Compose `SystemHealth` and the agents grid inside a `HomeTab` component; render `HomeTab` when active tab is Home

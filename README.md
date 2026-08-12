# Task Manager

A simple vanilla JavaScript Task Manager app. Add, delete, and complete tasks, with data persisted in localStorage so your list survives a page refresh.

## Features
- Add a task
- Delete a task
- Mark a task as completed (with visual strikethrough)
- Live counter for total and completed tasks
- Data persistence via localStorage
- Responsive layout

### Bonus Features
- **Dark mode** — toggle button in the header, preference saved to localStorage
- **Edit a task** — click "Edit" to turn the task into an editable input, then "Save" or press Enter
- **Filter tasks** — "All" / "Pending" / "Completed" buttons above the list
- **Custom animations** — tasks slide/fade in when added and fade out when deleted

## How to Run
1. clone this folder.
2. Open `index.html` in your browser (no build step or server required).

## File Structure
- `index.html` — page structure
- `style.css` — styling and layout
- `script.js` — app logic (state, rendering, events, localStorage)

## How It Works
The app keeps one JavaScript array (`tasks`) as its single source of truth. Every action — adding, deleting, or toggling a task — updates this array, saves it to `localStorage`, then re-renders the entire list from the array. This keeps the UI and the underlying data always in sync.

## Suggested Git Commit History
```
git commit -m "initial project setup"
git commit -m "implement add task feature"
git commit -m "implement delete task feature"
git commit -m "implement task completion"
git commit -m "implement local storage"
```

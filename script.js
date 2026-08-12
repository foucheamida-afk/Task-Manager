// STEP 1: Grab references to the DOM elements we'll need

const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const taskCounter = document.getElementById('task-counter');
const themeToggle = document.getElementById('theme-toggle');       // BONUS
const filterButtons = document.querySelectorAll('.filter-btn');    // BONUS


// STEP 2: Our single source of truth — an array of task objects
// Each task looks like: { id, title, completed }

let tasks = [];

// BONUS: current filter — 'all' | 'pending' | 'completed'
let currentFilter = 'all';


// STEP 3: localStorage helpers — save and load

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
  const stored = localStorage.getItem('tasks');
  tasks = stored ? JSON.parse(stored) : [];
}


// STEP 4: Render function — rebuilds the DOM list from `tasks`
// This is called after every add/delete/toggle so the UI
// always matches the data.

// BONUS: track which task (if any) is currently being edited
let editingId = null;

function renderTasks() {
  // Clear the current list
  taskList.innerHTML = '';

  // BONUS: apply the active filter before rendering
  const visibleTasks = tasks.filter(task => {
    if (currentFilter === 'completed') return task.completed;
    if (currentFilter === 'pending') return !task.completed;
    return true; // 'all'
  });

  // Build one <li> per task using a template literal
  visibleTasks.forEach(({ id, title, completed }) => {
    const li = document.createElement('li');
    li.className = 'task-item' + (completed ? ' completed' : '');
    li.dataset.id = id;

    // BONUS: if this task is being edited, render an input instead of text
    const titleMarkup = (id === editingId)
      ? `<input type="text" class="edit-input" value="${title}" />`
      : `<span class="task-title">${title}</span>`;

    const actionButtons = (id === editingId)
      ? `<button class="save-btn">Save</button>`
      : `<button class="edit-btn">Edit</button><button class="delete-btn">Delete</button>`;

    li.innerHTML = `
      <div class="task-left">
        <input type="checkbox" class="toggle-checkbox" ${completed ? 'checked' : ''} />
        ${titleMarkup}
      </div>
      <div class="task-actions">${actionButtons}</div>
    `;

    taskList.appendChild(li);
  });

  updateCounter();
}


// STEP 5: Update the total / completed counter

function updateCounter() {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  taskCounter.textContent = `Total: ${total} | Completed: ${completed}`;
}


// STEP 6: Add a new task
function addTask() {
  const title = taskInput.value.trim();

  // Guard: don't add empty tasks
  if (title === '') return;

  const newTask = {
    id: Date.now(),      // simple unique id
    title,
    completed: false
  };

  tasks.push(newTask);
  taskInput.value = '';

  saveTasks();
  renderTasks();
}


// STEP 7: Delete a task by id

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}


// BONUS: Edit a task's title


// Enter edit mode for a given task id (re-renders that row as an input)
function startEdit(id) {
  editingId = id;
  renderTasks();

  // Focus the input and place the cursor at the end of the text
  const input = taskList.querySelector('.edit-input');
  if (input) {
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  }
}

// Save the new title typed into the edit input
function saveEdit(id, newTitle) {
  const trimmed = newTitle.trim();

  // Guard: don't allow saving an empty title
  if (trimmed === '') {
    editingId = null;
    renderTasks();
    return;
  }

  tasks = tasks.map(task =>
    task.id === id ? { ...task, title: trimmed } : task
  );

  editingId = null;
  saveTasks();
  renderTasks();
}

// =========================================================
// STEP 8: Toggle a task's completed state by id
// =========================================================
function toggleComplete(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  renderTasks();
}


// STEP 9: Event listeners


// Add task on button click
addBtn.addEventListener('click', addTask);

// Add task on Enter key
taskInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') addTask();
});

// STEP 9b: Event delegation for delete + toggle + edit + save
// The delete/edit buttons and checkboxes are created dynamically,
// so we listen on the parent <ul> and check what was clicked.
taskList.addEventListener('click', (event) => {
  const li = event.target.closest('.task-item');
  if (!li) return;

  const id = Number(li.dataset.id);

  if (event.target.classList.contains('delete-btn')) {
    // BONUS: play the fade-out animation before actually removing the task
    li.classList.add('removing');
    li.addEventListener('animationend', () => deleteTask(id), { once: true });
    return;
  }

  if (event.target.classList.contains('toggle-checkbox')) {
    toggleComplete(id);
  }

  // BONUS: enter edit mode
  if (event.target.classList.contains('edit-btn')) {
    startEdit(id);
  }

  // BONUS: save an edit
  if (event.target.classList.contains('save-btn')) {
    const input = li.querySelector('.edit-input');
    saveEdit(id, input.value);
  }
});

// BONUS: allow pressing Enter to save an edit while typing
taskList.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && event.target.classList.contains('edit-input')) {
    const li = event.target.closest('.task-item');
    const id = Number(li.dataset.id);
    saveEdit(id, event.target.value);
  }
});


// BONUS STEP: Filter buttons (All / Pending / Completed)
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    currentFilter = btn.dataset.filter;

    // Update the "active" styling on the buttons
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    renderTasks();
  });
});

// BONUS STEP: Dark mode toggle
// Preference is saved to localStorage so it persists too.

function applyTheme(theme) {
  if (theme === 'dark') {
    document.body.classList.add('dark');
    themeToggle.textContent = '☀️';
  } else {
    document.body.classList.remove('dark');
    themeToggle.textContent = '🌙';
  }
}

themeToggle.addEventListener('click', () => {
  const isDark = document.body.classList.contains('dark');
  const newTheme = isDark ? 'light' : 'dark';
  applyTheme(newTheme);
  localStorage.setItem('theme', newTheme);
});


// STEP 10: Initial load — run once when the page opens

loadTasks();
renderTasks();

// BONUS: restore saved theme preference on load
applyTheme(localStorage.getItem('theme') || 'light');

// =========================================================
// STEP 1: Grab references to the DOM elements we'll need
// =========================================================
const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const taskCounter = document.getElementById('task-counter');

// =========================================================
// STEP 2: Our single source of truth — an array of task objects
// Each task looks like: { id, title, completed }
// =========================================================
let tasks = [];

// =========================================================
// STEP 3: localStorage helpers — save and load
// =========================================================
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
  const stored = localStorage.getItem('tasks');
  tasks = stored ? JSON.parse(stored) : [];
}

// =========================================================
// STEP 4: Render function — rebuilds the DOM list from `tasks`
// This is called after every add/delete/toggle so the UI
// always matches the data.
// =========================================================
function renderTasks() {
  // Clear the current list
  taskList.innerHTML = '';

  // Build one <li> per task using a template literal
  tasks.forEach(({ id, title, completed }) => {
    const li = document.createElement('li');
    li.className = 'task-item' + (completed ? ' completed' : '');
    li.dataset.id = id;

    li.innerHTML = `
      <div class="task-left">
        <input type="checkbox" class="toggle-checkbox" ${completed ? 'checked' : ''} />
        <span class="task-title">${title}</span>
      </div>
      <button class="delete-btn">Delete</button>
    `;

    taskList.appendChild(li);
  });

  updateCounter();
}

// =========================================================
// STEP 5: Update the total / completed counter
// =========================================================
function updateCounter() {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  taskCounter.textContent = `Total: ${total} | Completed: ${completed}`;
}

// =========================================================
// STEP 6: Add a new task
// =========================================================
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

// =========================================================
// STEP 7: Delete a task by id
// =========================================================
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
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

// =========================================================
// STEP 9: Event listeners
// =========================================================

// Add task on button click
addBtn.addEventListener('click', addTask);

// Add task on Enter key
taskInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') addTask();
});

// STEP 9b: Event delegation for delete + toggle
// The delete buttons and checkboxes are created dynamically,
// so we listen on the parent <ul> and check what was clicked.
taskList.addEventListener('click', (event) => {
  const li = event.target.closest('.task-item');
  if (!li) return;

  const id = Number(li.dataset.id);

  if (event.target.classList.contains('delete-btn')) {
    deleteTask(id);
  }

  if (event.target.classList.contains('toggle-checkbox')) {
    toggleComplete(id);
  }
});

// =========================================================
// STEP 10: Initial load — run once when the page opens
// =========================================================
loadTasks();
renderTasks();

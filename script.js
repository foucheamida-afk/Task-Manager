
const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const taskCounter = document.getElementById('task-counter');
const themeToggle = document.getElementById('theme-toggle');       
const filterButtons = document.querySelectorAll('.filter-btn');    


let tasks = [];


function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
  const stored = localStorage.getItem('tasks');
  tasks = stored ? JSON.parse(stored) : [];
}


let editingId = null;

function renderTasks() {

  taskList.innerHTML = '';

 
  const visibleTasks = tasks.filter(task => {
    if (currentFilter === 'completed') return task.completed;
    if (currentFilter === 'pending') return !task.completed;
    return true; // 'all'
  });

 
  visibleTasks.forEach(({ id, title, completed }) => {
    const li = document.createElement('li');
    li.className = 'task-item' + (completed ? ' completed' : '');
    li.dataset.id = id;

   
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


function updateCounter() {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  taskCounter.textContent = `Total: ${total} | Completed: ${completed}`;
}


function addTask() {
  const title = taskInput.value.trim();


  if (title === '') return;

  const newTask = {
    id: Date.now(),     
    title,
    completed: false
  };

  tasks.push(newTask);
  taskInput.value = '';

  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

function updateCounter() {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  taskCounter.textContent = `Total: ${total} | Completed: ${completed}`;
}




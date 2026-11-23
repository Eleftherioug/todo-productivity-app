const STORAGE_KEY = 'daymark.tasks.v1';
const taskList = document.querySelector('#task-list');
const form = document.querySelector('#task-form');
const titleInput = document.querySelector('#task-title');
const dueInput = document.querySelector('#task-due');
const emptyState = document.querySelector('#empty-state');
const filters = document.querySelector('.filters');
let selectedFilter = 'all';
let tasks = loadTasks();

function loadTasks() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(value) ? value.filter(task => task && typeof task.id === 'string' && typeof task.title === 'string') : [];
  } catch { return []; }
}

function saveTasks() { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); }
function formatDate(value) {
  if (!value) return '';
  const date = new Date(`${value}T12:00:00`);
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(date);
}

function render() {
  taskList.replaceChildren();
  const visible = tasks.filter(task => selectedFilter === 'all' || (selectedFilter === 'active' ? !task.done : task.done));
  emptyState.hidden = visible.length > 0;
  emptyState.textContent = tasks.length === 0 ? 'Nothing here yet. Add a task to get started.' : 'No tasks in this view.';
  visible.forEach(task => {
    const item = document.createElement('li');
    item.className = `task-item${task.done ? ' done' : ''}`;
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox'; checkbox.className = 'task-check'; checkbox.checked = Boolean(task.done);
    checkbox.setAttribute('aria-label', `Mark ${task.title} ${task.done ? 'active' : 'completed'}`);
    checkbox.addEventListener('change', () => updateTask(task.id, { done: checkbox.checked }));
    const text = document.createElement('span'); text.className = 'task-text'; text.textContent = task.title;
    item.append(checkbox, text);
    if (task.due) {
      const due = document.createElement('time'); due.className = 'due-date'; due.dateTime = task.due; due.textContent = formatDate(task.due);
      if (!task.done && task.due < new Date().toISOString().slice(0, 10)) due.classList.add('overdue');
      item.append(due);
    }
    const actions = document.createElement('span'); actions.className = 'task-actions';
    const edit = document.createElement('button'); edit.type = 'button'; edit.className = 'icon-button'; edit.textContent = 'Edit'; edit.setAttribute('aria-label', `Edit ${task.title}`);
    edit.addEventListener('click', () => editTask(task));
    const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'icon-button'; remove.textContent = 'Delete'; remove.setAttribute('aria-label', `Delete ${task.title}`);
    remove.addEventListener('click', () => { tasks = tasks.filter(entry => entry.id !== task.id); saveTasks(); render(); });
    actions.append(edit, remove); item.append(actions); taskList.append(item);
  });
  const completed = tasks.filter(task => task.done).length;
  const active = tasks.length - completed;
  document.querySelector('#open-count').textContent = active;
  document.querySelector('#completed-count').textContent = `${completed} completed`;
  const percent = tasks.length ? Math.round(completed / tasks.length * 100) : 0;
  const progress = document.querySelector('#progress'); progress.setAttribute('aria-valuenow', percent); progress.firstElementChild.style.width = `${percent}%`;
}

function updateTask(id, changes) {
  tasks = tasks.map(task => task.id === id ? { ...task, ...changes } : task);
  saveTasks(); render();
}

function editTask(task) {
  const title = window.prompt('Edit task', task.title);
  if (title === null) return;
  const cleanTitle = title.trim();
  if (!cleanTitle) { titleInput.focus(); return; }
  updateTask(task.id, { title: cleanTitle.slice(0, 120) });
}

form.addEventListener('submit', event => {
  event.preventDefault();
  const title = titleInput.value.trim();
  if (!title) return;
  tasks.unshift({ id: crypto.randomUUID(), title: title.slice(0, 120), due: dueInput.value, done: false, createdAt: new Date().toISOString() });
  saveTasks(); form.reset(); selectedFilter = 'all';
  filters.querySelectorAll('button').forEach(button => { const active = button.dataset.filter === selectedFilter; button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active)); });
  render(); titleInput.focus();
});

filters.addEventListener('click', event => {
  const button = event.target.closest('button[data-filter]');
  if (!button) return;
  selectedFilter = button.dataset.filter;
  filters.querySelectorAll('button').forEach(filter => { const active = filter === button; filter.classList.toggle('active', active); filter.setAttribute('aria-pressed', String(active)); });
  render();
});

document.querySelector('#today-label').textContent = new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date());
render();

// DOM Elements
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const filters = document.querySelectorAll(".filters button");
const taskCounter = document.getElementById("taskCounter");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");

// State
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// Save tasks to Local Storage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Generate unique ID
function generateId() {
  return Date.now();
}

// Add Task
function addTask() {
  const text = taskInput.value.trim();
  if (text === "") return;

  const task = {
    id: generateId(),
    text,
    completed: false
  };

  tasks.push(task);
  saveTasks();
  taskInput.value = "";
  renderTasks();
}

// Toggle Complete
function toggleTask(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  renderTasks();
}

// Delete Task
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

// Edit Task
function editTask(id, span) {
  const newText = prompt("Edit task:", span.textContent);
  if (newText === null || newText.trim() === "") return;

  tasks = tasks.map(task =>
    task.id === id ? { ...task, text: newText.trim() } : task
  );
  saveTasks();
  renderTasks();
}

// Filter Tasks
function getFilteredTasks() {
  if (currentFilter === "active") {
    return tasks.filter(task => !task.completed);
  }
  if (currentFilter === "completed") {
    return tasks.filter(task => task.completed);
  }
  return tasks;
}

// ✅ Render Tasks with COMPLETED button
function renderTasks() {
  taskList.innerHTML = "";

  const filteredTasks = getFilteredTasks();

  filteredTasks.forEach(task => {
    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";

    // Task text
    const span = document.createElement("span");
    span.textContent = task.text;

    // Action buttons
    const actions = document.createElement("div");
    actions.className = "task-actions";

    // ✅ Completed / Active button
    const completeBtn = document.createElement("button");
    completeBtn.textContent = task.completed ? "Active" : "Completed";
    completeBtn.onclick = () => toggleTask(task.id);

    // Edit button
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.onclick = () => editTask(task.id, span);

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = () => deleteTask(task.id);

    actions.append(completeBtn, editBtn, deleteBtn);

    li.append(span, actions);
    taskList.appendChild(li);
  });

  updateCounter();
}

// Update Task Counter
function updateCounter() {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  const remaining = total - completed;

  taskCounter.textContent = `Total: ${total} | Completed: ${completed} | Remaining: ${remaining}`;
}

// Clear Completed Tasks
clearCompletedBtn.addEventListener("click", () => {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  renderTasks();
});

// Filter Buttons
filters.forEach(button => {
  button.addEventListener("click", () => {
    filters.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    currentFilter = button.dataset.filter;
    renderTasks();
  });
});

// Events
addTaskBtn.addEventListener("click", addTask);
taskInput.addEventListener("keydown", e => {
  if (e.key === "Enter") addTask();
});

// Initial render
renderTasks();

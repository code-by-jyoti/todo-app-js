const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

// Array to store tasks
let tasks = [];

// Render function
function renderTasks() {
    taskList.innerHTML = "";

    tasks.forEach(task => {
        const li = document.createElement("li");
        li.textContent = task;
        taskList.appendChild(li);
    });
}

// Add Task Function
function addTask() {
    const text = taskInput.value.trim();

    // Prevent empty input
    if (!text) {
        alert("Enter task!");
        return;
    }

    // Add to array
    tasks.push(text);

    // Clear input field
    taskInput.value = "";

    // Trigger render function to update UI
    renderTasks();
}

// Button click
addTaskBtn.addEventListener("click", addTask);
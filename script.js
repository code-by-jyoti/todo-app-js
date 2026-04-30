const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

// Array to store tasks
let tasks = [];

// Render function
function renderTasks() {
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
        // Create list item
        const li = document.createElement("li");

        // Create task text
        const span = document.createElement("li");
        span.textContent = task;

        // Create delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.addEventListener("click", () => {
            tasks.splice(index, 1);
            renderTasks();
        })

        li.appendChild(span);
        li.appendChild(deleteBtn);
        
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
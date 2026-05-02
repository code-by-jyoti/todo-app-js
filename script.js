const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const importantCheck = document.getElementById("importantCheck");
const dueDateInput = document.getElementById("dueDateInput");

const totalCount = document.getElementById("totalCount");
const completedCount = document.getElementById("completedCount");
const pendingCount = document.getElementById("pendingCount");
const importantCount = document.getElementById("importantCount");

// Array to store tasks
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// --- Save Tasks To Local Storage ---
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// --- UPDATE COUNTERS ---
function updateCounters() {
    totalCount.textContent = tasks.length;
    completedCount.textContent = tasks.filter(t => t.completed).length;
    pendingCount.textContent = tasks.filter(t => !t.completed).length;
    importantCount.textContent = tasks.filter(t => t.important).length;
}

// Render function
function renderTasks() {
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
        // Create list item
        const li = document.createElement("li");

        li.classList.toggle("important", task.important);
        li.classList.toggle("completed", task.completed);

        /* ---------------- CHECKBOX ---------------- */
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", () => {
            task.completed = checkbox.checked;

            saveTasks();
            renderTasks();
            updateCounters();
        });

        // Create task text
        const span = document.createElement("span");
        span.textContent = task;

        /* ---- DUE DATE ---- */
        const date = document.createElement("small");
        if (task.dueDate) {
            date.textContent = "📅 Due: " + new Date(task.dueDate).toDateString();
        }
        else {
            date.textContent = "";
        }

        // Edit button
        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.className = "edit-btn";

        editBtn.addEventListener("click", () => {
            const input = document.createElement("input");
            input.value = task.text;
            input.className = "edit-input";

            span.replaceWith(input);
            input.focus();

            input.addEventListener("blur", () => {
                const value = input.value.trim();
                if (value) {
                task.text = value;
                }

                saveTasks();
                renderTasks();
            });
        })

        // Create delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";

        deleteBtn.addEventListener("click", () => {
            tasks.splice(index, 1);

            // Save updated tasks
            saveTasks();
            renderTasks();
            updateCounters();
        })

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(date);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);
        
        taskList.appendChild(li);
    });
    updateCounters();
}

// Add Task Function
function addTask() {
    const text = taskInput.value.trim();

    // Prevent empty input
    if (!text) {
        alert("Enter task!");
        return;
    }

    // Create task object
    const task = {
        id: Date.now(),
        text,
        completed: false,
        important: importantCheck.checked,
        dueDate: dueDateInput.value || ""
    };

    // Add to array
    tasks.push(text);

    // Save tasks
    saveTasks();
    
    // Clear input field
    taskInput.value = "";
    importantCheck.checked = false;
    dueDateInput.value = "";

    // Trigger render function to update UI
    renderTasks();
}

// Button click
addTaskBtn.addEventListener("click", addTask);

// Initital render on page load
renderTasks();
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const importantCheck = document.getElementById("importantCheck");
const dueDateInput = document.getElementById("dueDateInput");
const filterBtns = document.querySelectorAll(".filter-btn");

const sortSelect = document.getElementById("sortSelect");

const totalCount = document.getElementById("totalCount");
const completedCount = document.getElementById("completedCount");
const pendingCount = document.getElementById("pendingCount");
const importantCount = document.getElementById("importantCount");

// Array to store tasks
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";
let draggedTaskId = null;

// --- Save Tasks To Local Storage ---
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// --- SHOW FLOATING ICON ---
function showFloatingIcon(icon, element) {
    const rect = element.getBoundingClientRect();
    const span = document.createElement("span");
    span.className = "floating-icon";
    span.textContent = icon;
    span.style.left = rect.left + rect.width / 2 + "px";
    span.style.top = rect.top + "px";
    document.body.appendChild(span);
    setTimeout(() => document.body.removeChild(span), 1000);
}

// --- UPDATE COUNTERS ---
function updateCounters() {
    totalCount.textContent = tasks.length;
    completedCount.textContent = tasks.filter(t => t.completed).length;
    pendingCount.textContent = tasks.filter(t => !t.completed).length;
    importantCount.textContent = tasks.filter(t => t.important).length;
}

/* ---------------- SORT ---------------- */
function sortTasks(list) {
    const type = sortSelect.value;
    let sorted = [...list];

    if (type === "az") {
        return sorted.sort((a, b) => a.text.localeCompare(b.text));
    }
    if (type === "za") {
        return sorted.sort((a, b) => b.text.localeCompare(a.text));
    }
    if (type === "date") {
        return sorted.sort(
            (a, b) => new Date(a.dueDate || 0) - new Date(b.dueDate || 0)
        );
    }
    if (type === "important") {
        return sorted.sort((a, b) => b.important - a.important);
    }

    return sorted;
}

// Render function
function renderTasks() {
    taskList.innerHTML = "";

    let filteredTasks = tasks.filter(task => {
        if (currentFilter === "all") return true;
        if (currentFilter === "completed") return task.completed;
        if (currentFilter === "pending") return !task.completed;
        if (currentFilter === "important") return task.important;
    });

    filteredTasks = sortTasks(filteredTasks);

    filteredTasks.forEach(task => {
        // Create list item
        const li = document.createElement("li");

        li.classList.toggle("important", task.important);
        li.classList.toggle("completed", task.completed);

        /* --------- DRAG START --------*/
        li.draggable = true;

        li.addEventListener("dragstart", () => {
            draggedTaskId = task.id;
        });

        li.addEventListener("dragover", (e) => {
            e.preventDefault();
        });

        li.addEventListener("drop", () => {
            const draggedIndex = tasks.findIndex(t => t.id === draggedTaskId);
            const targetIndex = tasks.findIndex(t => t.id === task.id);
            if (draggedIndex === -1 || targetIndex === -1) return;

            const temp = tasks[draggedIndex];
            tasks.splice(draggedIndex, 1);
            tasks.splice(targetIndex, 0, temp);

            saveTasks();
            renderTasks();
        });

        /* ---------------- CHECKBOX ---------------- */
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.tabIndex = 0;
        checkbox.checked = task.completed;

        // accessibility 
        checkbox.setAttribute("aria-label", "Mark task as Completed");

        checkbox.addEventListener("change", () => {
            task.completed = checkbox.checked;

            saveTasks();
            renderTasks();
            updateCounters();
        
            showFloatingIcon("✓", li);
        });

        // Create task text
        const span = document.createElement("span");
        span.textContent = task.text;

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
        editBtn.setAttribute("aria-label", "Edit task");
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
        });

        // Create delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.setAttribute("aria-label", "DeleteTask");
        deleteBtn.className = "delete-btn";

        deleteBtn.addEventListener("click", () => {
            tasks = tasks.filter(t => t.id !== task.id);

            // Save updated tasks
            saveTasks();
            renderTasks();
        });

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(date);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);

        taskList.appendChild(li);
    });

    //EMPTY STATE CHECK
    const emptyMsg = document.getElementById("emptyMsg");
    if (filteredTasks.length === 0) {
        emptyMsg.style.display = "block";
    }
    else {
        emptyMsg.style.display = "none";
    }

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
    tasks.push(task);

    // Clear input field
    taskInput.value = "";
    importantCheck.checked = false;
    dueDateInput.value = "";

    // Save tasks
    saveTasks();

    // Trigger render function to update UI
    renderTasks();

    if (task.important) showFloatingIcon("★", taskInput);
}

// --- THEME SWITCHER ---
themeSelect.addEventListener("change", () => {
    document.body.classList.remove("theme-dark", "theme-neon");
    if (themeSelect.value !== "default") {
        document.body.classList.add("theme-" + themeSelect.value);
    }
});

// --- FILTER BUTTONS ---
filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});

/* ---------------- SORT ---------------- */
sortSelect.addEventListener("change", renderTasks);

// --- EVENT LISTENERS ---
addTaskBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", e => {
    if (e.key === "Enter") addTask();
});

// Initital render on page load
renderTasks();
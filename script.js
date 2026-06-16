const taskInput = document.getElementById("taskInput");
const category = document.getElementById("category");
const priority = document.getElementById("priority");
const dueDate = document.getElementById("dueDate");
const addTaskBtn = document.getElementById("addTaskBtn");

const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

const progressFill = document.getElementById("progressFill");
const progressPercent = document.getElementById("progressPercent");

const themeBtn = document.getElementById("themeBtn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

/* -----------------------------
   Save Tasks
----------------------------- */
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* -----------------------------
   Stats
----------------------------- */
function updateStats() {

    const total = tasks.length;

    const completed = tasks.filter(
        task => task.completed
    ).length;

    const pending = total - completed;

    totalTasks.textContent = total;
    completedTasks.textContent = completed;
    pendingTasks.textContent = pending;

    const percent =
        total === 0
        ? 0
        : Math.round((completed / total) * 100);

    progressFill.style.width = percent + "%";
    progressPercent.textContent = percent + "%";
}

/* -----------------------------
   Render Tasks
----------------------------- */
function renderTasks(filteredTasks = tasks) {

    taskList.innerHTML = "";

    filteredTasks.forEach((task, index) => {

        const li = document.createElement("li");

        li.className =
            task.completed
            ? "task completed"
            : "task";

        li.innerHTML = `
            <div class="task-left">

                <div class="task-title">
                    ${task.text}
                </div>

                <div class="task-info">

                    <span class="badge ${task.priority.toLowerCase()}">
                        ${task.priority}
                    </span>

                    <span>
                        📂 ${task.category}
                    </span>

                    <span>
                        📅 ${task.dueDate || "No Date"}
                    </span>

                </div>

            </div>

            <div class="task-actions">

                <button class="complete-btn">
                    ${
                        task.completed
                        ? "Undo"
                        : "Done"
                    }
                </button>

                <button class="edit-btn">
                    Edit
                </button>

                <button class="delete-btn">
                    Delete
                </button>

            </div>
        `;

        const completeBtn =
            li.querySelector(".complete-btn");

        const editBtn =
            li.querySelector(".edit-btn");

        const deleteBtn =
            li.querySelector(".delete-btn");

        completeBtn.addEventListener("click", () => {
            task.completed = !task.completed;
            saveTasks();
            renderTasks();
            updateStats();
        });

        editBtn.addEventListener("click", () => {

            const newText = prompt(
                "Edit Task",
                task.text
            );

            if (
                newText &&
                newText.trim() !== ""
            ) {
                task.text = newText.trim();

                saveTasks();
                renderTasks();
            }
        });

        deleteBtn.addEventListener("click", () => {

            if (
                confirm(
                    "Delete this task?"
                )
            ) {

                tasks.splice(index, 1);

                saveTasks();
                renderTasks();
                updateStats();
            }
        });

        taskList.appendChild(li);
    });

    updateStats();
}

/* -----------------------------
   Add Task
----------------------------- */
addTaskBtn.addEventListener("click", () => {

    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task");
        return;
    }

    const task = {
        text: text,
        category: category.value,
        priority: priority.value,
        dueDate: dueDate.value,
        completed: false
    };

    tasks.push(task);

    saveTasks();
    renderTasks();

    taskInput.value = "";
    dueDate.value = "";
});

/* -----------------------------
   Search
----------------------------- */
searchInput.addEventListener("input", () => {

    const keyword =
        searchInput.value.toLowerCase();

    const filtered = tasks.filter(task =>
        task.text
            .toLowerCase()
            .includes(keyword)
    );

    renderTasks(filtered);
});

/* -----------------------------
   Theme
----------------------------- */
const savedTheme =
    localStorage.getItem("theme");

if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeBtn.innerHTML =
        '<i class="fa-solid fa-sun"></i>';
}

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if (
        document.body.classList.contains("dark")
    ) {

        localStorage.setItem(
            "theme",
            "dark"
        );

        themeBtn.innerHTML =
            '<i class="fa-solid fa-sun"></i>';

    } else {

        localStorage.setItem(
            "theme",
            "light"
        );

        themeBtn.innerHTML =
            '<i class="fa-solid fa-moon"></i>';
    }
});

/* -----------------------------
   Enter Key Support
----------------------------- */
taskInput.addEventListener("keypress", e => {

    if (e.key === "Enter") {
        addTaskBtn.click();
    }
});

/* -----------------------------
   Initial Load
----------------------------- */
renderTasks();
updateStats();
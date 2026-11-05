
const API_URL = "https://jsonplaceholder.typicode.com/todos?_limit=15";
const POST_URL = "https://jsonplaceholder.typicode.com/todos";

const todoList = document.getElementById("todoList");
const loading = document.getElementById("loading");
const errorMessage = document.getElementById("error");
const emptyMessage = document.getElementById("emptyMessage");
const taskCount = document.getElementById("taskCount");

const todoForm = document.getElementById("todoForm");
const taskInput = document.getElementById("taskInput");
const addButton = document.getElementById("addButton");
const formMessage = document.getElementById("formMessage");

const filterButtons = document.querySelectorAll(".filter-btn");

let todos = [];
let currentFilter = "all";

// Mengambil data tugas dari API
async function getTodos() {
    loading.classList.remove("hidden");
    errorMessage.classList.add("hidden");
    todoList.innerHTML = "";

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Gagal mengambil data tugas.");
        }

        todos = await response.json();

        showTodos();

    } catch (error) {
        errorMessage.classList.remove("hidden");
        console.error(error);

    } finally {
        loading.classList.add("hidden");
    }
}

// Menampilkan daftar tugas
function showTodos() {
    todoList.innerHTML = "";

    let filteredTodos = todos;

    if (currentFilter === "done") {
        filteredTodos = todos.filter(function(todo) {
            return todo.completed === true;
        });

    } else if (currentFilter === "undone") {
        filteredTodos = todos.filter(function(todo) {
            return todo.completed === false;
        });
    }

    taskCount.textContent = filteredTodos.length + " tugas";

    emptyMessage.classList.toggle(
        "hidden",
        filteredTodos.length !== 0
    );

    filteredTodos.forEach(function(todo) {
        const li = document.createElement("li");

        li.className = "todo-item";

        if (todo.completed) {
            li.classList.add("done");
        }

        const title = document.createElement("p");
        title.className = "todo-title";
        title.textContent = todo.title;

        const status = document.createElement("span");
        status.className = "status";

        status.textContent = todo.completed
            ? "Selesai"
            : "Belum Selesai";

        li.appendChild(title);
        li.appendChild(status);

        todoList.appendChild(li);
    });
}

// Filter tugas
filterButtons.forEach(function(button) {
    button.addEventListener("click", function() {

        filterButtons.forEach(function(item) {
            item.classList.remove("active");
        });

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        showTodos();
    });
});

// Menambahkan tugas baru menggunakan POST
todoForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const newTitle = taskInput.value.trim();

    if (newTitle === "") {
        formMessage.textContent =
            "Nama tugas tidak boleh kosong.";

        formMessage.classList.add("error");
        return;
    }

    addButton.disabled = true;
    addButton.textContent = "Mengirim...";

    formMessage.textContent = "";
    formMessage.classList.remove("error");

    try {
        const response = await fetch(POST_URL, {
            method: "POST",

            body: JSON.stringify({
                title: newTitle,
                completed: false,
                userId: 1
            }),

            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });

        if (!response.ok) {
            throw new Error("Gagal menambahkan tugas.");
        }

        const newTodo = await response.json();

        // Menambahkan tugas ke daftar lokal
        todos.unshift({
            id: newTodo.id,
            title: newTodo.title,
            completed: newTodo.completed
        });

        currentFilter = "all";

        filterButtons.forEach(function(item) {
            item.classList.toggle(
                "active",
                item.dataset.filter === "all"
            );
        });

        showTodos();

        taskInput.value = "";

        formMessage.textContent =
            "Tugas berhasil ditambahkan!";

    } catch (error) {
        formMessage.textContent =
            "Gagal menambahkan tugas. Coba lagi.";

        formMessage.classList.add("error");

        console.error(error);

    } finally {
        addButton.disabled = false;
        addButton.textContent = "+ Tambah Tugas";
    }
});

// Menjalankan fungsi saat halaman dibuka
getTodos();

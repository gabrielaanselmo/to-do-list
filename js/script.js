const inputField = document.querySelector(".input-field textarea"),
  todoLists = document.querySelector(".todoLists"),
  pendingNum = document.querySelector(".pending-num"),
  clearButton = document.querySelector(".clear-button");

// Função para carregar tarefas do armazenamento local ao carregar a página
function loadTasks() {
  const savedTasks = localStorage.getItem("tasks");
  if (savedTasks) {
    todoLists.innerHTML = savedTasks;
    allTasks();
  }
}

function saveTasks() {
  const tasksHTML = todoLists.innerHTML;
  localStorage.setItem("tasks", tasksHTML);
}

window.addEventListener("load", loadTasks);

todoLists.addEventListener("DOMNodeInserted", saveTasks);
todoLists.addEventListener("DOMNodeRemoved", saveTasks);

function allTasks() {
  let tasks = document.querySelectorAll(".pending");

  pendingNum.textContent = tasks.length === 0 ? "não" : tasks.length;

  let allLists = document.querySelectorAll(".list");
  if (allLists.length > 0) {
    todoLists.style.marginTop = "20px";
    clearButton.style.pointerEvents = "auto";
    return;
  }
  todoLists.style.marginTop = "0px";
  clearButton.style.pointerEvents = "none";
}

inputField.addEventListener("keyup", (e) => {
  let inputVal = inputField.value.trim();

  if (e.key === "Enter" && inputVal.length > 0) {
    let liTag = ` <li class="list pending" onclick="handleStatus(this)">
          <input type="checkbox" />
          <span class="task">${inputVal}</span>
          <i class="uil uil-trash" onclick="deleteTask(this)"></i>
        </li>`;

    todoLists.insertAdjacentHTML("beforeend", liTag);
    inputField.value = "";
    allTasks();
    saveTasks(); // Salve as tarefas após adicionar uma nova
  }
});

function handleStatus(e) {
  const checkbox = e.querySelector("input");
  checkbox.checked = checkbox.checked ? false : true;
  e.classList.toggle("pending");
  allTasks();
}

function deleteTask(e) {
  e.parentElement.remove();
  allTasks();
}

clearButton.addEventListener("click", () => {
  todoLists.innerHTML = "";
  allTasks();
});

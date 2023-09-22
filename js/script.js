// Seleção de elementos HTML
const inputField = document.querySelector(".input-field textarea"),
  todoLists = document.querySelector(".todoLists"),
  pendingNum = document.querySelector(".pending-num"),
  clearButton = document.querySelector(".clear-button");

// Função para carregar tarefas do armazenamento local ao carregar a página
function loadTasks() {
  const savedTasks = JSON.parse(localStorage.getItem("tasks"));
  if (savedTasks) {
    // Define o conteúdo das tarefas carregadas na lista de tarefas
    todoLists.innerHTML = savedTasks.tasksHTML;

    // Carrega tarefas concluídas e remove tarefas excluídas da lista
    const completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || [];
    completedTasks.forEach((taskId) => {
      const taskToComplete = document.querySelector(`[data-task-id="${taskId}"]`);
      if (taskToComplete) {
        // Marca tarefas como concluídas
        taskToComplete.classList.remove("pending");
        taskToComplete.querySelector("input[type='checkbox']").checked = true;
      }
    });

    const deletedTasks = JSON.parse(localStorage.getItem("deletedTasks")) || [];
    deletedTasks.forEach((taskId) => {
      const taskToRemove = document.querySelector(`[data-task-id="${taskId}"]`);
      if (taskToRemove) {
        // Remove tarefas excluídas da lista
        taskToRemove.remove();
      }
    });

    // Atualiza o contador de tarefas pendentes
    allTasks();
  }
}

// Função para salvar tarefas no armazenamento local
function saveTasks() {
  // Obtém o HTML da lista de tarefas e o salva no armazenamento local
  const tasksHTML = todoLists.innerHTML;
  localStorage.setItem("tasks", JSON.stringify({ tasksHTML }));
}

// Função para salvar tarefas concluídas no armazenamento local
function saveCompletedTasks(taskId) {
  // Obtém a lista de tarefas concluídas do armazenamento local e adiciona a tarefa atual
  const completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || [];
  completedTasks.push(taskId);
  localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
}

// Função para salvar tarefas excluídas no armazenamento local
function saveDeletedTasks(taskId) {
  // Obtém a lista de tarefas excluídas do armazenamento local e adiciona a tarefa atual
  const deletedTasks = JSON.parse(localStorage.getItem("deletedTasks")) || [];
  deletedTasks.push(taskId);
  localStorage.setItem("deletedTasks", JSON.stringify(deletedTasks));
}

window.addEventListener("load", loadTasks);

// Adicione um ouvinte de evento para salvar tarefas sempre que uma tarefa for adicionada ou removida
todoLists.addEventListener("DOMNodeInserted", saveTasks);
todoLists.addEventListener("DOMNodeRemoved", (event) => {
  if (event.target.classList.contains("list")) {
    const taskId = event.target.getAttribute("data-task-id");
    saveDeletedTasks(taskId);
    saveTasks();
  }
});

// Função para atualizar o estado das tarefas
function allTasks() {
  let tasks = document.querySelectorAll(".pending");
  pendingNum.textContent = tasks.length === 0 ? "não" : tasks.length;
  let allLists = document.querySelectorAll(".list");
  if (allLists.length > 0) {
    // Se houver tarefas, ajusta o estilo do container e habilita o botão de limpar
    todoLists.style.marginTop = "20px";
    clearButton.style.pointerEvents = "auto";
    return;
  }
  // Caso contrário, remove o estilo e desabilita o botão de limpar
  todoLists.style.marginTop = "0px";
  clearButton.style.pointerEvents = "none";
}

inputField.addEventListener("keyup", (e) => {
  let inputVal = inputField.value.trim();
  if (e.key === "Enter" && inputVal.length > 0) {
    const taskId = Date.now();
    let liTag = ` <li class="list pending" data-task-id="${taskId}" onclick="handleStatus(this)">
          <input type="checkbox" />
          <span class="task">${inputVal}</span>
          <i class="uil uil-trash" onclick="deleteTask(this)"></i>
        </li>`;
    todoLists.insertAdjacentHTML("beforeend", liTag);
    inputField.value = "";
    allTasks();
    saveTasks(); // Salva as tarefas após adicionar uma nova
  }
});

// Função para alternar o status de uma tarefa entre pendente e concluída
function handleStatus(e) {
  const checkbox = e.querySelector("input");
  checkbox.checked = checkbox.checked ? false : true;
  e.classList.toggle("pending");
  allTasks();
  const taskId = e.getAttribute("data-task-id");
  if (e.classList.contains("pending")) {
    // Tarefa voltou a ser pendente, então removemos da lista de tarefas concluídas
    removeCompletedTask(taskId);
  } else {
    saveCompletedTasks(taskId);
  }
  saveTasks();
}

// Função para excluir uma tarefa
function deleteTask(e) {
  const taskId = e.parentElement.getAttribute("data-task-id");
  saveDeletedTasks(taskId);
  e.parentElement.remove();
  allTasks();
  saveTasks();
}

// Função para remover uma tarefa da lista de tarefas concluídas
function removeCompletedTask(taskId) {
  const completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || [];
  const index = completedTasks.indexOf(taskId);
  if (index !== -1) {
    completedTasks.splice(index, 1);
    localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
  }
}

// Event listener para limpar todas as tarefas
clearButton.addEventListener("click", () => {
  todoLists.innerHTML = "";
  allTasks();
  // Limpar todas as tarefas do armazenamento local
  localStorage.removeItem("completedTasks");
  localStorage.removeItem("deletedTasks");
  saveTasks();
});

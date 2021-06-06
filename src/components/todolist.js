import PubSub from "pubsub-js";

const section = document.createElement("section");
const header = document.createElement("header");
const h1 = document.createElement("h1");
const addButton = document.createElement("button");
const list = document.createElement("ul");
const form = document.createElement("form");
const titleText = document.createElement("input");
const calender = document.createElement("input");
const descText = document.createElement("textarea");
const low = document.createElement("option");
const mid = document.createElement("option");
const high = document.createElement("option");
const priority = document.createElement("select");
const project = document.createElement("select");
const saveButton = document.createElement("button");
const cancelButton = document.createElement("button");

function generateTodoList() {
  section.className = "content";
  addButton.textContent = "New Todo";
  addButton.className = "btn-add";
  addButton.addEventListener("click", showAddToDoDialog);
  header.append(h1, addButton, form);

  titleText.type = "text";
  titleText.placeholder = "Title";
  titleText.id = "todo-title";

  descText.placeholder = "Description";
  descText.id = "todo-desc";

  calender.type = "date";
  calender.id = "dueDate";

  low.textContent = "Low";
  low.value = "low";
  mid.textContent = "Mid";
  mid.value = "mid";
  high.textContent = "High";
  high.value = "high";
  priority.append(high, mid, low);

  saveButton.textContent = "Save";
  saveButton.className = "btn-save";
  saveButton.type = "button";
  saveButton.addEventListener("click", addToDo);

  cancelButton.textContent = "Cancel";
  cancelButton.className = "btn-cancel";
  cancelButton.type = "button";
  cancelButton.addEventListener("click", hideAddToDoDialog);

  form.append(
    titleText,
    descText,
    calender,
    priority,
    project,
    saveButton,
    cancelButton
  );
  form.className = "add-todo";
  form.style.display = "none";
  section.append(header, list);
  return section;
}

const showAddToDoDialog = function (e) {
  form.style.display = "block";
  addButton.style.display = "none";
};

const hideAddToDoDialog = function (e) {
  form.style.display = "none";
  addButton.style.display = "block";
};

const addToDo = function (e) {
  PubSub.publish("ADD_TODO", {
    title: titleText.value,
    description: descText.value,
    dueDate: calender.value,
    priority: priority.value,
    projectName: project.value,
  });
  form.reset();
  hideAddToDoDialog();
};

const delToDo = function (e) {
  console.log(e.currentTarget);
  PubSub.publish("DEL_TODO", e.currentTarget.parentElement.parentElement.id);
};

const renderTodoList = function (msg = "", todos = []) {
  const content = document.querySelector(".content");
  const oldList = content.querySelector("ul");
  const list = document.createElement("ul");
  const h1 = content.querySelector("h1");
  h1.textContent = todos.active;

  todos.todoList.forEach((todo) => {
    console.log(todo);
    const todoEl = document.createElement("li");
    todoEl.id = todo.title;
    const header = document.createElement("div");
    header.className = "list-header";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    const title = document.createElement("span");
    title.textContent = todo.title;
    title.className = "title";
    const due = document.createElement("span");
    due.textContent = todo.dueDate;
    due.className = `due ${todo.priority}`;
    header.append(checkbox, title, due);

    const action = document.createElement("div");
    action.className = "action";
    const editButton = document.createElement("button");
    const editIcon = document.createElement("span");
    editIcon.className = "material-icons-outlined";
    editIcon.textContent = "edit";
    editButton.append(editIcon);
    const delButton = document.createElement("button");
    const delIcon = document.createElement("span");
    delIcon.className = "material-icons-outlined";
    delIcon.textContent = "delete";
    delButton.append(delIcon);
    delButton.addEventListener("click", delToDo);
    action.append(editButton, delButton);
    todoEl.append(header, action);
    list.append(todoEl);
  });
  content.replaceChild(list, oldList);
};

const updateProjectOption = function (msg, data) {
  let child = project.lastElementChild;
  while (child) {
    project.removeChild(child);
    child = project.lastElementChild;
  }
  data.map((p) => {
    const op = document.createElement("option");
    op.textContent = p.name;
    if (p.active) op.defaultSelected = true;
    project.append(op);
  });
};

const tokenTodoList = PubSub.subscribe("TODOLIST", renderTodoList);
const tokenProjectist = PubSub.subscribe("PROJECTLIST", updateProjectOption);

export default generateTodoList();

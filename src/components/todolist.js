import PubSub from "pubsub-js";
import { formatDistanceToNow } from "date-fns";

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
const moveToDoEl = document.createElement("ul");
let activeTodoList;

function generateTodoList() {
  section.className = "content";
  addButton.textContent = "New Todo";
  addButton.className = "btn-add";
  addButton.addEventListener("click", showEditableToDoDialog);
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
  saveButton.addEventListener("click", saveToDo);

  cancelButton.textContent = "Cancel";
  cancelButton.className = "btn-cancel";
  cancelButton.type = "button";
  cancelButton.addEventListener("click", hideEditableToDoDialog);

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

const showEditableToDoDialog = function (e, mode, todo) {
  form.style.display = "block";
  form.dataset.mode = mode || "add";
  addButton.style.display = "none";
  project.style.display = "inline-block";
  if (!e) {
    form.dataset.editTodo = todo.title;
    project.style.display = "none";
    titleText.value = todo.title;
    descText.value = todo.description;
    calender.value = todo.dueDate;
    priority.value = todo.priority;
  }
};

const hideEditableToDoDialog = function (e) {
  form.reset();
  form.style.display = "none";
  addButton.style.display = "block";
};

const saveToDo = function (e) {
  if (form.dataset.mode === "edit") {
    PubSub.publish("EDIT_TODO", [
      form.dataset.editTodo,
      titleText.value,
      descText.value,
      calender.value,
      priority.value,
    ]);
  } else {
    PubSub.publish("ADD_TODO", {
      title: titleText.value,
      description: descText.value,
      dueDate: calender.value,
      priority: priority.value,
      projectName: project.value,
    });
  }
  form.reset();
  hideEditableToDoDialog();
};

const editToDo = function (e) {
  const tobeEdit = activeTodoList.todoList.find(
    (item) => item.title === e.currentTarget.parentElement.parentElement.id
  );
  showEditableToDoDialog(null, "edit", tobeEdit);
};

const delToDo = function (e) {
  PubSub.publish("DEL_TODO", e.currentTarget.parentElement.parentElement.id);
};

const toggleDone = function (e) {
  PubSub.publish("TOGGLE_TODO", e.currentTarget.parentElement.parentElement.id);
};

const toggleMoveToDoEl = function (e) {
  e.currentTarget.parentElement.append(moveToDoEl);
  moveToDoEl.classList.toggle("hide");
};

const moveToDoProject = function (e) {
  PubSub.publish("MOVE_TODO", [
    e.currentTarget.parentElement.parentElement.parentElement.id,
    e.currentTarget.textContent,
  ]);
};

const renderTodoList = function (msg = "", todos = []) {
  activeTodoList = todos;
  const content = document.querySelector(".content");
  const oldList = content.querySelector("ul");
  const list = document.createElement("ul");
  const h1 = content.querySelector("h1");
  h1.textContent = todos.active;

  todos.todoList.forEach((todo) => {
    const todoEl = document.createElement("li");
    todoEl.id = todo.title;
    const header = document.createElement("div");
    header.className = "list-header";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.addEventListener("change", toggleDone);
    const title = document.createElement("span");
    title.textContent = todo.title;
    title.className = "title";
    const due = document.createElement("span");
    due.textContent = formatDistanceToNow(new Date(todo.dueDate), {
      addSuffix: true,
    });
    due.className = `due ${todo.priority}`;
    header.append(checkbox, title, due);

    const action = document.createElement("div");
    action.className = "action";
    const moveButton = document.createElement("button");
    const moveIcon = document.createElement("span");
    moveIcon.className = "material-icons-outlined";
    moveIcon.textContent = "exit_to_app";
    moveButton.append(moveIcon);
    moveButton.addEventListener("click", toggleMoveToDoEl);

    const editButton = document.createElement("button");
    const editIcon = document.createElement("span");
    editIcon.className = "material-icons-outlined";
    editIcon.textContent = "edit";
    editButton.append(editIcon);
    editButton.addEventListener("click", editToDo);

    const delButton = document.createElement("button");
    const delIcon = document.createElement("span");
    delIcon.className = "material-icons-outlined";
    delIcon.textContent = "delete";
    delButton.append(delIcon);
    delButton.addEventListener("click", delToDo);
    action.append(moveButton, editButton, delButton);
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
  let mchild = moveToDoEl.lastElementChild;
  while (mchild) {
    moveToDoEl.removeChild(mchild);
    mchild = moveToDoEl.lastElementChild;
  }
  data.map((p) => {
    const op = document.createElement("option");
    const li = document.createElement("li");
    op.textContent = p.name;
    li.textContent = p.name;
    if (p.active) {
      op.defaultSelected = true;
      li.className = "active";
    }
    li.addEventListener("click", moveToDoProject);
    project.append(op);
    moveToDoEl.append(li);
  });
  moveToDoEl.id = "chooser";
  moveToDoEl.className = "hide";
};

const tokenTodoList = PubSub.subscribe("TODOLIST", renderTodoList);
const tokenProjectist = PubSub.subscribe("PROJECTLIST", updateProjectOption);

export default generateTodoList();

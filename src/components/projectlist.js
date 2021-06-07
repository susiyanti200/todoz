import PubSub from "pubsub-js";

const section = document.createElement("section");
const list = document.createElement("ul");
const addButton = document.createElement("button");
const form = document.createElement("form");
const nameText = document.createElement("input");
const saveButton = document.createElement("button");
const cancelButton = document.createElement("button");

function generateProjectList() {
  section.className = "sidebar";
  addButton.textContent = "New Project";
  addButton.className = "btn-add";
  addButton.addEventListener("click", showAddProjectDialog);

  nameText.type = "text";
  nameText.placeholder = "Project Name";
  nameText.id = "name";

  saveButton.textContent = "Save";
  saveButton.className = "btn-save";
  saveButton.type = "button";
  saveButton.addEventListener("click", addProject);

  cancelButton.textContent = "Cancel";
  cancelButton.className = "btn-cancel";
  cancelButton.type = "button";
  cancelButton.addEventListener("click", hideAddProjectDialog);

  form.append(nameText, saveButton, cancelButton);
  form.style.display = "none";
  section.append(list, addButton, form);
  return section;
}

const addProject = function (e) {
  PubSub.publish("ADD_PROJECT", nameText.value);
  nameText.value = "";
  hideAddProjectDialog();
};

const delProject = function (e) {
  PubSub.publish("DEL_PROJECT", e.currentTarget.parentElement.id);
  e.stopPropagation();
};

const changeActiveProject = function (e) {
  PubSub.publish("SWITCH_PROJECT", e.currentTarget.id);
};

const showAddProjectDialog = function (e) {
  form.style.display = "block";
  addButton.style.display = "none";
};

const hideAddProjectDialog = function (e) {
  form.style.display = "none";
  addButton.style.display = "block";
};

const renderProjectList = function (msg = "", projects = []) {
  const sidebar = document.querySelector(".sidebar");
  const oldList = sidebar.querySelector("ul");

  const list = document.createElement("ul");

  projects.forEach((project) => {
    const projectEl = document.createElement("li");
    projectEl.id = project.name;
    if (project.active) projectEl.className = "active";

    const icon = document.createElement("span");
    icon.className = "material-icons-outlined";
    icon.textContent = project.default ? "inbox" : "book";
    const title = document.createElement("span");
    title.textContent = project.name;
    title.className = "title";

    const count = document.createElement("span");
    count.textContent = project.todoCount;
    count.className = "num";

    const delButton = document.createElement("button");
    const delIcon = document.createElement("span");
    delIcon.className = "material-icons-outlined";
    delIcon.textContent = "delete";
    delButton.append(delIcon);
    delButton.addEventListener("click", delProject);

    projectEl.append(icon, title, count);
    if (!project.default) projectEl.append(delButton);
    projectEl.addEventListener("click", changeActiveProject);
    list.append(projectEl);
  });
  sidebar.replaceChild(list, oldList);
};

const tokenProjectList = PubSub.subscribe("PROJECTLIST", renderProjectList);

export default generateProjectList();

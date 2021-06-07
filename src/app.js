import Project from "./project";
import ToDo from "./todo";

let projectList = loadFromLocalStorage();
let defaultProject = findProject("Inbox");
let activeProject = defaultProject;

function addProject(projectName) {
  if (projectList.find((activeProject) => activeProject.name === projectName))
    throw `'${projectName}' exists.`;
  if (projectName === "") throw "Can not create project with no name";
  const project = new Project(projectName);
  projectList.push(project);
  return project;
}

function removeProject(projectName) {
  if (projectName === defaultProject.name)
    throw `Can not remove default project '${defaultProject.name}'.`;
  if (projectName === activeProject.name) activeProject = defaultProject;
  projectList = projectList.filter((project) => project.name !== projectName);
}

function getProjects() {
  saveToLocalStrorage();
  return projectList.map((project) => ({
    name: project.name,
    todoCount: project.notDoneToDoCount(),
    active: project.name === activeProject.name,
    default: project.name === defaultProject.name,
  }));
}

function findProject(projectName) {
  console.log(projectList);
  const found = projectList.find((project) => project.name === projectName);
  if (!found) throw `Could not find project '${projectName}'`;
  return found;
}

function switchProject(projectName) {
  activeProject = findProject(projectName);
}

function moveToDoToProject(todo, projectName) {
  const todoIndex = activeProject.findTodoIndex(todo);
  const targetProject = findProject(projectName);
  targetProject.addToDo(activeProject.todoList[todoIndex]);
  activeProject.removeToDo(todo);
}

function addToDo({ title, description, dueDate, priority, projectName = "" }) {
  if (!(title && description && dueDate && priority))
    throw "Can not add todo with missing info!";
  if (activeProject.findTodoIndex(title) >= 0) throw `'${title}' exists.`;
  const targetProject = projectName ? findProject(projectName) : activeProject;
  targetProject.addToDo(new ToDo(title, description, dueDate, priority));
}

function removeToDo(title) {
  activeProject.removeToDo(title);
}

function updateTodo(todo, updatedTodo) {
  const todoIndex = activeProject.findTodoIndex(todo);
  if (todoIndex === -1) throw `Could not find ToDo '${title}'`;
  activeProject.todoList[todoIndex] = new ToDo(...updatedTodo);
}

function toggleToDo(todo) {
  const todoIndex = activeProject.findTodoIndex(todo);
  if (todoIndex === -1) throw `Could not find ToDo '${title}'`;
  activeProject.todoList[todoIndex].toggleIsDone();
}

function getToDoList() {
  return {
    active: activeProject.name,
    todoList: activeProject.notDoneToDoList(),
    completeList: activeProject.doneToDoList(),
  };
}

function saveToLocalStrorage() {
  localStorage.setItem("todoz", JSON.stringify(projectList));
}

function loadFromLocalStorage() {
  const dProject = new Project("Inbox");
  return (JSON.parse(localStorage.getItem("todoz")) || [dProject]).map(
    (project) => {
      project.todoList = project.todoList.map((todo) =>
        Object.assign(new ToDo(), todo)
      );
      return Object.assign(new Project(), project);
    }
  );
}

export {
  addProject,
  removeProject,
  getProjects,
  switchProject,
  addToDo,
  removeToDo,
  updateTodo,
  moveToDoToProject,
  getToDoList,
  toggleToDo,
};

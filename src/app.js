import Project from "./project";
import ToDo from "./todo";

const defaultProject = new Project("inbox");

let activeProject = defaultProject;

let projectList = [defaultProject];

function addProject(projectName) {
  if (projectList.find((activeProject) => activeProject.name === projectName))
    throw `'${projectName}' exists.`;
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
  return projectList.map((project) => ({
    name: project.name,
    todoCount: project.notDoneToDoCount(),
    active: project.name === activeProject.name,
  }));
}

function findProject(projectName) {
  const found = projectList.find((project) => project.name === projectName);
  if (!found) throw `Could not find project '${projectName}'`;
  return found;
}

function switchProject(projectName) {
  activeProject = findProject(projectName);
}

function moveToDoToProject(todo, projectName) {
  activeProject.removeToDo(todo);
  const targetProject = findProject(projectName);
  targetProject.addToDo(todo);
}

function addToDo(title, description, dueDate, priority, projectName = "") {
  const targetProject = projectName ? findProject(projectName) : activeProject;
  targetProject.addToDo(new ToDo(title, description, dueDate, priority));
}

function removeToDo(todo) {
  activeProject.removeToDo(todo);
}

function updateTodo(todo, updatedInfo) {
  const todoIndex = activeProject.findTodoIndex(todo);
  activeProject.todoList[todoIndex] = { ...todo, ...updatedInfo };
}

function getToDoList() {
  return activeProject.notDoneToDoList();
}

function getCompletedToDoList() {
  return activeProject.doneToDoList();
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
  getCompletedToDoList,
};
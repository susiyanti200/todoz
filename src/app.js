import Project from "./project";
import ToDo from "./todo";

const defaultProject = new Project("Inbox");

let activeProject = defaultProject;

let projectList = [defaultProject];

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
  return projectList.map((project) => ({
    name: project.name,
    todoCount: project.notDoneToDoCount(),
    active: project.name === activeProject.name,
    default: project.name === defaultProject.name,
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

function addToDo({ title, description, dueDate, priority, projectName = "" }) {
  if (!(title && description && dueDate && priority)) throw "Can not add todo!";
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
  return {
    active: activeProject.name,
    todoList: activeProject.notDoneToDoList(),
    completeList: activeProject.doneToDoList(),
  };
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
};

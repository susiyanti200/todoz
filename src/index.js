import * as App from "./app";
import "./style.css";
import PubSub from "pubsub-js";

import projectListEl from "./components/projectlist";
import todoListEl from "./components/todolist";
import { generateHeader, alertDialog } from "./components/header";

const body = document.querySelector("body");
const main = document.createElement("main");
main.append(projectListEl, todoListEl);
body.append(generateHeader(), main);

PubSub.publish("PROJECTLIST", App.getProjects());
PubSub.publish("TODOLIST", App.getToDoList());

const tokenAddProject = PubSub.subscribe("ADD_PROJECT", (msg, data) => {
  try {
    App.addProject(data);
  } catch (err) {
    body.append(alertDialog(err));
  }
  PubSub.publish("PROJECTLIST", App.getProjects());
});

const tokenSwitchProject = PubSub.subscribe("SWITCH_PROJECT", (msg, data) => {
  App.switchProject(data);
  PubSub.publish("PROJECTLIST", App.getProjects());
  PubSub.publish("TODOLIST", App.getToDoList());
});

const tokenChangeProject = PubSub.subscribe("DEL_PROJECT", (msg, data) => {
  App.removeProject(data);
  PubSub.publish("PROJECTLIST", App.getProjects());
  PubSub.publish("TODOLIST", App.getToDoList());
});

const tokenAddToDo = PubSub.subscribe("ADD_TODO", (msg, data) => {
  try {
    App.addToDo(data);
  } catch (err) {
    body.append(alertDialog(err));
  }
  PubSub.publish("PROJECTLIST", App.getProjects());
  PubSub.publish("TODOLIST", App.getToDoList());
});

const tokenDelToDo = PubSub.subscribe("DEL_TODO", (msg, data) => {
  App.removeToDo(data);
  PubSub.publish("PROJECTLIST", App.getProjects());
  PubSub.publish("TODOLIST", App.getToDoList());
});

const tokenEditToDo = PubSub.subscribe("EDIT_TODO", (msg, data) => {
  App.updateTodo(data[0], data.slice(1));
  PubSub.publish("PROJECTLIST", App.getProjects());
  PubSub.publish("TODOLIST", App.getToDoList());
});

const tokenToggleToDo = PubSub.subscribe("TOGGLE_TODO", (msg, data) => {
  App.toggleToDo(data);
  PubSub.publish("PROJECTLIST", App.getProjects());
  PubSub.publish("TODOLIST", App.getToDoList());
});

const tokenMoveToDo = PubSub.subscribe("MOVE_TODO", (msg, data) => {
  App.moveToDoToProject(data[0], data[1]);
  PubSub.publish("PROJECTLIST", App.getProjects());
  PubSub.publish("TODOLIST", App.getToDoList());
});

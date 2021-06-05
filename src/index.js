import * as App from "./app";
import "./style.css";
import PubSub from "pubsub-js";

import projectListEl from "./components/projectlist";
import todoListEl from "./components/todolist";
import header from "./components/header";

const body = document.querySelector("body");
const main = document.createElement("main");
main.append(projectListEl, todoListEl);
body.append(header, main);

PubSub.publish("PROJECTLIST", App.getProjects());
PubSub.publish("TODOLIST", App.getToDoList());

const tokenAddProject = PubSub.subscribe("ADD_PROJECT", (msg, data) => {
  App.addProject(data);
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
  App.addToDo(data);
  PubSub.publish("PROJECTLIST", App.getProjects());
  PubSub.publish("TODOLIST", App.getToDoList());
});

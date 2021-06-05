import PubSub from "pubsub-js";

function generateTodoList() {
  const section = document.createElement("section");
  section.className = "content";
  const header = document.createElement("header");
  const h1 = document.createElement("h1");
  const addButton = document.createElement("button");
  addButton.textContent = "New Todo";
  addButton.className = "btn-add";
  header.append(h1, addButton);
  const list = document.createElement("ul");
  section.append(header, list);
  return section;
}

const renderTodoList = function (msg = "", todos = []) {
  const content = document.querySelector(".content");
  const oldList = content.querySelector("ul");
  const list = document.createElement("ul");
  const h1 = content.querySelector("h1");
  h1.textContent = todos.active;
  content.replaceChild(list, oldList);
};

const tokenTodoList = PubSub.subscribe("TODOLIST", renderTodoList);

export default generateTodoList();

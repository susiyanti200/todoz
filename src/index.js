import * as App from "./app";

console.log(App.getProjects());

// App.addProject("inbox"); // can't add default project
App.addProject("work");
// App.addProject("work"); // can't add existing project
console.log(App.getProjects());

App.addToDo("write", "finished your writing", "2021-06-06", "high");
App.addToDo("read", "finished your reading", "2021-06-06", "low", "work");
const todo = App.getToDoList();
console.log(todo);
console.log(App.getProjects());

// App.updateTodo(todo[0], { isDone: true }); // specify updated information in the 2nd parameter
// console.log(App.getToDoList());
// console.log(App.getCompletedToDoList());

App.moveToDoToProject(todo[0], "work");
console.log(App.getCompletedToDoList());
console.log(App.getProjects());
App.switchProject("work");
console.log(App.getProjects());
App.moveToDoToProject(todo[0], "inbox");
App.removeProject("work");
console.log(App.getProjects());

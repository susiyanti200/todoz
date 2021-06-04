import { isTheSame } from "./helper";

class Project {
  constructor(name) {
    this.name = name;
    this.todoList = [];
  }

  addToDo(todo) {
    this.todoList.push(todo);
  }

  findTodoIndex(todo) {
    const todoIndex = this.todoList.findIndex((currentToDo) => {
      return isTheSame(currentToDo, todo);
    });
    if (todoIndex === -1) throw `Could not find ToDo '${todo.title}'`;
    return todoIndex;
  }

  removeToDo(todo) {
    const removedIndex = this.findTodoIndex(todo);
    const removedTodo = this.todoList.splice(removedIndex, 1);
    return removedTodo;
  }

  totalTodoCount() {
    return this.todoList.length;
  }

  doneToDoList() {
    return this.todoList.filter((todo) => todo.isDone);
  }

  doneToDoCount() {
    return this.doneToDoList().length;
  }

  notDoneToDoList() {
    return this.todoList.filter((todo) => !todo.isDone);
  }

  notDoneToDoCount() {
    return this.notDoneToDoList().length;
  }
}

export default Project;

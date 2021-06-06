class Project {
  constructor(name) {
    this.name = name;
    this.todoList = [];
  }

  addToDo(todo) {
    this.todoList.push(todo);
  }

  findTodoIndex(title) {
    const todoIndex = this.todoList.findIndex(
      (currentToDo) => currentToDo.title === title
    );
    if (todoIndex === -1) throw `Could not find ToDo '${title}'`;
    return todoIndex;
  }

  removeToDo(title) {
    const removedIndex = this.findTodoIndex(title);
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

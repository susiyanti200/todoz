class ToDo {
  constructor(title, description, dueDate, priority) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.isDone = false;
  }

  toggleIsDone() {
    this.isDone = !this.isDone;
  }
}

export default ToDo;

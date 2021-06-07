function generateHeader() {
  const nav = document.createElement("nav");
  const icon = document.createElement("span");
  icon.id = "nav";
  icon.className = "material-icons-outlined";
  icon.textContent = "menu";
  nav.append(icon);
  addNavListener(nav);
  return nav;
}

function addNavListener(nav) {
  nav.addEventListener("click", () => {
    const sidebar = document.querySelector(".sidebar");
    const content = document.querySelector(".content");
    sidebar.classList.toggle("toggle");
    content.classList.toggle("toggle");
  });
}

function alertDialog(msg) {
  console.log(msg);
  const alert = document.createElement("div");
  alert.className = "alert";
  const close = document.createElement("span");
  close.innerHTML = "&times;";
  close.className = "closebtn";
  const content = document.createElement("span");
  content.textContent = msg;
  alert.append(close, content);

  close.onclick = function () {
    var div = this.parentElement;
    div.style.opacity = "0";
    setTimeout(function () {
      div.style.display = "none";
    }, 600);
  };
  return alert;
}

export { generateHeader, alertDialog };

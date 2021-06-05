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

export default generateHeader();

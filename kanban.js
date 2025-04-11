let styleTag;
let currentId;
let taskAnim;
let offsetX, offsetY;

function dragStart(event) {
  const id = event.target.id;
  offsetX = event.offsetX;
  offsetY = event.offsetY;
  console.log(event.offsetX, event.offsetY);
  setTimeout(() => event.target.classList.add("dragged"));
  event.dataTransfer.setData("text/plain", id);
  console.log("id:", id);
  setTimeout(() =>
    event.target.closest(".column").dispatchEvent(new Event("dragenter"))
  );
  currentId = id;
  styleTag = document.createElement("style");
  document.head.appendChild(styleTag);
}

function dragEnd(event) {
  event.target.classList.remove("dragged");
}

function dragOver(event) {
  event.preventDefault();
  event.stopPropagation();
  event.dataTransfer.dropEffect = "move";
}
function drop(event) {
  event.preventDefault();
  event.stopPropagation();
  const id = event.dataTransfer.getData("text/plain");
  const task = document.getElementById(id);
  const {x,y} = task.getBoundingClientRect();
  task.style.position = "relative";
  task.style.top = (event.clientY - offsetY - y)+ "px";
  task.style.left = (event.clientX - offsetX -x)+ "px";
  task.classList.remove("dragged");

  const column = event.target.closest(".column");
  const tasks = column.querySelector(".tasks");
  const rect = tasks.getBoundingClientRect();
  const where = Math.max(
    0,
    Math.min(
      tasks.children.length,
      ~~(((event.clientY - rect.y) / rect.height) * tasks.children.length)
    )
  );
  document.startViewTransition(() => {
    tasks.children.length !== where
      ? tasks.children[where].insertAdjacentElement("beforebegin", task)
      : tasks.appendChild(task);
    task.style.position = "initial";
    column.classList.remove("dropArea");
    event.target.style.backgroundColor = "";
    styleTag.textContent = `::view-transition-group(${id}) {z-index: 1;}`
  }).finished.finally(() => {
    styleTag && styleTag.remove();
  });
}

function dragEnter(event) {
  if (event.target.closest(".column") !== event.target) return;
  event.stopPropagation();
  event.preventDefault();
  event.target.classList.add("dropArea");
}

function dragLeave(event) {
  if (event.target.closest(".column") !== event.target) return;
  event.stopPropagation();
  event.preventDefault();
  event.target.style.backgroundColor = "";
  event.target.classList.remove("dropArea");
}

window.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".task").forEach((task, idx) => {
    task.style.viewTransitionName = task.id = "t" + idx;
    task.addEventListener("dragstart", dragStart);
    task.addEventListener("dragend", dragEnd);
  });
  document.querySelectorAll(".column").forEach((col) => {
    col.addEventListener("dragover", dragOver);
    col.addEventListener("drop", drop);
    col.addEventListener("dragenter", dragEnter);
    col.addEventListener("dragleave", dragLeave);
  });
});

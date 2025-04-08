function dragStart(event) {
  event.dataTransfer.setData("text/plain", event.target.id);
}

function dragEnd(event) {}

function dragOver(event) {
  event.preventDefault();
  event.stopPropagation();
  event.dataTransfer.dropEffect = "move";
}
function drop(event) {
  event.preventDefault();
  event.stopPropagation();
  const data = event.dataTransfer.getData("text/plain");
  console.log("data:", data);
  const column = event.target.closest(".column");
  const tasks = column.querySelector(".tasks");
  const rect = tasks.getBoundingClientRect();
  console.log( rect.y, event.clientY, rect.y + rect.height)
  const where = Math.max(0, Math.min(tasks.children.length, ~~((event.clientY - rect.y) / rect.height * tasks.children.length)));
  console.log("where:", where);
  document.startViewTransition(() => {
    const task = document.getElementById(data);
    tasks.children.length !== where ? tasks.children[where].insertAdjacentElement('beforebegin', task) : tasks.appendChild(task);
    column.classList.remove("drag");
    event.target.style.backgroundColor = "";
  });
}

function dragEnter(event) {
  if (event.target.closest(".column") !== event.target) return;
  event.stopPropagation();
  event.preventDefault();
  event.target.style.backgroundColor = "#888";
  console.log("enter", event.target);
  event.target.classList.add("drag");
}

function dragLeave(event) {
  if (event.target.closest(".column") !== event.target) return;
  event.stopPropagation();
  event.preventDefault();
  console.log("leave", event.target);
  event.target.style.backgroundColor = "";
  event.target.classList.remove("drag");
}

window.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".task").forEach((task, idx) => {
    task.draggable = "true";
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

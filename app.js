function render() {
    let list = document.getElementById("list");
    if (!list) return;

    list.innerHTML = "";

    let filterElement = document.getElementById("filter");
    let filter = filterElement ? filterElement.value : "Alle";

    let doneCount = 0;
    let visibleCount = 0;

    exercises
        .filter(ex => filter === "Alle" || ex.day === filter)
        .forEach(ex => {

            visibleCount++;

            let li = document.createElement("li");

            // 👉 Swipe Variablen
            let startX = 0;

            li.addEventListener("touchstart", (e) => {
                startX = e.touches[0].clientX;
            });

            li.addEventListener("touchend", (e) => {
                let endX = e.changedTouches[0].clientX;

                if (startX - endX > 80) {
                    // 👉 Swipe nach links = löschen
                    removeExercise(ex.id);
                }
            });

            let checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = ex.done;
            checkbox.onclick = function() {
                toggleDone(ex.id, !ex.done);
            };

            let text = document.createElement("span");
            text.innerText = ex.text + " (" + ex.day + ")";

            if (ex.done) {
                text.style.textDecoration = "line-through";
                doneCount++;
            }

            let button = document.createElement("button");
            button.innerHTML = '<i class="fa-solid fa-trash"></i>';
            button.onclick = function() {
                removeExercise(ex.id);
            };

            li.appendChild(checkbox);
            li.appendChild(text);
            li.appendChild(button);

            list.appendChild(li);
        });

    let progress = document.getElementById("progress");
    if (progress) {
        progress.innerText = doneCount + " von " + visibleCount + " Übungen erledigt";
    }
}

let exercises = [];

function loadData() {
    db.collection("training").onSnapshot(snapshot => {
        exercises = [];
        snapshot.forEach(doc => {
            exercises.push({
                id: doc.id,
                text: doc.data().text,
                done: doc.data().done || false,
                day: doc.data().day || "Allgemein"
            });
        });

        render();
    });
}

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

            // ✅ SWIPE (stabil)
            let startX = 0;
            let currentX = 0;

            li.addEventListener("touchstart", function(e) {
                startX = e.touches[0].clientX;
                currentX = startX;
            });

            li.addEventListener("touchmove", function(e) {
                currentX = e.touches[0].clientX;
                let diff = currentX - startX;

                if (diff < 0) {
                    li.style.transform = "translateX(" + diff + "px)";
                } else {
                    li.style.transform = "translateX(0px)";
                }
            });

            li.addEventListener("touchend", function() {
                let diff = currentX - startX;

                if (diff < -60) {
                    // 👉 löschen
                    removeExercise(ex.id);
                } else {
                    // 👉 zurück
                    li.style.transform = "translateX(0px)";
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
        progress.innerText = doneCount + " von " + visibleCount + " erledigt";
    }
}

function addExercise() {
    let input = document.getElementById("exercise");
    let day = document.getElementById("day").value;

    if (input.value.trim() === "") return;

    db.collection("training").add({
        text: input.value,
        done: false,
        day: day
    });

    input.value = "";
}

function toggleDone(id, newStatus) {
    db.collection("training").doc(id).update({
        done: newStatus
    });
}

function removeExercise(id) {
    db.collection("training").doc(id).delete();
}

loadData();

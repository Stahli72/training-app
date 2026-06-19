let exercises = [];

// 🔥 Live-Sync
function loadData() {
    db.collection("training").onSnapshot(snapshot => {
        exercises = [];
        snapshot.forEach(doc => {
            exercises.push({
                id: doc.id,
                text: doc.data().text,
                done: doc.data().done || false,
                day: doc.data().day || "Allgemein",
                date: doc.data().date || ""
            });
        });

        render();
    });
}

function render() {
    let list = document.getElementById("list");
    list.innerHTML = "";

    let filter = document.getElementById("filter").value;

    let doneCount = 0;
    let visibleCount = 0;
    let currentDate = "";

    exercises
        .filter(ex => filter === "Alle" || ex.day === filter)
        .forEach(ex => {

            // ✅ Datum als einfache Zeile (kein <h3>)
            if (ex.date !== currentDate) {
                currentDate = ex.date;

                let dateLine = document.createElement("li");
                dateLine.style.fontWeight = "bold";
                dateLine.style.opacity = "0.7";
                dateLine.innerText = currentDate;

                list.appendChild(dateLine);
            }

            visibleCount++;

            let li = document.createElement("li");

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

// Datum
function getTodayDate() {
    let today = new Date();
    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, '0');
    let day = String(today.getDate()).padStart(2, '0');

    return year + "-" + month + "-" + day;
}

// Add
function addExercise() {
    let input = document.getElementById("exercise");
    let day = document.getElementById("day").value;

    if (input.value.trim() === "") return;

    db.collection("training").add({
        text: input.value,
        done: false,
        day: day,
        date: getTodayDate()
    });

    input.value = "";
}

// Toggle
function toggleDone(id, newStatus) {
    db.collection("training").doc(id).update({
        done: newStatus
    });
}

// Delete
function removeExercise(id) {
    db.collection("training").doc(id).delete();
}

// Start
loadData();

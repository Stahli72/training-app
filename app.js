let exercises = [];

// 🔥 Live-Sync aktiv
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

        // ✅ Nach Datum sortieren (neueste zuerst)
        exercises.sort((a, b) => b.date.localeCompare(a.date));

        render();
    });
}

// Anzeige der Liste
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

            // ✅ Neue Datum-Überschrift
            if (ex.date !== currentDate) {
                currentDate = ex.date;

                let header = document.createElement("h3");
                header.innerText = currentDate;
                list.appendChild(header);
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
            button.innerText = "X";
            button.onclick = function() {
                removeExercise(ex.id);
            };

            li.appendChild(checkbox);
            li.appendChild(text);
            li.appendChild(button);

            list.appendChild(li);
        });

    // 📊 Fortschritt
    let progress = document.getElementById("progress");
    if (progress) {
        progress.innerText = doneCount + " von " + visibleCount + " Übungen erledigt";
    }
}

// ✅ Datum erzeugen (Format: YYYY-MM-DD für richtige Sortierung)
function getTodayDate() {
    let today = new Date();

    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, '0');
    let day = String(today.getDate()).padStart(2, '0');

    return year + "-" + month + "-" + day;
}

// Neue Übung hinzufügen
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

// Status ändern
function toggleDone(id, newStatus) {
    db.collection("training").doc(id).update({
        done: newStatus
    });
}

// Übung löschen
function removeExercise(id) {
    db.collection("training").doc(id).delete();
}

// Start
loadData();

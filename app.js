let exercises = [];

// 🔥 Live-Sync aktiv
function loadData() {
    db.collection("training").onSnapshot(snapshot => {
        exercises = [];
        snapshot.forEach(doc => {
            exercises.push({
                id: doc.id,
                text: doc.data().text,
                done: doc.data().done || false
            });
        });
        render();
    });
}

// Anzeige der Liste
function render() {
    let list = document.getElementById("list");
    list.innerHTML = "";

    exercises.forEach(ex => {
        let li = document.createElement("li");

        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = ex.done;
        checkbox.onclick = function() {
            toggleDone(ex.id, !ex.done);
        };

        let text = document.createElement("span");
        text.innerText = ex.text;

        if (ex.done) {
            text.style.textDecoration = "line-through";
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
}

// Neue Übung hinzufügen
function addExercise() {
    let input = document.getElementById("exercise");

    if (input.value.trim() === "") return;

    db.collection("training").add({
        text: input.value,
        done: false   // ✅ NEU
    });

    input.value = "";
}

// ✅ NEU: Status ändern
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
``

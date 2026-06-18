let exercises = [];

// 🔥 Live-Sync aktiv
function loadData() {
    db.collection("training").onSnapshot(snapshot => {
        exercises = [];
        snapshot.forEach(doc => {
            exercises.push({ id: doc.id, text: doc.data().text });
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
        li.innerHTML = ex.text +
        " <button onclick='removeExercise(\"" + ex.id + "\")'>X</button>";
        list.appendChild(li);
    });
}

// Neue Übung hinzufügen
function addExercise() {
    let input = document.getElementById("exercise");

    if (input.value.trim() === "") return;

    db.collection("training").add({
        text: input.value
    });

    input.value = "";
}

// Übung löschen
function removeExercise(id) {
    db.collection("training").doc(id).delete();
}

// Start
loadData();

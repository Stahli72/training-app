let exercises = [];

// ✅ Daten laden
function loadData() {
    db.collection("training").onSnapshot(snapshot => {
        exercises = [];
        snapshot.forEach(doc => {
            exercises.push({
                id: doc.id,
                text: doc.data().text,
                done: doc.data().done || false,
                day: doc.data().day,
                date: doc.data().date
            });
        });
        render();
    });
}

// ✅ Render (zeigt nur ausgewählten Tag!)
function render() {

    let list = document.getElementById("list");
    list.innerHTML = "";

    let selectedDate = document.getElementById("selectedDate").value;

    let filtered = exercises.filter(ex => ex.date === selectedDate);

    filtered.forEach(ex => {

        let li = document.createElement("li");

        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = ex.done;
        checkbox.onclick = () => toggleDone(ex.id, !ex.done);

        let text = document.createElement("span");
        text.innerText = ex.text + " (" + ex.day + ")";

        if (ex.done) {
            text.style.textDecoration = "line-through";
        }

        let button = document.createElement("button");
        button.innerHTML = '<i class="fa-solid fa-trash"></i>';
        button.onclick = () => removeExercise(ex.id);

        li.appendChild(checkbox);
        li.appendChild(text);
        li.appendChild(button);

        list.appendChild(li);
    });
}

// ✅ Modal öffnen
function openModal() {
    document.getElementById("modal").classList.remove("hidden");
}

// ✅ Modal schließen
function closeModal() {
    document.getElementById("modal").classList.add("hidden");
}

// ✅ Neue Übung
function addExercise() {
    let input = document.getElementById("exercise");
    let day = document.getElementById("day").value;
    let date = document.getElementById("selectedDate").value;

    if (!date) {
        alert("Bitte Datum wählen");
        return;
    }

    db.collection("training").add({
        text: input.value,
        day: day,
        done: false,
        date: date
    });

    input.value = "";
    closeModal();
}

// ✅ Toggle
function toggleDone(id, status) {
    db.collection("training").doc(id).update({ done: status });
}

// ✅ Delete
function removeExercise(id) {
    db.collection("training").doc(id).delete();
}

// ✅ Datum ändern → neu rendern
document.addEventListener("change", function(e) {
    if (e.target.id === "selectedDate") render();
});

// Start
loadData();

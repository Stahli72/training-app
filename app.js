let exercises = [];

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

// ✅ Modal öffnen (FIX für Handy)
function openModal() {
    let modal = document.getElementById("modal");
    modal.classList.remove("hidden");

    // 👉 Fokus auf Eingabefeld (wichtig fürs Handy)
    setTimeout(() => {
        document.getElementById("exercise").focus();
    }, 200);
}

// ✅ Modal schließen
function closeModal() {
    document.getElementById("modal").classList.add("hidden");
}

// ✅ Heute als Standard setzen (wichtig!)
function getToday() {
    let today = new Date();
    return today.toISOString().split("T")[0];
}

// ✅ Neue Übung
function addExercise() {
    let input = document.getElementById("exercise");
    let day = document.getElementById("day").value;
    let dateInput = document.getElementById("selectedDate");

    let date = dateInput.value || getToday(); // ✅ Fallback

    if (input.value.trim() === "") return;

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

// ✅ Datum ändern
document.addEventListener("change", function(e) {
    if (e.target.id === "selectedDate") render();
});

// ✅ Start
function init() {
    let dateInput = document.getElementById("selectedDate");
    dateInput.value = getToday(); // 👉 automatisch heute setzen

    loadData();
}

init();

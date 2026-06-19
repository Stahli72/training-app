let exercises = [];

function loadData() {
    db.collection("training").onSnapshot(snapshot => {
        exercises = [];

        snapshot.forEach(doc => {
            exercises.push({
                id: doc.id,
                text: doc.data().text || "",
                day: doc.data().day || "",
                date: doc.data().date || "",
                done: doc.data().done || false
            });
        });

        render();
    });
}

function render() {
    let list = document.getElementById("list");
    list.innerHTML = "";

    let selectedDate = document.getElementById("selectedDate").value;

    exercises
        .filter(e => e.date === selectedDate)
        .forEach(e => {

            let li = document.createElement("li");

            let checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = e.done;

            let text = document.createElement("span");
            text.innerText = e.text + " (" + e.day + ")";

            let button = document.createElement("button");
            button.innerText = "X";
            button.onclick = () => removeExercise(e.id);

            li.appendChild(checkbox);
            li.appendChild(text);
            li.appendChild(button);

            list.appendChild(li);
        });
}

function openModal() {
    document.getElementById("modal").classList.remove("hidden");
}

function closeModal() {
    document.getElementById("modal").classList.add("hidden");
}

function addExercise() {

    let input = document.getElementById("exercise");
    let day = document.getElementById("day").value;
    let date = document.getElementById("selectedDate").value;

    if (!date || input.value === "") return;

    db.collection("training").add({
        text: input.value,
        day: day,
        date: date,
        done: false
    });

    input.value = "";
    closeModal();
}

function removeExercise(id) {
    db.collection("training").doc(id).delete();
}

document.getElementById("selectedDate").addEventListener("change", render);

loadData();

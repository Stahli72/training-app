let exercises = [];

function loadData() {
    db.collection("training").get().then(snapshot => {
        exercises = [];
        snapshot.forEach(doc => {
            exercises.push({ id: doc.id, text: doc.data().text });
        });
        render();
    });
}

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

function addExercise() {
    let input = document.getElementById("exercise");

    if (input.value.trim() === "") return;

    db.collection("training").add({
        text: input.value
    }).then(() => {
        input.value = "";
        loadData();
    });
}

function removeExercise(id) {
    db.collection("training").doc(id).delete().then(() => {
        loadData();
    });
}

loadData();

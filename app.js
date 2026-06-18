let exercises = JSON.parse(localStorage.getItem("training")) || [];

function render() {
    let list = document.getElementById("list");
    list.innerHTML = "";

    exercises.forEach((ex, index) => {
        let li = document.createElement("li");
        li.innerHTML = ex + " <button onclick='removeExercise(" + index + ")'>X</button>";
        list.appendChild(li);
    });

    localStorage.setItem("training", JSON.stringify(exercises));
}

function addExercise() {
    let input = document.getElementById("exercise");
    exercises.push(input.value);
    input.value = "";
    render();
}

function removeExercise(index) {
    exercises.splice(index, 1);
    render();
}

render();

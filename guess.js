// Setting Game Name
let gameName = "Guess The Word";
document.title = gameName;
document.querySelector("h1").innerHTML = gameName;
document.querySelector("footer").innerHTML = `${gameName} Game Created By Ahmed Ibrahim`;

// Setting game Aria
let numberOfTries = 6;
let numberOfLetters = 6;
let currentTry = 1;
let nubmerOfHints = 2;

// Manage Words
let wordToGuess = "";
const words = ["Create", "Update", "Delete", "Master", "Branch", "Mainly", "Elzero", "School"];
wordToGuess = words[Math.floor(Math.random() * words.length)].toLowerCase();
let messageArea = document.querySelector(".message");

// Manage Hints
document.querySelector(".hint span").innerHTML = nubmerOfHints;
const getHintButton = document.querySelector(".hint");
getHintButton.addEventListener("click", getHint);

function generateInput() {
    const inputsContainer = document.querySelector(".inputs");

    for (let i = 1; i <= numberOfTries; i++) {
        const tryDiv = document.createElement("div");
        tryDiv.classList.add(`try-${i}`);
        tryDiv.innerHTML = `<span>Try ${i}</span>`;

        if (i !== 1) tryDiv.classList.add("disabled-inputs");

        for (let j = 1; j <= numberOfLetters; j++) {
            const input = document.createElement("input");
            input.type = "text";
            input.id = `guess-${i}-letter-${j}`;
            input.setAttribute("maxlength", "1");
            tryDiv.appendChild(input);
        }
        inputsContainer.appendChild(tryDiv);
    }
    // Focus On Fisrt Input In First Try Element
    inputsContainer.children[0].children[1].focus();

    // Disable All Inputs Except First One
    const InputInDisabledDiv = document.querySelectorAll(".disabled-inputs input");
    InputInDisabledDiv.forEach((input) => input.disabled = true);

    const inputs = document.querySelectorAll("input");
    inputs.forEach((input, index) => {
        // Convert To Upper Case 
        input.addEventListener("input", function () {
            this.value = this.value.toUpperCase();

            const nextInput = inputs[index + 1];
            if (nextInput) nextInput.focus();
        })

        input.addEventListener("keydown", function (event) {
            const currentIndex = Array.from(inputs).indexOf(event.target);
            // console.log(event);
            // console.log(currentIndex);
            if (event.key === "ArrowRight") {
                const nextInput = currentIndex + 1;
                if (nextInput < inputs.length) inputs[nextInput].focus();
            }
            if (event.key === "ArrowLeft") {
                const preInput = currentIndex - 1;
                if (preInput >= 0 ) inputs[preInput].focus();
            }
        })
    })
}

const guessButton = document.querySelector(".check");
guessButton.addEventListener("click", checkGuess);

console.log(wordToGuess);

function checkGuess() {
    let successGuess = true;
    for(let i = 1; i <= numberOfLetters; i++) {
        const inputField = document.querySelector(`#guess-${currentTry}-letter-${i}`);
        const letter = inputField.value.toLowerCase();
        const actuallLetter = wordToGuess[i - 1];

        // Game Logic
        if (letter === actuallLetter) {
            // Letter Is Correct And In Place
            inputField.classList.add("yes-in-place");
        } else if (wordToGuess.includes(letter) && letter !== "") {
            // Letter Is Correct And Not In Place
            inputField.classList.add("not-in-place");
            successGuess = false;
        } else {
            inputField.classList.add("no");
            successGuess = false;
        }
    }

    // Check If User Win Or Lose
    if (successGuess) {

        messageArea.innerHTML = `You Win The Word Is <span>${wordToGuess}</span>`;
        
        if (nubmerOfHints === 2) {
            messageArea.innerHTML = `<p>Congratulation You Didn't Use Hints</p>`;
        }

        // Add Disabled Class On All Try Divs
        let allTries = document.querySelectorAll(".inputs > div");
        allTries.forEach(tryDiv => tryDiv.classList.add("disabled-inputs"));

        // Disabled Guess Button
        guessButton.disabled = true;
    } else {

        document.querySelector(`.try-${currentTry}`).classList.add("disabled-inputs");
        const currentTryInputs = document.querySelectorAll(`.try-${currentTry} input`);
        currentTryInputs.forEach((input) => input.disabled = true);

        currentTry++;

        document.querySelector(`.try-${currentTry}`).classList.remove("disabled-inputs");
        const nextTryInputs = document.querySelectorAll(`.try-${currentTry} input`);
        nextTryInputs.forEach((input) => input.disabled = false);

        let el = document.querySelector(`.try-${currentTry}`);
        if (el) {
            document.querySelector(`.try-${currentTry}`).classList.remove("disabled-inputs");
            el.children[1].focus();
        } else {
            // Disabled Guess Button
            guessButton.disabled = true;
            getHintButton.disabled = true;
            messageArea.innerHTML = `You Lose The Word Is <span>${wordToGuess}</span>`;
        }
    }
}

function getHint() {
    if (nubmerOfHints > 0) {
        nubmerOfHints--;
        document.querySelector(".hint span").innerHTML = nubmerOfHints;
    }
    if (nubmerOfHints === 0) {
        getHintButton.disabled = true;
    }

    const enabledInputs = document.querySelectorAll("input:not([disabled])");
    // console.log(enabledInputs);
    const emptyEnabledInputs = Array.from(enabledInputs).filter((input) => input.value === "");
    // console.log(emptyEnabledInputs);

    if (emptyEnabledInputs.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyEnabledInputs.length);
        const randomInput = emptyEnabledInputs[randomIndex];
        const indexToFill = Array.from(enabledInputs).indexOf(randomInput);
        // console.log(randomIndex);
        // console.log(randomInput);
        // console.log(indexToFill);
        if (indexToFill !== -1) {
            randomInput.value = wordToGuess[indexToFill].toUpperCase();
        }
    } else {
        console.log(`SomeThing Is Wrong`);
    }
}

function handleBackspace(event) {
    if (event.key === "Backspace") {
        const inputs = document.querySelectorAll("input:not([disabled])");
        const currentIndex = Array.from(inputs).indexOf(document.activeElement);
        if (currentIndex > 0) {
            const currentInput = inputs[currentIndex];
            const preInput = inputs[currentIndex - 1];
            currentInput.value = "";
            preInput.value = "";
            preInput.focus();
            // currentInput.focus();
        }
    }
}

document.addEventListener("keydown", handleBackspace);

window.onload = function () {
    generateInput();
}
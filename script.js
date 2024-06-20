let currentQuestion = 0;
let score = 0;
let timerInterval;
let random_number = 0;

const apiURL = "https://opentdb.com/api.php?amount=30&type=multiple";

let questions = [];

fetch(apiURL)
  .then((response) => response.json())
  .then((data) => {
    questions = data.results.map((item) => ({
      question: item.question,
      options: [...item.incorrect_answers, item.correct_answer].sort(
        () => Math.random() - 0.5
      ),
      correctAnswer: item.correct_answer,
    }));

    // Reinitialize the random number generator with the correct length
    generateRandomNumber = createRandomNumberGenerator(0, questions.length - 1);

    // Log the questions to the console for verification
    console.log(questions);
  })
  .catch((error) => {
    console.error("Error fetching questions:", error);
  });

function createRandomNumberGenerator(min, max) {
  const generatedNumbers = [];

  function getRandomNumber() {
    let randomNumber;
    do {
      randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (generatedNumbers.includes(randomNumber));
    generatedNumbers.push(randomNumber);
    return randomNumber;
  }

  return getRandomNumber;
}

// Initialize with an empty generator to prevent errors before fetching questions
let generateRandomNumber = () => Math.floor(Math.random() * 10);

function startQuiz() {
  if (questions.length === 0) {
    alert("Questions are not loaded yet. Please try again later.");
    return;
  }

  document.getElementById("quiz-container").style.display = "block";
  document.getElementById("start-quiz").style.display = "none";
  displayQuestion();
}

function decodeHtmlEntities(str) {
  const entities = {
    "&#039;s": "'s",
    "&quot;": '"',
    "&apos;": "'",
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&cent;": "¢",
    "&pound;": "£",
    "&yen;": "¥",
    "&euro;": "€",
    "&copy;": "©",
    "&reg;": "®",
    "&trade;": "™",
    "&sect;": "§",
    "&para;": "¶",
    "&bull;": "•",
    "&hellip;": "…",
    "&prime;": "′",
    "&Prime;": "″",
    "&lsaquo;": "‹",
    "&rsaquo;": "›",
    "&oline;": "‾",
    "&frasl;": "⁄",
    "&ndash;": "–",
    "&mdash;": "—",
    "&lsquo;": "‘",
    "&rsquo;": "’",
    "&sbquo;": "‚",
    "&ldquo;": "“",
    "&rdquo;": "”",
    "&bdquo;": "„",
    "&dagger;": "†",
    "&Dagger;": "‡",
    "&permil;": "‰",
    "&lsaquo;": "‹",
    "&rsaquo;": "›",
    "&oline;": "‾",
    "&euro;": "€",
    "&trade;": "™",
    "&larr;": "←",
    "&uarr;": "↑",
    "&rarr;": "→",
    "&darr;": "↓",
    "&harr;": "↔",
    "&crarr;": "↵",
    "&lceil;": "⌈",
    "&rceil;": "⌉",
    "&lfloor;": "⌊",
    "&rfloor;": "⌋",
    "&loz;": "◊",
    "&spades;": "♠",
    "&clubs;": "♣",
    "&hearts;": "♥",
    "&diams;": "♦",
  };

  // Check if the string contains any entities
  const entityRegex = /&[a-z]+;/g;
  const matches = str.match(entityRegex);

  // If no matches are found, return the original string
  if (!matches) {
    return str;
  }

  // Replace entities with their corresponding characters
  return str.replace(entityRegex, function (match) {
    return entities[match] || match;
  });
}

function displayQuestion() {
  resetTimer();
  updateScore();

  random_number = generateRandomNumber();
  let questionElement = document.getElementById("question");
  let optionsElement = document.getElementById("options");

  let currentQ = questions[random_number];

  questionElement.textContent = `Question ${
    currentQuestion + 1
  }: ${decodeHtmlEntities(currentQ.question)}`;

  optionsElement.innerHTML = "";

  currentQ.options.forEach((option) => {
    let optionDiv = document.createElement("div");
    optionDiv.classList.add("option");

    let radioInput = document.createElement("input");
    radioInput.type = "radio";
    radioInput.name = "answer";
    radioInput.value = option;

    let label = document.createElement("label");
    label.textContent = ` ${option}`;

    optionDiv.appendChild(radioInput);
    optionDiv.appendChild(label);

    optionsElement.appendChild(optionDiv);
  });

  startTimer(10000); // 10 seconds duration for each question
}

function startTimer(duration) {
  let progressBar = document.getElementById("progress-bar");
  progressBar.style.animation = `timerAnimation ${duration / 1000}s linear`;
  timerInterval = setTimeout(timerFinished, duration);
}

function resetTimer() {
  clearTimeout(timerInterval);
  let progressBar = document.getElementById("progress-bar");
  progressBar.style.animation = "none";
  void progressBar.offsetWidth; // Trigger reflow
  progressBar.style.animation = `timerAnimation 10s linear`; // Update timer to 10 seconds
}

function checkAnswer() {
  let selectedOption = document.querySelector('input[name="answer"]:checked');
  if (!selectedOption) {
    showPopup("Time's up! Please select an answer.", false);
    return;
  }

  let userAnswer = selectedOption.value;
  let correctAnswer = questions[random_number].correctAnswer;

  if (userAnswer === correctAnswer) {
    score++;
  }

  let isCorrect = userAnswer === correctAnswer;
  showPopup(
    isCorrect
      ? "Correct! Well done."
      : `Incorrect. The correct answer is ${correctAnswer}.`,
    isCorrect
  );
}

function showPopup(message, isCorrect) {
  clearTimeout(timerInterval);
  let popup = document.getElementById("result-popup");
  let popupContent = document.getElementById("popup-content");
  let popupMessage = document.getElementById("popup-message");

  popupMessage.textContent = message;
  popupContent.classList.remove("result-popup-correct", "result-popup-wrong");
  popupContent.classList.add(
    isCorrect ? "result-popup-correct" : "result-popup-wrong"
  );

  popup.style.display = "flex";

  // Display the Next button after showing the popup
  let nextButton = document.getElementById("next-button");
  nextButton.style.display = "inline-block";
}

function nextQuestion() {
  let popup = document.getElementById("result-popup");
  let quizContainer = document.querySelector(".quiz-container");

  // Add the fade-out class to trigger the transition animation
  quizContainer.classList.add("fade-out");

  setTimeout(function () {
    // Remove the fade-out class and proceed to the next question
    quizContainer.classList.remove("fade-out");
    popup.style.display = "none";
    currentQuestion++;

    if (currentQuestion < 10) {
      displayQuestion();
    } else {
      showFinalScore();
    }
  }, 400); // Adjust the timeout duration based on your transition duration
}

function timerFinished() {
  resetTimer();

  let selectedOption = document.querySelector('input[name="answer"]:checked');

  if (!selectedOption) {
    showPopup("Time's up! Moving to the next question.", false);
  } else {
    let userAnswer = selectedOption.value;
    let correctAnswer = questions[random_number].correctAnswer;

    if (userAnswer === correctAnswer) {
      score++;
    }

    let isCorrect = userAnswer === correctAnswer;
    showPopup(
      isCorrect
        ? "Correct! Well done."
        : `Incorrect. The correct answer is ${correctAnswer}.`,
      isCorrect
    );
  }

  setTimeout(() => {
    nextQuestion();
  }, 2000); // Adjust the delay duration based on your preference
}

function showFinalScore() {
  let quizContainer = document.querySelector(".quiz-container");
  quizContainer.style.display = "none";

  let finishContainer = document.getElementById("finish-container");
  finishContainer.style.display = "block";

  let finalScoreElement = document.getElementById("final-score");
  finalScoreElement.textContent = `${score}/10`;

  let commentElement = document.getElementById("comment");

  let percentageScore = (score / 10) * 100;

  if (percentageScore <= 40) {
    commentElement.textContent = "You can do better. Keep trying!";
  } else if (percentageScore <= 60) {
    commentElement.textContent = "Not bad. You're making progress!";
  } else if (percentageScore <= 80) {
    commentElement.textContent = "Great job! You're doing well!";
  } else {
    commentElement.textContent = "Congratulations! You're the best!";
  }
}

function updateScore() {
  document.getElementById("score").textContent = `Score: ${score}/${
    currentQuestion + 1
  }`;
}

function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  document.getElementById("quiz-container").style.display = "block";
  document.getElementById("finish-container").style.display = "none";
  startQuiz();
}

// Ensure the Next button is hidden initially
document.addEventListener("DOMContentLoaded", function () {
  let nextButton = document.getElementById("next-button");
  nextButton.style.display = "none";
  setTimeout(function () {
    nextButton.addEventListener("click", nextQuestion);
  }, 2000);
  nextButton.addEventListener("click", nextQuestion);
});

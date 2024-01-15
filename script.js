let currentQuestion = 0;
let score = 0;
let timerInterval;
let random_number = 0;

let questions = [
  {
    question: "What is the capital of France?",
    options: ["Paris", "Berlin", "London"],
    correctAnswer: "Paris",
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Venus"],
    correctAnswer: "Mars",
  },
  {
    question: "What is the largest mammal?",
    options: ["Elephant", "Blue Whale", "Giraffe"],
    correctAnswer: "Blue Whale",
  },
  {
    question: "Which programming language is known for building web pages?",
    options: ["Java", "Python", "HTML"],
    correctAnswer: "HTML",
  },
  {
    question: "What is the capital of Japan?",
    options: ["Seoul", "Tokyo", "Beijing"],
    correctAnswer: "Tokyo",
  },
  {
    question: "How many continents are there?",
    options: ["5", "6", "7"],
    correctAnswer: "7",
  },
  {
    question: "Which is the largest ocean?",
    options: ["Atlantic", "Indian", "Pacific"],
    correctAnswer: "Pacific",
  },
  {
    question: "What is the currency of Brazil?",
    options: ["Peso", "Real", "Dollar"],
    correctAnswer: "Real",
  },
  {
    question: "Who wrote 'Romeo and Juliet'?",
    options: ["Charles Dickens", "William Shakespeare", "Jane Austen"],
    correctAnswer: "William Shakespeare",
  },
  {
    question: "What is the largest desert in the world?",
    options: ["Sahara", "Arabian", "Antarctica"],
    correctAnswer: "Antarctica",
  },
  {
    question: "In which year did World War II end?",
    options: ["1945", "1939", "1950"],
    correctAnswer: "1945",
  },
  {
    question: "What is the capital of France?",
    options: ["Paris", "Berlin", "London"],
    correctAnswer: "Paris",
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Venus"],
    correctAnswer: "Mars",
  },
  {
    question: "What is the largest mammal?",
    options: ["Elephant", "Blue Whale", "Giraffe"],
    correctAnswer: "Blue Whale",
  },
  {
    question: "Which programming language is known for building web pages?",
    options: ["Java", "Python", "HTML"],
    correctAnswer: "HTML",
  },
  {
    question: "What is the capital of Japan?",
    options: ["Seoul", "Tokyo", "Beijing"],
    correctAnswer: "Tokyo",
  },
  {
    question: "How many continents are there?",
    options: ["5", "6", "7"],
    correctAnswer: "7",
  },
  {
    question: "Which is the largest ocean?",
    options: ["Atlantic", "Indian", "Pacific"],
    correctAnswer: "Pacific",
  },
  {
    question: "What is the currency of Brazil?",
    options: ["Peso", "Real", "Dollar"],
    correctAnswer: "Real",
  },
  {
    question: "Who painted the Mona Lisa?",
    options: ["Vincent van Gogh", "Leonardo da Vinci", "Pablo Picasso"],
    correctAnswer: "Leonardo da Vinci",
  },
  {
    question: "Which element has the chemical symbol 'O'?",
    options: ["Oxygen", "Gold", "Silver"],
    correctAnswer: "Oxygen",
  },
  {
    question: "What is the largest mountain in the world?",
    options: ["K2", "Mount Everest", "Kangchenjunga"],
    correctAnswer: "Mount Everest",
  },
  {
    question: "In which year did the Titanic sink?",
    options: ["1912", "1920", "1905"],
    correctAnswer: "1912",
  },
  // Add more questions as needed
];

function createRandomNumberGenerator(min, max) {
  // Create an array to store generated numbers
  const generatedNumbers = [];

  // Function to generate a unique random number within the specified range
  function getRandomNumber() {
    let randomNumber;

    // Keep generating until a unique number is found
    do {
      randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (generatedNumbers.includes(randomNumber));

    // Add the generated number to the array
    generatedNumbers.push(randomNumber);

    return randomNumber;
  }

  return getRandomNumber;
}
let generateRandomNumber = createRandomNumberGenerator(0, questions.length);

function startQuiz() {
  document.getElementById("quiz-container").style.display = "block";
  document.getElementById("start-quiz").style.display = "none";
  displayQuestion();
}

function displayQuestion() {
  resetTimer();
  updateScore();

  let questionElement = document.getElementById("question");
  let optionsElement = document.getElementById("options");

  let currentQ = questions[random_number];

  questionElement.textContent = `Question ${currentQuestion + 1}: ${
    currentQ.question
  }`;

  optionsElement.innerHTML = "";

  currentQ.options.sort().forEach((option) => {
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
  progressBar.style.animation = "timerAnimation 10s linear"; // Update timer to 10 seconds
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
}

function nextQuestion() {
  let popup = document.getElementById("result-popup");
  let quizContainer = document.querySelector(".quiz-container");

  // Add the fade-out class to trigger the transition animation
  quizContainer.classList.add("fade-out");
  random_number = generateRandomNumber();

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
    showPopup("Time's up! Comming up with the next question.", false);
  } else {
    let userAnswer = selectedOption.value;
    let correctAnswer = questions[currentQuestion].correctAnswer;

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

  score = (score / questions.length) * 100;

  if (score <= 40) {
    commentElement.textContent = "You can do better. Keep trying!";
  } else if (score <= 60) {
    commentElement.textContent = "Not bad. You're making progress!";
  } else if (score <= 80) {
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

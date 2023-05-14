// Declaração de variáveis
const question = document.querySelector("#question");
const answersBox = document.querySelector("#answers-box");
const quizzContainer = document.querySelector("#quizz-container");
const scoreContainer = document.querySelector("#score-container");
const wrongBox = document.querySelector("#perguntas-erradas");
const wrongQuestionsList = document.getElementById("wrong-questions-list");
const letters = ['a', 'b', 'c', 'd'];
let points = 0;
let actualQuestion = 0;
let duracao = true;
let clicks = 0;
const selectedOptions = []; // declara a nova variável aqui

// Perguntas
const questions = [
  {
    "question": "PHP foi desenvolvido para qual fim?",
    "answers": [
      {
        "answer": "back-end",
        "correct": true
      },
      {
        "answer": "front-end",
        "correct": false
      },
      {
        "answer": "Sistema operacional",
        "correct": false
      },
      {
        "answer": "Banco de dados",
        "correct": false
      },
    ]
  },
  {
    "question": "Uma forma de declarar variável em JavaScript:",
    "answers": [
      {
        "answer": "$var",
        "correct": false
      },
      {
        "answer": "var",
        "correct": true
      },
      {
        "answer": "@var",
        "correct": false
      },
      {
        "answer": "#let",
        "correct": false
      },
    ]
  },
  {
    "question": "Qual o seletor de id no CSS?",
    "answers": [
      {
        "answer": "#",
        "correct": true
      },
      {
        "answer": ".",
        "correct": false
      },
      {
        "answer": "@",
        "correct": false
      },
      {
        "answer": "/",
        "correct": false
      },
    ]
  },
]

// Substituição do layout pela primeira questão
function init() {
  relogio();
  createQuestion(0)
  console.log(selectedOptions);
}

// Create a question 
function createQuestion(i) {


  // Limpa questão anterior
  const oldButtons = answersBox.querySelectorAll("button");

  oldButtons.forEach(function (btn) {
    btn.remove();
  });

  // Altera texto da pergunta
  const questionText = question.querySelector("#question-text");
  const questionNumber = question.querySelector("#question-number");

  questionText.textContent = questions[i].question;
  questionNumber.textContent = i + 1;

  // Insere alternativas
  questions[i].answers.forEach(function (answer, i) {

    // Altera texto do template
    const answerTemplate = document.querySelector(".answer-template").cloneNode(true);

    const letterBtn = answerTemplate.querySelector(".btn-letter");
    const answerText = answerTemplate.querySelector(".question-answer");

    letterBtn.textContent = letters[i];
    answerText.textContent = answer['answer'];

    answerTemplate.setAttribute("correct-answer", answer["correct"]);

    // remove classe de hide e template do template
    answerTemplate.classList.remove("hide");
    answerTemplate.classList.remove("answer-template");

    // Insere template na tela
    answersBox.appendChild(answerTemplate);

  });

  // Cria evento em todos os botões
  const buttons = answersBox.querySelectorAll("button");

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      checkAnswer(this, buttons);
      resetTimer(0, 0);
      relogio();
      clicks++;
      if (button.getAttribute("correct-answer") === "false") {
        selectedOptions.push(actualQuestion - 1);
      }
    });
  });


  // Incrementa o número atual de questões
  actualQuestion++;
}


// Verificando se resposta está correta
function checkAnswer(btn, buttons) {

  // Exibir respostas erradas e a certa
  buttons.forEach(function (button) {

    if (button.getAttribute("correct-answer") === "true") {
      button.classList.add("correct-answer");
      // checa se o usuário acertou
      if (btn === button) {
        // incrementa os pontos
        points++;
      }
    } else {
      button.classList.add("wrong-answer");
    }
  });

  nextQuestion();

}

// Exibe a próxima pergunta
function nextQuestion() {

  // Timer para ver se acertou ou errou
  setTimeout(function () {

    // checa se ainda há mais perguntas
    if (actualQuestion >= questions.length) {
      // apresenta msg de sucesso
      showSuccessMessage();
      return;
    }

    createQuestion(actualQuestion)

  }, 1000);

}

// Tela final
function showSuccessMessage() {

  hideOrShowQuizz();

  // calc score
  const score = Math.floor(((points / questions.length) * 100).toFixed(2));
  const scoreDisplay = document.querySelector("#display-score span");

  scoreDisplay.textContent = score.toString();

  // alterar número de perguntas corretas
  const correctAnswers = document.querySelector("#correct-answers");
  correctAnswers.textContent = points;

  // alterar total de perguntas
  const totalQuestions = document.querySelector("#questions-qty");
  totalQuestions.textContent = questions.length;

  if (scoreDisplay.textContent == 100) {
    wrongBox.classList.add("hide");
    mensagem.textContent = "Parabens! 😁";
    confetti.start();
  } else
    if (scoreDisplay.textContent > 50 && scoreDisplay.textContent < 90) {
      wrongBox.classList.remove("hide");
      mensagem.textContent = "Parabens, mas pode melhorar! 🙂";
      confetti.start();
    }
    else if (clicks == 0 && points == 0) {
      const mensagem = document.querySelector("#mensagem");
      wrongBox.classList.add("hide");
      mensagem.textContent = "Que pena! 😭";
    }
    else if  (clicks > 0 && points >= 0){
      const mensagem = document.querySelector("#mensagem");
      wrongBox.classList.remove("hide");
      mensagem.textContent = "Que pena! 😭";
    }

  //aqui ele percorre todo o array, e cada array encontrado, ele imprime a pergunta na tela de acordo o indice da pergunta


  selectedOptions.forEach(function (index) {
    const question = questions[index].question;
    const questionNumber = index + 1;

    // cria um elemento de lista para a resposta errada
    const listItem = document.createElement("li");

    // cria o número e a pergunta e adiciona-os ao elemento de lista
    const questionText = document.createTextNode(questionNumber + " - " + question);
    listItem.appendChild(questionText);

    // adiciona o elemento de lista à lista de perguntas erradas
    wrongQuestionsList.appendChild(listItem);
  });

}

// Reiniciar Quizz
const restartBtn = document.querySelector("#restart");

restartBtn.addEventListener("click", function () {
  actualQuestion = 0;
  points = 0;
  hideOrShowQuizz();
  init();
  confetti.stop();
  selectedOptions.length = 0;
  wrongQuestionsList.innerHTML = "";
  wrongBox.classList.add("hide");
});

// Mostra ou exibe o quizz
function hideOrShowQuizz() {
  quizzContainer.classList.toggle("hide");
  scoreContainer.classList.toggle("hide");
}

// relogio

function startTimer(duration, segundo) {
  var time = duration, seconds;

  intervalo = setInterval(function () {
    seconds = parseInt(time % 60, 10);
    seconds = seconds < 10 ? "0" + seconds : seconds;
    segundo.textContent = seconds;

    if (--time < 0) {
      time = duration;
    }

    if (segundo.textContent == "00") {
      aparecerRespostar();
      nextQuestion();
    } else if (quizzContainer.classList.contains("hide")) {
      resetTimer(0, 0);
    }
  }, 1000);
}

function relogio() {
  if (duracao) {
    var duration = 5;
    var segundo = document.querySelector("#segundos");
    startTimer(duration, segundo);
  }
}

function resetTimer(duration, segundo) {
  clearInterval(intervalo);
  startTimer(duration, segundo);
}

function aparecerRespostar() {
  const buttons = answersBox.querySelectorAll("button");

  buttons.forEach(function (button) {
    if (button.getAttribute("correct-answer") === "true") {
      button.classList.add("correct-answer");
      // checa se o usuário acertou
    } else {
      button.classList.add("wrong-answer");
    }
  });
}

// Inicialização
init();




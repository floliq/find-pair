(function () {
  let list = [];
  let cards = null;
  let [isFlippedCard, lockBoard] = [false, false];
  let [firstCard, secondCard] = [null, null];
  let [firstValue, secondValue] = [null, null];
  let inputCount = document.getElementById("count");
  let inputTime = document.getElementById("timer");
  let time = 0;
  let started = false;
  let score = 0;
  let countPairs = 0;
  let interval;

  function createNumbersArray(count) {
    if (count < 2 || count > 10 || count % 2 != 0) {
      count = 4;
      inputCount.value = 4;
      countPairs = 4;
    }
    list = [];
    for (let i = 1; i < count + 1; i++) {
      list.push(i, i);
    }
  }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  function startGame(count) {
    createNumbersArray(count);
    shuffle(list);
    if (started) removeCards();
    createCards();
    interval = setInterval(startTimer, 1000);
  }

  function loseGame(){
    cards.forEach((card) =>{
      card.classList.add("flip");
      card.removeEventListener("click", flipCard);
    })
  }

  function startTimer() {
    let timer = document.querySelector(".game__result-seconds");
    time--;
    timer.textContent = time;
    if (time==0) {
      document.querySelector(".game__result").textContent = "Ты проиграл";
      loseGame();
      clearInterval(interval);
    }
  }


  function removeCards() {
    cards.forEach((card) => card.remove());
  }

  function createCards() {
    for (num of list) {
      let card = document.createElement("div");
      card.classList.add("game__card", "col-3", "d-flex");
      let face = document.createElement("span");
      face.classList.add(
        "game__face",
        "d-flex",
        "justify-content-center",
        "align-items-center"
      );
      face.textContent = num;
      let back = document.createElement("span");
      back.classList.add(
        "game__back",
        "d-flex",
        "justify-content-center",
        "align-items-center"
      );
      back.textContent = "?";
      card.append(face);
      card.append(back);
      document.querySelector(".game__cards").append(card);
    }
    cards = document.querySelectorAll(".game__card");
    cards.forEach((card) => card.addEventListener("click", flipCard));
    started = true;
  }

  function createGame() {
    score = 0;
    time = parseInt(inputTime.value);
    document.querySelector(
      ".game__result"
    ).innerHTML = `Счет: <span class="game__result-score">${score}</span> Время: <span class="game__result-seconds">${time}</span>`;
    let count = parseInt(inputCount.value);
    timer.textContent = time;
    countPairs = count;
    startGame(count);
  }

  function flipCard() {
    let item = event.target.parentElement;
    if (lockBoard) return lockBoard;
    if (event.target.parentElement == firstCard) return firstCard;
    item.classList.add("flip");
    if (!isFlippedCard) {
      isFlippedCard = true;
      firstCard = event.target.parentElement;
      firstValue = parseInt(firstCard.children[0].textContent);
      return;
    }
    secondCard = event.target.parentElement;
    secondValue = parseInt(secondCard.children[0].textContent);
    firstValue == secondValue ? disableCards() : unflipCards();
  }

  function resetBoard() {
    [isFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
  }

  function disableCards() {
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);
    let scoreText = document.querySelector(".game__result-score");
    score += 1;
    scoreText.textContent = score;
    resetBoard();
    if (score == countPairs) {
      document.querySelector(".game__result").textContent = "Ты победил";
      clearInterval(interval);
    }
  }

  function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
      firstCard.classList.remove("flip");
      secondCard.classList.remove("flip");
      resetBoard();
    }, 1000);
  }

  window.createGame = createGame;
})();

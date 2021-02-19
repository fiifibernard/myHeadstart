
// Chanllenge 5 Blackjack
document.querySelector("#hit-button").addEventListener("click", blackjackHit);
document
  .querySelector("#stand-button")
  .addEventListener("click", blackjackStand);
/* document.querySelector('#deal-button').addEventListener('click', blackjackdeal); */
document
  .querySelector("#reset-button")
  .addEventListener("click", blackjackReset);

let blackjackgame = {
  you: { div: "#you-box", spanScore: "#you-results", score: 0 },
  dealer: { div: "#dealer-box", spanScore: "#dealer-results", score: 0 },
  card: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "j", "k", "q", "a"],
  value: {
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "10": 10,
    j: 10,
    k: 10,
    q: 10,
    a: [1, 11],
  },
  wins: 0,
  losses: 0,
  draws: 0,
  isHit: false,
  isStand: false,
  turnsOver: false,
  isBust: false,
  fullName: function () {},
};
var myArray = Object.values(blackjackgame.value);
var myStr = JSON.stringify(blackjackgame);


const YOU = blackjackgame.you;
const DEALER = blackjackgame.dealer;

const hitSound = new Audio("sounds/swish.m4a");
const bustSound = new Audio("sounds/bust.mp3");
const winSound = new Audio("sounds/win.mp3");
const lostSound = new Audio("sounds/aww.mp3");
const resetSound = new Audio("sounds/cash.mp3")

function blackjackHit() {
  if (
    blackjackgame.isStand === false &&
    blackjackgame.isBust === false &&
    blackjackgame.turnsOver === false
  ) {
    outcome(YOU); //{'div':'#you-box', 'spanScore':'#you-results', 'score':0}
    bustCheck(YOU);
    if (YOU.score > 21) {
      showResults(computeWinner());
    }
    blackjackgame.isHit = true;
  }
}

async function blackjackStand() {
  if (blackjackgame.isHit === true && 
        blackjackgame.isBust === false) {
    
    while (DEALER.score < 18) {
                outcome(DEALER); //{'div': '#dealer-box', 'spanScore': '#dealer-results', 'score': 0}
                bustCheck(DEALER);
                await sleep(1000);
    }
    showResults(computeWinner());
    blackjackgame.isStand = true;
    blackjackgame.turnsOver = true;
  }
}

function blackjackReset() {
  resetFuntion();
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function outcome(playerTurn) {
  var randomIndex = Math.floor(Math.random() * 13);
  let selectedCard = blackjackgame.card[randomIndex];
  let cardValue = blackjackgame.value[selectedCard];
  showCard(selectedCard, playerTurn);
  scoreUpdates(selectedCard, cardValue, playerTurn);
  hitSound.play();
}

function bustCheck(playerTurn) {
  if (playerTurn["score"] > 21) {
    document.querySelector(playerTurn["spanScore"]).textContent = "BUST!";
    document.querySelector(playerTurn["spanScore"]).style.color = "red";
    bustSound.play();
    blackjackgame.isBust = true;
  } else {
    document.querySelector(playerTurn["spanScore"]).textContent =
      playerTurn["score"];
  }
}

function showCard(selectedCard, playerTurn) {
  let cardImage = document.createElement("img");
  cardImage.src = `img/bjimages/${selectedCard}.png`;
  if (playerTurn["score"] <= 21) {
    document.querySelector(playerTurn["div"]).appendChild(cardImage);
  }
}

function scoreUpdates(selectedCard, cardValue, playerTurn) {
  if (selectedCard === "a") {
    if (playerTurn["score"] + cardValue[1] <= 21) {
      playerTurn["score"] += cardValue[1];
    } else {
      playerTurn["score"] += cardValue[0];
    }
  } else {
    playerTurn["score"] += cardValue;
  }
}

function computeWinner() {
  let winner;

  if (YOU.score <= 21) {
    if (YOU.score > DEALER.score || DEALER.score > 21) {
      winner = YOU;
      blackjackgame["wins"]++;
    } else if (YOU.score < DEALER.score) {
      winner = DEALER;
      blackjackgame["losses"]++;
    } else if (YOU.score === DEALER.score) {
      blackjackgame["draws"]++;
    }
  } else if (YOU.score > 21 && DEALER.score <= 21) {
    winner = DEALER;
    blackjackgame["losses"]++;
  } else if (YOU.score > 21 && DEALER.score > 21) {
    blackjackgame["draws"]++;
  }
  return winner;
}

function showResults(winner) {
  let message, messagecolor;

  if (winner === YOU) {
    message = "You Won!";
    messagecolor = "green";
    winSound.play();
    document.querySelector("#wins").innerHTML = blackjackgame["wins"];
  } else if (winner === DEALER) {
    message = "You Lost!";
    messagecolor = "red";
    lostSound.play();
    document.querySelector("#losses").textContent = blackjackgame["losses"];
  } else {
    message = "You Drew!";
    messagecolor = "yellow";
    lostSound.play();
    document.querySelector("#draws").textContent = blackjackgame["draws"];
  }

  document.querySelector("#blackjack-result").textContent = message;
  document.querySelector("#blackjack-result").style.color = messagecolor;
}

function resetFuntion() {
    if (blackjackgame.isStand ===true){
        resetSound.play();
    }
  let youBoxImages = document.querySelector("#you-box").querySelectorAll("img");
  let dealBoxImages = document
    .querySelector("#dealer-box")
    .querySelectorAll("img");

  for (i = 0; i < youBoxImages.length; i++) {
    youBoxImages[i].remove();
  }
  for (i = 0; i < dealBoxImages.length; i++) {
    dealBoxImages[i].remove();
  }

  YOU.score = 0;
  DEALER.score = 0;

  blackjackgame.isHit = false;
  blackjackgame.isStand = false;
  blackjackgame.turnsOver = false;
  blackjackgame.isBust = false;

  document.querySelector("#you-results").textContent = 0;
  document.querySelector("#dealer-results").textContent = 0;
  document.querySelector("#you-results").style.color = "white";
  document.querySelector("#dealer-results").style.color = "white";
  document.querySelector("#blackjack-result").textContent = "Lets play";
  document.querySelector("#blackjack-result").style.color = "black";
}

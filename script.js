const diceButtons = document.querySelectorAll('.dice');
const rollButton = document.getElementById('roll-button');
// const endTurnButton = document.getElementById('end-turn-button');
const scoringCategories = document.querySelectorAll('.category');
const upperSection = document.getElementById('upper-section');
const lowerSection = document.getElementById('lower-section');
const rollsLeftDisplay = document.getElementById('rolls-left');
const totalScoreDisplay = document.getElementById('total-score');
const diceHolds = [false, false, false, false, false];
let rollsLeft = 3;
let gameRound = 0;
let totalScore = 0;

function toggleHold(index) {
  if (rollsLeft > 2 || rollsLeft < 1) {
    return;
  }

  diceHolds[index] = !diceHolds[index];
  diceButtons[index].classList.toggle('hold');
}

function rollDice() {
  if (rollsLeft > 3) {
    endTurn();
  }
  if (rollsLeft > 0) {
    diceButtons.forEach((diceButton, index) => {
      if (!diceHolds[index]) {
        const randomNumber = Math.floor(Math.random() * 6) + 1;
        diceButton.textContent = randomNumber;
      }
    });
    rollsLeft--;
    rollsLeftDisplay.textContent = `Rolls Left: ${rollsLeft}`;
    if (rollsLeft === 0) {
      rollButton.disabled = true;
      // endTurnButton.disabled = false;
    }
  }
}

function scoreCategory(category) {
  if (rollsLeft > 2) {
    return;
  }
  const categoryElement = scoringCategories[category - 1];
  if (!categoryElement.classList.contains('scored')) {
    categoryElement.classList.add('scored');
    const diceValues = Array.from(diceButtons).map(diceButton => parseInt(diceButton.textContent));
    let categoryScore = 0;
    switch (category) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
        categoryScore = diceValues.filter(diceValue => diceValue === category).reduce((a, b) => a + b, 0);
        break;
      case 7:
        if (checkForMatching(diceValues, 3))
          categoryScore = diceValues.reduce((a, b) => a + b, 0);
        break;
      case 8:
        if (checkForMatching(diceValues, 4))
          categoryScore = diceValues.reduce((a, b) => a + b, 0);
        break;
      case 9:
        if (checkForFullHouse(diceValues))
          categoryScore = 25;
        break;
      case 10:
        if (checkForStraight(diceValues, 4))
          categoryScore = 30;
        break;
      case 11:
        if (checkForStraight(diceValues, 5))
          categoryScore = 30;
        break;
      case 12:
        if (checkForMatching(diceValues, 5))
          categoryScore = 50;
        break;
      case 13:
        categoryScore = diceValues.reduce((a, b) => a + b, 0);
        break;
    }
    totalScore += categoryScore;
    console.log('Category Score:', categoryScore);
    console.log('Total Score:', totalScore);
    totalScoreDisplay.textContent = `Total Score: ${totalScore}`;
    endTurn(category);
  }
}

function endTurn(category) {
  if (gameRound < scoringCategories.length) {
    scoringCategories[category - 1].classList.add('scored');
    gameRound++;
    rollsLeft = 3;
    rollsLeftDisplay.textContent = `Rolls Left: ${rollsLeft}`;
    rollButton.disabled = false;
    // endTurnButton.disabled = true;
    resetHolds(); // Reset dice holds after a new round
  }
}

function resetHolds() {
  diceHolds.fill(false);
  diceButtons.forEach(diceButton => {
    diceButton.classList.remove('hold');
  });
}

function checkForMatching(diceValues, count) {
  const frequency = {};
  for (let i = 0; i < diceValues.length; i++) {
    const value = diceValues[i];
    frequency[value] = (frequency[value] || 0) + 1;
  }
  return Object.values(frequency).some(value => value >= count);
}

function checkForFullHouse(diceValues) {
  const frequency = {};
  for (let i = 0; i < diceValues.length; i++) {
    const value = diceValues[i];
    frequency[value] = (frequency[value] || 0) + 1;
  }
  return Object.values(frequency).length === 2 && Object.values(frequency).every(value => value === 2 || value === 3);
}

function checkForStraight(diceValues, count) {
  const uniqueValues = [...new Set(diceValues)].sort((a, b) => a - b);
  for (let i = 0; i < uniqueValues.length - count + 1; i++) {
    let isStraight = true;
    for (let j = i; j < i + count - 1; j++) {
      if (uniqueValues[j + 1] - uniqueValues[j] !== 1) {
        isStraight = false;
        break;
      }
    }
    if (isStraight)
      return true;
  }
  return false;
}

function toggleMenu() {
  var hamburger = document.querySelector('.hamburger');
  var menu = document.querySelector('.menu');

  // Toggle the "open" class on the hamburger menu
  hamburger.classList.toggle('open');

  // Display or hide the reload button based on the menu state
  menu.style.display = hamburger.classList.contains('open') ? 'block' : 'none';
}

function reloadPage() {
  location.reload();
}

function newGame() {
    // Reset game state variables
    rollsLeft = 3;
    currentTurn = 0;
    totalScore = 0;
    diceHolds.fill(false);

    // Reset dice buttons and scoring categories
    diceButtons.forEach((diceButton) => {
        diceButton.textContent = '-';
        diceButton.classList.remove('hold');
    });
    scoringCategories.forEach((category) => {
        category.classList.remove('scored');
    });

    // Reset display elements
    rollsLeftDisplay.textContent = `Rolls Left: ${rollsLeft}`;
    totalScoreDisplay.textContent = `Total Score: ${totalScore}`;

    // Enable roll button and disable end turn button
    rollButton.disabled = false;
    endTurnButton.disabled = true;
}
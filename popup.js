let targetNumber;
let attempts = 0;
let maxAttempts;
let score = 0;
let highScore = 0;
let difficulty = 'medium';
let maxNumber = 100;

function startNewGame() {
  difficulty = document.getElementById('difficultySelect').value;
  switch (difficulty) {
    case 'easy':
      maxNumber = 50;
      maxAttempts = 8;
      break;
    case 'medium':
      maxNumber = 100;
      maxAttempts = 10;
      break;
    case 'hard':
      maxNumber = 200;
      maxAttempts = 12;
      break;
  }
  
  targetNumber = Math.floor(Math.random() * maxNumber) + 1;
  attempts = 0;
  updateMessage(`Game started! Guess a number between 1 and ${maxNumber}.`);
  updateAttemptCount();
  updateScore();
  document.getElementById('submitGuess').style.display = 'block';
  document.getElementById('newGame').style.display = 'none';
  document.getElementById('guessInput').value = '';
  document.getElementById('guessInput').focus();
  document.getElementById('hint').textContent = '';
  document.getElementById('guessInput').max = maxNumber;
  document.getElementById('hint').style.display = 'none';
}

function updateMessage(msg) {
  const messageElement = document.getElementById('message');
  let icon = '';
  if (msg.includes('Congratulations')) {
    icon = '<i class="fas fa-crown"></i> ';
  } else if (msg.includes('Game over')) {
    icon = '<i class="fas fa-times-circle"></i> ';
  } else if (msg.includes('freezing cold')) {
    icon = '<i class="fas fa-snowflake"></i> ';
  } else if (msg.includes('cold')) {
    icon = '<i class="fas fa-thermometer-quarter"></i> ';
  } else if (msg.includes('warm')) {
    icon = '<i class="fas fa-thermometer-half"></i> ';
  } else if (msg.includes('hot')) {
    icon = '<i class="fas fa-thermometer-three-quarters"></i> ';
  } else if (msg.includes('burning hot')) {
    icon = '<i class="fas fa-fire"></i> ';
  }
  messageElement.innerHTML = icon + msg;
}

function updateAttemptCount() {
  document.querySelector('#attemptCount span').textContent = `Attempts: ${attempts}/${maxAttempts}`;
}

function updateScore() {
  document.querySelector('#score span').textContent = `Score: ${score}`;
  document.querySelector('#highScore span').textContent = `High Score: ${highScore}`;
}

function handleGuess() {
  const guessInput = document.getElementById('guessInput');
  const guess = parseInt(guessInput.value);

  if (isNaN(guess) || guess < 1 || guess > maxNumber) {
    updateMessage(`Please enter a valid number between 1 and ${maxNumber}.`);
    return;
  }

  attempts++;
  updateAttemptCount();

  if (guess === targetNumber) {
    const newScore = calculateScore();
    score += newScore;
    highScore = Math.max(highScore, score);
    updateMessage(`Congratulations! You guessed the number in ${attempts} attempts. You earned ${newScore} points!`);
    updateScore();
    playCongratsSound(); // Add this line to play the sound
    endGame(true);
  } else if (attempts >= maxAttempts) {
    updateMessage(`Game over! The number was ${targetNumber}. You've used all ${maxAttempts} attempts.`);
    endGame(false);
  } else {
    const difference = Math.abs(guess - targetNumber);
    let message = '';
    if (difference > 50) {
      message = 'You\'re freezing cold!';
    } else if (difference > 25) {
      message = 'You\'re cold!';
    } else if (difference > 10) {
      message = 'You\'re warm!';
    } else if (difference > 5) {
      message = 'You\'re hot!';
    } else {
      message = 'You\'re burning hot!';
    }
    updateMessage(`${guess < targetNumber ? 'Too low' : 'Too high'}! ${message}`);
    
    if (attempts === Math.floor(maxAttempts / 2)) {
      provideHint();
    }
  }

  guessInput.value = '';
  guessInput.focus();
}

function calculateScore() {
  const baseScore = maxNumber - (attempts - 1) * 10;
  const difficultyMultiplier = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3;
  return Math.max(baseScore, 10) * difficultyMultiplier;
}

function provideHint() {
  const hintElement = document.querySelector('#hint span');
  const lowerBound = Math.max(1, targetNumber - 10);
  const upperBound = Math.min(maxNumber, targetNumber + 10);
  hintElement.textContent = `The number is between ${lowerBound} and ${upperBound}`;
  document.getElementById('hint').style.display = 'block';
}

function endGame(won) {
  document.getElementById('submitGuess').style.display = 'none';
  document.getElementById('newGame').style.display = 'block';
}

function playCongratsSound() {
  const audio = document.getElementById('congratsSound');
  audio.play();
}

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('submitGuess').addEventListener('click', handleGuess);
  document.getElementById('newGame').addEventListener('click', startNewGame);
  document.getElementById('guessInput').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
      handleGuess();
    }
  });
  document.getElementById('difficultySelect').addEventListener('change', startNewGame);
  startNewGame();
});

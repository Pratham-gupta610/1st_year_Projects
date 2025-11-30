'use strict';

/* NOTE: 
   'use strict' enables Strict Mode in JavaScript.
   This helps catch common mistakes (like using undeclared variables)
   and enforces safer, cleaner coding practices.
*/

// console.log(document.querySelector('.message').textContent);
/* NOTE:
   document → refers to the entire HTML page.
   querySelector('.message') → selects the first HTML element with the class "message".
   textContent → reads the text inside that element.
   console.log(...) → prints that text in the browser console for debugging.
   So this line prints the initial message shown on the webpage (like "Start guessing...").
*/

// document.querySelector('.message').textContent = '🥳🎉CORRECT NUMBER!!';
/* NOTE:
   This line changes the text inside the element with class "message"
   to "🥳🎉CORRECT NUMBER!!".
   It updates what the user sees in the browser (the message section).
*/

// console.log(document.querySelector('.message').textContent);
/* NOTE:
   Logs the updated message ("🥳🎉CORRECT NUMBER!!") to confirm it changed successfully.
*/

// document.querySelector('.number').textContent = 13;
/* NOTE:
   Selects the element with class "number" (usually shows '?')
   and replaces its text with 13 — the correct number in the guessing game.
*/

// document.querySelector('.score').textContent = 10;
/* NOTE:
   Selects the element with class "score"
   and changes its displayed number to 20 — simulating the player’s score.
*/

// document.querySelector('.guess').value = 23;
/* NOTE:
   Selects the input box with class "guess".
   The property 'value' is used to read or set what’s typed inside an input field.
   Here we set it to 23 — as if the player typed that number in manually.
*/

// console.log(document.querySelector('.guess').value);

/* NOTE:
   Logs the current value of the input box to verify it worked.
   It will print 23 in the console.
*/
let secretNumber = Math.trunc(Math.random() * 100) + 1;

let score = 20;
let highscore = 0;

document.querySelector('.check').addEventListener('click', function () {
  const guess = Number(document.querySelector('.guess').value);
  /*NOTE: we used number as the ouput here will be string number..so to convert it into number ..we did so
  const input = "5";
console.log(input + 1);        // "51" → string concatenation
console.log(Number(input) + 1); // 6   → numeric addition
*/
  console.log(guess, typeof guess);
  if (!guess) {
    document.querySelector('.message').textContent = '🚫NO NUMBER INPUT !!🚫';
    //IMP_NOTE: We can also use a function to call this as it is used multiple times in the code
  } else if (guess === secretNumber) {
    document.querySelector('.message').textContent = '🥳🎉CORRECT NUMBER!!';

    document.querySelector('.number').textContent = secretNumber;
    document.querySelector('body').style.backgroundColor = '#60b347';
    document.querySelector('.number').style.width = '30rem';

    if (highscore < score) {
      highscore = score;
      document.querySelector('.highscore').textContent = highscore;
    }
  } else if (guess !== secretNumber) {
    if (score > 1) {
      document.querySelector('.message').textContent =
        guess > secretNumber ? '📈📈GUESSED HIGH🫷🫷!!' : '📉📉GUESSED LOW🫷🫷!!';
      score--;
      document.querySelector('.score').textContent = score;
    } else {
      document.querySelector('.message').textContent = '💥YOU LOST THE GAME💥';
      document.querySelector('.score').textContent = 0;
    }
  }

  //   else if (guess > secretNumber) {
  //     if (score > 1) {
  //       document.querySelector('.message').textContent = '📈📈GUESSED HIGH🫷🫷!!';
  //       score--;
  //       document.querySelector('.score').textContent = score;
  //     } else {
  //       document.querySelector('.message').textContent = '💥YOU LOST THE GAME💥';
  //       document.querySelector('.score').textContent = 0;
  //     }
  //   } else if (guess < secretNumber) {
  //     if (score > 1) {
  //       document.querySelector('.message').textContent = '📉📉GUESSED LOW🫷🫷!!';
  //       score--;
  //       document.querySelector('.score').textContent = score;
  //     } else {
  //       document.querySelector('.message').textContent = '💥YOU LOST THE GAME💥';
  //       document.querySelector('.score').textContent = 0;
  //     }
  //   }
});

document.querySelector('.again').addEventListener('click', function () {
  // NOTE: This 'click' event listener is attached to the button with class '.again'.
  // When the player clicks the "Again!" button, the following code block will execute.
  // It basically resets the game to its initial state so that the player can play again.

  score = 20;
  // NOTE: Reset the score back to its starting value (20) when the game restarts.

  secretNumber = Math.trunc(Math.random() * 100) + 1;
  /* NOTE: We generate a new secret number again between 1 and 20.
     Math.random() gives a decimal number between 0 and 1 (like 0.5634).
     Multiplying by 20 gives a value between 0 and 19.999.
     Math.trunc() removes the decimal part (e.g., 19.999 → 19).
     Adding +1 shifts the range from 0–19 to 1–20.
     So every new round has a fresh random number to guess.
  */

  document.querySelector('.message').textContent = 'Start guessing...';
  /* NOTE: Reset the message area text back to its original message.
     This message guides the player that the game has restarted.
  */

  //   displayMessage('Start guessing...');
  // NOTE: This line is commented out — it's an alternative way to display the message
  // if we had created a helper function like displayMessage(message). But here, we directly used textContent.

  document.querySelector('.score').textContent = score;
  // NOTE: Update the score on the webpage back to 20 — reflecting the reset value.

  document.querySelector('.number').textContent = '?';
  /* NOTE: Hide the previously revealed secret number by replacing it with a question mark.
     This indicates that the secret number is "hidden" again.
  */

  document.querySelector('.guess').value = '';
  /* NOTE: Clear the input field where the user types their guess.
     This ensures that no previous input remains when starting a new game.
  */

  document.querySelector('body').style.backgroundColor = '#222';
  /* NOTE: Reset the background color of the body back to the original dark color.
     Earlier, when the player guessed correctly, we changed it to green (#60b347).
     Now it returns to the normal dark gray background.
  */

  document.querySelector('.number').style.width = '15rem';
  /* NOTE: Reset the width of the element displaying the secret number back to its default size (15rem).
     When the player wins, the width was increased to 30rem to highlight the win.
     So this line visually resets that style.
  */
});

// document.querySelector('.again').addEventListener('click', function () {
//   score = 20;
//   secretNumber = Math.trunc(Math.random() * 20) + 1;

//   document.querySelector('.message').textContent = 'Start guessing...';
//   //   displayMessage('Start guessing...');
//   document.querySelector('.score').textContent = score;
//   document.querySelector('.number').textContent = '?';
//   document.querySelector('.guess').value = '';

//   document.querySelector('body').style.backgroundColor = '#222';
//   document.querySelector('.number').style.width = '15rem';
// });

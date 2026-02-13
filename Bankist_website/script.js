'use strict';

/////////////////////////////////////////////////
// BANKIST APP - Data
/////////////////////////////////////////////////
const saveAccounts = function () {
  localStorage.setItem('accounts', JSON.stringify(accounts));
};

const loadAccounts = function () {
  const data = localStorage.getItem('accounts');
  if (data) {
    const loadedAccounts = JSON.parse(data);
    accounts.splice(0, accounts.length, ...loadedAccounts);
  }
};

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2,
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-07-26T17:01:17.194Z',
    '2020-07-28T23:36:17.929Z',
    '2020-08-01T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'en-US',
  transactionDetails: [
    { type: 'Initial Deposit' },
    { type: 'Initial Deposit' },
    { type: 'Initial Deposit' },
    { type: 'Initial Deposit' },
    { type: 'Initial Deposit' },
    { type: 'Initial Deposit' },
    { type: 'Initial Deposit' },
    { type: 'Initial Deposit' },
  ],
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
  transactionDetails: [
    { type: 'Initial Deposit' },
    { type: 'Initial Deposit' },
    { type: 'Initial Deposit' },
    { type: 'Initial Deposit' },
    { type: 'Initial Deposit' },
    { type: 'Initial Deposit' },
    { type: 'Initial Deposit' },
    { type: 'Initial Deposit' },
  ],
};

const accounts = [account1, account2];

// Load accounts from localStorage on page load
loadAccounts();

/////////////////////////////////////////////////
// Elements
/////////////////////////////////////////////////

const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');
const btnCreateAccount = document.querySelector('.btn--create-account');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const modalAccount = document.querySelector('.modal-account');
const overlayAccount = document.querySelector('.overlay-account');
const btnCloseModal = document.querySelector('.btn--close-modal');
const accountCreatedMessage = document.querySelector('.account-created-message');

// Transaction Details Modal Elements
const modalTransactionDetails = document.querySelector('.modal-transaction-details');
const overlayTransactionDetails = document.querySelector('.overlay-transaction-details');
const btnCloseTransactionModal = document.querySelector('.btn--close-transaction-modal');

/////////////////////////////////////////////////
// Functions
/////////////////////////////////////////////////

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const combinedMovsDates = acc.movements.map((mov, i) => ({
    movement: mov,
    movementDate: acc.movementsDates.at(i),
    transactionDetails: acc.transactionDetails?.at(i) || null,
  }));

  if (sort) combinedMovsDates.sort((a, b) => a.movement - b.movement);

  combinedMovsDates.forEach(function (obj, i) {
    const { movement, movementDate, transactionDetails } = obj;
    const type = movement > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(movementDate);
    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = formatCur(movement, acc.locale, acc.currency);

    // Format full date and time for details
    const fullDateTime = new Intl.DateTimeFormat(acc.locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);

    const html = `
      <div class="movements__row" data-index="${i}">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });

  // Add click event listeners to all movement rows
  document.querySelectorAll('.movements__row').forEach((row) => {
    row.addEventListener('click', function () {
      const index = this.dataset.index;
      const movement = combinedMovsDates[index];
      const date = new Date(movement.movementDate);
      
      const fullDateTime = new Intl.DateTimeFormat(acc.locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }).format(date);

      // Show transaction details modal
      showTransactionDetails(movement, fullDateTime, acc);
    });
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    const names = acc.owner.toLowerCase().split(' ');
    // First letter from first word + first letter from last word
    if (names.length === 1) {
      acc.username = names[0].substring(0, 2);
    } else {
      acc.username = names[0][0] + names[names.length - 1][0];
    }
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  displayMovements(acc);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
};

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }

    time--;
  };

  let time = 120;

  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};

///////////////////////////////////////
// Event handlers
///////////////////////////////////////

// Show Transaction Details Modal
const showTransactionDetails = function (movement, fullDateTime, acc) {
  const modal = document.querySelector('.modal-transaction-details');
  const overlay = document.querySelector('.overlay-transaction-details');
  
  const type = movement.movement > 0 ? 'Deposit' : 'Withdrawal';
  const formattedAmount = formatCur(movement.movement, acc.locale, acc.currency);
  
  let detailsHTML = `
    <div class="transaction-detail-row">
      <span class="detail-label">Amount:</span>
      <span class="detail-value ${movement.movement > 0 ? 'positive' : 'negative'}">${formattedAmount}</span>
    </div>
    <div class="transaction-detail-row">
      <span class="detail-label">Date & Time:</span>
      <span class="detail-value">${fullDateTime}</span>
    </div>
    <div class="transaction-detail-row">
      <span class="detail-label">Type:</span>
      <span class="detail-value">${type}</span>
    </div>
  `;
  
  if (movement.transactionDetails) {
    if (movement.transactionDetails.from) {
      detailsHTML += `
        <div class="transaction-detail-row">
          <span class="detail-label">From:</span>
          <span class="detail-value">${movement.transactionDetails.from}</span>
        </div>
      `;
    }
    if (movement.transactionDetails.to) {
      detailsHTML += `
        <div class="transaction-detail-row">
          <span class="detail-label">To:</span>
          <span class="detail-value">${movement.transactionDetails.to}</span>
        </div>
      `;
    }
    if (movement.transactionDetails.type) {
      detailsHTML += `
        <div class="transaction-detail-row">
          <span class="detail-label">Transaction Type:</span>
          <span class="detail-value">${movement.transactionDetails.type}</span>
        </div>
      `;
    }
  }
  
  document.querySelector('.transaction-details-content').innerHTML = detailsHTML;
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeTransactionDetails = function () {
  const modal = document.querySelector('.modal-transaction-details');
  const overlay = document.querySelector('.overlay-transaction-details');
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

let currentAccount, timer;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === +inputLoginPin.value) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Initialize transactionDetails array if it doesn't exist
    if (!currentAccount.transactionDetails) {
      currentAccount.transactionDetails = [];
    }
    if (!receiverAcc.transactionDetails) {
      receiverAcc.transactionDetails = [];
    }

    // Add transaction details for sender
    currentAccount.transactionDetails.push({
      type: 'Transfer',
      to: receiverAcc.owner,
      toUsername: receiverAcc.username,
    });

    // Add transaction details for receiver
    receiverAcc.transactionDetails.push({
      type: 'Transfer',
      from: currentAccount.owner,
      fromUsername: currentAccount.username,
    });

    updateUI(currentAccount);

    // Save accounts after transfer
    saveAccounts();

    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      currentAccount.movements.push(amount);

      currentAccount.movementsDates.push(new Date().toISOString());

      // Initialize transactionDetails array if it doesn't exist
      if (!currentAccount.transactionDetails) {
        currentAccount.transactionDetails = [];
      }

      // Add transaction details for loan
      currentAccount.transactionDetails.push({
        type: 'Loan Approved',
        from: 'Bankist Bank',
      });

      updateUI(currentAccount);
// 
      // Save accounts after loan
      saveAccounts();

      clearInterval(timer);
      timer = startLogOutTimer();
    }, 2500);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    accounts.splice(index, 1);

    // Save accounts after closing
    saveAccounts();

    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

///////////////////////////////////////
// CREATE ACCOUNT FUNCTIONALITY
///////////////////////////////////////

const openModal = function () {
  modalAccount.classList.remove('hidden');
  overlayAccount.classList.remove('hidden');
  accountCreatedMessage.classList.add('hidden');
  document.querySelector('.modal__form').classList.remove('hidden');
};

const closeModal = function () {
  modalAccount.classList.add('hidden');
  overlayAccount.classList.add('hidden');
  document.querySelector('.modal__form').reset();
};

btnCreateAccount.addEventListener('click', openModal);
btnCloseModal.addEventListener('click', closeModal);
overlayAccount.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modalAccount.classList.contains('hidden')) {
    closeModal();
  }
});

// Handle Create Account Form Submission
document.querySelector('.modal__form').addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('account-name').value;
  const deposit = +document.getElementById('account-deposit').value;
  const interest = +document.getElementById('account-interest').value;
  const pin = +document.getElementById('account-pin').value;
  const currency = document.getElementById('account-currency').value;
  const locale = document.getElementById('account-locale').value;

  // Validate PIN is 4 digits
  if (pin < 1000 || pin > 9999) {
    alert('PIN must be exactly 4 digits!');
    return;
  }

  // Validate deposit
  if (deposit < 100) {
    alert('Minimum initial deposit is €100');
    return;
  }

  // Create new account object
  const newAccount = {
    owner: name,
    movements: [deposit],
    interestRate: interest,
    pin: pin,
    movementsDates: [new Date().toISOString()],
    currency: currency,
    locale: locale,
    transactionDetails: [{ type: 'Initial Deposit' }],
  };

  // Generate username - first letter of first word + first letter of last word
  const names = name.toLowerCase().split(' ');
  if (names.length === 1) {
    newAccount.username = names[0].substring(0, 2);
  } else {
    newAccount.username = names[0][0] + names[names.length - 1][0];
  }

  // Add to accounts array
  accounts.push(newAccount);

  // Save accounts to localStorage
  saveAccounts();

  // Show success message
  document.querySelector('.modal__form').classList.add('hidden');
  accountCreatedMessage.classList.remove('hidden');
  document.getElementById('new-username').textContent = newAccount.username;

  // Auto close modal after 3 seconds
  setTimeout(() => {
    closeModal();
  }, 3000);
});

///////////////////////////////////////
// TRANSACTION DETAILS MODAL
///////////////////////////////////////

document.addEventListener('click', function (e) {
  if (e.target.classList.contains('btn--close-transaction-modal')) {
    closeTransactionDetails();
  }
  if (e.target.classList.contains('overlay-transaction-details')) {
    closeTransactionDetails();
  }
});

document.addEventListener('keydown', function (e) {
  const modal = document.querySelector('.modal-transaction-details');
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeTransactionDetails();
  }
});
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
    // Regenerate usernames for loaded accounts
    createUsernames(accounts);
  }
};

// Generate unique 7-digit account number
const generateAccountNumber = function() {
  let accountNumber;
  do {
    accountNumber = Math.floor(1000000 + Math.random() * 9000000).toString();
  } while (accounts.some(acc => acc.accountNumber === accountNumber));
  return accountNumber;
};

const account1 = {
  owner: 'Jonas Schmedtmann',
  accountNumber: '1234567',
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
  accountNumber: '2345678',
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

const account3 = {
  owner: 'Raj Kumar',
  accountNumber: '3456789',
  movements: [10000, 5000, -2500, -1000, 15000, -3000, 8000, -500],
  interestRate: 1.8,
  pin: 3333,
  movementsDates: [
    '2019-10-15T08:30:00.000Z',
    '2019-11-20T12:45:00.000Z',
    '2019-12-10T15:20:00.000Z',
    '2020-01-05T09:30:00.000Z',
    '2020-02-14T14:00:00.000Z',
    '2020-03-25T11:15:00.000Z',
    '2020-05-18T16:45:00.000Z',
    '2020-06-30T10:00:00.000Z',
  ],
  currency: 'INR',
  locale: 'en-IN',
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

const accounts = [account1, account2, account3];

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
const labelAccountNumber = document.querySelector('.account-number');

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

// Currency conversion function with real-time rates
const convertCurrency = async function (amount, fromCurrency, toCurrency) {
  // If same currency, no conversion needed
  if (fromCurrency === toCurrency) {
    return amount;
  }

  try {
    // Fetch real-time exchange rates from API
    const response = await fetch(
      `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
    );
    const data = await response.json();
    
    if (data.rates && data.rates[toCurrency]) {
      const rate = data.rates[toCurrency];
      const convertedAmount = amount * rate;
      console.log(`Converting ${amount} ${fromCurrency} to ${toCurrency}: ${convertedAmount} (Rate: ${rate})`);
      return convertedAmount;
    } else {
      // Fallback to manual rates if API fails
      console.log('API rate not found, using manual rates');
      return convertCurrencyManual(amount, fromCurrency, toCurrency);
    }
  } catch (error) {
    console.log('Exchange rate API failed, using manual rates:', error);
    return convertCurrencyManual(amount, fromCurrency, toCurrency);
  }
};

// Manual conversion rates as fallback
const convertCurrencyManual = function (amount, fromCurrency, toCurrency) {
  // Exchange rates (approximate values as fallback)
  const rates = {
    EUR: { USD: 1.08, GBP: 0.86, JPY: 161.5, INR: 91.5, EUR: 1 },
    USD: { EUR: 0.93, GBP: 0.79, JPY: 149.5, INR: 84.8, USD: 1 },
    GBP: { EUR: 1.17, USD: 1.27, JPY: 189.8, INR: 107.5, GBP: 1 },
    JPY: { EUR: 0.0062, USD: 0.0067, GBP: 0.0053, INR: 0.57, JPY: 1 },
    INR: { EUR: 0.011, USD: 0.012, GBP: 0.0093, JPY: 1.76, INR: 1 },
  };

  if (rates[fromCurrency] && rates[fromCurrency][toCurrency]) {
    return amount * rates[fromCurrency][toCurrency];
  }
  
  // If currencies not found, return original amount
  console.log('Currency pair not found in manual rates');
  return amount;
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    // Find the original index in the movements array
    const originalIndex = acc.movements.indexOf(mov);
    const date = new Date(acc.movementsDates[originalIndex]);
    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    const html = `
      <div class="movements__row" data-index="${originalIndex}">
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
  addTransactionClickListeners(acc);
};

const addTransactionClickListeners = function(acc) {
  document.querySelectorAll('.movements__row').forEach((row) => {
    row.addEventListener('click', function () {
      const index = parseInt(this.dataset.index);
      const movement = acc.movements[index];
      const movementDate = acc.movementsDates[index];
      const transactionDetails = acc.transactionDetails?.[index] || null;
      
      const date = new Date(movementDate);
      const fullDateTime = new Intl.DateTimeFormat(acc.locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }).format(date);

      // Show transaction details modal
      showTransactionDetails({movement, movementDate, transactionDetails}, fullDateTime, acc);
    });
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((sum, mov) => sum + mov, 0);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((sum, mov) => sum + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((sum, mov) => sum + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int) => {
      return int >= 1;
    })
    .reduce((sum, int) => sum + int, 0);
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

const updateUI = function (acc) {
  displayMovements(acc);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
  // Display account number
  if (labelAccountNumber) {
    labelAccountNumber.textContent = `Account: ${acc.accountNumber}`;
  }
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
    if (movement.transactionDetails.fromAccountNumber) {
      detailsHTML += `
        <div class="transaction-detail-row">
          <span class="detail-label">From Account:</span>
          <span class="detail-value">${movement.transactionDetails.fromAccountNumber}</span>
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
    if (movement.transactionDetails.toAccountNumber) {
      detailsHTML += `
        <div class="transaction-detail-row">
          <span class="detail-label">To Account:</span>
          <span class="detail-value">${movement.transactionDetails.toAccountNumber}</span>
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
    
    // Show currency conversion info if available
    if (movement.transactionDetails.originalCurrency && 
        movement.transactionDetails.convertedCurrency &&
        movement.transactionDetails.originalCurrency !== movement.transactionDetails.convertedCurrency) {
      
      const originalFormatted = formatCur(
        movement.transactionDetails.originalAmount,
        acc.locale,
        movement.transactionDetails.originalCurrency
      );
      
      const convertedFormatted = formatCur(
        movement.transactionDetails.convertedAmount,
        acc.locale,
        movement.transactionDetails.convertedCurrency
      );
      
      detailsHTML += `
        <div class="transaction-detail-row conversion-info">
          <span class="detail-label">💱 Conversion:</span>
          <span class="detail-value">${originalFormatted} → ${convertedFormatted}</span>
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

  const enteredPin = +inputLoginPin.value;

  // Find account ONLY by PIN
  currentAccount = accounts.find(acc => acc.pin === enteredPin);

  if (currentAccount) {
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
  } else {
    alert('Invalid PIN');
  }
});

btnTransfer.addEventListener('click', async function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAccountNumber = inputTransferTo.value.trim();
  
  // Find receiver by account number
  const receiverAcc = accounts.find(
    acc => acc.accountNumber === receiverAccountNumber
  );
  
  inputTransferAmount.value = inputTransferTo.value = '';

  if (!receiverAcc) {
    alert('Invalid account number!');
    return;
  }

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.accountNumber !== currentAccount.accountNumber
  ) {
    // Convert currency if needed
    let convertedAmount = amount;
    if (currentAccount.currency !== receiverAcc.currency) {
      convertedAmount = await convertCurrency(
        amount,
        currentAccount.currency,
        receiverAcc.currency
      );
    }

    // Deduct from sender (original amount in sender's currency)
    currentAccount.movements.push(-amount);
    
    // Add to receiver (converted amount in receiver's currency)
    receiverAcc.movements.push(convertedAmount);

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
      toAccountNumber: receiverAcc.accountNumber,
      originalAmount: amount,
      originalCurrency: currentAccount.currency,
      convertedAmount: convertedAmount,
      convertedCurrency: receiverAcc.currency,
    });

    // Add transaction details for receiver
    receiverAcc.transactionDetails.push({
      type: 'Transfer',
      from: currentAccount.owner,
      fromAccountNumber: currentAccount.accountNumber,
      originalAmount: amount,
      originalCurrency: currentAccount.currency,
      convertedAmount: convertedAmount,
      convertedCurrency: receiverAcc.currency,
    });

    // Update UI immediately
    updateUI(currentAccount);

    // Save accounts after transfer
    saveAccounts();

    clearInterval(timer);
    timer = startLogOutTimer();
  }
  else if( currentAccount.balance < amount) {
    alert("Balance is insufficient")
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

  // Check if PIN already exists
  const pinExists = accounts.some(acc => acc.pin === pin);

  if (pinExists) {
    alert('This PIN is already used. Please choose a different 4-digit PIN.');
    return;
  }

  // Validate PIN is 4 digits
  if (pin < 1000 || pin > 9999) {
    alert('PIN must be exactly 4 digits!');
    return;
  }

  // Validate deposit
  if (deposit < 100) {
    alert('Minimum initial deposit is 100 (in selected currency)');
    return;
  }

  // Generate unique account number
  const accountNumber = generateAccountNumber();

  // Create new account object
  const newAccount = {
    owner: name,
    accountNumber: accountNumber,
    movements: [deposit],
    interestRate: interest,
    pin: pin,
    movementsDates: [new Date().toISOString()],
    currency: currency,
    locale: locale,
    transactionDetails: [{ type: 'Initial Deposit' }],
  };

  // Generate username - first letter of first word + first letter from last word
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

  // Show success message with account number
  document.querySelector('.modal__form').classList.add('hidden');
  accountCreatedMessage.classList.remove('hidden');
  document.getElementById('new-username').textContent = newAccount.username;
  document.getElementById('new-account-number').textContent = newAccount.accountNumber;

  // Auto close modal after 5 seconds (increased time to read account number)
  setTimeout(() => {
    closeModal();
  }, 5000);
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

// Initialize - Create usernames and load from localStorage
createUsernames(accounts);
loadAccounts();

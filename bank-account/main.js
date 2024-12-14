const createBankSystem = (function () {

  let accounts = [];

  function accountHolder (name, amount) {
    return {name, amount};
  }

  function createAccount (accountName) {
    accounts.push(accountHolder(accountName, 0));
  }

  function deposit (accountName, amount) {
    const object = accounts.find(x => x.name === accountName);
    if (object) {
      object.amount += amount;
      return console.log(accounts);
    } else {
      console.log('No Account Found.');
    }
    
  };

  function withdraw (accountName, amount) {
    const object = accounts.find(x => x.name === accountName);
    if (object) {
      if (amount <= object.amount) {
        object.amount -= amount;
        return console.log(accounts);
      } else {
        return console.log(`Cannot withdraw more than what's available in total balance`);
      }
    } else {
      console.log('No Account Found.');
    }
    
  };

  function getBalance (accountName) {
    const object = accounts.find(x => x.name === accountName);
    return object.amount;
  }

  function getAllAccounts () {
    return accounts;
  }

  return {accountHolder, createAccount, getAllAccounts, deposit, withdraw, getBalance};

})();

const mainContainer = document.getElementById('main-container');

const renderMain = () => {
  mainContainer.innerHTML = `
  <h1 class="header-two" id="header-two">Welcome to G.C. Bank</h1>
  <form id="main-form" class="containers">
    <label for="account-username" class="labels">Username: </label>
    <input type="text" id="account-username" class="inputs" placeholder="Aragorn, the Strider..." required>
    <button id="submit-btn" class="buttons" type="button">Create Account</button>
  </form>
  <h1 class="or" id="or">Or</h1>
  <div id="login-container" class="containers">
    <label for="login-username" class="labels">Username: </label>
    <input type="text" id="login-username" class="inputs" placeholder="Gimli, the Longbeard..." required>
    <button id="login-btn" class="buttons" type="button">Log-in</button>
  </div>
  `
};

renderMain();

const userAccount = document.getElementById('account-username');
const submitBtn = document.getElementById('submit-btn');
const createForm = document.getElementById('main-form');

submitBtn.addEventListener('click', () => {
  const name = userAccount.value;
  createBankSystem.createAccount(name);
  userAccount.value = "";
  return console.log(createBankSystem.getAllAccounts(), name);
});

const loginAccount = document.getElementById('login-username');
const loginBtn = document.getElementById('login-btn');
const loginForm = document.getElementById('login-container');

loginBtn.addEventListener('click', () => {
  const name = loginAccount.value;
  const accounts = createBankSystem.getAllAccounts();
  const object = accounts.find(x => x.name === name);
  if (object) {
    renderBalance();
  } else {
    // pop a dialog
  }
});

const renderBalance = () => {
  const nameAccount = loginAccount.value;
  const accounts = createBankSystem.getAllAccounts();
  const object = accounts.find(x => x.name === nameAccount);

    loginForm.style.display = 'none';
    createForm.style.display = 'none';
    mainContainer.style.display = 'block';
    const {name, amount} = object;
    mainContainer.innerHTML = `
    <div class="display-container" id="display-container">
    <div class="main-panel">
      <h1 class="header" id="header">Welcome to your Account, <span>${name}</span></h1>
      <div id="balance-container">
        <h3>Balance: <span>$${amount}</span></h3>
      </div>
      <div class="btn-container" id="btn-container">
        <button class="buttons" id="deposit-btn">Deposit</button>
        <input type="number" class="inputs" id="deposit-amount" placeholder="$100..." required>
        <button class="buttons" id="withdraw-btn">Withdraw</button>
        <input type="number" class="inputs" id="withdraw-amount" placeholder="$50..." required>
      </div>
    </div>
    <div class="secondary-panel">
      <button class="buttons" id="goback-btn">
        Go Back
      </button>
    </div>
  </div>
  `

  const depositBtn = document.getElementById('deposit-btn');
  depositBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const input = document.getElementById('deposit-amount').value;
    createBankSystem.deposit(name, Number(input));
    renderBalance();
  });

  const withdrawBtn = document.getElementById('withdraw-btn');
  withdrawBtn.addEventListener('click', () => {
    const input = document.getElementById('withdraw-amount').value;
    createBankSystem.withdraw(name, Number(input));
    renderBalance();
  });

  const goBackBtn = document.getElementById('goback-btn');
  goBackBtn.addEventListener('click', () => {
    renderMain();
  });
};


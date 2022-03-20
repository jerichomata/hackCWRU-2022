//carousel nav buttons chagning slides
document.querySelectorAll(".carousel").forEach((carousel) => {
  const items = carousel.querySelectorAll(".carousel__item");
  const buttonsHtml = Array.from(items, () => {
    return `<span class="carousel__button"></span>`;
  });

  carousel.insertAdjacentHTML(
    "beforeend",
    `
    <div class="carousel__nav">
      ${buttonsHtml.join("")}
    </div>
  `
  );

  const buttons = carousel.querySelectorAll(".carousel__button");
  var currentCarousel = 0;
  const maxCarousel = items.length - 1;

  buttons.forEach((button, i) => {
    button.addEventListener("click", () => {
      // un-select all the items
      items.forEach((item) => (item.style.display = "none"));
      buttons.forEach((button) =>
        button.classList.remove("carousel__button--selected")
      );

      items[i].style.display = "block";
      currentCarousel = i;
      button.classList.add("carousel__button--selected");
    });
  });

  carousel.querySelector(".left-arrow").addEventListener("click", () => {
    items.forEach((item) => (item.style.display = "none"));
    buttons.forEach((button) =>
      button.classList.remove("carousel__button--selected")
    );
    currentCarousel--;
    if (currentCarousel == -1) currentCarousel = maxCarousel;

    items[currentCarousel].style.display = "block";
    buttons[currentCarousel].classList.add("carousel__button--selected");
  });

  carousel.querySelector(".right-arrow").addEventListener("click", () => {
    items.forEach((item) => (item.style.display = "none"));
    buttons.forEach((button) =>
      button.classList.remove("carousel__button--selected")
    );
    currentCarousel++;
    if (currentCarousel > maxCarousel) currentCarousel = 0;

    items[currentCarousel].style.display = "block";
    buttons[currentCarousel].classList.add("carousel__button--selected");
  });

  // Select the first item on page load
  buttons[0].classList.add("carousel__button--selected");
});

const sideMenu = document.querySelector("aside");
const menuBtn = document.querySelector("#menu-btn");
const closeBtn = document.querySelector("#close-btn");
const themeToggler = document.querySelector(".theme-toggler");
const sideBar = document.querySelectorAll(".sidebar a");
const mainMenu = document.querySelectorAll("main .tab");
const carousels = document.querySelectorAll(".carousel__item");
const newsArticles = document.querySelectorAll(".news-article");

//show sidebar
menuBtn.addEventListener("click", () => {
  sideMenu.style.display = "block";
});

//close sidebar
closeBtn.addEventListener("click", () => {
  sideMenu.style.display = "none";
});

//change theme

themeToggler.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme-variables");

  themeToggler.querySelector("span:nth-child(1)").classList.toggle("active");

  themeToggler.querySelector("span:nth-child(2)").classList.toggle("active");
});

sideBar.forEach(function (sideTab, index) {
  if (index != 7) {
    sideTab.addEventListener("click", () => {
      sideBar.forEach(function (tab) {
        tab.classList.remove("active");
      });
      mainMenu.forEach(function (menu) {
        menu.style.display = "none";
      });
      mainMenu[index].style.display = "block";
      sideTab.classList.add("active");
    });
  }
});

newsArticles.forEach(function (article, index) {
  article.addEventListener("click", () => {
    if (index == 0)
      window.open(
        "https://www.nytimes.com/2022/03/18/obituaries/don-young-obituary-alaska.html",
        "_blank"
      );
    else if (index == 1)
      window.open(
        "https://www.cnbc.com/2022/03/15/why-the-federal-reserve-raises-interest-rates-to-combat-inflation-.html",
        "_blank"
      );
    else
      window.open(
        "https://www.cnbc.com/2022/03/11/federal-reserve-expected-to-raise-interest-rates-in-week-ahead.html",
        "_blank"
      );
  });
});

const labels = ["January", "February", "March", "April", "May", "June"];

const data = {
  labels: labels,
  datasets: [
    {
      label: "My First dataset",
      backgroundColor: "rgb(255, 99, 132)",
      borderColor: "rgb(255, 99, 132)",
      data: [0, 10, 5, 2, 20, 30, 45],
    },
  ],
};

const config = {
  type: "line",
  data: data,
  options: {},
};

const myChart = new Chart(carousels[0], config);

// User data
const userSettings = document.querySelectorAll(".profile-section-box");
const userName = document.querySelector(".profile b");

function configureUser(userData) {
  var bankAccount;
  userData["User"]["accounts"].forEach( function( account )
  {
    if( account['subtype'] == 'checking' || account['subtype'] == 'Checking' )
      bankAccount = account;
  })
  const user = bankAccount["owners"][0];
  console.log(user);
  userSettings.forEach(function (settings) {
    console.log(settings);
    var settingName = settings.querySelector("h5").innerHTML;
    console.log(settingName);
    var settingData = settings.querySelector("p");
    console.log(settingData);
    if (settingName == "Email:") {
      user["emails"].forEach(function (email) {
        if (email["primary"]) settingData.innerHTML = email["data"];
      });
    }
    if (settingName == "Name:") {
      settingData.innerHTML = user["names"][0];
      userName.innerHTML = user["names"][0];
    }
    if (settingName == "Phone:") {
      user["phone_numbers"].forEach(function (number) {
        if (number["primary"]) settingData.innerHTML = number["data"];
      });
      if (settingData.innerHTML == "")
        settingData.innerHTML = user["phone_numbers"][0]["data"];
    }
  });
}

const accountBalance = document.getElementById("account-balance-num");

function configureBalance(balanceData, transactionsData) {
  var bankAccount;
  balanceData["Balance"]["accounts"].forEach( function( account )
  {
    if( account['subtype'] == 'checking' || account['subtype'] == 'Checking' )
      bankAccount = account;
  })
  if( bankAccount )
  {
    var balance = bankAccount["balances"]["current"];
    console.log(balance);
    accountBalance.innerHTML = `$${balance}`;
  }
}

const availableCredit = document.getElementById("available-credit");

function getAvailableCredit(balanceData) {
  var bankAccount;
  balanceData["Balance"]["accounts"].forEach( function( account )
  {
    if( account['subtype'] == 'credit' || account['subtype'] == 'Credit' )
      bankAccount = account;
  })
  if( bankAccount )
  {
    var balance = bankAccount["balances"]["current"];
    var limit = bankAccount["balances"]["limit"];
    console.log(balance);
    availableCredit.innerHTML = `$${limit - balance}`;
  }
}

import "/sass/main.scss";

// // preloader
// const preloaderTL = gsap.timeline();
// preloaderTL.to('#logo', {yPercent: -20, opacity: 0, delay: 4})
// preloaderTL.to('.preloader', {transform: 'scaleY(0)', transformOrigin: 'top', delay: 1})

// custom cursor
const cursor = document.querySelector('.cursor');
window.onmousemove = (e) => {
    cursor.setAttribute('style', `top: ${e.pageY}px; left: ${e.pageX}px; z-index: 2;`)
}

// navigation
const tl = gsap.timeline({ paused: true, reversed: true });
tl.to(".box", {
  height: "100vh",
  duration: 0.3,
  transformOrigin: "bottom",
  stagger: 0.2,
});
tl.to(".nav-main__content", {
  opacity: "1",
  visibility: "visible",
  yPercent: -5,
  duration: 0.3,
  transformOrigin: "bottom",
  stagger: 0.2,
});

const navIcon = document.querySelector(".nav-icon");
navIcon.onclick = function () {
  if (tl.reversed()) {
    this.classList.add("nav-anim");
    tl.play();
    document.body.classList.add("noScroll");
  } else {
    this.classList.remove("nav-anim");
    tl.reverse();
    document.body.classList.remove("noScroll");
  }
};

const allLinks = document.querySelectorAll(".list__item a");

allLinks.forEach((link) => {
  link.addEventListener("click", () => {
    document.body.classList.remove("noScroll");
    tl.reverse();
    navIcon.classList.remove("nav-anim");
  });
});

const projs = document.querySelectorAll("#projects .project-box");
const links = document.querySelectorAll("#projects .project-box__link");

projs.forEach((proj) => {
  proj.onclick = () => viewProj(proj);
});

function viewProj(proj) {
  let link = proj.querySelector("#projects .project-box__link");
  link.classList.remove("shaky");
  setTimeout(() => {
    link.classList.add("shaky");
  }, 200);
}

const quote = document.querySelector("q");
const timer = 6000;

function getQuotes() {
  fetch(
    "https://gist.githubusercontent.com/tiapnn/ca5f70fc803eef6c02ded745ad624c71/raw/9b2c6f5440785d7b62ee04953d5a779c3ed8b166/programming-quotes.json"
  )
    .then((response) => response.json())
    .then((data) => setInterval(() => shuffleQuotes(data.data), timer));
}
getQuotes();

(async ()=> {
    let answer = await fetch('https://ru.smartcat.com/proxycat/api/freelancers/profile/ernest-bagretsov'), data = await answer.json();
 
    document.querySelector('#res').insertAdjacentHTML('afterBegin', `
        translatedWordCount : ${data.translatedWordCount} <br>
        completedProjectCount : ${data.completedProjectCount}
    `);
})();

function shuffleQuotes(allQuotes) {
  let randomQuote = getRandomQuote(allQuotes);
  toggleTransition();
  changeQuote(randomQuote);
}

function getRandomQuote(allQuotes) {
  return allQuotes[Math.floor(Math.random() * allQuotes.length)];
}

function changeQuote(q) {
  setTimeout(() => {
    quote.innerHTML = q.quote;
    quote.cite = q.source;
  }, 300);
}

function toggleTransition() {
  // trigger toggleTransition method
  quote.removeEventListener("transitionend", onTransitionEnd);
  quote.addEventListener("transitionend", onTransitionEnd);

  // removing the class for leave state
  quote.classList.remove("fade");
}

function onTransitionEnd() {
  // removing the listener again so that it is triggered only once
  quote.removeEventListener("transitionend", onTransitionEnd);
  quote.classList.add("fade");
}

//scroll anchor links fixed
let switchView = function (hash = location.hash, adjust = 350) {
  try {
    let mobileView = window.matchMedia("(max-width: 426px)");
    if (mobileView.matches) adjust = 250;
    let elem = document.querySelector(hash);
    let top = elem.offsetTop;
    window.scrollTo(0, top - adjust);
  } catch (DOMException) {
    location.hash = "";
  }
};

document.addEventListener("DOMContentLoaded", () => {
  switchView();
});
window.onhashchange = () => {
  switchView();
};

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.onclick = (e) => {
    let target = e.target;
    e.preventDefault();
    switchView(target.attributes.href.value);
  };
});

// мусор в консоль
const message =
  "Любознательность – это фитиль в свече жизни. 🐺☝️";
console.group("Привет! 👋");
console.log(message);
console.log("%cЭрнест Багрецов - kumadeji@yandex.ru", "font-size:20px");
console.groupEnd();

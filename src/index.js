import "/sass/main.scss";

// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
var keys = {37: 1, 38: 1, 39: 1, 40: 1};

function preventDefaultA(e) {
  e.preventDefault();
}

function preventDefaultForScrollKeys(e) {
  if (keys[e.keyCode]) {
    preventDefaultA(e);
    return false;
  }
}

// modern Chrome requires { passive: false } when adding event
var supportsPassive = false;
try {
  window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
    get: function () { supportsPassive = true; } 
  }));
} catch(e) {}

var wheelOpt = supportsPassive ? { passive: false } : false;
var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

// call this to Disable
function disableScroll() {
  window.onunload = function(){ window.scrollTo(0,0); } // сброс скролла при перезагрузке
  window.addEventListener('DOMMouseScroll', preventDefaultA, false); // older FF
  window.addEventListener(wheelEvent, preventDefaultA, wheelOpt); // modern desktop
  window.addEventListener('touchmove', preventDefaultA, wheelOpt); // mobile
  window.addEventListener('keydown', preventDefaultForScrollKeys, false);
  document.body.style.overflow = 'hidden';
}

// call this to Enable
function enableScroll() {
  window.removeEventListener('DOMMouseScroll', preventDefaultA, false);
  window.removeEventListener(wheelEvent, preventDefaultA, wheelOpt); 
  window.removeEventListener('touchmove', preventDefaultA, wheelOpt);
  window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
  document.body.style.overflow = 'visible';
}

disableScroll();

// preloader
const preloadertl = gsap.timeline();
preloadertl.to('#preloader-text-over', {yPercent: -20, opacity: 0, delay: 4})
preloadertl.to('#preloader-text-main', {yPercent: -20, opacity: 0, delay: 0})
preloadertl.to('#preloader-text-under', {yPercent: -20, opacity: 0, delay: 0})
preloadertl.to('#preloader-text-under-2', {yPercent: -20, opacity: 0, delay: 0})
preloadertl.to('.preloader', {transform: 'scaleY(0)', transformOrigin: 'top', delay: 0})
preloadertl.call(enableScroll)

// custom cursor - вырезан
// const cursor = document.querySelector('.cursor');
// window.onmousemove = (e) => {
//     cursor.setAttribute('style', `top: ${e.pageY}px; left: ${e.pageX}px; z-index: 2;`)
// }

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
  // fetch("https://gist.githubusercontent.com/tiapnn/ca5f70fc803eef6c02ded745ad624c71/raw/9b2c6f5440785d7b62ee04953d5a779c3ed8b166/programming-quotes.json")
  fetch("https://raw.githubusercontent.com/kumadeji/kumadeji/master/quotes.json")
  
    .then((response) => response.json())
    .then((data) => setInterval(() => shuffleQuotes(data.data), timer));
}
getQuotes();

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

function declOfNum(number, words) {  
    return words[(number % 100 > 4 && number % 100 < 20) ? 2 : [2, 0, 1, 1, 1, 2][(number % 10 < 5) ? Math.abs(number) % 10 : 5]];
}

function getSmartCat() {
  // fetch("https://jsonp.afeld.me/?callback=&url=https%3A%2F%2Fru.smartcat.com%2Fproxycat%2Fapi%2Ffreelancers%2Fprofile%2Falexey-vladimirov")
  fetch("https://ml-cors.herokuapp.com/raw?url=https://ru.smartcat.com/proxycat/api/freelancers/profile/alexey-vladimirov")
  
  // запасной: https://crp-proxy.herokuapp.com/
  
  .then((response) => {
    return response.json();
  })
  .then((data) => {
var translatedWordCount = document.getElementById('translatedWordCount');
var completedProjectCount = document.getElementById('completedProjectCount');
var completedProjectText = document.getElementById('completedProjectText');

translatedWordCount.innerHTML = ((Math.round(data.translatedWordCount / 1000) * 1000)/1000) + ' тыс ';
completedProjectCount.innerHTML = data.completedProjectCount;
completedProjectText.innerHTML = declOfNum(completedProjectCount.innerHTML, ['проект', 'проекта', 'проектов']);
  });
}
getSmartCat();

// фикс ширины и паддинга у последних из трех блоков в таблицах на планшетах
function setWidthFix() {
  var certs = document.getElementById("width-read");
  var fix1 = document.getElementById("width-write-1");
  var fix2 = document.getElementById("width-write-2");
  
  var leftPadding = window.getComputedStyle(certs, null).getPropertyValue('padding-left');
  var width = window.getComputedStyle(certs, null).getPropertyValue('width');
  
  var windowwidth = window.innerWidth;
  
  if ((windowwidth > 538) && (windowwidth < 821)) {
    fix1.style.width = width;
	fix1.style.padding = leftPadding;
	fix2.style.width = width;
	fix2.style.padding = leftPadding;
  }
  else {
    fix1.style.width = "auto";
	fix1.style.padding = "2rem";
	fix2.style.width = "auto";
	fix2.style.padding = "2rem";
  }
  
  var smartcat = document.getElementById("smartcat-width-write");
  var source = document.getElementById("width-read-2");
  var leftPadding2 = window.getComputedStyle(source, null).getPropertyValue('padding-left');
  var width2 = window.getComputedStyle(source, null).getPropertyValue('width');
  
  smartcat.style.width = width2;
  smartcat.style.padding = leftPadding2;
}
setWidthFix();
window.addEventListener('resize', setWidthFix);

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

window.onload = function () {
  document.body.style.opacity = "1"; // перенесено из html - отображение прелоадера
};

// Yeps
function unYeps() {
  var YepsFrame = document.getElementsByTagName('iframe')[0];
  var YepsDoc = YepsFrame.contentDocument || YepsFrame.contentWindow.document;
  var YepsElement = YepsDoc.getElementsByClassName("yeps-logo")[0];
  // var YepsElement = YepsDoc.getElementsByClassName("yeps-logo-text")[0];

  YepsElement.style.display = "none";
}
setTimeout(unYeps, 10000);

function getCustomStyle(theTag,theStyle) {
  var styles=document.getElementsByTagName(theTag)[0].getAttribute("style").split(';');
  var astyle;
  for(var i=0;i<styles.length;i++) {
    astyle=styles[i].split(':');
    if(astyle[0]==theStyle) return (astyle[1]);
  }
  return undefined;
}

window.onscroll = function() {
  var YepsOffset = getCustomStyle("html","--yeps-top-height-offset");
  var NavButton = document.getElementsByClassName("nav-icon");
  
  var YepsFrame = document.getElementsByTagName('iframe')[0];
  var YepsDoc = YepsFrame.contentDocument || YepsFrame.contentWindow.document;
  
  var WindowWidth = window.innerWidth;
  
  if ((YepsDoc.readyState == 'complete') && (YepsOffset == '0px')) {
    if (WindowWidth < 420) {
      NavButton[0].style.marginTop = "15rem";
    }
    else if ((WindowWidth > 419) && (WindowWidth < 574)) {
      NavButton[0].style.marginTop = "10rem";
    }
    else if ((WindowWidth > 573) && (WindowWidth < 1001)) {
      NavButton[0].style.marginTop = "7.5rem";
    }
    else if (WindowWidth > 1000) {
      NavButton[0].style.marginTop = "5rem";
    }
  }
  else {
    NavButton[0].style.marginTop = "0rem";
  }
};

// мусор в консоль
const message =
  "Любознательность – это фитиль в свече жизни. 🐺☝️";
console.group("Привет! 👋");
console.log(message);
console.log("%cАлексей Владимиров - hey@kumadeji.ru", "font-size:20px");
console.groupEnd();

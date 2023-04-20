// const leftBtn = document.getElementById("leftBtn");

// function clickLeftBtn() {}

// leftBtn.addEventListener("click", clickLeftBtn);

// function fullSlider() {
//   $("#full-slide .prev, #full-slide .next").click(function () {
//     var current = $(".banner").find(".active");
//     var position = $(".banner").children().index(current);
//     var totalPics = $(".banner").children().length;

//     if ($(this).hasClass("next")) {
//       if (position < totalPics - 1) {
//         current.removeClass("active").next().addClass("active");
//       } else {
//         $(".banner li").removeClass("active").first().addClass("active");
//       }
//     } else {
//       if (position === 0) {
//         $(".banner li").removeClass("active").last().addClass("active");
//       } else {
//         current.removeClass("active").prev().addClass("active");
//       }
//     }
//   });
// }
const slideContainer = document.querySelector(".slide_container");
const slideItems = document.querySelectorAll(".slide_container > div");
const slideWidth = slideItems[0].offsetWidth;
let slideIndex = 0;

// 슬라이드 이동 함수
function moveSlide(index) {
  slideContainer.style.transform = `translateX(-${slideWidth * index}px)`;
}

// 다음 슬라이드 보기
function nextSlide() {
  if (slideIndex === slideItems.length - 1) {
    slideIndex = 0;
  } else {
    slideIndex++;
  }
  moveSlide(slideIndex);
}

// 이전 슬라이드 보기
function prevSlide() {
  if (slideIndex === 0) {
    slideIndex = slideItems.length - 1;
  } else {
    slideIndex--;
  }
  moveSlide(slideIndex);
}

// 이전 버튼 클릭 시 이전 슬라이드 보기
document.getElementById("leftBtn").addEventListener("click", prevSlide);

// 다음 버튼 클릭 시 다음 슬라이드 보기
document.getElementById("rightBtn").addEventListener("click", nextSlide);

$(document).ready(function () {
  $('.menu-toggle').on('click', function () {
    $('.nav').toggleClass('showing');
    $('.nav ul').toggleClass('showing');

  });

  $('.posts').slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    nextArrow: $('.next'),
    prevArrow: $('.prev'),
    responsive: [
      {
        breakpoint: 1290,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: false
        }
      },
      {
        breakpoint: 825,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1, 
          accessibility: false
        }
      },

      // You can unslick at a given breakpoint now by adding:
      // settings: "unslick"
      // instead of a settings object
    ]
  });
});


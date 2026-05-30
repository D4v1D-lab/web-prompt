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
      }
    ]
  });

  // Search form filtering
  $('input[name="search-term"]').on('input', function () {
    var query = $(this).val().toLowerCase();

    // Filter recent posts
    $('.recent-post').each(function () {
      var text = $(this).text().toLowerCase();
      if (query === '' || text.indexOf(query) !== -1) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });

    // Filter carousel slider posts
    var found = false;
    $('.posts .single-post').each(function () {
      var text = $(this).text().toLowerCase();
      if (query === '' || text.indexOf(query) !== -1) {
        $(this).show();
        found = true;
      } else {
        $(this).hide();
      }
    });
  });

  // Newsletter form handling
  $('.section.contact form').on('submit', function (e) {
    e.preventDefault();
    var email = $(this).find('input[name="subs-term"]').val();
    if (email) {
      $(this).find('.btn').text('Suscrito!').css({ background: '#28a745', color: '#fff' });
      $(this).find('input[name="subs-term"]').prop('disabled', true);
    }
  });
});

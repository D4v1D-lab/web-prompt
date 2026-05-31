$(document).ready(function () {
  $('.menu-toggle').on('click', function () {
    $('.nav').toggleClass('showing');
    $('.nav ul').toggleClass('showing');
  });

  $('.section.contact form').on('submit', function (e) {
    e.preventDefault();
    var email = $(this).find('input[name="subs-term"]').val();
    if (email) {
      $(this).find('.btn').text('Suscrito!').css({ background: '#28a745', color: '#fff' });
      $(this).find('input[name="subs-term"]').prop('disabled', true);
    }
  });

  $.getJSON('data/articulos.json', function (articulos) {
    if ($('.posts').length) {
      renderCarousel(articulos);
      renderRecentPosts(articulos);
      initSearch(articulos);
    }

    if ($('#article-content').length) {
      renderArticle(articulos);
    }
  }).fail(function () {
    console.error('Error al cargar los artículos');
  });
});

function renderCarousel(articulos) {
  var destacados = articulos.filter(function (a) { return a.destacado; });
  var $posts = $('.posts');
  $posts.empty();

  destacados.forEach(function (a) {
    var html = '<div class="single-post">' +
      '<img src="' + a.imagen + '" alt="" class="slider-image">' +
      '<div class="post-info">' +
      '<h4><a href="single.html?id=' + a.id + '" style="margin-left: 5px;">' + a.titulo + '</a></h4>' +
      '<i class="far fa-calendar" style="font-size: x-small; margin-left: 5px;"> ' + a.fecha + '</i>' +
      '</div></div>';
    $posts.append(html);
  });

  $posts.slick({
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
}

function renderRecentPosts(articulos) {
  var recientes = articulos.filter(function (a) { return !a.destacado; });
  var $recent = $('.main .recent');

  $recent.find('.recent-post').remove();

  recientes.forEach(function (a) {
    var html = '<div class="recent-post clear">' +
      '<div class="recent-image"><img src="' + a.imagen + '" alt="' + a.titulo + '"></div>' +
      '<div class="post-preview">' +
      '<h2><a href="single.html?id=' + a.id + '" style="margin-left: 5px;" class="recent-post-title">' + a.titulo + '</a></h2>' +
      '<i class="far fa-calendar" style="font-size: x-small; margin-left: 5px;"> ' + a.fecha + '</i>' +
      '<p class="preview-text" style="margin-left: 2px;">' + a.resumen + '</p>' +
      '<a href="single.html?id=' + a.id + '" class="btn" style="margin-left: 5px;">Leer mas...</a>' +
      '</div></div>';
    $recent.append(html);
  });
}

function initSearch(articulos) {
  $('input[name="search-term"]').on('input', function () {
    var query = $(this).val().toLowerCase();

    $('.recent-post').each(function () {
      var text = $(this).text().toLowerCase();
      $(this).toggle(query === '' || text.indexOf(query) !== -1);
    });

    $('.posts .single-post').each(function () {
      var text = $(this).text().toLowerCase();
      $(this).toggle(query === '' || text.indexOf(query) !== -1);
    });

    if ($('.posts').hasClass('slick-initialized')) {
      $('.posts').slick('setPosition');
    }
  });
}

function renderArticle(articulos) {
  var params = new URLSearchParams(window.location.search);
  var id = parseInt(params.get('id'));
  var articulo = articulos.find(function (a) { return a.id === id; });
  var $container = $('#article-content');

  if (!articulo) {
    $container.html('<p style="text-align:center; margin:50px;">Artículo no encontrado. <a href="index.html">Volver al inicio</a></p>');
    return;
  }

  document.title = articulo.titulo + ' - Autosuficiencia Los Chillos';

  var html = '<article class="single-article" style="background: white; padding: 30px; border-radius: 5px; box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.5);">' +
    '<h1 style="color: rgb(6, 147, 194); font-family: \'Kreon\'; font-size: 2em;">' + articulo.titulo + '</h1>' +
    '<i class="far fa-calendar" style="font-size: small; color: rgb(6, 147, 194); margin-bottom: 20px; display: block;"> ' + articulo.fecha + '</i>' +
    '<img src="' + articulo.imagen + '" alt="' + articulo.titulo + '" style="width: 100%; max-height: 400px; object-fit: cover; border-radius: 5px; margin-bottom: 20px;">' +
    '<div style="color: #333; line-height: 1.8; font-family: \'Josefin Sans\', sans-serif;">' + articulo.contenido + '</div>' +
    '<div style="margin-top: 30px;"><a href="index.html" class="btn">Volver a la página principal</a></div>' +
    '</article>';

  $container.html(html);
}

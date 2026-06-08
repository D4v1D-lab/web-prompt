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

  $.getJSON('/data/articulos.json', function (articulos) {
    if ($('.posts').length) {
      renderCarousel(articulos);
      renderRecentPosts(articulos, 1);
      initSearch(articulos);
    }

    if ($('#article-content').length) {
      renderArticle(articulos);
    }
  }).fail(function () {
    console.error('Error al cargar los artículos');
  });
});

var currentPage = 1;

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

function renderRecentPosts(articulos, page) {
  var recientes = articulos.filter(function (a) { return !a.destacado; });
  var $recent = $('.main .recent');
  var perPage = 3;

  $recent.find('.recent-post').remove();
  $recent.find('.pagination-controls').remove();

  var start = (page - 1) * perPage;
  var pageItems = recientes.slice(start, start + perPage);
  var totalPages = Math.ceil(recientes.length / perPage);

  pageItems.forEach(function (a) {
    var html = '<div class="recent-post clear">' +
      '<div class="recent-image"><img src="' + a.imagen + '" alt="' + a.titulo + '"></div>' +
      '<div class="post-preview">' +
      '<h2><a href="single.html?id=' + a.id + '" style="margin-left: 5px;" class="recent-post-title">' + a.titulo + '</a></h2>' +
      '<i class="far fa-calendar" style="font-size: x-small; margin-left: 5px;"> ' + a.fecha + '</i>' +
      '<p class="preview-text" style="margin-left: 2px;">' + a.resumen + '</p>' +
      '<a href="single.html?id=' + a.id + '" class="btn" style="margin-left: 5px;">Leer mas...</a>' +
      '<div class="share-section small">' +
        '<span class="share-label">Compartir:</span>' +
        '<a href="https://api.whatsapp.com/send?text=' + encodeURIComponent(a.titulo + ' - ' + window.location.origin + '/single.html?id=' + a.id) + '" target="_blank" rel="noopener" class="share-btn whatsapp" title="Compartir en WhatsApp"><i class="fab fa-whatsapp"></i></a>' +
        '<a href="https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(window.location.origin + '/single.html?id=' + a.id) + '" target="_blank" rel="noopener" class="share-btn facebook" title="Compartir en Facebook"><i class="fab fa-facebook-f"></i></a>' +
        '<button class="share-btn link" title="Copiar enlace" onclick="copiarEnlace(this, \'' + window.location.origin + '/single.html?id=' + a.id + '\')"><i class="fas fa-link"></i></button>' +
      '</div>' +
      '</div></div>';
    $recent.append(html);
  });

  if (totalPages > 1) {
    var pagHtml = '<div class="pagination-controls" style="text-align: center; margin: 20px 0; clear: both; display: flex; align-items: center; justify-content: center; gap: 5px;">';
    if (page > 1) {
      pagHtml += '<button class="btn btn-page prev-page" style="background: rgb(6, 147, 194); color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;"><i class="fas fa-chevron-left"></i></button>';
    }
    for (var i = 1; i <= totalPages; i++) {
      var isActive = i === page;
      pagHtml += '<button class="btn btn-page page-num" data-page="' + i + '" style="background: ' + (isActive ? 'rgb(6, 147, 194)' : 'white') + '; color: ' + (isActive ? 'white' : 'rgb(6, 147, 194)') + '; border: 1px solid rgb(6, 147, 194); padding: 8px 12px; border-radius: 4px; cursor: pointer; min-width: 36px;">' + i + '</button>';
    }
    if (page < totalPages) {
      pagHtml += '<button class="btn btn-page next-page" style="background: rgb(6, 147, 194); color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;"><i class="fas fa-chevron-right"></i></button>';
    }
    pagHtml += '</div>';
    $recent.append(pagHtml);

    $('.prev-page').on('click', function (e) {
      e.preventDefault();
      if (currentPage > 1) {
        currentPage--;
        renderRecentPosts(articulos, currentPage);
      }
    });

    $('.next-page').on('click', function (e) {
      e.preventDefault();
      if (currentPage < totalPages) {
        currentPage++;
        renderRecentPosts(articulos, currentPage);
      }
    });

    $('.page-num').on('click', function (e) {
      e.preventDefault();
      var p = parseInt($(this).data('page'));
      if (p !== currentPage) {
        currentPage = p;
        renderRecentPosts(articulos, currentPage);
      }
    });
  }
}

function initSearch(articulos) {
  $('input[name="search-term"]').on('input', function () {
    var query = $(this).val().toLowerCase();

    if (query === '') {
      renderRecentPosts(articulos, currentPage);
      return;
    }

    var recientes = articulos.filter(function (a) { return !a.destacado; });
    var $recent = $('.main .recent');
    $recent.find('.recent-post').remove();
    $recent.find('.pagination-controls').remove();

    var matches = recientes.filter(function (a) {
      return a.titulo.toLowerCase().indexOf(query) !== -1 ||
             a.resumen.toLowerCase().indexOf(query) !== -1;
    });

    matches.forEach(function (a) {
      var html = '<div class="recent-post clear">' +
        '<div class="recent-image"><img src="' + a.imagen + '" alt="' + a.titulo + '"></div>' +
        '<div class="post-preview">' +
        '<h2><a href="single.html?id=' + a.id + '" style="margin-left: 5px;" class="recent-post-title">' + a.titulo + '</a></h2>' +
        '<i class="far fa-calendar" style="font-size: x-small; margin-left: 5px;"> ' + a.fecha + '</i>' +
        '<p class="preview-text" style="margin-left: 2px;">' + a.resumen + '</p>' +
        '<a href="single.html?id=' + a.id + '" class="btn" style="margin-left: 5px;">Leer mas...</a>' +
        '<div class="share-section small">' +
          '<span class="share-label">Compartir:</span>' +
          '<a href="https://api.whatsapp.com/send?text=' + encodeURIComponent(a.titulo + ' - ' + window.location.origin + '/single.html?id=' + a.id) + '" target="_blank" rel="noopener" class="share-btn whatsapp" title="Compartir en WhatsApp"><i class="fab fa-whatsapp"></i></a>' +
          '<a href="https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(window.location.origin + '/single.html?id=' + a.id) + '" target="_blank" rel="noopener" class="share-btn facebook" title="Compartir en Facebook"><i class="fab fa-facebook-f"></i></a>' +
          '<button class="share-btn link" title="Copiar enlace" onclick="copiarEnlace(this, \'' + window.location.origin + '/single.html?id=' + a.id + '\')"><i class="fas fa-link"></i></button>' +
        '</div>' +
        '</div></div>';
      $recent.append(html);
    });

    $('.posts .single-post').each(function () {
      var text = $(this).text().toLowerCase();
      $(this).toggle(text.indexOf(query) !== -1);
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
    (articulo.informacion ? '<div style="margin-top: 25px; padding: 15px; background: #f0f8fb; border-left: 4px solid rgb(6, 147, 194); border-radius: 3px; font-family: \'Josefin Sans\', sans-serif;">' +
      '<i class="fas fa-external-link-alt" style="color: rgb(6, 147, 194); margin-right: 8px;"></i>' +
      '<strong style="color: rgb(6, 147, 194);">Para más información:</strong> ' +
      '<a href="' + articulo.informacion + '" target="_blank" rel="noopener" style="color: rgb(6, 147, 194); word-break: break-all;">' + articulo.informacion + '</a>' +
    '</div>' : '') +
    '<div class="share-section">' +
      '<span class="share-label">Compartir:</span>' +
      '<a href="https://api.whatsapp.com/send?text=' + encodeURIComponent(articulo.titulo + ' - ' + window.location.href) + '" target="_blank" rel="noopener" class="share-btn whatsapp" title="Compartir en WhatsApp"><i class="fab fa-whatsapp"></i></a>' +
      '<a href="https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(window.location.href) + '" target="_blank" rel="noopener" class="share-btn facebook" title="Compartir en Facebook"><i class="fab fa-facebook-f"></i></a>' +
      '<button class="share-btn link" title="Copiar enlace" onclick="copiarEnlace(this)"><i class="fas fa-link"></i></button>' +
    '</div>' +
    '<div style="margin-top: 30px;"><a href="index.html" class="btn">Volver a la página principal</a></div>' +
    '</article>';

  $container.html(html);
}

function copiarEnlace(btn, url) {
  url = url || window.location.href;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(url).then(function () {
      var $btn = $(btn);
      var orig = $btn.html();
      $btn.html('<i class="fas fa-check"></i>');
      setTimeout(function () { $btn.html(orig); }, 2000);
    });
  } else {
    var input = document.createElement('input');
    input.value = url;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    var $btn = $(btn);
    var orig = $btn.html();
    $btn.html('<i class="fas fa-check"></i>');
    setTimeout(function () { $btn.html(orig); }, 2000);
  }
}

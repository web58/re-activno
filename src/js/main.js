jQuery(function($) {

  // --- mask ---

  $("input[type=tel]").mask("+7 (999)999-99-99");

  // --- slider ---

  $('.slider')
    .slick({
      slidesToShow: 1,
      dots: true,
      arrows: true,
      lazyLoad: true,
      responsive: [
        {
          breakpoint: 1200,
          settings: {
            arrows: false,
          }
        }
      ]
    })
    .on('beforeChange', function(event, slick, currentSlide, nextSlide){
      $('.slider .slick-dots li').removeClass('custom-dot');
      if(nextSlide!==0){
        $('.slider .slick-dots li').eq(nextSlide-1).addClass('custom-dot');
      }
    });

  // --- services scroll to ---

  $('.scroll-to-services').on('click', function () {
    let headerH = $("header").innerHeight();
    let top = $('#services').offset().top;
    $('body,html').animate({scrollTop: top - headerH}, 800);
  });

  // --- popup ---

  $('body').on('click','.popup__close, .popup__back, .popup__good', function () {
    $('.popup').fadeOut();
  });

  $('[data-service]').on('click', function () {
    let serviceName = $(this).attr('data-service');
    $('.popup_service .txt-red').text(serviceName);
    $('.popup_service input[type=hidden]').val(serviceName);
    $('.popup_service').fadeIn();
  });
  $('.view-popup').on('click', function () {
    $('.popup_policy').fadeIn();
  });

  $('form.form').on('submit', function (e) {
    var formData = new FormData($(this)[0]);
    //var data = new FormData();
    $.ajax({
      url: 'scripts/mail.php',
      type: "POST",
      data: formData,
      async: false,
      success: function (res) {
        $('.popup_service').fadeOut();
        $('.popup_thanks').fadeIn();
      },
      error: function (msg) {
        alert('Ошибка!');
      },
      cache: false,
      contentType: false,
      processData: false
    });
    e.preventDefault();
  });

});

(function(){
  
  $('.sidebar-nav').on('click', 'li > a', function(e) {
    e.preventDefault();
    var _index = $(this).parent().index(),
      _offsetTop = $('#href' + _index).offset().top + 1;
    
    actionHref(_index);
    
    $('html, body').stop().animate({
      scrollTop: _offsetTop
    }, 600);
  });
  
  $(window).scroll(function() {
    var _fromTop = $(this).scrollTop(),
      _cur = $('.js-scroll-href').map(function() {
        if ($(this).offset().top < _fromTop) return this;
      });   
    _cur = _cur[_cur.length - 1];
    
    var _id = $(_cur).attr('id'),
      _numb = (_id !== undefined) ? _id.slice(-1) : 0;
    
    if (_numb !== null) actionHref(_numb);
  });
  
  // прилипашка
  $(".about__sidebar").css({'z-index': 20});
  var _height = $(".about__sidebar").offset().top - $(".about__head .h1--line").offset().top - 58;
  $.lockfixed(".about__sidebar",{offset: {top: _height, bottom: document.getElementsByClassName('page-footer')[0].offsetHeight}});
  
  // слайдер преподавателей
  $('#js-about-teachers__slides').meSlider({
    leftBtn: 'slider-nav__btn--left',
    rightBtn: 'slider-nav__btn--right',
    items: 'about-teachers__item',
    speed: 600,
    visible: 2,
  }); 
  
  function actionHref(ind){
    $('.sidebar-nav > li.active').html('<a href="#">' + $('.sidebar-nav > li.active').text() + '</a>').removeClass('active');
    var _new = $('.sidebar-nav > li')[ind],
      _text = $($(_new).find('a')[0]).text();
    
    $(_new).html(_text).addClass('active');
  }
  
}());
'use strict';

(function() {
  var messagesCollapse = document.querySelectorAll('.js-messages-collapse');

  if (messagesCollapse) {
    messagesCollapse = Array.prototype.slice.call(messagesCollapse, 0);

    messagesCollapse.forEach(function(item) {
      item.addEventListener('click', function(event) {
        event.preventDefault();
        item.parentNode.classList.toggle('open');
      });
    });
  }
})();

(function(){
  
  // кнопки добавления в корзины
  $('a.btn--buy, a.btn--buy-red').on('click', function(e){
    e.preventDefault();
    var idProgram = $(this).parent().attr('data-program-id');
    $.get('/api/programs/add-me-bag.json?id=' + idProgram, function(response){
      if (response.status == 'ok'){
        var count = Number($('.shop-btn__icon--bag .shop-btn__counter').text());
        $('.shop-btn__icon--bag .shop-btn__counter').text(++count);
        renderBag();
      }
    });
  }); 
  $('.btn-fav').on('click', function(){
    var idProgram = $(this).parent().attr('data-program-id'),
      _this = this;
      
    if ($(this).hasClass('programs__btn-fav--active')) return;
    
    $.get('/api/programs/add-me-fav.json?id=' + idProgram, function(response){
      if (response.status == 'ok'){
        var count = Number($('.shop-btn__icon--fav .shop-btn__counter').text());
        $('.shop-btn__icon--fav .shop-btn__counter').text(++count);
        $(_this).addClass('programs__btn-fav--active');
        renderFav();
      }
    });
  });
  
  // слайдер преподавателей
  $('#js-slider-person').meSlider({
    leftBtn: 'slider-nav__btn--left.slider-nav__btn--left-person',
    rightBtn: 'slider-nav__btn--right.slider-nav__btn--left-person',    
    items: 'course-slide-one__person',
    visible: 1,
    speed: 600,
  });
  
  // слайдер отзывов
  $('#js-slider-comment').meSlider({
    leftBtn: 'slider-nav__btn--left.slider-nav__btn--left-comment',
    rightBtn: 'slider-nav__btn--right.slider-nav__btn--left-comment',   
    items: 'course-slide-one__comment',
    visible: 1,
    speed: 600,
  });
  
}());
(function(){
  var ageArray = ['0', '12', '13', '14', '15', '16', '17', '18'],
    age = 0;
  
  $('.age-filter').on('click', '.age-filter__item', function(){
    var n = $(this).index();
    age = n;
    $('.age-filter__item').removeClass('age-filter__item--active');
    $('.age-filter__item').removeClass('age-filter__item--current');    
    $('.age-filter__item').each(function(index){
      if (index <= n){
        $(this).addClass('age-filter__item--active');
      }
    });   
    $(this).addClass('age-filter__item--current');
    loadPrograms();
  });
  
  $('.courses-filter__col input').on('click', function(){
    if ($(this).attr('id') == 'all-courses' && $(this).prop('checked')) $('.courses-filter__col input:checkbox:checked').not(this).prop('checked', false);
    loadPrograms();
  });
  
  $('.courses-filter__link').on('click', function(){
    $('.courses-filter__col input').prop('checked', false);
    $('.js-age-filter-default').click();
  });
  
  // кнопки добавления в корзины
  $('.programs__item-action').on('click', '.programs__btn-bag', function(){
    var idProgram = $(this).parent().attr('data-program-id');
    $.get('/api/programs/add-me-bag.json?id=' + idProgram, function(response){
      if (response.status == 'ok'){
        var count = Number($('.shop-btn__icon--bag .shop-btn__counter').text());
        $('.shop-btn__icon--bag .shop-btn__counter').text(++count);
        renderBag();
      }
    });
  }); 
  $('.programs__item-action').on('click', '.programs__btn-fav', function(){
    var idProgram = $(this).parent().attr('data-program-id'),
      _this = this;
    
    if ($(this).hasClass('programs__btn-fav--active')) return;
    
    $.get('/api/programs/add-me-fav.json?id=' + idProgram, function(response){
      if (response.status == 'ok'){
        var count = Number($('.shop-btn__icon--fav .shop-btn__counter').text());
        $('.shop-btn__icon--fav .shop-btn__counter').text(++count);
        $(_this).addClass('programs__btn-fav--active');
        renderFav();
      }
    });
  });
  
  function loadPrograms(){
    var _check = $('.courses-filter__col input:checkbox:checked'),
      _age = ageArray[age],
      _q = {};
    
    $(_check).each(function(index){
      _q[index] = $(this).attr('id');
    });
    
    var data = $.param({
      'age': _age,
      'check': _q
    });

    $.post('/api/programs/load.json', data, function(response){
      $('.programs__items').find('.item-col').remove();
      $(response.reverse()).each(function(){
        var _div = renderProgram(this);
        $('.programs__items').prepend(_div);
      });
    }, 'json');
  }
  
}());
(function(){
  
  
}());
(function(){
  renderScroll("#scroll-w1", ".shop-box--fav");
  renderScroll("#scroll-w2", ".shop-box--bag");
  
  // Для корзины
  $(".shop-btn__icon--bag").mouseenter(function() {
     // renderBag();
     $(".shop-box--bag").fadeTo(200, 1);
     $(".shop-box--fav").hide();
  }).mouseleave(function() {    
    $(".shop-box--bag").one('mouseenter', function() {
      $(".shop-box--bag").one('mouseleave', function() {
        $(".shop-box--bag").fadeTo(200, 0);
        $(".shop-box--bag").hide();
        return;
      });
    });
    
    setTimeout(function(){
      $('body').one('mousemove', function(e){
        var bool = $('.shop-box--bag').find(e.target)[0];
        if (bool !== undefined){
          return;
        } else {
          $(".shop-box--bag").fadeTo(200, 0);
          $(".shop-box--bag").hide();
        }
      });
    }, 250);
  });
  
  // Для списка желаемого
  $(".shop-btn__icon--fav").mouseenter(function() {
     // renderFav();
     $(".shop-box--fav").fadeTo(200, 1);
     $(".shop-box--bag").hide();
  }).mouseleave(function() {    
    $(".shop-box--fav").one('mouseenter', function() {
      $(".shop-box--fav").one('mouseleave', function() {
        $(".shop-box--fav").fadeTo(200, 0);
        $(".shop-box--fav").hide();
        return;
      });
    });
    
    setTimeout(function(){
      $('body').one('mousemove', function(e){
        var bool = $('.shop-box--fav').find(e.target)[0];
        if (bool !== undefined){
          return;
        } else {
          $(".shop-box--fav").fadeTo(200, 0);
          $(".shop-box--fav").hide();
        }
      });
    }, 250);
  });
  
  // кнопки корзины
  $('.shop-box--bag').on('click', '.shop-box__link-del', function(){
    $.get('/api/bag/del.json?id=all', function(response){
      if (response.status == 'ok'){
        renderBag();
      }
    });
  });
  
  $('.shop-box--bag').on('click', '.counter__minus', function(){
    var _id = $(this).parent().attr('data-program-id');
    if (_id == null) return;
    $.get('/api/programs/minus-in-bag.json?id=' + _id, function(response){
      if (response.status == 'ok'){
        renderBag();
      }
    });
  });
  
  $('.shop-box--bag').on('click', '.counter__plus', function(){
    var _id = $(this).parent().attr('data-program-id');
    if (_id == null) return;
    $.get('/api/programs/plus-in-bag.json?id=' + _id, function(response){
      if (response.status == 'ok'){
        renderBag();
      }
    });
  });
  
  $('.shop-box--bag').on('click', '.btn-del', function(){
    var _id = $(this).attr('data-program-id');
    if (_id == null) return;
    $.get('/api/programs/del-in-bag.json?id=' + _id, function(response){
      if (response.status == 'ok'){
        renderBag();
      }
    });
  });
  
  // кнопки списка желаемого
  $('.shop-box--fav').on('click', '.shop-box__link-del', function(){
    $.get('/api/fav/del.json?id=all', function(response){
      if (response.status == 'ok'){
        renderFav();
      }
    });
  });
  
  $('.shop-box--fav').on('click', '.counter__minus', function(){
    var _id = $(this).parent().attr('data-program-id');
    if (_id == null) return;
    $.get('/api/programs/minus-in-fav.json?id=' + _id, function(response){
      if (response.status == 'ok'){
        renderFav();
      }
    });
  });
  
  $('.shop-box--fav').on('click', '.counter__plus', function(){
    var _id = $(this).parent().attr('data-program-id');
    if (_id == null) return;
    $.get('/api/programs/plus-in-fav.json?id=' + _id, function(response){
      if (response.status == 'ok'){
        renderFav();
      }
    });
  });
  
  $('.shop-box--fav').on('click', '.btn-del', function(){
    var _id = $(this).attr('data-program-id');
    if (_id == null) return;
    $.get('/api/programs/del-in-fav.json?id=' + _id, function(response){
      if (response.status == 'ok'){
        renderFav();
      }
    });
  });
  
}());

function renderBag(){
  $.get('/api/bag/load.json', function(response){
    if (response.status == 'ok'){
      var items = response.items;
      $('.shop-box--bag').find('.shop-box__item').remove();
      $('.page-header__nav-shop .shop-btn__info').text(response.count);
      
      $(items).each(function(index){
        var _id = this.id,
          _title = this.title,
          _subtitle = this.subtitle,
          _price = this.price,
          _count = this.count;
        
        var newDiv = '<div class="shop-box__item">' +
                    '<div class="shop-box__item-text">' +
                      '<div class="shop-box__item-title">' + _title + '</div>' +
                      '<div class="shop-box__item-descr">' + _subtitle + '</div>' +
            '</div><div class="shop-box__item-numbers">' +
                      '<div class="shop-box__counter counter" data-program-id="' + _id + '">' +
                        '<div class="counter__minus"></div>' +
                        '<div class="counter__num">' + _count + '</div>' +
                        '<div class="counter__plus"></div></div>' +
                      '<div class="shop-box__price">' + _price + '</div></div>' +
                    '<div class="shop-box__item-del"><button class="btn-del" data-program-id="' + _id + '"></button></div></div>';

        $('.shop-box--bag .shop-box__head').after(newDiv);
        
        // cookies bag
      });
      
      $('.shop-box--bag .shop-box__item').first().addClass('shop-box__item--yellow');
      
      if ($('.shop-box--bag').css('display') == 'none'){
        renderScroll("#scroll-w2", ".shop-box--bag");
      } else {
        $("#scroll-w2").nanoScroller({ alwaysVisible: true });
      }
    }
  });
}

function renderFav(){
  $.get('/api/fav/load.json', function(response){
    if (response.status == 'ok'){
      var items = response.items;
      $('.shop-box--fav').find('.shop-box__item').remove();
      
      $(items).each(function(index){
        var _id = this.id,
          _title = this.title,
          _subtitle = this.subtitle,
          _price = this.price,
          _count = this.count;
        
        var newDiv = '<div class="shop-box__item">' +
                    '<div class="shop-box__item-text">' +
                      '<div class="shop-box__item-title">' + _title + '</div>' +
                      '<div class="shop-box__item-descr">' + _subtitle + '</div>' +
            '</div><div class="shop-box__item-numbers">' +
                      '<div class="shop-box__counter counter" data-program-id="' + _id + '">' +
                        '<div class="counter__minus"></div>' +
                        '<div class="counter__num">' + _count + '</div>' +
                        '<div class="counter__plus"></div></div>' +
                      '<div class="shop-box__price">' + _price + '</div></div>' +
                    '<div class="shop-box__item-del"><button class="btn-del" data-program-id="' + _id + '"></button></div></div>';

        $('.shop-box--fav .shop-box__head').after(newDiv);
        
        // cookies fav
      });
      
      $('.shop-box--fav .shop-box__item').first().addClass('shop-box__item--yellow');
      
      if ($('.shop-box--fav').css('display') == 'none'){
        renderScroll("#scroll-w1", ".shop-box--fav");
      } else {
        $("#scroll-w1").nanoScroller({ alwaysVisible: true });
      }
    }
  });
}

function renderProgram(obj){
  var _id = obj.id,
    _numb = obj.numb,
    _type = (obj.type !== null) ? ' programs__item--' + obj.type : '',
    _title = obj.title,
    _subtitle = obj.subtitle,
    _newPrice = obj.newPrice,
    _oldPrice = (obj.oldPrice !== null) ? '<span class="full-price">' + obj.oldPrice + '</span>' : '',
    _action = obj.action,
    _actionClass = (obj.action) ? ' programs__item--bonus' : '',
    _actionSpan = (obj.action) ? '<span class="bonus-label">Акция</span>' : '',
    _startDate = obj.startDate;
    _added = (obj.added) ? ' programs__btn-fav--active' : '';
    _url = obj.url;
  
  var _svg = '<svg class="icon-heart" xmlns="http://www.w3.org/2000/svg" viewBox="-69 189.3 471.7 414.7" width="18" height="15"><path d="M364.6 227.8c-24.7-24.7-57.4-38.2-92.3-38.2s-67.7 13.6-92.4 38.3L167 240.8l-13.1-13.1c-24.7-24.7-57.6-38.4-92.5-38.4-34.8 0-67.6 13.6-92.2 38.2-24.7 24.7-38.3 57.5-38.2 92.4 0 34.9 13.7 67.6 38.4 92.3L157.2 600c2.6 2.6 6.1 4 9.5 4s6.9-1.3 9.5-3.9l188.2-187.5c24.7-24.7 38.3-57.5 38.3-92.4.1-34.9-13.4-67.7-38.1-92.4zm-19.2 165.7l-178.7 178-178.3-178.3C-31.2 373.6-42 347.6-42 319.9s10.7-53.7 30.3-73.2c19.5-19.5 45.5-30.3 73.1-30.3 27.7 0 53.8 10.8 73.4 30.4l22.6 22.6c5.3 5.3 13.8 5.3 19.1 0l22.4-22.4c19.6-19.6 45.7-30.4 73.3-30.4s53.6 10.8 73.2 30.3c19.6 19.6 30.3 45.6 30.3 73.3.1 27.7-10.7 53.7-30.3 73.3z"/></svg><svg class="icon-heart icon-heart--active" xmlns="http://www.w3.org/2000/svg" viewBox="-69 189.3 471.7 414.7" width="18" height="15"><path fill="#d95e40" d="M364.6 227.8c-24.7-24.7-57.4-38.2-92.3-38.2s-67.7 13.6-92.4 38.3L167 240.8l-13.1-13.1c-24.7-24.7-57.6-38.4-92.5-38.4-34.8 0-67.6 13.6-92.2 38.2-24.7 24.7-38.3 57.5-38.2 92.4 0 34.9 13.7 67.6 38.4 92.3L157.2 600c2.6 2.6 6.1 4 9.5 4s6.9-1.3 9.5-3.9l188.2-187.5c24.7-24.7 38.3-57.5 38.3-92.4.1-34.9-13.4-67.7-38.1-92.4z"/></svg>';
  
  var newDiv = '<div class="item-col"><div class="programs__item' + _type + _actionClass + '">' +
    '<div class="programs__item-number">' + _numb + '</div>' + _actionSpan +
    '<div class="programs__item-top"><div class="programs__item-text">курс</div>' +
    '<div class="programs__item-date"><span class="item-date">' + _startDate + '</span></div></div>' +
    '<a href="' + _url + '" class="item-title">' + _title + '</a><div class="programs__about">' + _subtitle + '</div>' +
    '<div class="programs__item-fullprice">' + _oldPrice + '</div><div class="programs__item-bottom">' +
    '<span class="programs__item-price">' + _newPrice + '</span>' +
    '<div class="programs__item-action" data-program-id="' + _id + '"><button class="programs__btn-bag btn btn--buy">В&nbsp;корзину</button>' +
    '<button class="programs__btn-fav' + _added + '">' + _svg + '</button></div></div></div></div>';

  return newDiv;
}

function renderScroll(_id, _class){
  $(_class).css({'display': 'block', 'opacity': '0'});
  $(_id).nanoScroller({ alwaysVisible: true });
  $(_class).css({'display': 'none'});
}
/*!
 * jQuery lockfixed plugin
 * http://www.directlyrics.com/code/lockfixed/
 *
 * Copyright 2012-2015 Yvo Schaap
 * Released under the MIT license
 * http://www.directlyrics.com/code/lockfixed/license.txt
 *
 * Date: Sun March 30 2015 12:00:01 GMT
 */
(function(e,p){e.extend({lockfixed:function(a,b){b&&b.offset?(b.offset.bottom=parseInt(b.offset.bottom,10),b.offset.top=parseInt(b.offset.top,10)):b.offset={bottom:100,top:0};if((a=e(a))&&a.offset()){var n=a.css("position"),c=parseInt(a.css("marginTop"),10),l=a.css("top"),g=a.offset().top,h=!1;if(!0===b.forcemargin||navigator.userAgent.match(/\bMSIE (4|5|6)\./)||navigator.userAgent.match(/\bOS ([0-9])_/)||navigator.userAgent.match(/\bAndroid ([0-9])\./i))h=!0;e(window).bind("scroll resize orientationchange load lockfixed:pageupdate",
a,function(k){if(!h||!document.activeElement||"INPUT"!==document.activeElement.nodeName){var d=0,d=a.outerHeight();k=a.outerWidth();var m=e(document).height()-b.offset.bottom,f=e(window).scrollTop();"fixed"!=a.css("position")&&(g=a.offset().top,c=parseInt(a.css("marginTop"),10),l=a.css("top"));f>=g-(c?c:0)-b.offset.top?(d=m<f+d+c+b.offset.top?f+d+c+b.offset.top-m:0,h?a.css({marginTop:parseInt((c?c:0)+(f-g-d)+2*b.offset.top,10)+"px"}):a.css({position:"fixed",top:b.offset.top-d+"px",width:k+"px"})):
a.css({position:n,top:l,width:k+"px",marginTop:(c?c:0)+"px"})}})}}})})(jQuery);
(function(){
  // --start-- кнопка Показать еще -- переделать!!!
  var count_school_about_row_points = 1;
  
  $('div.js-row-about-school').slideUp(100);
  
  $('a.school-about__btn-more').on('click' , function(){
    if (count_school_about_row_points == 0){
      $(this).text('Показать еще');
      $('div.js-row-about-school').slideUp('slow');
      count_school_about_row_points = 1;
      return false;
    }
    
    var row_this_is = $('div.js-row-about-school').is('div.js-row-' + count_school_about_row_points),
      row_next_is = $('div.js-row-about-school').is('div.js-row-' + (count_school_about_row_points + 1));
    
    if (row_this_is){
      $('div.js-row-' + count_school_about_row_points).slideDown('slow');
      if (row_next_is){
        ++count_school_about_row_points;        
      } else {
        count_school_about_row_points = 0;
        $(this).text('Свернуть');
      }
    }
    
    return false;
  }); 
  // --end-- кнопка Показать еще
  
  // слайдер новостей
  $('#last-news__carousel').meSlider({
    leftBtn: 'last-news__nav-btn--left',
    rightBtn: 'last-news__nav-btn--right',    
    items: 'last-news__item',
    speed: 600,
  });
  
  // кнопка Другие программы
  $('.programs__btn-more').on('click', function(){
    $.get('/api/programs/load.json?quantity=4', function(response){
      $('.programs__items').find('.item-col').remove();     
      $(response.reverse()).each(function(){
        var _div = renderProgram(this);
        $('.programs__items').prepend(_div);
      });
    });   
  });
  
  // кнопки добавления в корзины
  $('.programs__items').on('click', '.programs__btn-bag', function(){
    var idProgram = $(this).parent().attr('data-program-id');
    $.get('/api/programs/add-me-bag.json?id=' + idProgram, function(response){
      if (response.status == 'ok'){
        var count = Number($('.shop-btn__icon--bag .shop-btn__counter').text());
        $('.shop-btn__icon--bag .shop-btn__counter').text(++count);
        renderBag();
      }
    });
  }); 
  $('.programs__items').on('click', '.programs__btn-fav', function(){
    var idProgram = $(this).parent().attr('data-program-id'),
      _this = this;
      
    if ($(this).hasClass('programs__btn-fav--active')) return;
    
    $.get('/api/programs/add-me-fav.json?id=' + idProgram, function(response){
      if (response.status == 'ok'){
        var count = Number($('.shop-btn__icon--fav .shop-btn__counter').text());
        $('.shop-btn__icon--fav .shop-btn__counter').text(++count);
        $(_this).addClass('programs__btn-fav--active');
        renderFav();
      }
    });
  });
  
  // основной слайдер
  $('.promo-slider__nav-btn--left').on('click', loadSlide);
  $('.promo-slider__nav-btn--right').on('click', loadSlide);
  $('.promo-slider__dots').on('click', '.promo-slider__dot', loadSlide);
  
  
  function loadSlide(){
    var _id = $('.promo-slider__counter-current').text(),
      _max = $('.promo-slider__counter-all').text(),
      _last = _id;
    
    if ($(this).hasClass('promo-slider__nav-btn--left')){
      --_id;
    } else if ($(this).hasClass('promo-slider__nav-btn--right')){
      ++_id;
    } else if ($(this).hasClass('promo-slider__dot')){
      _id = $(this).index() + 1;
    }
    
    if (_id > _max) _id = 1;
    if (_id < 1) _id = _max;
    
    var _slideLast = $('.promo-slider__slide').filter('[data-slide-numb="' + _last + '"]'),
      _slideNew = $('.promo-slider__slide').filter('[data-slide-numb="' + _id + '"]');
    
    _slideLast.addClass('hide');    
    _slideNew.find('.promo-slider__img').css({'right': '15px'});    
    _slideNew.find('.promo-slider__img > img').css({'opacity': '0'});
    _slideNew.removeClass('hide');
    
    setTimeout(function(){
      _slideNew.find('.promo-slider__img').animate({'right': '-45px'}, 125);
      _slideNew.find('.promo-slider__img > img').animate({'opacity': '1'}, 275);
    }, 300);
    
    $('.promo-slider__counter-current').text(_id);
    $('.promo-slider__dot').removeClass('promo-slider__dot--current');
    $($('.promo-slider__dot')[--_id]).addClass('promo-slider__dot--current');
  }
  
}());
/*
    jQuery Masked Input Plugin
    Copyright (c) 2007 - 2015 Josh Bush (digitalbush.com)
    Licensed under the MIT license (http://digitalbush.com/projects/masked-input-plugin/#license)
    Version: 1.4.1
*/
!function(factory) {
    "function" == typeof define && define.amd ? define([ "jquery" ], factory) : factory("object" == typeof exports ? require("jquery") : jQuery);
}(function($) {
    var caretTimeoutId, ua = navigator.userAgent, iPhone = /iphone/i.test(ua), chrome = /chrome/i.test(ua), android = /android/i.test(ua);
    $.mask = {
        definitions: {
            "9": "[0-9]",
            a: "[A-Za-z]",
            "*": "[A-Za-z0-9]"
        },
        autoclear: !0,
        dataName: "rawMaskFn",
        placeholder: "_"
    }, $.fn.extend({
        caret: function(begin, end) {
            var range;
            if (0 !== this.length && !this.is(":hidden")) return "number" == typeof begin ? (end = "number" == typeof end ? end : begin, 
            this.each(function() {
                this.setSelectionRange ? this.setSelectionRange(begin, end) : this.createTextRange && (range = this.createTextRange(), 
                range.collapse(!0), range.moveEnd("character", end), range.moveStart("character", begin), 
                range.select());
            })) : (this[0].setSelectionRange ? (begin = this[0].selectionStart, end = this[0].selectionEnd) : document.selection && document.selection.createRange && (range = document.selection.createRange(), 
            begin = 0 - range.duplicate().moveStart("character", -1e5), end = begin + range.text.length), 
            {
                begin: begin,
                end: end
            });
        },
        unmask: function() {
            return this.trigger("unmask");
        },
        mask: function(mask, settings) {
            var input, defs, tests, partialPosition, firstNonMaskPos, lastRequiredNonMaskPos, len, oldVal;
            if (!mask && this.length > 0) {
                input = $(this[0]);
                var fn = input.data($.mask.dataName);
                return fn ? fn() : void 0;
            }
            return settings = $.extend({
                autoclear: $.mask.autoclear,
                placeholder: $.mask.placeholder,
                completed: null
            }, settings), defs = $.mask.definitions, tests = [], partialPosition = len = mask.length, 
            firstNonMaskPos = null, $.each(mask.split(""), function(i, c) {
                "?" == c ? (len--, partialPosition = i) : defs[c] ? (tests.push(new RegExp(defs[c])), 
                null === firstNonMaskPos && (firstNonMaskPos = tests.length - 1), partialPosition > i && (lastRequiredNonMaskPos = tests.length - 1)) : tests.push(null);
            }), this.trigger("unmask").each(function() {
                function tryFireCompleted() {
                    if (settings.completed) {
                        for (var i = firstNonMaskPos; lastRequiredNonMaskPos >= i; i++) if (tests[i] && buffer[i] === getPlaceholder(i)) return;
                        settings.completed.call(input);
                    }
                }
                function getPlaceholder(i) {
                    return settings.placeholder.charAt(i < settings.placeholder.length ? i : 0);
                }
                function seekNext(pos) {
                    for (;++pos < len && !tests[pos]; ) ;
                    return pos;
                }
                function seekPrev(pos) {
                    for (;--pos >= 0 && !tests[pos]; ) ;
                    return pos;
                }
                function shiftL(begin, end) {
                    var i, j;
                    if (!(0 > begin)) {
                        for (i = begin, j = seekNext(end); len > i; i++) if (tests[i]) {
                            if (!(len > j && tests[i].test(buffer[j]))) break;
                            buffer[i] = buffer[j], buffer[j] = getPlaceholder(j), j = seekNext(j);
                        }
                        writeBuffer(), input.caret(Math.max(firstNonMaskPos, begin));
                    }
                }
                function shiftR(pos) {
                    var i, c, j, t;
                    for (i = pos, c = getPlaceholder(pos); len > i; i++) if (tests[i]) {
                        if (j = seekNext(i), t = buffer[i], buffer[i] = c, !(len > j && tests[j].test(t))) break;
                        c = t;
                    }
                }
                function androidInputEvent() {
                    var curVal = input.val(), pos = input.caret();
                    if (oldVal && oldVal.length && oldVal.length > curVal.length) {
                        for (checkVal(!0); pos.begin > 0 && !tests[pos.begin - 1]; ) pos.begin--;
                        if (0 === pos.begin) for (;pos.begin < firstNonMaskPos && !tests[pos.begin]; ) pos.begin++;
                        input.caret(pos.begin, pos.begin);
                    } else {
                        for (checkVal(!0); pos.begin < len && !tests[pos.begin]; ) pos.begin++;
                        input.caret(pos.begin, pos.begin);
                    }
                    tryFireCompleted();
                }
                function blurEvent() {
                    checkVal(), input.val() != focusText && input.change();
                }
                function keydownEvent(e) {
                    if (!input.prop("readonly")) {
                        var pos, begin, end, k = e.which || e.keyCode;
                        oldVal = input.val(), 8 === k || 46 === k || iPhone && 127 === k ? (pos = input.caret(), 
                        begin = pos.begin, end = pos.end, end - begin === 0 && (begin = 46 !== k ? seekPrev(begin) : end = seekNext(begin - 1), 
                        end = 46 === k ? seekNext(end) : end), clearBuffer(begin, end), shiftL(begin, end - 1), 
                        e.preventDefault()) : 13 === k ? blurEvent.call(this, e) : 27 === k && (input.val(focusText), 
                        input.caret(0, checkVal()), e.preventDefault());
                    }
                }
                function keypressEvent(e) {
                    if (!input.prop("readonly")) {
                        var p, c, next, k = e.which || e.keyCode, pos = input.caret();
                        if (!(e.ctrlKey || e.altKey || e.metaKey || 32 > k) && k && 13 !== k) {
                            if (pos.end - pos.begin !== 0 && (clearBuffer(pos.begin, pos.end), shiftL(pos.begin, pos.end - 1)), 
                            p = seekNext(pos.begin - 1), len > p && (c = String.fromCharCode(k), tests[p].test(c))) {
                                if (shiftR(p), buffer[p] = c, writeBuffer(), next = seekNext(p), android) {
                                    var proxy = function() {
                                        $.proxy($.fn.caret, input, next)();
                                    };
                                    setTimeout(proxy, 0);
                                } else input.caret(next);
                                pos.begin <= lastRequiredNonMaskPos && tryFireCompleted();
                            }
                            e.preventDefault();
                        }
                    }
                }
                function clearBuffer(start, end) {
                    var i;
                    for (i = start; end > i && len > i; i++) tests[i] && (buffer[i] = getPlaceholder(i));
                }
                function writeBuffer() {
                    input.val(buffer.join(""));
                }
                function checkVal(allow) {
                    var i, c, pos, test = input.val(), lastMatch = -1;
                    for (i = 0, pos = 0; len > i; i++) if (tests[i]) {
                        for (buffer[i] = getPlaceholder(i); pos++ < test.length; ) if (c = test.charAt(pos - 1), 
                        tests[i].test(c)) {
                            buffer[i] = c, lastMatch = i;
                            break;
                        }
                        if (pos > test.length) {
                            clearBuffer(i + 1, len);
                            break;
                        }
                    } else buffer[i] === test.charAt(pos) && pos++, partialPosition > i && (lastMatch = i);
                    return allow ? writeBuffer() : partialPosition > lastMatch + 1 ? settings.autoclear || buffer.join("") === defaultBuffer ? (input.val() && input.val(""), 
                    clearBuffer(0, len)) : writeBuffer() : (writeBuffer(), input.val(input.val().substring(0, lastMatch + 1))), 
                    partialPosition ? i : firstNonMaskPos;
                }
                var input = $(this), buffer = $.map(mask.split(""), function(c, i) {
                    return "?" != c ? defs[c] ? getPlaceholder(i) : c : void 0;
                }), defaultBuffer = buffer.join(""), focusText = input.val();
                input.data($.mask.dataName, function() {
                    return $.map(buffer, function(c, i) {
                        return tests[i] && c != getPlaceholder(i) ? c : null;
                    }).join("");
                }), input.one("unmask", function() {
                    input.off(".mask").removeData($.mask.dataName);
                }).on("focus.mask", function() {
                    if (!input.prop("readonly")) {
                        clearTimeout(caretTimeoutId);
                        var pos;
                        focusText = input.val(), pos = checkVal(), caretTimeoutId = setTimeout(function() {
                            input.get(0) === document.activeElement && (writeBuffer(), pos == mask.replace("?", "").length ? input.caret(0, pos) : input.caret(pos));
                        }, 10);
                    }
                }).on("blur.mask", blurEvent).on("keydown.mask", keydownEvent).on("keypress.mask", keypressEvent).on("input.mask paste.mask", function() {
                    input.prop("readonly") || setTimeout(function() {
                        var pos = checkVal(!0);
                        input.caret(pos), tryFireCompleted();
                    }, 0);
                }), chrome && android && input.off("input.mask").on("input.mask", androidInputEvent), 
                checkVal();
            });
        }
    });
});
(function($){
    'use strict';
  $.fn.meSlider = function(options) {
        var options = $.extend({
            leftBtn: 'leftBtn',
            rightBtn: 'rightBtn',
            items: 'rightBtn',
            visible: 3,
            speed: 600,
        }, options);
        var make = function() {
            $(this).css('overflow', 'hidden');
            
            var _this = this,
        currentPosition = 0,
        slides = $('.' + options.items),
        slideWidth = ($(this).width())/options.visible,
        numberOfSlides = slides.length;
      
      $(this).css('overflow', 'hidden');
      slides
        .wrapAll('<div class="slide-inner"></div>')
        .css({
          'float' : 'left',
          'width' : slideWidth
        });

      $(this).find('.slide-inner').css('width', slideWidth * numberOfSlides);
      
      $('.' + options.rightBtn).on('click', function(event){
        event.preventDefault();
        ++currentPosition;
        if (currentPosition > numberOfSlides - options.visible) currentPosition = 0;
        $(_this).find('.slide-inner').animate({
          'marginLeft' : slideWidth * (-currentPosition)
        }, options.speed);
      });     
      $('.' + options.leftBtn).on('click', function(event){
        event.preventDefault();
        --currentPosition;
        if (currentPosition < 0) currentPosition = numberOfSlides - options.visible;
        $(_this).find('.slide-inner').animate({
          'marginLeft' : slideWidth * (-currentPosition)
        }, options.speed);
      });
        };
        return this.each(make);
    };
})(jQuery);
'use strict';

(function() {
  var openModalBtns = document.querySelectorAll('.js-get-modal');
  if (openModalBtns) {
    var body = document.querySelector('body');
    openModalBtns = Array.prototype.slice.call(openModalBtns, 0);

    openModalBtns.forEach(function(openModalBtn) {
      openModalBtn.addEventListener('click', function(event) {
        event.preventDefault();
        var targetModal;
        if (openModalBtn.dataset.target) {
          targetModal = document.querySelector(openModalBtn.dataset.target);
        } else {
          targetModal = document.querySelector('.modal');
        }
        if (targetModal) {
          closeModal();
          targetModal.classList.add('modal-open');
          body.classList.add('body-modal');

          var modalCloseBtn = targetModal.querySelector('.js-modal-close');
          modalCloseBtn.addEventListener('click', modalCloseBtnEvent);
          targetModal.addEventListener('click', modalCloseOverEvent);
          window.addEventListener('keypress', modalCloseEscEvent);
        }
      });
    });
  }

  /**
   * Функция которая закрывает модальные окна, если они открыты
   */
  function closeModal() {
    var closeModalTarget = document.querySelector('.modal-open');
    if (closeModalTarget) {
      closeModalTarget.classList.remove('modal-open');
      document.querySelector('body').classList.remove('body-modal');
      closeModalTarget.querySelector('.js-modal-close').removeEventListener('click', modalCloseBtnEvent);
      closeModalTarget.removeEventListener('click', modalCloseOverEvent);
      window.removeEventListener('keypress', modalCloseEscEvent);
    }
  }

  /**
   * Событие которое вызывается при закрытии модального окна по нажтию на кнопку.
   * @param {Event} event default
   */
  function modalCloseBtnEvent(event) {
    event.preventDefault();
    closeModal();
  }

  /**
   * Событие которое вызывается при закрытии модального окна при клике по оверлею.
   * @param {Event} event default
   * @param {Element} modal
   */
  function modalCloseOverEvent(event) {
    if (event.target === document.querySelector('.modal-open')) {
      closeModal();
    }
  }

  /**
   * Событие которое вызывается при закрытии модального окна при нажатии на ESC.
   * @param {Event} event default
   */
  function modalCloseEscEvent(event) {
    if (event.keyKode === 27) {
      closeModal();
    }
  }
})();

(function(){
  
  $('.container').on('click', '.teachers-list__item', function(){
    $('.teachers-list__item').removeClass('teachers-list__item--active');
    var _id = $(this).attr('data-teacher-id'),
      _infoDiv = $('.teachers-slider'),
      _this = this;
    
    if (_infoDiv[0] !== undefined && $(_infoDiv).attr('data-teacher-id') == _id){
      $(_infoDiv).slideUp(400);
      setTimeout(function(){
        $(_infoDiv).remove();
      }, 450);
      return false;
    }
    
    $.get('/api/teachers/info.json?id=' + _id, function(reponse){
      var _container = $(_this).parents('.container')[0];
      
      if (_infoDiv[0] !== undefined) $(_infoDiv).remove();
      $(_this).addClass('teachers-list__item--active');
      $(_container).after(renderDetail(reponse));
      $('.teachers-slider').hide();
      if (_infoDiv[0] === undefined) {
        $('.teachers-slider').slideDown(400);
      } else {
        $('.teachers-slider').show();
      }
    });
  });
  
  $('.teachers').on('click', '.teachers-slider__nav-btn--left', function(){
    var _numb = $(this).parents('.teachers-slider').attr('data-teacher-numb');
    if (_numb == 1){
      _numb = Number($('.teachers-list__item').last().attr('data-teacher-numb')) + 1;
    }
    --_numb;
    $('.teachers-list__item').filter('[data-teacher-numb="' + _numb + '"]').click();
  });
  
  $('.teachers').on('click', '.teachers-slider__nav-btn--right', function(){
    var _numb = $(this).parents('.teachers-slider').attr('data-teacher-numb');
    if (_numb == Number($('.teachers-list__item').last().attr('data-teacher-numb'))){
      _numb = 0;
    }
    ++_numb;
    $('.teachers-list__item').filter('[data-teacher-numb="' + _numb + '"]').click();
  });
  
  function renderDetail(obj){
    var _title = obj.title,
      _subtitle = obj.subtitle,
      _img = obj.img,
      _id = obj.id,
      _numb = $('.teachers-list__item').filter('.teachers-list__item--active').attr('data-teacher-numb');
    
    return '<div class="teachers-slider" data-teacher-id="' + _id + '" data-teacher-numb="' + _numb + '"><div class="container">' +
      '<div class="teachers-slider__items">' +
      '<div class="teachers-slider__nav">' +
            '<button class="teachers-slider__nav-btn teachers-slider__nav-btn--left"><svg id="Слой_1" xmlns="http://www.w3.org/2000/svg" viewBox="-182 166.6 246.6 460.4"><style>.st0{stroke:#000;stroke-width:10;stroke-miterlimit:10;}</style><path class="st0" d="M32.8 171.4c3.2-3.2 7.1-4.8 11.5-4.8s8.3 1.6 11.5 4.8c6.4 6.4 6.4 16.7 0 23l-202.4 202.4L55.8 599.2c6.4 6.4 6.4 16.7 0 23-6.4 6.4-16.7 6.4-23 0l-214-213.9c-6.4-6.4-6.4-16.7 0-23l214-213.9z"/></svg></button>' +
            '<button class="teachers-slider__nav-btn teachers-slider__nav-btn--right"><svg id="Слой_1" xmlns="http://www.w3.org/2000/svg" viewBox="-182 166.6 246.6 460.4"><style>.st0{stroke:#000;stroke-width:10;stroke-miterlimit:10;}</style><path class="st0" d="M32.8 171.4c3.2-3.2 7.1-4.8 11.5-4.8s8.3 1.6 11.5 4.8c6.4 6.4 6.4 16.7 0 23l-202.4 202.4L55.8 599.2c6.4 6.4 6.4 16.7 0 23-6.4 6.4-16.7 6.4-23 0l-214-213.9c-6.4-6.4-6.4-16.7 0-23l214-213.9z"/></svg></button>' +
            '</div><div class="teachers-slider__item"><div class="teachers-slider__item-photo">' +
        '<img src="' + _img + '" alt="" width="240" height="240">' +
            '</div><div class="teachers-slider__item-about">' +
      '<h2 class="h2">Образование</h2>' +
        '<p>' + _title + '</p>' +
            '<h2 class="h2">Компетенции</h2>' +
        '<p>' + _subtitle + '</p>' +
            '</div></div></div></div></div>';
  }
  
}());
(function($){
    'use strict';
  $.fn.toggleShowPassword = function(options) {
        var options = $.extend({
            control: 'leftBtn',
        }, options);
        var make = function() {
            var _this = this,
        control = $('.' + options.control);
      
      $(_this).wrap('<div class="hideShowPassword-wrapper">');
      $(_this).addClass('hideShowPassword-input');
      $(_this).after('<div class="hideShowPassword-btn"></div>');
      
      $(this).parent().on('click', '.hideShowPassword-btn', function(){
        var _input = $(this).parent().find('input'),
          _active = $(_input).hasClass('active-eye');
        
        if (_active){
          $(_input).removeClass('active-eye');
          $(_input).attr('type', 'password');
        } else {
          $(_input).addClass('active-eye');
          $(_input).attr('type', 'text');
        }
      });
        };
        return this.each(make);
    };
})(jQuery);
(function(){
  $('.js-pass-eye').toggleShowPassword();
  $('input.js-input-tel').mask("+7 (999) 999-99-99");
  
  document.querySelector('input[type="file"]').addEventListener('change', previewFile, false);  
  function previewFile(evt) {
    var file = evt.target.files; // FileList object
    var f = file[0];
    
    // Only process image files.
    if (!f.type.match('image.*')) {
      alert("Image only please....");
    }
    var reader = new FileReader();
    // Closure to capture the file information.
    reader.onload = (function(theFile) {
      return function(e) {
        // Render thumbnail.
        var _img = e.target.result;
        $('div.user-form__photo').css('background-image', 'url("' + _img + '")');
      };
    })(f);
    // Read in the image file as a data URL.
    reader.readAsDataURL(f);
  }
  
  $('form.form').on('submit', function(){
    var _empty = true;
    
    $('input.text-validate').each(function(){
      if ($.trim($(this).val()) == ''){
        _empty = false;
      }
    });
    $('input.email-validate').each(function(){
      if ($.trim($(this).val()) == ''){
        _empty = false;
      }
    });
    if ($.trim($('input.pass-validate').val()) == ''){
      _empty = false;
    }
    $('input.pass-validate-re').each(function(){
      if ($.trim($(this).val()) == ''){
        _empty = false;
      }
    });
    
    if (!_empty){
      alert('Необходимо заполнить все поля!');
      return false;
    }
    
    if ($($('input.pass-validate-re')[0]).val() != $($('input.pass-validate-re')[1]).val()){
      alert('Новый пароль и его повтор не совпадают!');
      return false;
    }
  });

}());

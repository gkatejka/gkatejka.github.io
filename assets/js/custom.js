'use strict';

$(function(){

  if($(window).width()<=768) {
    $('#bookprogress>.book-progress').detach().prependTo('#booknav');
  }



  //                  _       __
  //     ____  ____  (_)___  / /______
  //    / __ \/ __ \/ / __ \/ __/ ___/
  //   / /_/ / /_/ / / / / / /_(__  )
  //  / .___/\____/_/_/ /_/\__/____/
  // /_/
  var pointsMin = 0;
  var pointsMax = 100;      // Максимум баллов
  var thesisCounter;        // Кол-во тезисов
  var pointsQuality = 0;    // Баллы за качество

  // Находим все тезисы
  var thesesItem = document.getElementById('thesesInputs').getElementsByTagName('input');

  thesisCounter = thesesItem.length;
  var thesisValue = pointsMax / thesisCounter;    // Кол-во баллов за 1 тезис

  function Culc() {
    var thesisChecked = 0;    // Кол-во отмеченных тезисов
    var pointsTotal = 0;      // Сумма баллов

    // Считаем кол-во отмеченных тезисов
    for (var l = 0; l < thesisCounter; l++) {
      if(thesesItem[l].checked) {
        thesisChecked++;
      }
    }

    // Считаем быллы за качество конспекта
    var qualityElem = document.getElementById('thesesQuality').getElementsByTagName('input');

    for (var j = 0; j < qualityElem.length; j++) {
      if( qualityElem[j].checked) {
        pointsQuality = + qualityElem[j].value;
        break;
      }
    }

    // Суммируем баллы за тезисы и качество
    pointsTotal = (thesisValue*thesisChecked) + pointsQuality;

    if ( pointsTotal >= pointsMax ) {
      pointsTotal = pointsMax;
      return pointsTotal;
    } else if ( pointsTotal < pointsMin ) {
      pointsTotal = pointsMin;
      return pointsTotal;
    } else {
      return pointsTotal;
    }
  }

  // Подсчет суммы баллов
  function totalPoints(){
    var total = Culc();
    document.getElementById('pointsAll').innerHTML = total;
    return total;
  }

  var inputs = document.getElementById('checkIdeas');
  var input = inputs.getElementsByTagName('input');

  for (var i = 0; i < input.length; i++) {
    input[i].addEventListener('click', set_handler(i));
  }

  function set_handler(i){
    return function () {
      totalPoints();
    };
  }
});
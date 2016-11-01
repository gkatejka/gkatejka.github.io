'use strict';

$(function(){

  if($(window).width()<=768) {
    $('#bookprogress>.book-progress').detach().prependTo('#booknav');
  };
});
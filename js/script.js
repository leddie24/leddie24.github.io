$.ajaxSetup ({
    // Disable caching of AJAX responses
    cache: false
});

$(document).ready(function() {
   var home = true;

   function loadHome(callback) {
      $.get('./views/home.html', function( data ) {
         $( "#content" ).html( data ).imagesLoaded().then(function(){
            callback();
         });
      });
   }

   function scrollTo(position) {
      $('body').animate({
         scrollTop: position
      }, 1000, function() {});
   }

   loadHome(function(){});

   // Fn to allow an event to fire after all images are loaded
   $.fn.imagesLoaded = function () {

   // Edit: in strict mode, the var keyword is needed
   var $imgs = this.find('img[src!=""]');
   // if there's no images, just return an already resolved promise
   if (!$imgs.length) {
      return $.Deferred().resolve().promise();
   }

   // for each image, add a deferred object to the array which resolves when the image is loaded (or if loading fails)
   var dfds = [];  
   $imgs.each(function(){

      var dfd = $.Deferred();
      dfds.push(dfd);
      var img = new Image();
      img.onload = function(){dfd.resolve();}
      img.onerror = function(){dfd.resolve();}
      img.src = this.src;

   });

   // return a master promise object which will resolve when all the deferred objects have resolved
   // IE - when all the images are loaded
   return $.when.apply($,dfds);

   }

   $(document).on('click', '.modal-img', function(e) {
      e.preventDefault();
      $('#imagepreview').attr('src', $(this).children('img').attr('src')); // here asign the image to the modal when the user click the enlarge link
      $('#myModalLabel').text($(this).children('figcaption').html());
      $('#imagemodal').modal('show'); // imagemodal is the id attribute assigned to the bootstrap modal, then i use the show function
   });

   $(document).on('click', '.int-proj', function(e){
      e.preventDefault();
      $('body').addClass('noClass');
      if ($(this).parent('li')) {
         var keepactive = true;
         var parent = $(this).parent('li');
         $('.nav .active').removeClass('active');
      }
      var link = $(this).attr('data-alt-proj');
      home = false;
      $('body').animate({
         scrollTop: $('#content').offset().top
      }, 800, function() {
         $('#content').animate({opacity: 0}, 500, function() {
            $(this).load('./views/' + link);
            $('body').removeClass('noClass');
            $('.nav .active').removeClass('active'); 
            if (keepactive) {
               $(parent).addClass('active');
            }
         }).delay(800).animate({opacity: 1}, 500);
      });
   });

   $(document).on('click', '.navbar-brand', function(e) {
      e.preventDefault();
      $('body').animate({
         scrollTop: 0
      }, 300);
      if (!home) {
         $('#content').animate({opacity: 0}, function() {
            loadHome(function(){});
         }).delay(800).animate({opacity: 1});
         home = true;
      }
   });

   $(document).on('click', '.page-scroll', function(e) {
      e.preventDefault();
      var anchor = $(this).attr('href');
      if (!home) {
         $('#content').animate({opacity: 0}, function() {
            loadHome(function(){
               scrollTo($(anchor).offset().top);
            });
         }).delay(800).animate({opacity: 1});
         home = true;
      } else {
         scrollTo($(anchor).offset().top);
      }
   });
});
$.ajaxSetup ({
    // Disable caching of AJAX responses
    cache: false
});

$(document).ready(function() {
   var home = true;

   function loadHome(callback) {
      $.get('./views/home.html', function( data ) {
        $( "#content" ).html( data );
        callback();
      });
   }

   function scrollTo(position) {
      console.log(position);
      $('body').animate({
         scrollTop: position
      }, 1000, function() {});
   }

   loadHome(function(){});


   $(document).on('click', '.modal-img', function(e) {
      e.preventDefault();
      $('#imagepreview').attr('src', $(this).children('img').attr('src')); // here asign the image to the modal when the user click the enlarge link
      $('#myModalLabel').text($(this).children('figcaption').html());
      $('#imagemodal').modal('show'); // imagemodal is the id attribute assigned to the bootstrap modal, then i use the show function
   });

   $(document).on('click', '.int-proj', function(e){
      e.preventDefault();
      home = false;
      $('body').animate({
         scrollTop: $('#content').offset().top
      }, 800, function() {
         $('#content').animate({opacity: 0}, 500, function() {
            $(this).load('./views/discussion_board.html');
            $('.nav .active').removeClass('active');
         }).animate({opacity: 1}, 500);
      });
   });

   $(document).on('click', '.navbar-brand', function(e) {
      e.preventDefault();
      $('body').animate({
         scrollTop: 0
      }, 300);
      if (!home) {
         $('#content').animate({opacity: 0}, function() {
            loadHome();
         }).delay(2000).animate({opacity: 1});
         home = true;
      }
   });



   $(document).on('click', '.page-scroll', function(e) {
      e.preventDefault();
      var anchor = $(this).attr('href');
      if (!home) {
         loadHome(function(){
            scrollTo($(anchor).offset().top);
         });
         home = true;
      } else {
         scrollTo($(anchor).offset().top);
      }
   });
});
$(".tab").on("click", function(){
  $(".tab").removeClass("active-tab");
  $(".chart-section").removeClass("active");
  $(this).addClass("active-tab");
  var targetClass = $(this).attr("target");
  $("." + targetClass).addClass("active");
})

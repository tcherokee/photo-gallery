$(document).ready(function(){

  // var $header = $("header");
  // var offsetTop = $('a').first().offset()
  // var bottom = offsetTop.top + $('a').first().outerHeight();
  // var scrollPosition = $(window).scrollTop();
  //
  // $(window).on("scroll", function(){
  //     scrollPosition = $(window).scrollTop();
  //
  //     if (scrollPosition >= bottom) {
  //         $header.addClass("small");
  //     } else if (scrollPosition <= bottom) {
  //         $header.removeClass("small");
  //     }
  //     console.log("bottom:" + bottom);
  //     console.log("scroll:"+ scrollPosition);
  // })


//Declaring Variables
var $mediaContainer = $(".media-container");
var $mediaContainerA = $(".media-container a");
var $overlay = $('<div class="overlay"></div>');
var imagePointer;
var $mediaType;
var clickedArrayIndex;

//Create an Array of media containers
var mediaArray = [];

$("div.media-container").each(function(){
  mediaArray.push($(this).children().get(0));
})

// console.log($(mediaArray[12]).parent().get(0));

function appendImage(e) {
  //Declaring variables for the function

  //I tried using this to reset the html variable so that I do not have to clear
  //the variable again but it doesn't seem to work.
  var $html = $overlay;
  var $title = $(e).children().attr("title");
  var $alt = $(e).children().attr("alt");
  var $href = $(e).attr("href");
  var $videoEmbed = $href.replace("watch?v=", "embed/");
  $mediaType = $(e).parent().attr("class");


  //Append the image href, alt and <p> to the overlay div
  if ($mediaType === "media-container image") {
    $html.append('<div class="imgWrap"><img src="' + $href + '" alt="' + $title + '" class="lightbox">' + '<p>' + $alt + '</p><span class="arrowContainerL arrow"><img src="js/img/leftArrow.png" alt="leftArrow" class="leftArrow"></span><span class="arrowContainerR arrow"><img src="js/img/rightArrow.png" alt="rightArrow" class="rightArrow"></span></div>');
  } else {
    // $videoEmbed =
    $html.append('<div class="imgWrap"><iframe width="100%" height="100%" src="' + $videoEmbed + '" frameborder="0" class="lightbox" allowfullscreen></iframe>' + '<p>' + $alt + '</p><span class="arrowContainerL"><img src="js/img/leftArrow.png" alt="leftArrow" class="leftArrow"></span><span class="arrowContainerR"><img src="js/img/rightArrow.png" alt="rightArrow" class="rightArrow"></span></div>');
  }

  //return the combine html
  return $html;

}

function calculateWidthHeight(i,j) {
  //defining variables for this function
  var arrowsPad;
  var mediaHeight;
  var mediaWidth;
  var mediaMargin;

  //calculate height of the browser window and assign it to a variable
  var windowHeight = $(window).height();

  //calculate width of the browser window and assign it to a variable
  var windowWidth = $(window).width();

  mediaHeight = j.height();
  mediaWidth = j.width();

  //Calculate height of media element to be 70% of the width of the window;
  mediaWidth  = Math.round(0.7 * windowWidth);

  //calculate height of media to be in the 16:9 ratio
  //Mainly because this will work well with videos

  mediaHeight = Math.round((mediaWidth/16)*9);

  //Based on the window height and the image height
  //We can calculate the needed top margin to center the media
  //We also need to take into account the padding around the media
  //as well as the padding from the paragraph tags for the description
  mediaMargin = Math.round((windowHeight - (mediaHeight+26))/2);
  //Based on the height of the media element, calculate the top for the navi arrows
  //image height - half arrow height
  arrowsPad = Math.round(((mediaHeight+26)/2) - 46);

  if ($mediaType === "media-container image") {
    //Assign the media width & height to the image to prevent conflict with img CSS rule
    $(i).css({width: mediaWidth, height: mediaHeight});
  } else if ($mediaType === "media-container video") {
    //Assign the media width &height to the video to prevent conflict with img CSS rule
    $(i).attr({width: mediaWidth, height: mediaHeight});
  }

  //Assign the width of the image plus a padding of 20px(right and left) to the imgWrap
  //Assign the calculated top margin to the imgWrap to center the image on the screen
  $(i).offsetParent().css({"width":mediaWidth+20, "margin-top":mediaMargin});

  //Assign calculated padding to the arrows
  $(i).siblings("span").css({"padding-top":arrowsPad,"padding-bottom":arrowsPad});

}

function updateSrcAndP(cai) {

  var currentMedia = $(mediaArray[cai]);
  var overlayMedia = $(".overlay").find(".lightbox");
  var nextHeight = $(overlayMedia).prop("height");
  var nextWidth = $(overlayMedia).prop("width");
  var nextPrevHref = $(mediaArray[cai]).attr("href");
  var nextPrevVidHref = nextPrevHref.replace("watch?v=", "embed/");

  // console.log($(mediaArray[cai]).children().get(0));
  if (currentMedia.parent().prop("class") === "media-container image") {
    $("body").find(".lightbox").replaceWith('<img src="' + nextPrevVidHref + '" style="width:' + nextWidth + 'px; height:' + nextHeight + 'px;" class="lightbox">').attr("src", nextPrevHref );
  } else {
    $("body").find("img.lightbox").replaceWith('<iframe width="' + nextWidth + '" height="' + nextHeight + '" src="' + nextPrevVidHref + '" frameborder="0" class="lightbox" allowfullscreen></iframe>');
  }
  $("body").find("p").replaceWith("<p>" + currentMedia.children().attr("alt") + "</p>");
  console.log(nextHeight);
}

// function searchMedia() {
$("#search-box").on("keyup", function(e) {
  var searchValue = $(this).val()
  for (var i = 0; i < mediaArray.length; i += 1) {

    console.log(mediaArray[i]);

    if ($(mediaArray[i]).children().attr('alt').indexOf(searchValue) === -1) {

      $(mediaArray[i]).parent().hide();
    } else {
      $(mediaArray[i]).parent().show();
    }
    console.log(e.which);
  }


});
// }

//When previous arrow is clicked, show previous image in lightbox
$("body").on("click", ".arrowContainerL", function(){

  if (clickedArrayIndex >= 1) {
    //subtract one from clickedArrayIndex to set mediaArray index to the previous item
    clickedArrayIndex = clickedArrayIndex - 1;
    updateSrcAndP(clickedArrayIndex);
  } else if (clickedArrayIndex === -1) {
    event.preventDefault();
  }

});


//When next arrow is clicked, show next image in lightbox
$("body").on("click", ".arrowContainerR", function(){

  //If clickedArrayIndex is not length of array then set lightbox image to the image from the next image.
  if (clickedArrayIndex < (mediaArray.length - 1)) {
    //add one to the clickedArrayIndex to set mediaArray index to the next item
    clickedArrayIndex = clickedArrayIndex + 1;
    updateSrcAndP(clickedArrayIndex);
  } else {
    event.preventDefault();
  }

});

//Add on click event to the images
$mediaContainerA.on("click", function(){

  //Disable click action which takes user to a page with the image
  event.preventDefault();

  //Set the array index value of clicked image.
  clickedArrayIndex = mediaArray.indexOf(this);

  //Call append image function, append it to the document body and assign it to a variable
  var combinedHTML = $("body").append(appendImage(this));

  //Find the image in the newly appended HTML & Assign to variable
  imagePointer = $(".overlay").find(".lightbox");

  //Use a load function to ensure the lightbox has loaded before running additional functions
  $(imagePointer).load(function(){
    calculateWidthHeight(this,imagePointer);
  });

});


$("body").on("click keyup", ".overlay", function(event){
  //Check if the image or the overlay bkg was clicked
  //If overlay bkg was clicked close else do nothing.
  if (event.target !== this ) {
    event.stopPropagation();
  } else {
    //Reset overlay
    $overlay = $('<div class="overlay"></div>')
    $(this).remove();
  }
});








  //Clicking on the next and previous arrows takes you to the next and previous images in the list
  //clicking anywhere else closes the overlay

});

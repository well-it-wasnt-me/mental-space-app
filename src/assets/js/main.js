$(window).on('mouseover', function() {

$(".footer-menu-btn").click(function(){
$('.main-menu-box').addClass('open');
$('.footer-menu-close-btn').addClass('show');
$(this).addClass('hide');
});
$(".footer-menu-close-btn").click(function(){
$('.main-menu-box').removeClass('open');
$('.footer-menu-btn').removeClass('hide');
$(this).removeClass('show');
});
$(".singout-btn a").click(function(){
	$('.main-menu-box').removeClass('open');
$('.footer-menu-btn').removeClass('hide');
$('.footer-menu-close-btn').removeClass('show');
});

$(".main-menu  a:not(.submenu)").click(function(){
$('.main-menu-box').removeClass('open');
$('.footer-menu-btn').removeClass('hide');
$('.footer-menu-close-btn').removeClass('show');
if($('.submenu').hasClass('collapsed'))
{
	$('.collapse').removeClass('show');
	$('.submenu').addClass('collapsed');
}
else
{
}
});

var inputField = document.querySelector('.chosen-value');
var dropdown = document.querySelector('.value-list');
var dropdownArray = [].concat(document.querySelectorAll('li'));
var dropdownItems = dropdownArray[0];
if (dropdown !==null )
{
dropdown.classList.add('open');
inputField.focus(); // Demo purposes only

var valueArray = [];
dropdownItems.forEach(function (item) {
  valueArray.push(item.textContent);
});

var closeDropdown = function closeDropdown() {
  dropdown.classList.remove('open');
};

inputField.addEventListener('input', function () {
  dropdown.classList.add('open');
  var inputValue = inputField.value.toLowerCase();
  var valueSubstring = undefined;
  if (inputValue.length > 0) {
    for (var j = 0; j < valueArray.length; j++) {
      if (!(inputValue.substring(0, inputValue.length) === valueArray[j].substring(0, inputValue.length).toLowerCase())) {
        dropdownItems[j].classList.add('closed');
      } else {
        dropdownItems[j].classList.remove('closed');
      }
    }
  } else {
    for (var i = 0; i < dropdownItems.length; i++) {
      dropdownItems[i].classList.remove('closed');
    }
  }
});

dropdownItems.forEach(function (item) {
  item.addEventListener('click', function (evt) {
    inputField.value = item.textContent;
    dropdownItems.forEach(function (dropdown) {
      dropdown.classList.add('closed');
    });
  });
});

inputField.addEventListener('focus', function () {
  inputField.placeholder = 'Type to filter';
  dropdown.classList.add('open');
  dropdownItems.forEach(function (dropdown) {
    dropdown.classList.remove('closed');
  });
});

inputField.addEventListener('blur', function () {
  inputField.placeholder = 'Select state';
  dropdown.classList.remove('open');
});

document.addEventListener('click', function (evt) {
  var isDropdown = dropdown.contains(evt.target);
  var isInput = inputField.contains(evt.target);
  if (!isDropdown && !isInput) {
    dropdown.classList.remove('open');
  }
});
}
});


$(function() {
$(".footer-menu-btn").click(function(){
$('.main-menu-box').addClass('open');
$('.footer-menu-close-btn').addClass('show');
$(this).addClass('hide');
});
$(".footer-menu-close-btn").click(function(){
$('.main-menu-box').removeClass('open');
$('.footer-menu-btn').removeClass('hide');
$(this).removeClass('show');
});
$(".singout-btn a").click(function(){
	$('.main-menu-box').removeClass('open');
$('.footer-menu-btn').removeClass('hide');
$('.footer-menu-close-btn').removeClass('show');
});

});


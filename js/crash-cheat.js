var titleTime;
var originalTitle = document.title;
document.addEventListener('visibilitychange', function () {
  if (document.hidden) {
    $('[rel="icon"]').attr('href', "/images/failure.ico");
    document.title = 'Aw, Snap! Something went wrong while displaying this webpage.';
    clearTimeout(titleTime);
  } else {
    $('[rel="icon"]').attr('href', "/images/hacker.ico");
    document.title = "(ฅ>ω<*ฅ) What's happening~" + originalTitle;
    titleTime = setTimeout(function () {
      document.title = originalTitle;
    }, 2000);
  }
});
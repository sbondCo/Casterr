window.scrolling = {
  runFuncAtEnd: function (elId, funcToRun, dotnetHelper) {
    let el = document.getElementById(elId);

    el.addEventListener("scroll", function () {
      if (el.scrollHeight - el.scrollTop === el.clientHeight) {
        // If scrolled to bottom run funcToRun
        dotnetHelper.invokeMethodAsync(funcToRun);
      }
    });
  }
}

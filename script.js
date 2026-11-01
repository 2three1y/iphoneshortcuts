// Copy buttons and fill-in boxes for the iOS 27 prompts. Nothing is saved or sent.
(function () {
  function fill(input) {
    var key = input.getAttribute("data-target");
    var spans = document.querySelectorAll('[data-fill="' + key + '"]');
    var value = input.value.trim();
    for (var i = 0; i < spans.length; i++) {
      var s = spans[i];
      if (!s.hasAttribute("data-placeholder")) s.setAttribute("data-placeholder", s.textContent);
      s.textContent = value || s.getAttribute("data-placeholder");
    }
  }
  var inputs = document.querySelectorAll("input[data-target]");
  for (var i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener("input", function (e) { fill(e.target); });
    if (inputs[i].value) fill(inputs[i]);
  }

  function say(el, msg) {
    el.textContent = "";
    setTimeout(function () { el.textContent = msg; }, 60);
  }
  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.top = "-1000px";
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, text.length);
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }
  var buttons = document.querySelectorAll("button.copy");
  for (var j = 0; j < buttons.length; j++) {
    buttons[j].addEventListener("click", function (e) {
      var btn = e.currentTarget;
      var text = document.getElementById(btn.getAttribute("data-copy")).innerText.trim();
      var status = document.getElementById(btn.getAttribute("data-status"));
      var hasBlank = /\[[^\]]+\]/.test(text);
      var okMsg = hasBlank
        ? "Copied. Some boxes are empty, so swap the words in square brackets after you paste."
        : "Copied. Now paste it into Shortcuts.";
      function done(ok) {
        say(status, ok ? okMsg : "Couldn't copy. Select the prompt text below and copy it.");
      }
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(fallbackCopy(text)); });
      } else {
        done(fallbackCopy(text));
      }
    });
  }
})();

(function () {
  const domain = window.location.hostname;

  chrome.storage.sync.get(domain, function (data) {
    const status = (data[domain] as boolean) || false;
    if (status) {
      removeCopyRestriction();
    }
  });

  function removeCopyRestriction() {
    const events = [
      "copy",
      "cut",
      "contextmenu",
      "selectstart",
      "mousedown",
      "mouseup",
    ];

    const stopPropagation = (event: Event) => {
      event.stopPropagation();
      event.stopImmediatePropagation?.(); // Optional chaining for broader compatibility
    };

    const allowCopyClass = "easy-copy";

    document.body.classList.add(allowCopyClass);

    const styleElement = document.createElement("style");
    styleElement.textContent = `.${allowCopyClass} { user-select: text !important; }`;
    document.head.appendChild(styleElement);

    events.forEach((event) => {
      document.documentElement.addEventListener(event, stopPropagation, {
        capture: true,
      });
    });
  }
})();

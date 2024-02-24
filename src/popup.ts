document.addEventListener("DOMContentLoaded", async () => {
  const switchButton = document.getElementById("switch") as HTMLButtonElement;
  const domainElement = document.getElementById("domain") as HTMLElement;
  const statusElement = document.getElementById("status") as HTMLElement;
  const contentElement = document.getElementById("content") as HTMLElement;

  switchButton.addEventListener("click", async () => {
    try {
      if (statusElement.innerHTML === "Invalid") return;
      const domain = domainElement.textContent || "";
      const status = statusElement.textContent === "Enable";

      if (!status) {
        await chrome.storage.sync.set({ [domain]: true });
        await chrome.tabs.reload();
      } else {
        await chrome.storage.sync.remove([domain]);
      }

      await loadData(true);
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Check the console for details.");
    }
  });

  async function loadData(isReload: boolean) {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs.length === 0) return;

    const url = tabs[0].url || "";
    if (!isURL(url)) {
      // Handle invalid URL case
      statusElement.textContent = "Invalid";
      switchButton.textContent = "Current tab is invalid";
      contentElement.classList.add("active");
      return;
    }

    const domain = new URL(url).hostname;
    if (isReload && tabs[0].id) await chrome.tabs.reload(tabs[0].id);
    domainElement.textContent = domain;

    const data = await chrome.storage.sync.get(domain);
    const status = (data[domain] as boolean) || false;
    updateUI(status); // Separate UI update logic
  }

  function updateUI(status: boolean) {
    statusElement.textContent = status ? "Enable" : "Disable";
    switchButton.textContent =
      (status ? "Disable" : "Enable") + " extension on this website";
    contentElement.classList.toggle("active", status);
  }

  loadData(false); // Initial data load

  function isURL(url: string): boolean {
    const urlRegex =
      /^(https?):\/\/(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i;
    return urlRegex.test(url);
  }
});

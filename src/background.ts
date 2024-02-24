// Function to get the icon path based on status
const getIcon = (status: boolean): { [key: string]: string } => ({
  "16": status ? "../images/icon16.png" : "../images/icon216.png",
  "48": status ? "../images/icon48.png" : "../images/icon248.png",
  "128": status ? "../images/icon128.png" : "../images/icon2128.png",
});

// Listen for tab updates and storage changes to update the icon
chrome.tabs.onUpdated.addListener((_tabId, changeInfo, tab) => {
  if (changeInfo.status === "loading") {
    loadIcon(tab);
  }
});

chrome.storage.onChanged.addListener(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    if (activeTab) {
      loadIcon(activeTab);
    }
  });
});

async function loadIcon(tab: chrome.tabs.Tab) {
  const url = tab.url || "";
  const domain = new URL(url).hostname;

  const status =
    ((await chrome.storage.sync.get(domain))[domain] as boolean) || false;
  const iconPath = getIcon(status);
  chrome.action.setIcon({ path: iconPath["16"] }); // Use a specific size for setIcon
}

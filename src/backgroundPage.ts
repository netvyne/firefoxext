chrome.browserAction.onClicked.addListener((tab) => {
  // Send a message to the active tab
  console.log(tab);
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab : any = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {
      message: 'clicked_browser_action',
    });
  });
});

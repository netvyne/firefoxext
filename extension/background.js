chrome.browserAction.onClicked.addListener((tab) => {
  chrome.tabs.sendMessage(tab.id, 'toggle');
  browser.tabs.query({currentWindow: true, active: true}).then((tabs) => {
      let tab = tabs[0]; // Safe to assume there will only be one result
      chrome.tabs.sendMessage(tab.id, {
        message: 'currentTabInfo',
        urlInfo: tab
      });
  }, console.error)
});

chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    if (request.message === 'cropped') {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, 'toggle');
        chrome.runtime.sendMessage(chrome.runtime.id, { target: 'app', type: 'screenshotcropped' });
      });
      sendResponse({ message: 'goodbye cropped' });
    }
    if (request.message === 'closeDialogue') {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, 'toggle');
      });
      sendResponse({ message: 'goodbye cropped' });
    }
  },
);

chrome.browserAction.onClicked.addListener(() => {
  // Send a message to the active tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {
      message: 'clicked_browser_action',
    });
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.screenshot === 'take') {
    // use background script to take screenshot, move sidebar out of the way
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, 'toggle');
      chrome.tabs.sendMessage(
        activeTab.id,
        { message: 'clicked_browser_action' },
        () => {
          chrome.tabs.captureVisibleTab({ format: 'png' }, (src) => {
            storage.StorageArea.set({ screenshot: src }, () => {
              chrome.tabs.sendMessage(activeTab.id, 'toggle');
              chrome.tabs.sendMessage(
                activeTab.id,
                { message: 'clicked_browser_action' },
                () => {
                  sendResponse([]);
                },
              );
            });
          });
        },
      );
    });
  } else if (request.screenshot === 'clear') {
    // clear screenshot from storage
    storage.StorageArea.remove('screenshot', () => {
      sendResponse([]);
    });
  } else if (request.screenshot === 'createDiv') {
    // eslint-disable-next-line no-alert
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, 'toggle');
      chrome.tabs.sendMessage(
        activeTab.id,
        { message: 'clicked_browser_action' },
        () => {
          chrome.tabs.captureVisibleTab({ format: 'png' }, (src) => {
            storage.StorageArea.set({ screenshot: src }, () => {
              // console.log('Stored screenshot!');
              chrome.tabs.sendMessage(activeTab.id, 'toggle');
              chrome.scripting.executeScript(
                {
                  target: { tabId: activeTab.id },
                  files: ['content-crop.js'],
                }, () => {
                  if (chrome.runtime.lastError) {
                    console.log(`Script injection failed: ${chrome.runtime.lastError.message}`);
                  }
                }
              );
              sendResponse({ confirmation: 'Successfully created div' });
            });
          });
        },
      );
    });
    // sendResponse({ confirmation: 'Successfully created div' });
  } else if (request.clear_notifications) {
    chrome.browserAction.setBadgeBackgroundColor({ color: [0, 0, 0, 0] });
    chrome.browserAction.setBadgeText({ text: '' });
  } else if (request.type && request.type === 'setBadge') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.browserAction.setBadgeText({ text: `${request.text}` });
    });
  } else {
    // this message is a request, use background script to make request
    fetch(request.url, request.init).then(
      (response) => {
        const resp = response.text();
        return resp.then((text) => {
          sendResponse([
            {
              body: text,
              status: response.status,
              statusText: response.statusText,
            },
            null,
          ]);
        });
      },
      (error) => {
        sendResponse([null, error]);
      },
    );
  }
  return true;
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.tabs.create({
    url: 'https://www.netvyne.com/welcome',
    active: true
  });
  return false;
});

chrome.runtime.setUninstallURL('https://forms.gle/gBrENf235DqnTbcj9');

chrome.tabs.onUpdated.addListener(
  (tabId, changeInfo) => {
    // read changeInfo data and do something with it
    if (changeInfo.url) {
      chrome.tabs.sendMessage(tabId, {
        message: 'urlupdated',
        url: changeInfo.url
      });
    }
  }
);

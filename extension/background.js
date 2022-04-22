chrome.browserAction.onClicked.addListener((tab) => {
  chrome.tabs.sendMessage(tab.id, 'toggle');
  chrome.tabs.query({ currentWindow: true, active: true }).then((tabs) => {
    const curTab = tabs[0]; // Safe to assume there will only be one result
    chrome.tabs.sendMessage(curTab.id, {
      message: 'currentTabInfo',
      urlInfo: curTab
    });
  }, console.error);
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

    if (request.popupMounted) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {
          message: 'currentTabInfo',
          urlInfo: activeTab,
          active: activeTab?.active
        });
      });
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
            chrome.storage.local.set({ screenshot: src }, () => {
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
    chrome.storage.local.remove('screenshot', () => {
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
            chrome.storage.local.set({ screenshot: src }, () => {
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
    chrome.tabs.query({ active: true, currentWindow: true }, () => {
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
  chrome.storage.local.remove('isExtClosed', () => {});
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
      setTimeout(() => {
        chrome.tabs.get(tabId, async (tab) => {
          chrome.tabs.sendMessage(tabId, {
            message: 'urlupdated',
            completeInfo: tab,
            url: changeInfo.url
          });
        });
      }, 2000);

      // chrome.tabs.getCurrent((tab) => {
      //   chrome.tabs.sendMessage(tabId, {
      //     message: 'urlupdated',
      //     completeInfo: tab,
      //     url: changeInfo.url
      //   });
      // });
    }
  }
);

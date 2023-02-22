chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tabData) => {
        if(tabData.url.startsWith("chrome://")) 
            return undefined;
        
        chrome.tabs.sendMessage(activeInfo.tabId, { message: "" });
    })
})

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if(changeInfo.status === "complete") {
        chrome.tabs.get(tabId, (tabData) => {
            if(tabData.url.startsWith("chrome://")) 
                return undefined;   
            
            chrome.tabs.sendMessage(tabId, { tabId: tabId });
        })
    }    
});

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
        chrome.storage.sync.get(["lockedTabs"])
            .then((result) => {
                if(result.lockedTabs && result.lockedTabs[`${tabId}`]) {
                    let lockedTabs = result.lockedTabs;
                    delete lockedTabs[`${tabId}`]

                    chrome.storage.sync.set({lockedTabs: lockedTabs});
                }
            })
  });
  
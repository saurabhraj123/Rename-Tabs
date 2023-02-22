let title;

chrome.runtime.onMessage.addListener((tab) => {
    
    let tabId = tab.tabId;
    chrome.storage.sync.get(["lockedTabs"])
            .then((result) => {
                if(result.lockedTabs && result.lockedTabs[`${tabId}`]) {
                    let lockedTabs = result.lockedTabs;
                    title = lockedTabs[`${tabId}`]
                    document.querySelector('title').innerText = title;
                }else {
                    title = document.querySelector('title')?.innerText || 'title';
                }
                

                chrome.storage.sync.set({title: title});
            })
})
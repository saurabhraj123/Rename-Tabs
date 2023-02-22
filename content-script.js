let title; 

chrome.runtime.onMessage.addListener((tab) => {
    
    console.log('TabId', tab.tabId);
    let tabId = tab.tabId;

    chrome.storage.sync.get(["lockedTabs"])
    .then((result) => {
        if(result.lockedTabs && result.lockedTabs[`${tabId}`]) {
            let lockedTabs = result.lockedTabs;
            title = lockedTabs[`${tabId}`]
            document.querySelector('title').innerText = title;
            
            console.log('cs-lockedTabs', lockedTabs);
        }else {
            title = document.querySelector('title').innerText;
        }

        console.log('Result', result);
        
        chrome.storage.sync.set({title: document.querySelector('title').innerText});
    })
})
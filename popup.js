const saveBtn = document.querySelector('#saveBtn');
const lockBtn = document.querySelector('#lockBtn');
const titleInputField = document.querySelector('#title');

titleInputField.focus();

titleInputField.addEventListener("focus", function() {
  titleInputField.select();
});

chrome.storage.sync.get(["title"])
    .then((result) => {
        if(result.title) {
            titleInputField.value = result.title;
        }else {
            chrome.storage.sync.set({title: document.querySelector('title').innerText});
            titleInputField.value = document.querySelector('title').innerText;
        }
    })

titleInputField.addEventListener('input', () => {
    console.log(titleInputField.value);
    if (titleInputField.value === '') {
        saveBtn.disabled = true;
        lockBtn.disabled = true;
    } else {
        saveBtn.disabled = false;
        lockBtn.disabled = false;
    }
})

document.addEventListener('keyup', (event) => {
    if(event.keyCode === 13) {
        saveBtn.click();

        if(titleInputField.value.length !== 0)
            window.close();
    }
})

saveBtn.addEventListener('click', () => { 
    chrome.storage.sync.set({title: titleInputField.value})
        .then(() => {
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                let tab = tabs[0];
                
                if (tab.url?.startsWith("chrome://")) return undefined;
        
                chrome.scripting.executeScript({
                    target: {tabId: tab.id},
                    files: ['title_change.js']
                })
            });
        })
})

lockBtn.addEventListener('click', () => {
    saveBtn.click();

    chrome.storage.sync.get(["lockedTabs"])
        .then((result) => {
            chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
                if(result.lockedTabs) {
                    let tabId = tabs[0].id;

                    let lockedTabs = result.lockedTabs;
                    lockedTabs[`${tabId}`] = titleInputField.value;

                    chrome.storage.sync.set({lockedTabs: lockedTabs})
                }else {
                    let tabId = tabs[0].id;
                    let value = titleInputField.value;

                    let lockedTabs = {}
                    lockedTabs[`${tabId}`] = value;

                    chrome.storage.sync.set({lockedTabs: lockedTabs})
                }
            })
        })
})
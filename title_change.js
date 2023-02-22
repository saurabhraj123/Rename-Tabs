
chrome.storage.sync.get(["title"])
    .then((result) => {
        document.querySelector('title').innerText = `${result.title}`;
    })


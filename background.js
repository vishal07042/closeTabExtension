// Initialize storage when extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ 
        'questionAnswered': false,
        'firstTabOpened': false 
    });
});

// Handle new tab creation
chrome.tabs.onCreated.addListener(async (tab) => {
    if (!tab.url || tab.url === '') return;
    
    const result = await chrome.storage.local.get(['questionAnswered', 'firstTabOpened']);
    
    // Allow the first new tab to open
    if (!result.firstTabOpened && 
        (tab.pendingUrl === 'chrome://newtab/' || tab.url === 'chrome://newtab/')) {
        chrome.storage.local.set({ 'firstTabOpened': true });
        return;
    }
    
    // If question isn't answered, prevent opening other URLs
    if (!result.questionAnswered) {
        chrome.tabs.update(tab.id, { url: 'chrome://newtab' });
    }
});

// Handle navigation within existing tabs
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (!changeInfo.url) return;
    
    const result = await chrome.storage.local.get(['questionAnswered', 'firstTabOpened']);
    
    // Allow browser system pages
    if (changeInfo.url.startsWith('chrome://') || 
        changeInfo.url.startsWith('edge://') || 
        changeInfo.url.startsWith('about:')) {
        return;
    }
    
    // If question isn't answered, redirect to new tab
    if (!result.questionAnswered) {
        chrome.tabs.update(tabId, { url: 'chrome://newtab' });
    }
}); 
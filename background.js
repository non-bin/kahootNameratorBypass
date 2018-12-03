name = 'Something\'s Wrong';

browser.runtime.onMessage.addListener(nameRequested);

function nameRequested(message) {
    name = message.name;
}

function injectListener(details) {
    let filter = browser.webRequest.filterResponseData(details.requestId);
    let decoder = new TextDecoder('utf-8');
    let encoder = new TextEncoder();


    filter.ondata = event => {
        filter.write(encoder.encode('{"name":"' + name + '"}'));
        filter.disconnect();
    }

    return {};
}

function nameratorCheckListener(details) {
    let filter = browser.webRequest.filterResponseData(details.requestId);
    let decoder = new TextDecoder('utf-8');
    let encoder = new TextEncoder();

    filter.ondata = event => {
        let str = decoder.decode(event.data, {stream: true});

        if (str.includes('"namerator":true,')) {
            browser.tabs.sendMessage(details.tabId, 'requestName');
        }

        filter.write(encoder.encode(str));
        filter.disconnect();
    }

    return {};
}

browser.webRequest.onBeforeRequest.addListener(nameratorCheckListener, {urls: ['https://kahoot.it/reserve/session/*']}, ['blocking']);
browser.webRequest.onBeforeRequest.addListener(injectListener, {urls: ['https://apis.kahoot.it/namerator/*']}, ['blocking']);

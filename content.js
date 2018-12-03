function requestName() {
    var inputName = prompt("Enter a name to inject");

    if (inputName == null || inputName == "") {
        inputName = "PlzWriteSomething";
    }

    browser.runtime.sendMessage({name: inputName});
}

browser.runtime.onMessage.addListener(requestName);

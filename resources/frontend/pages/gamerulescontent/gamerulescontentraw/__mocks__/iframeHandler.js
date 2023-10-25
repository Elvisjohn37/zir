
let isSuccess;

let loadGoogleDocsIframe = jest.fn((iframe, url, callback) => {
    if(isSuccess) {
        callback.success && callback.success();
    } else {
        callback.error
    }
});

let resetLoadGoogleDocsIframe = () => {
    isSuccess = true;
}

let setError = () => {
    isSuccess = false;
}

resetLoadGoogleDocsIframe();

export { loadGoogleDocsIframe, resetLoadGoogleDocsIframe, setError };
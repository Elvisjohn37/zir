
let isSucces;

let testData = "test data";

let googleDocs = jest.fn((url, success, error) => {
    if(isSucces) {
        success({
            data: testData
        });
    } else {
        error();
    }
});

let resetGoogleDocs = () => {
    isSucces = true;
}

let setErrorGoogleDocs = () => {
    isSucces = false;
}

resetGoogleDocs();

export { googleDocs, resetGoogleDocs, setErrorGoogleDocs, testData };

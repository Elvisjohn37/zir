let mockedModule = jest.createMockFromModule('../bannerHelper');

let rsoData;

mockedModule.getRsoUrl =  function(url, type, lang = null) {
    let fileName = url.substring(url.lastIndexOf('/')+1);
    if(lang == null) {
        rsoData = url.replace(fileName, `${type}/${fileName}`);
    } else {
        rsoData = url.replace(fileName, `${type}_${lang}/${fileName}`);
    }
    return rsoData;
}

mockedModule.getRsoUrlData = function() {
    return rsoData;
}

mockedModule.resetRsoUrl = function() {
    rsoData = "5_en/customerSupport.png";
}

mockedModule.setRsoUrl = function(rsoUrl) {
    rsoData = rsoUrl;
}

mockedModule.resetRsoUrl();

module.exports = mockedModule;

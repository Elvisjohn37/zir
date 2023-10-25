

export function getRsoUrl(url, type, lang = null) {
    let fileName = url.substring(url.lastIndexOf('/')+1);
    if(lang == null) {
        return url.replace(fileName, `${type}/${fileName}`);
    } else {
        return url.replace(fileName, `${type}_${lang}/${fileName}`);
    }
}
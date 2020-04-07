module.exports = {
    parseUrl: function (url) {
        if (!url.startsWith('http://') && !url.startsWith('https://')) url = 'http://' + url;
        return url;
    }
};
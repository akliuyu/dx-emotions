/**
 * module: 右键菜单监听
 */

chrome.contextMenus.create({
    'id': '1000',
    'title': '添加到收藏',
    'contexts': ['image']
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
    var src = info['srcUrl'];
    chrome.storage.local.get(['favorList', 'newFavorList'], function (items) {
        var favorList = items['favorList'] || [];
        var newFavorList = items['newFavorList'];

        if (!newFavorList && favorList) {
            newFavorList = favorList.map(function (element) {
                return {
                    url: element,
                    count: 0
                }
            });

            saveNewFavor(newFavorList);
        }
        // if (newFavorList) {
        var contains = false;
        for (var i = 0; i < newFavorList.length; i++) {
            if (favorList[i].url === src) {
                contains = true;
                break;
            }
        }
        if (!contains) {
            newFavorList.push({
                url: src,
                count: 0
            });
            saveNewFavor(newFavorList);
        }
    });
});

function saveNewFavor(newFavorList) {
    chrome.storage.local.set({
        'newFavorList': newFavorList,
        'hasNew': true
    });
}

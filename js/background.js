/**
 * 
 */

chrome.contextMenus.create({
    'id' : '1000',
    'title' : '添加到收藏',
    'contexts' : [ 'image' ]
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
    var src = info['srcUrl'];
    chrome.storage.local.get('favorList', function(items) {
        var favorList = items['favorList'];
        if (favorList) {
            var contains = false;
            for (var i = 0; i < favorList.length; i++) {
                if (favorList[i] == src) {
                    contains = true;
                    break;
                }
            }
            if (!contains) {
                favorList[favorList.length] = src;
                saveFavor(favorList);
            }
        } else {
            favorList = [ src ];
            saveFavor(favorList);
        }
    });
});

function saveFavor(favorList) {
    chrome.storage.local.set({
        'favorList' : favorList,
        'hasNew' : true
    }, function() {
        
    });
}
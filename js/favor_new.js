/**
 * @module: 画面板和表情主流程
 */
hack();
var msgSend;
function hack() {
    setTimeout(function () {
        msgSend = $('#msgSend');
        if (msgSend.length > 0) {
            hackLeft();
            doHack();
        } else {
            hack();
        }
    }, 1000);
}
function hackLeft() {
    $($('#main .cust-app-item').get(0)).click(function () {
        setTimeout(function () {
            msgSend = $('#msgSend');
            if (msgSend.length > 0) {
                doHack();
            } else {
                hack();
            }
        }, 1000);
    });
}
function doHack() {
    msgSend.find('.smiley-container .dxicon').unbind('click').bind('click', function () {
        addTabBar();
    });
}

function addTabBar() {
    setTimeout(function () {
        var tabbar = msgSend.find('.smiley-tabbar');
        var isExist = tabbar.find('[title=收藏]').length > 0;
        if (tabbar.length > 0 && !isExist) {
            tabbar.append($('<div>', {
                'class': 'tabbar-item',
                'title': '收藏',
                'click': showFavor,
                'custom': '1'
            }).append($('<img>', {
                'src': chrome.extension.getURL('img/favorite.png'),
                'style': 'width: 20px; height: 20px;'
            }))).append($('<span>', {
                'click': openOptions,
                'text': '管理',
                'style': 'position: absolute; right: 5px; font-size: 12px; color: #666; padding: 0px 4px; cursor: pointer;'
            }));
            // tab点击
            tabbar.find('.tabbar-item').unbind('click').bind('click', function () {
                tabbar.find('.tabbar-item').removeClass('active');
                $(this).addClass('active');
                if ($(this).attr('custom')) {
                    showFavor();
                } else {
                    msgSend.find('.smiley-emotions-fv').remove();
                    msgSend.find('.smiley-panel div').show();
                }
            });
        } else {
            addTabBar();
        }
    }, 200)
}

function removeTabBar() {
    var tabBar = msgSend.find('.smiley-tabbar');
    tabBar.remove('[title=收藏]');
    var favorPanel = msgSend.find('.smiley-panel');
    favorPanel.remove();
}

var tips = $('<label>', {
    'style': 'position: absolute; top: 45%; left: 30%',
    'text': '在图片上点击右键添加到收藏'
});

function showFavor() {
    var favorPanel = msgSend.find('.smiley-panel');
    var favorBox = $('<div>', {
        'class': 'smiley-emotions-fv',
        'style': 'height: 216px; position: relative; overflow: auto;'
    });
    favorBox.append(tips);
    loadFavor(favorBox);
    favorPanel.find('div').hide().end().append(favorBox);
}

function hideFavor() {
    removeTabBar();
}

function loadFavor(favorBox) {
    chrome.storage.local.get(['favorList'], function (items) {
        var favorList = items['favorList'];
        if (favorList) {
            showTips(favorList.length === 0);
            favorBox.find('span').remove();
            for (var i = 0; i < favorList.length; i++) {
                favorBox.append($('<span>', {
                    'href': '#',
                    'class': 'icon icon-smiley-emotions',
                    'style': 'width: 64px; height: 64px;'
                }).append($('<img>', {
                    'width': 64,
                    'height': 64,
                    'src': favorList[i],
                    'onclick': 'postFavor()',
                    'click': hideFavor
                })));
            }
        }
    });
}

function showTips(empty) {
    if (empty) {
        tips.show();
    } else {
        tips.hide();
    }
}
// 管理
function openOptions() {
    window.open(chrome.extension.getURL('options.html'));
}

// 发表
function postFavor() {
    var src = event.target.getAttribute('src');

    if (mta) {
        mta('count', 'emotions.custom.dx');
    }

    if (window._debug) {
        var message = window._debug.message;
        var to = location.pathname.match(/[\d_]+/)[0];
        message.sendImageMessage(src, src, src, 'img/gif', 0, to);
    } else {
        window.postMessage({type: 'sendCustomEmotion', text: src}, '*');
    }
}

function getCookie(name) {
    var cookies = document.cookie;
    var cookiesArr = cookies.split(';');
    for (var i in cookiesArr) {
        var cookie = cookiesArr[i];
        var kv = cookie.split("=");
        if (kv[0].trim() === name) {
            return kv[1];
        }
    }
}

(function injectFunc() {
    var e = document.createElement("script");
    e.textContent = postFavor + '\n' + getCookie + "\n";
    document.body.appendChild(e);
})();

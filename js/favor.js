/**
 * 
 */

emojiPanel = $('#emojiPanel');
emojiPanel.find('.title').append($('<a>', {
    'text' : '收藏',
    'href' : 'javascript:;',
    'index' : '2'
})).append($('<span>', {
    'click' : openOptions,
    'text' : '管理',
    'style' : 'position: absolute; right: 5px; bottom: 6px; border: 1px solid #eee; border-radius: 2px; font-size: 12px; color: #666; padding: 0px 4px; cursor: pointer;'
}));
var favorBox = $('<div>', {
    'class' : 'favorBox',
    'style' : 'display: none; margin-left: 20px; height: 276px; position: relative; overflow: auto;'
});
var tips = $('<label>', {
    'style' : 'position: absolute; top: 45%; left: 30%',
    'text' : '在图片上点击右键添加到收藏'
});
favorBox.append(tips);
emojiPanel.find('.title').before(favorBox);
function loadFavor(first) {
    chrome.storage.local.get([ 'favorList', 'hasNew' ], function(items) {
        var favorList = items['favorList'];
        var hasNew = items['hasNew'];
        if ((first || hasNew) && favorList) {
            console.log("load favor ...");
            showTips(favorList.length == 0);
            favorBox.find('a').remove();
            for (var i = 0; i < favorList.length; i++) {
                favorBox.append($('<a>', {
                    'href' : '#',
                    'style' : 'float: left; margin: 12px 20px 0 0;'
                }).append($('<img>', {
                    'width' : 64,
                    'height' : 64,
                    'src' : favorList[i],
                    'onclick' : 'postFavor()'
                })));
            }
            chrome.storage.local.set({
                "hasNew" : false
            });
        }
    });
}
loadFavor(true);

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

// 表情tab切换
$('#emojiPanel .title a').unbind('click').bind('click', function() {
    $('#emojiPanel .title a').removeClass("select");
    if ($(this).addClass("select")) {
        var index = $(this).attr("index");
        if (index == 0) {
            $(".xiaoTuanBox").show();
            $(".faceBox").hide();
            $(".favorBox").hide();
        } else if (index == 1) {
            $(".xiaoTuanBox").hide();
            $(".faceBox").show();
            $(".favorBox").hide();
        } else {
            $(".xiaoTuanBox").hide();
            $(".faceBox").hide();
            $(".favorBox").show();
        }
    }
    return false;
});
$('#sendEmojiIcon').click(function() {
    loadFavor();
});

// 发表
function postFavor() {
    var bubblePanel = require('debug').view.bubblePanel;
    var src = jQuery(event.target).attr('src');
    bubblePanel.sendImage(src, src, src);
}

(function injectFunc() {
    var e = document.createElement("script");
    e.textContent = postFavor + ';\n';
    document.body.appendChild(e);
})();

/**
 * @module 表情插件管理模块
 */
Array.prototype.remove = function (item) {
    var index = this.indexOf(item);
    var re = this[index];
    if (index >= 0) {
        this.splice(index, 1);
    }
    return re;
};

function saveFavor(favorList) {
    chrome.storage.local.set({
        'favorList': favorList,
        'hasNew': true
    },function(){

    });
}

var myApp = angular.module('myApp', []);

myApp.controller('OptionCtrl', ['$scope', function($scope) {
    $scope.emotions = '';
    $scope.favors = [];
    $scope.info = '';
    chrome.storage.local.get('favorList', function(items) {
        if (chrome.runtime.lastError) {
            return;
        }
        $scope.$apply(function () {
            var favorList = items['favorList'];
            $scope.favors = favorList;
        });
    });
    $scope.remove = function (url) {
        $scope.favors.remove(url);
        chrome.storage.local.set({
            'favorList': $scope.favors,
            'hasNew': true
        });
    };

    $scope.importEmotions = function (emotions) {
        try {
            var emotionsArr = JSON.parse(emotions);
            chrome.storage.local.get('favorList', function(items) {
                var favorList = items['favorList'];
                var result = [];
                const hashMap = {};

                if (favorList) {
                    favorList.forEach(function(emotion) {
                        hashMap[emotion] =emotion;
                    });
                }

                emotionsArr.forEach(function(emotion) {
                    if (!hashMap[emotion]) {
                        hashMap[emotion] =emotion;
                    }
                });

                for (var i in hashMap) {
                    result.push(hashMap[i]);
                }

                $scope.favors = result;

                saveFavor(result);
                location.reload();
            });
        } catch (e) {
            alert('请输入正确的导入数据，或重新检查下~~');
        }
    };

    $scope.exportEmotions = function () {
        var emotions = JSON.stringify($scope.favors);

        if (!emotions || emotions.length === 0) {
            $scope.info = '没有表情可以导出';
            return;
        }

        $scope.emotions = emotions;
        $scope.info = '已经复制到剪贴板中';

        setTimeout(function() {
            var input = document.querySelector('.emotion-text');
            var range = document.createRange();
            range.selectNode(input);
            window.getSelection().addRange(range);

            try {
                document.execCommand('copy');

            } catch (err) {
                $scope.info = '拷贝失败，请手动复制'
            }
        }, 0);
    };
}]);


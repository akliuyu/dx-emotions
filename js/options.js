/**
 * @module 表情插件管理模块
 */
function saveFavor(favorList) {
    chrome.storage.local.set({
        'newFavorList': favorList,
        'hasNew': true
    }, function () {

    });
}

var myApp = angular.module('myApp', []);

myApp.controller('OptionCtrl', ['$scope', function ($scope) {
    $scope.emotions = '';
    $scope.favors = [];
    $scope.info = '';
    chrome.storage.local.get(['favorList', 'newFavorList'], function (items) {
        if (chrome.runtime.lastError) {
            return;
        }

        if (!items['newFavorList'] && items['favorList']) {
            saveFavor(items['favorList'].map(function (element) {
                return {
                    url: element,
                    count: 0
                };
            }));
        }

        $scope.$apply(function () {
            var favorList = items['favorList'];
            var newFavorList = items['newFavorList'];
            $scope.favors = newFavorList ? newFavorList : favorList;
        });
    });
    $scope.remove = function (obj) {
        var result = [];

        $scope.favors.forEach(function (element) {
            if (element.url !== obj.url) {
                result.push(element);
            }
        });
        $scope.favors = result;
        chrome.storage.local.set({
            'newFavorList': $scope.favors,
            'hasNew': true
        });
    };

    $scope.importEmotions = function (emotions) {
        try {
            var emotionsArr = JSON.parse(emotions);
            chrome.storage.local.get('favorList', function (items) {
                var favorList = items['favorList'];
                var result = [];
                const hashMap = {};

                if (favorList) {
                    favorList.forEach(function (emotion) {
                        hashMap[emotion] = emotion;
                    });
                }

                emotionsArr.forEach(function (emotion) {
                    if (!hashMap[emotion]) {
                        hashMap[emotion] = emotion;
                    }
                });

                for (var i in hashMap) {
                    result.push({
                        url: hashMap[i],
                        count: 0
                    });
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
        var result = $scope.favors.map(function (element) {
            return element.url;
        });

        var emotions = JSON.stringify(result);

        if (!emotions || emotions.length === 0) {
            $scope.info = '没有表情可以导出';
            return;
        }

        $scope.emotions = emotions;
        $scope.info = '已经复制到剪贴板中';

        setTimeout(function () {
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


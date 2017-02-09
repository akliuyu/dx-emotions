/**
 * @module 表情插件管理模块
 */
Array.prototype.remove = function (item) {
    let index = this.indexOf(item);
    let re = this[index];
    if (index >= 0) {
        this.splice(index, 1);
    }
    return re;
};

function saveFavor(favorList) {
    chrome.storage.local.set({
        'favorList': favorList,
        'hasNew': true
    }, function () {

    });
}

let myApp = angular.module('myApp', []);

myApp.controller('OptionCtrl', ['$scope', function ($scope) {
    $scope.favors = [];
    chrome.storage.local.get('favorList', function (items) {
        $scope.$apply(function () {
            let favorList = items['favorList'];
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
            let emotionsArr = JSON.parse(emotions);
            chrome.storage.local.get('favorList', (items)=> {
                let favorList = items['favorList'];
                let result = [];
                if (favorList) {
                    const hashMap = new Map();
                    favorList.forEach((emotion)=> {
                        hashMap.set(emotion, emotion);
                    });

                    emotionsArr.forEach((emotion)=> {
                        if (!hashMap.has(emotion)) {
                            hashMap.set(emotion, emotion);
                        }
                    });

                    for (let [key, value] of hashMap) {
                        result.push(value);
                    }

                    saveFavor(result);
                    location.reload();
                }
            });
        } catch (e) {
            alert('请输入正确的导入数据，或重新检查下~~');
        }
    };

    $scope.exportEmotions = function () {
        console.debug(JSON.stringify($scope.favors));
    };
}]);


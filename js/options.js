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
    }, ()=> {

    });
}

let myApp = angular.module('myApp', []);

myApp.controller('OptionCtrl', ['$scope', ($scope)=> {
    $scope.emotions = '';
    $scope.favors = [];
    chrome.storage.local.get('favorList', (items)=> {
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

                    $scope.favors = result;

                    saveFavor(result);
                    location.reload();
                }
            });
        } catch (e) {
            alert('请输入正确的导入数据，或重新检查下~~');
        }
    };

    $scope.exportEmotions = function () {
        $scope.emotions = JSON.stringify($scope.favors);
        setTimeout(()=> {
            var input = document.querySelector('.emotion-text');
            var range = document.createRange();
            range.selectNode(input);
            window.getSelection().addRange(range);

            try {
                var successful = document.execCommand('copy');
                var msg = successful ? 'successful' : 'unsuccessful';
                console.log('Copy email command was ' + msg);
            } catch (err) {
                console.log('Oops, unable to copy');
            }
        }, 0);
    };
}]);


/**
 * 
 */
Array.prototype.remove = function(item) {
    var index = this.indexOf(item);
    var re = this[index];
    if (index >= 0) {
        this.splice(index, 1);
    }
    return re;
}

var myApp = angular.module('myApp', []);

myApp.controller('OptionCtrl', [ '$scope', function($scope) {
    $scope.favors = [];
    chrome.storage.local.get('favorList', function(items) {
        $scope.$apply(function() {
            var favorList = items['favorList'];
            $scope.favors = favorList;
        });
    });
    $scope.remove = function(url) {
        $scope.favors.remove(url);
        chrome.storage.local.set({
            'favorList' : $scope.favors,
            'hasNew' : true
        });
    };
} ]);

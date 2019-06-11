define(
    [
        '../tool/tool'
    ],
    function (_) {
        var arr = ['H', 'e', 'l', 'l', 'o'];
        var result = '';
        _.each(arr, function (i, item) {
            result += item;
        });
        return result;
    });

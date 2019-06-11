define(
    [
        '../tool/tool'
    ],
    function (_) {
        var arr = ['h', 'e', 'l', 'l', 'o'];
        var result = '';
        _.each(arr, function (i, item) {
            result += item;
        });
        return result;
    });

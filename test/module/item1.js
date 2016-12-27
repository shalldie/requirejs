define([
    './item2',
    '../tool/tool'
],
    function (item2, _) {
        var result = "";
        _.each(item2, function (k, v) {
            result += k + ": " + v + " <br><br>";
            item2[k] = v + v;
        });


        return result;
    }
);
define([
    './hello',
    './space',
    './world',
    '../tool/tool'
], function (hello, space, world, _) {
    var result = hello;

    _.each(space, function (k, v) {
        result += v;
    });

    result += world;

    return result;
});

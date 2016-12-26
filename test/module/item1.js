define([
    './item2',
    '../module2/item3'
], function (item2, item3) {
    // console.log(item2, item3);
    return item2 + item3 + 1;
});
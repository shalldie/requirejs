require([
    './helloworld/helloworld',
    './module/item1',
    'module/item2',
    './tool/tool'
], function (helloworld, item1, item2, _) {
    var result = helloworld +
        "<br><br>-----------------------------------------------<br><br>" +
        "item2 的原始值：<br><br>" + item1;

    result += "<br><br>-----------------------------------------------<br><br>" +
        "在 item1 中处理之后，item2 的现有值为：<br><br>";

    _.each(item2, function (k, v) {
        result += k + ": " + v + " <br><br>";
    });


    var demo = document.getElementById('demo');
    demo.innerHTML = result;
})
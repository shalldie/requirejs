
require(['./module/item1', 'helloworld/helloworld'], function (item1, helloworld) {
    var demo = document.getElementById("demo");
    demo.innerHTML = item1 + "------" + helloworld;
    console.log(item1);
    console.log(helloworld);
});

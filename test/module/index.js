
require(
    [
        './helloworld/helloworld',
        'tom&lily',
        './tool/tool'
    ],
    function (helloworld, tomlily, _) {
        var result = tomlily;
        result += _.toLowerCase('<br><br> THEY SAY:"' + helloworld + '"');

        document.getElementById('root').innerHTML = result;
    }
);

define(
    'tom&lily',
    ['tom', 'lily'],
    function (tom, lily) {
        return tom + '<br><br>' + lily;
    }
);

define(
    'tom',
    ['./tool/tool'],
    function (_) {
        return _.toUpperCase('Tom thinks that u are a brave man!');
    }
);

define(
    'lily',
    [],
    function () {
        return 'Lily likes u and she is too shy to tell u...';
    }
);


require(
    [
        './helloworld/helloworld',
        'tom&lily',
        './tool/tool'
    ],
    function (helloworld, tomlily, _) {
        var result = _.toLowerCase(helloworld) === 'hello & world'
            && tomlily === 'TOMLILY';

        if (result) {
            window.notify.resolve();
        }
        else {
            window.notify.reject()
        }
    }
);

define(
    'tom&lily',
    ['tom', 'lily'],
    function (tom, lily) {
        return tom + lily;
    }
);

define(
    'tom',
    ['./tool/tool'],
    function (_) {
        return _.toUpperCase('tom');
    }
);

define(
    'lily',
    [],
    function () {
        return 'LILY';
    }
);

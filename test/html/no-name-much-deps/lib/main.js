require(['tom&lily/tom&lily', 'tom&lily/tool'], function (friends, _) {
    var result = _.join('hello ' + friends) === 'hello tom&lily';
    if (result) {
        window.notify.resolve();
    }
    else {
        window.notify.reject()
    }
});

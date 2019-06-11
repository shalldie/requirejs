require(['./utils/getSum'], function (getSum) {
    if (getSum(1, 2) === 3) {
        window.notify.resolve();
    }
    else {
        window.notify.reject()
    }
});

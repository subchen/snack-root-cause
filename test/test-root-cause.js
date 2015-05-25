var assert = require('assert');

require('../');

/* jshint mocha: true */
describe('root-cause', function() {

    it('async-test', function(done) {
        function callback() {
            setTimeout(function() {
                assert.throws(
                    function() {
                        throw new Error('foo');
                    },
                    function(e) {
                        if (e.stack.indexOf('root cause: setTimeout') === -1) {
                            return false;
                        }
                        if (e.stack.indexOf('root cause: process.nextTick') === -1) {
                            return false;
                        }
                        return true;
                    }
                );
                done();
            }, 0);
        }

        process.nextTick(callback);
    });

});

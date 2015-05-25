var ROOT_CAUSE_NAME = 'root cause';
var _currentAsyncStack = null;

// Wrap callback with stack info
function wrapCallback(callback, name) {
    var e = new Error(name);
    e.name = ROOT_CAUSE_NAME;
    e.stack = e.stack + (_currentAsyncStack ? '\n' + _currentAsyncStack : '');

    return function() {
        _currentAsyncStack = e.stack;
        return callback.apply(this, arguments);
    };
}

/**
 * Format stack use origin stack array.
 *
 * @param {Error} e
 * @param {CallSite[]} stack
 *
 * Don't use "e.stack" directly in Error.prepareStackTrace.
 * It will cause "RangeError: Maximum call stack size exceeded" in node 0.10.x
 */
function formatStack(e, stack) {
    var lines = [];
    lines.push(e.name + (e.message ? ': ' + e.message : ''));

    stack.forEach(function(s) {
        // remove me from stack
        s = s.toString();
        if (s.indexOf(__filename) === -1) {
            lines.push('    at ' + s);
        }
    });

    return lines.join('\n');
}

// Hook for v8-engine for new Error(...)
Error.prepareStackTrace = function(e, stack) {
    if (e.name === ROOT_CAUSE_NAME) {
        return formatStack(e, stack);
    } else {
        return formatStack(e, stack) + (_currentAsyncStack ? '\n' + _currentAsyncStack : '');
    }
};

/**
 * Registers node.js async function with wrapped function.
 *
 * @example
 *
 * var _setTimeout = global.setTimeout;
 *
 * global.setTimeout = function(callback) {
 *     var args = Array.prototype.slice.call(arguments);
 *     args[0] = wrapCallback(callback, 'setTimeout');
 *     return _setTimeout.apply(this, args);
 * };
 */
function registerFunction(object, name) {
    var originFn = object[name];
    if (typeof originFn === 'function') {
        var fullName = name;
        if (object !== global && object.constructor.name) {
            fullName = object.constructor.name + '.' + name;
        }

        object[name] = function(callback) {
            var args = Array.prototype.slice.call(arguments);
            args[0] = wrapCallback(callback, fullName);
            return originFn.apply(this, args);
        };
    }
}

// Sets the stack trace limit, default is 10
Error.stackTraceLimit = Infinity;

// Registers global async function
// jshint browser: true
if (typeof window === 'object') {
    // in browser
    registerFunction(window, 'setTimeout');
    registerFunction(window, 'setInterval');
    registerFunction(window, 'setImmediate');
} else {
    // in node.js
    if (typeof global === 'object') {
        registerFunction(global, 'setTimeout');
        registerFunction(global, 'setInterval');
        registerFunction(global, 'setImmediate');
    }
    if (typeof process === 'object') {
        registerFunction(process, 'nextTick');
        registerFunction(process, 'nextDomainTick');
    }
}

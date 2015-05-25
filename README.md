[![Build Status](https://travis-ci.org/subchen/snack-root-cause.svg?branch=master)](https://travis-ci.org/subchen/snack-root-cause)
[![Code Coverage](https://img.shields.io/coveralls/subchen/snack-root-cause/master.svg)](https://coveralls.io/r/subchen/snack-root-cause)
[![NPM Repo](https://img.shields.io/npm/v/snack-root-cause.svg)](https://www.npmjs.com/package/snack-root-cause)
[![License](http://img.shields.io/badge/License-Apache_2-red.svg?style=flat)](http://www.apache.org/licenses/LICENSE-2.0)

# snack-root-cause
Prints root cause error stack for async callback.

Supports browser and node.js.

# Installation

```shell
npm install snack-root-cause
```

# Example

```js
require('snack-root-cause');

function callback() {
    setTimeout(function() {
        throw new Error('foo');
    }, 0);
}

process.nextTick(callback);
```

** Before `require('snack-root-cause')` **

```
/ws/snack-root-cause/test.js:3
        throw new Error("foo");
              ^
Error: foo
    at null._onTimeout (/ws/snack-root-cause/test.js:3:15)
    at Timer.listOnTimeout (timers.js:110:15)
```

** After `require('snack-root-cause')` **

```
/ws/snack-root-cause/test.js:5
        throw new Error("foo");
              ^
Error: foo
    at null.<anonymous> (/ws/snack-root-cause/test.js:5:15)
    at Timer.listOnTimeout (timers.js:110:15)
root cause: setTimeout
    at callback (/ws/snack-root-cause/test.js:4:5)
    at process._tickCallback (node.js:355:11)
    at Function.Module.runMain (module.js:503:11)
    at startup (node.js:129:16)
    at node.js:814:3
root cause: process.nextTick
    at Object.<anonymous> (/ws/snack-root-cause/test.js:9:9)
    at Module._compile (module.js:460:26)
    at Object.Module._extensions..js (module.js:478:10)
    at Module.load (module.js:355:32)
    at Function.Module._load (module.js:310:12)
    at Function.Module.runMain (module.js:501:10)
    at startup (node.js:129:16)
    at node.js:814:3
```

# License

Released under the [Apache 2 License](http://www.apache.org/licenses/LICENSE-2.0).

/**
 * Test runner
 */

// Override the NODE_ENV variable
process.env.NODE_ENV = 'testing';

// Application logic for the test runner
_app = {};


// Container for the tests
_app.tests = {};

_app.tests.unit = require('./unit');
_app.tests.api = require('./api');

// Count all the tests
_app.countTests = function () {
    var counter = 0;
    for (const key in _app.tests) {
        if (_app.tests.hasOwnProperty(key)) {
            const subTest = _app.tests[key];
            for (const testName in subTest) {
                if (subTest.hasOwnProperty(testName)) {
                    counter++
                }
            }
        }
    }
    return counter;
};


// Run all the tests, collecting the errors and successes
_app.runTests = function () {
    var errors = [];
    var successes = 0;
    var limit = _app.countTests();
    var counter = 0;
    for (const key in _app.tests) {
        if (_app.tests.hasOwnProperty(key)) {
            const subTest = _app.tests[key];
            for (const testName in subTest) {
                if (subTest.hasOwnProperty(testName)) {
                    (function () {
                        var tmpTestName = testName;
                        var testValue = subTest[testName];
                        // Call the test
                        try {
                            testValue(function () {
                                // If it calls back without throwing, then it succeeded, so log it in green
                                console.log('\x1b[32m%s\x1b[0m', tmpTestName);
                                counter++;
                                successes++;
                                if (counter === limit) {
                                    _app.produceTestReport(limit, successes, errors)
                                }
                            })
                        } catch (err) {
                            // If it throws, then it failed, so capture the error thrown and log it in red
                            errors.push({
                                'name': testName,
                                'error': err
                            });
                            console.log('\x1b[31m%s\x1b[0m', tmpTestName);
                            counter++;
                            if (counter === limit) {
                                _app.produceTestReport(limit, successes, errors)
                            }
                        }
                    })();
                }
            }
        }
    }
};


// Produce a test outcome report
_app.produceTestReport = function (limit, successes, errors) {
    console.log('');
    console.log('---------- BEGIN TEST REPORTS ----------');
    console.log('');
    console.log('Total tests: ', limit);
    console.log('Pass: ', successes);
    console.log('Failed: ', errors.length);
    console.log('');

    // If there are errors, print them in details
    if (errors.length > 0) {
        console.log('---------- BEGIN ERROR DETAILS ----------');
        console.log('');

        errors.forEach(testError => {
            console.log('\x1b[31m%s\x1b[0m', testError.name);
            console.log(testError.error);
            console.log('');
        });

        console.log('');
        console.log('---------- END ERROR DETAILS ----------');
    }

    console.log('');
    console.log('---------- END TEST REPORTS ----------');
    process.exit(0);
};



// Run the test
_app.runTests();

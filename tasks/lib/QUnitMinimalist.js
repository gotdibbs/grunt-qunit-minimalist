/*global require:true, process:true, phantomjs:true, __dirname:true*/

var grunt = require('grunt'),
    path = require('path'),
    _ = grunt.util._;

var QUnitMinimalist = function QUnitMinimalist(task, phantomjs) {
    this.setOptions(task);
    this.src = task.filesSrc ? task.filesSrc[0] : null;
    this.async = task.async;
    this.phantomjs = phantomjs;
};

_.extend(QUnitMinimalist.prototype, (function () {
    'use strict';
    /*jshint validthis:true */
    
    var failureQueue = [],
        runningCount = 0,
        passCount = 0,
        failCount = 0,
        isPass = true;

    function onQunitDone(failed, passed, total, duration) {
        var passRate = (passed / total * 100),
            passFormat = passRate === 100 ? (passRate + '%') : (passRate.toFixed(2) + '%'),
            durationSeconds = duration / 1000,
            i = 0,
            len = failureQueue.length;

        this.phantomjs.halt();

        if (process.stdout.clearLine) {
            process.stdout.clearLine();
        }
        grunt.log.writeln(' ');
        if (failed) {
            grunt.log.warn(('Failed ' + failed + ' test(s)!').red);
            isPass = false;
            for (; i < len; i++) {
                grunt.log.writeln(failureQueue[i]);
            }
        }
        else {
            grunt.log.writeln(('Passed all ' + total + ' tests!').green);
        }
        grunt.log.writeln(' ');
        grunt.log.writeln(('' + passFormat + ' passed in ' + durationSeconds + ' seconds.').grey);
    }

    function onQunitLog(result, actual, expected, message, source) {
        var dots;

        if (!result) { // assertion failed
            message = message || 'Fail';
            failCount++;

            failureQueue.push('\n \u250c '.grey + 'Assertion "' + message + '".');
            failureQueue.push((' \u251c Actual:   ').grey + actual.toString().cyan);
            failureQueue.push((' \u251c Expected: ').grey + expected.toString().cyan);
            failureQueue.push((' \u2514 Source: ').grey + source.cyan);
        }
        else {
            passCount++;
        }

        if (process.stdout.clearLine && process.stdout.cursorTo) {
            process.stdout.clearLine();
            process.stdout.cursorTo(0);
            runningCount = (runningCount + 1) % 4;
            dots = new Array(runningCount + 1).join('.');
            process.stdout.write('Passed ' + passCount + '/' + (passCount + failCount) + '. Running' + dots);
        }
    }
    
    function onFailLoad(url) {
        this.phantomjs.halt();
        grunt.warn('Unable to load url "' + url + '".');
    }
    
    function onFailTimeout() {
        this.phantomjs.halt();
        grunt.warn('Timeout reached. Possible missing "start()" call or issue with page/test load.');
    }

    function setOptions(task) {
        this.options = task.options({
            parameters: null,
            phantomOptions: { }
        });
    }
    
    function run() {
        var self = this,
            options = self.options,
            phantomjs = self.phantomjs,
            markTaskComplete = this.async();
            
        if (!self.src) {
            grunt.fatal('Path to unit test host page was not specified, please use the "src" grunt parameter.');
        }

        if (!options.phantomOptions.inject) {
            options.phantomOptions.inject = path.join(__dirname, '../includes', 'qunit-bridge.js');
        }

        if (options.parameters) {
            self.src += (self.src.indexOf('?') === -1 ? '?' : '&') + options.parameters;
        }
        
        phantomjs.on('qunit.done', onQunitDone.bind(self));
        phantomjs.on('qunit.log', onQunitLog.bind(self));
        phantomjs.on('fail.load', onFailLoad.bind(self));
        phantomjs.on('fail.timeout', onFailTimeout.bind(self));
        
        phantomjs.spawn(self.src, (function () {
        
            function done(er) {
                if (er) {
                    grunt.log.writeln('error encountered');
                    grunt.fatal(er.message);
                }

                markTaskComplete(isPass);
            }
        
            return {
                options: options.phantomOptions,
                done: done
            };
        
        }()));
    }

    return {
        setOptions: setOptions,
        run: run
    };

}()));

QUnitMinimalist.registerWithGrunt = function registerWithGrunt(grunt) {
    var phantomjs = require('grunt-lib-phantomjs').init(grunt);
    
    grunt.registerMultiTask('qunit-minimalist', 'Minimalist phantomjs-based qunit test runner.', function() {
        var task = new QUnitMinimalist(this, phantomjs);
        
        task.run();
    });
};

module.exports = QUnitMinimalist;
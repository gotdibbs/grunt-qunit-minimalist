exports.nodeunit = (function (){
    'use strict';
    
    var grunt = require('grunt'),
        util = require('util'),
        _ = grunt.util._,
        QUnitMinimalist = require('../tasks/lib/QUnitMinimalist');

    function _getMockTask(opts) {
        if (!opts) { opts = {}; }
    
        return {
            options: function options(){ 
                return opts;
            },
            async: function noop() { }
        };
    }
    
    function exists(test) {
        test.expect(1);
        test.ok(QUnitMinimalist, 'Should exist.');
        test.done();
    }
    
    function setsDefaults(test) {
        var task = new QUnitMinimalist(_getMockTask());
        
        test.expect(2);
        test.ok(task, 'Task should exist.');
        test.ok(task.options, 'Options should exist.');
        test.done();
    }
    
    function registersSelfWithGrunt(test) {
        var calledName,
            calledFunc,
            mockGrunt = {
                registerMultiTask: function registerMultiTask(name, func) {
                    calledName = name,
                    calledFunc = func
                }
            };
    
        test.expect(3);
        test.ok(QUnitMinimalist.registerWithGrunt, 'Registration function should exist.');
        QUnitMinimalist.registerWithGrunt(mockGrunt);
        test.strictEqual(calledName, 'qunit-minimalist', 'Registers with the correct name.');
        test.ok(calledFunc, 'Should be passed a valid function.');
        test.done();
    }

    function runRegistersPhantomHandlers(test) {
        var registeredHandlers = [],
            task,
            mockPhantom = {
                spawn: function noop() { },
                on: function on(handler) { 
                    registeredHandlers.push(handler)
                }
            };

        task = new QUnitMinimalist(_getMockTask({ 
            page: 'test/test.html', 
            phantomOptions: { } 
        }), mockPhantom);

        test.expect(5);
        task.run();
        test.strictEqual(registeredHandlers.length, 4, 'Four handlers should be registered.');
        test.notEqual(registeredHandlers.indexOf('qunit.done'), -1, 'qunit.done should be registered.');
        test.notEqual(registeredHandlers.indexOf('qunit.log'), -1, 'qunit.log should be registered.');
        test.notEqual(registeredHandlers.indexOf('fail.load'), -1, 'fail.load should be regisered.');
        test.notEqual(registeredHandlers.indexOf('fail.timeout'), -1, 'fail.timeout should be registered.');
        test.done();
    }

    function runSetsDefaults(test) {
        var calledUrl,
            calledOptions,
            task,
            mockPhantom = {
                spawn: function spawn(url, options) {
                    calledUrl = url;
                    calledOptions = options;
                },
                on: function noop() { }
            };

        task = new QUnitMinimalist(_getMockTask({ 
            page: 'test/test.html', 
            phantomOptions: { } 
        }), mockPhantom);

        test.expect(3);
        task.run();
        test.strictEqual(calledUrl, 'test/test.html', 'Called URL should match what was passed in.');
        test.ok(calledOptions, 'Called options should be defined.');
        test.ok(calledOptions.options.inject.match(/qunit-bridge\.js$/), 'Inject should be defaulted to the default bridge.');
        test.done();
    }
    
    return {
        exists: exists,
        setsDefaults: setsDefaults,
        registersSelfWithGrunt: registersSelfWithGrunt,
        runRegistersPhantomHandlers: runRegistersPhantomHandlers,
        runSetsDefaults: runSetsDefaults
    };
}());
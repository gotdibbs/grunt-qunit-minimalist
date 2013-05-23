exports.nodeunit = (function (){
    'use strict';
    
    var grunt = require('grunt'),
        _ = grunt.util._,
        QUnitMinimalist = require('../tasks/lib/QUnitMinimalist');

    function _getMockTask(opts) {
        if (!opts) { opts = {}; }
    
        return {
            options: function options(extensions){ 
                return _.extend(opts, extensions);
            }
        };
    }
    
    function exists(test) {
        test.expect(1);
        test.ok(QUnitMinimalist, 'Should exist.');
        test.done();
    }
    
    function setsDefaults(test) {
        var task = new QUnitMinimalist(_getMockTask());
        
        test.expect(5);
        test.ok(task, 'Task should exist.');
        test.ok(task.options, 'Options should exist.');
        test.ok(task.options.phantomOptions, 'Phantom Options should exist.');
        test.strictEqual(task.options.page, null, 'Page should be null.');
        test.strictEqual(task.options['qunit-filter'], null, 'QUnit Filters should default to null.');
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
    
    return {
        exists: exists,
        setsDefaults: setsDefaults,
        registersSelfWithGrunt: registersSelfWithGrunt
    };
}());
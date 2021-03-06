:no_entry: [NOT MAINTAINED] I no longer have use for this plugin and so my time and efforts have been refocused elsewhere. I'd be happy to transition this repo to someone else if desired, or accept pull requests as needed. Otherwise, this repo will be left active for historical purposes.

# grunt-qunit-minimalist [![Build Status](https://travis-ci.org/gotdibbs/grunt-qunit-minimalist.png?branch=master)](https://travis-ci.org/gotdibbs/grunt-qunit-minimalist)

> Minimalist phantomjs-based qunit test runner. Runs your QUnit test host page without depending on a server like `connect`, also keeps results displayed in console to a minimum. Only a quick summary and any failures are reported.

![Success Screenshot](https://raw.github.com/gotdibbs/grunt-qunit-minimalist/master/success.png)

![Failure Screenshot](https://raw.github.com/gotdibbs/grunt-qunit-minimalist/master/failure.png)


## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-qunit-minimalist --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-qunit-minimalist');
```

## The "qunit-minimalist" task

### Overview
In your project's Gruntfile, add a section named `qunit-minimalist` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
    'qunit-minimalist': {
		options: {
            parameters: 'noglobals=true',
            phantomOptions: {
                '--web-security': false
            }
        },
        all: {
			src: [path.join('test', 'UnitTestHost.html')]
        }
    },
})
```

### Options

#### src
Type: `Array [string]`
Default value: `null`

A single-value array that represents the location of the unit test host page to be run.

#### options.parameters
Type: `String`
Default value: `null`

A string value that represents the parameters to be passed to the host page such as QUnit parameters for enforcing no globals etc.

#### options.phantomOptions
Type: `Object`
Default value: `{ }`

An object representing options to be passed to `grunt-lib-phantomjs` and thus subsequently to `phantomjs`. This can include things like `--web-security` and `timeout`.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using `npm test` before submitting a pull request.

## License
This library is licensed under the MIT License. Portions of this code were taken and/or inspired by the [grunt-contrib-qunit](https://github.com/gruntjs/grunt-contrib-qunit) and the [grunt-qunit-serverless](https://github.com/jgable/grunt-qunit-serverless) tasks.

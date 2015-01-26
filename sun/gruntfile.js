module.exports = function (grunt) {

    grunt.initConfig({
        pkg : grunt.file.readJSON('package.json'),
        uglify : {
            options : {
                banner : '/* <%= pkg.file %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            my_tartget : {
                files : {
                    'dest/sun.min.js' : ['src/*.js']
                }
            }
        },
        jshint : {
            all : ['src/**.js']
        },
        markdown : {
            all : {
                files : [{
                        expand : true,
                        src : 'toolkit.md',
                        dest : 'docs/',
                        ext : '.html'
                    }
                ]
            }
        },
        changelog : {
            options : {}
        },
        jsdoc : {
            dist : {
                src : ['src/demo.js'],
                options : {
                    destination : 'doc'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-conventional-changelog');
    grunt.loadNpmTasks('grunt-markdown');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');

    grunt.loadNpmTasks('grunt-jsdoc');

    grunt.registerTask('default', ['jshint:all', 'uglify']);
    grunt.registerTask('check', ['jshint:all']);
}

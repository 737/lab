module.exports = function (grunt) {
    
    grunt.initConfig({
        pkg : grunt.file.readJSON('package.json'),
        uglify : {
            options : {
                banner : '/* <%= pkg.file %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            my_tartget: {
                files: {
                    'dest/<%= pkg.file%>.min.js': ['src/*.js']
                }
            }
        },
        jshint: {
            all: ['src/*.js']
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    
    grunt.registerTask('default', ['jshint:all', 'uglify']);
}



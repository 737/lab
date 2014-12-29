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
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-uglify');
    
    grunt.registerTask('default', ['uglify']);
}

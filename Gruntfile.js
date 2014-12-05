module.exports = function(grunt){

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			options: {
				reporter: require('jshint-stylish')
			},
			build: ['Gruntfile.js', 'js/**/*.js']
		},
		uglify: {
			options: {
				banner: '//smskip:validation\n/*\n * <%= pkg.name %>\n * version: <%= pkg.version %>\n * author: <%= pkg.author %>\n * last edited by: <%= pkg.edited %>\n * build date: <%= grunt.template.today("yyyy-mm-dd") %>\n */\n'
			},
			build: {
				files: {
					'dist/js/core.min.js' : ['src/js/core.js']
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default', ['jshint', 'uglify']);

};
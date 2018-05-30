module.exports = function (grunt) {

	grunt.initConfig({

		clean: [ 'lib', 'types' ],

		tslint: {
			options: {
				configuration: './tslint.json'
			},
			files: {
				src: [
					'src/**/*.ts',
				]
			},
		},

		ts: {
			default: {
				tsconfig: true
			}
		},

		watch: {
			ts: {
				files: [ 'src/**/*.ts' ],
				tasks: [ 'ts' ]
			}
		}

	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks("grunt-ts");
	grunt.loadNpmTasks("grunt-tslint");

	grunt.registerTask('default', [ 'build', 'watch' ]);
	grunt.registerTask('build', [ 'tslint', 'clean', 'ts' ]);
};

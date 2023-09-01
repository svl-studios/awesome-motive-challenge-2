// phpcs:disable

/**
 * Gulpfile.
 *
 * @author Kevin Provance (@kprovance)
 * @package KevAwesomeMotive
 */

/**
 * Configuration.
 */
var AUTOPREFIXER_BROWSERS = ['last 2 version', '> 1%', 'ie > 10', 'ie_mob > 10', 'ff >= 30', 'chrome >= 34', 'safari >= 7', 'opera >= 23', 'ios >= 7', 'android >= 4', 'bb >= 10'];

/**
 * Load Plugins.
 */
var gulp         = require( 'gulp' );                                // Gulp of-course.
var sass         = require( 'gulp-sass' )( require( 'node-sass' ) );         // Gulp plugin for Sass compilation.
var minifycss    = require( 'gulp-uglifycss' );           // Minifies CSS files.
var autoprefixer = require( 'gulp-autoprefixer' );        // Auto prefixing magic.
var mmq          = require( 'gulp-merge-media-queries' ); // Combine matching media queries into one media query definition.
var rename       = require( 'gulp-rename' );    // Renames files E.g. style.css -> style.min.css.
var lineec       = require( 'gulp-line-ending-corrector' );                 // Consistent Line Endings for non UIX systems. Gulp Plugin for Line Ending Corrector (A utility that makes sure your files have consistent line endings).
var filter       = require( 'gulp-filter' );          // Enables you to work on a subset of the original files by filtering them using globbing.
var sourcemaps   = require( 'gulp-sourcemaps' );                      // Maps code in a compressed file (E.g. style.css) back to itâ€™s original position in a source file.

var stylessheet = [
	{'path': './css/kev-awesome-motive.scss','dest': './css/'}
];

function processScss( source, dest, add_min ) {
	var process = gulp.src( source, {allowEmpty: true} )
	.pipe( sourcemaps.init() )
	.pipe(
		sass(
			{
				indentType: 'tab',
				indentWidth: 1,
				errLogToConsole: true,

				// outputStyle: 'compact',
				// outputStyle: 'compressed',
				// outputStyle: 'nested'.
				outputStyle: 'compact',
				precision: 10
			}
		)
	)
	.on( 'error', console.error.bind( console ) )
	.pipe( sourcemaps.write( {includeContent: false} ) )
	.pipe( sourcemaps.init( {loadMaps: true} ) )
	.pipe( autoprefixer( AUTOPREFIXER_BROWSERS ) )
	.pipe( sourcemaps.write( './' ) )
	.pipe( lineec() )                                              // Consistent Line Endings for non UNIX systems.
	.pipe( gulp.dest( dest ) ).pipe( filter( '**/*.css' ) ) // Filtering stream to only css files.
	.pipe( mmq( {log: true} ) );                            // Merge Media Queries only for .min.css version.

	if ( add_min ) {
		process = process.pipe( rename( {suffix: '.min'} ) ).pipe(
			minifycss(
				{
					maxLineLen: 0
				}
			)
		)
		.pipe( lineec() )               // Consistent Line Endings for non UNIX systems.
		.pipe( gulp.dest( dest ) )
		.pipe( filter( '**/*.css' ) );   // Filtering stream to only css files.
	}

	return process;
}

/**
 * Task: `styles`.
 *
 * Compiles Sass, Auto-prefixes it and Minifies CSS.
 */
function styles( done ) {
	stylessheet.map(
		function( file ) {
			return processScss( file.path, file.dest, true );
		}
	);

	done();
}

/**
 * Tasks
 */
gulp.task(
	'default',
	gulp.series(
		styles,
	)
);

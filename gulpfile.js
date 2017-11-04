////////////////////////////////////////////////////////////////
var gulp         = require('gulp'), // Подключаем Gulp
		sass         = require('gulp-sass'), //Подключаем Sass пакет,
		browserSync  = require('browser-sync'), // Подключаем Browser Sync
		concat       = require('gulp-concat'), // Подключаем gulp-concat (для конкатенации файлов)
		uglify       = require('gulp-uglifyjs'), // Подключаем gulp-uglifyjs (для сжатия JS)
		cssnano      = require('gulp-cssnano'), // Подключаем пакет для минификации CSS
		rename       = require('gulp-rename'), // Подключаем библиотеку для переименования файлов
		del          = require('del'), // Подключаем библиотеку для удаления файлов и папок
		imagemin     = require('gulp-imagemin'), // Подключаем библиотеку для работы с изображениями
		pngquant     = require('imagemin-pngquant'), // Подключаем библиотеку для работы с png
		cache        = require('gulp-cache'), // Подключаем библиотеку кеширования
		autoprefixer = require('gulp-autoprefixer'),// Подключаем библиотеку для авто-добавления префиксов

		sourcemaps   = require('gulp-sourcemaps');
////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////
// Compile Our Sass
gulp.task('sass', function(){ // Создаем таск Sass
	return gulp.src(['app/sass/**/*.sass', 'app/sass/**/*.scss']) // Берем источник // все sass файлы из папки sass и дочерних, если таковые будут
		
		// .pipe(sourcemaps.init())// если не заработает удалить

		.pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError)) // Преобразуем Sass в CSS посредством gulp-sass
		
		// .pipe(sourcemaps.write('.'))// если не заработает удалить

		.pipe(gulp.dest('app/css')) // Выгружаем результата в папку app/css
		.pipe(browserSync.reload({stream: true})) // Обновляем CSS на странице при изменении
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы
});
// Compile Our Sass
////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////
gulp.task('browser-sync', function() { // Создаем таск browser-sync
	browserSync({ // Выполняем browserSync
		server: { // Определяем параметры сервера
			baseDir: 'app' // Директория для сервера - app
		},
		notify: false // Отключаем уведомления
	});
});
////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////
// Concatenate & Minify JS
gulp.task('scripts', function() {
	return gulp.src([ // Берем все необходимые библиотеки
		'app/libs/jquery/dist/jquery-3.2.1.min.js', // Берем jQuery
		'app/libs/bootstrap-4.0.0-beta.2/bootstrap.min.js' // Берем bootstrap???
		])
		.pipe(concat('libs.min.js')) // !!! Собираем их в кучу в новом файле libs.min.js !!!
		.pipe(uglify()) // Сжимаем JS файл
		.pipe(gulp.dest('app/js')); // Выгружаем в папку app/js
});
// Concatenate & Minify JS
////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////
gulp.task('css-libs', ['sass'], function() {
	return gulp.src('app/css/libs.css') // Выбираем файл для минификации
		.pipe(cssnano()) // Сжимаем
		.pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
		.pipe(gulp.dest('app/css')); // Выгружаем в папку app/css
});
////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////
//Тут мы укажем, за изменением каких файлов мы хотим наблюдать
gulp.task('watch', ['browser-sync', 'css-libs', 'scripts'], function() {
	gulp.watch(['app/sass/**/*.sass', 'app/sass/**/*.scss'], ['sass']); // Наблюдение за sass файлами в папке sass
	gulp.watch('app/*.html', browserSync.reload); // Наблюдение за HTML файлами в корне проекта
	gulp.watch('app/js/**/*.js', browserSync.reload);   // Наблюдение за JS файлами в папке js
});
//Тут мы укажем, за изменением каких файлов мы хотим наблюдать
////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////
//директории которые могут очищаться
gulp.task('clean', function() {
	return del.sync('dist'); // Удаляем папку dist перед сборкой
});
//директории которые могут очищаться
////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////
gulp.task('img', function() {
	return gulp.src('app/img/**/*') // Берем все изображения из app
		.pipe(cache(imagemin({  // Сжимаем их с наилучшими настройками с учетом кеширования
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		})))
		.pipe(gulp.dest('dist/img')); // Выгружаем на продакшен
});
////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////
//Тут мы укажем куда складывать готовые после сборки файлы
gulp.task('build', ['clean', 'img', 'sass', 'scripts'], function() {

	var buildCss = gulp.src([ // Переносим библиотеки CSS в продакшен
		'app/css/main.css', //Пути откуда брать исходники
		'app/css/libs.min.css' //Пути откуда брать исходники
		])
	.pipe(gulp.dest('dist/css')) // Переносим библиотеки CSS в продакшен

	var buildFonts = gulp.src('app/fonts/**/*') //Пути откуда брать исходники
	.pipe(gulp.dest('dist/fonts')) // Переносим шрифты в продакшен

	var buildJs = gulp.src('app/js/**/*') //Пути откуда брать исходники
	.pipe(gulp.dest('dist/js')) // Переносим скрипты в продакшен

	var buildHtml = gulp.src('app/*.html') //Пути откуда брать исходники
	.pipe(gulp.dest('dist')); // Переносим HTML в продакшен

});
//Тут мы укажем куда складывать готовые после сборки файлы
////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////
gulp.task('clear', function (callback) {
	return cache.clearAll();
})
////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////
gulp.task('default', ['watch']);
////////////////////////////////////////////////////////////////
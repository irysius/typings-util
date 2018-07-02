var gulp = require('gulp');
var exec = require('child_process').exec;
var fs = require('@irysius/utils').fs;

// compile - compiles typescript into javascript
gulp.task('compile', (done) => {
    exec('node-tsc', (err, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
        done(); // continue even if there's errors.
    });
});
gulp.task('clean', (done) => {
    Promise.all([
        fs.removeFolder('./amd'),
        fs.removeFolder('./commonjs')
    ]).then(() => {
        done();
    });
});

gulp.task('default', ['compile']);
gulp.task('prepare', ['compile']);
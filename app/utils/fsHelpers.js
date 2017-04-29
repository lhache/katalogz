// import fs from 'fs';
import fse from 'fs-extra';
import path from 'path';
import glob from 'glob';
import R from 'ramda';
import Promise from 'bluebird';

var fs = Promise.promisifyAll(require('fs'));
var fseCopy = Promise.promisify(fse.copy);
var promisifiedGlob = Promise.promisify(glob);


function copySingleFile (src, dest, newFileName) {
  let promise = fseCopy(src, path.join(dest, newFileName));
  return promise;
}

export function copyFiles (src, dest, files, cb) {

  cb(`Starting copy process`);
  cb(`Starting async copy process for ${files.length} file(s): ${files}`);
  let promise = new Promise((resolve, reject) => {

    Promise.each(files, file => {
      // TODO change to match more files
      let wildcard = path.join(src, '**', `${file}.*`);

      return new promisifiedGlob(wildcard, {})
        .then(matchingFiles => {
          return Promise
            .filter(matchingFiles, matchingFile => !R.test(new RegExp(dest), matchingFile))
            .then(matchingFiles => {
              cb(`Start processing input file ${file}`);
              cb(`Found ${matchingFiles.length} matching file(s) : ${matchingFiles}`);
              return matchingFiles;
            })
            .each(fileToCopy => {

                let fileName = R.last(fileToCopy.split('/'));
                let newFileName = fileName + '.copy';

                return copySingleFile(fileToCopy, dest, newFileName)
                  .then(data => cb('Done copying ' + newFileName))
                  .catch(err => cb('ERROR copying ' + newFileName))
            })
            .then(data => cb("Done processing input file " + file))
            .catch(err => cb('Error processing input file ' + file))
          });
    })
    .then(data => resolve())
    .catch(err => {
      cb('Parent process ERROR');
      reject(err);
    });
  })
  .then(data => cb('Copy process terminated succesfully'))
  .catch(err => cb('Copy process terminated with ERROR'))
  .finally(() => cb('Shutting system down\n\n'));

  return promise;
}



const folderExists = (folder) => {
  return fs.existsSync(path.join(folder));
}

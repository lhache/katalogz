  // import fs from 'fs';
  import fse from 'fs-extra';
  import path from 'path';
  import glob from 'glob';
  import R from 'ramda';
  import Promise from 'bluebird';

  const fs = Promise.promisifyAll(require('fs'));
  const fseCopy = Promise.promisify(fse.copy);
  const PromisifiedGlob = Promise.promisify(glob);


  function copySingleFile(src, dest, newFileName) {
    const promise = fseCopy(src, path.join(dest, newFileName));
    return promise;
  }

  export function copyFiles(src, dest, files, cb) {

    cb(`Starting copy process`);
    cb(`Starting async copy process for ${files.length} file(s): ${files}`);

    const promise = new Promise((resolve, reject) => {
      let counter = 0;

      Promise.each(files, file => {
        // TODO change to match more files
        const wildcard = path.join(src, '**', `${file}.*`);

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
                const fileName = R.last(fileToCopy.split('/'));

                return copySingleFile(fileToCopy, dest, fileName)
                  .then(data => {
                    counter++;
                    cb('Done copying ' + fileName)
                  })
                  .catch(err => cb('ERROR copying ' + fileName))
              })
              .then(data => cb("Done processing input file " + file))
              .catch(err => cb('Error processing input file ' + file))
            });
      })
      .then(data => {
        cb(`A total of ${counter} file(s) have been copied`);
        resolve();
      })
      .catch(err => {
        cb(`Copy process ERROR: ${err}`);
        reject(err);
      });
    })
    .then(data => cb('Copy process terminated succesfully'))
    .catch(err => cb('Copy process terminated with ERROR'))
    .finally(() => cb('Shutting system down\n\n'));

    return promise;
  }

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

  // will need refactoring - good enough for POC
  export function copyFiles(src, dest, files, cb) {

    cb(`Starting copy process`);
    cb(`Starting async copy process for ${files.length} file(s): ${files}`);

    const promise = new Promise((resolve, reject) => {
      let counter = 0;

      Promise.each(files, file => {
        // ain't not much consistency in file naming tho, gotta have to make it work
        // for a given X file, select only following files ({d} being an integer on their side)
        // X.{d}.jpg,  XA.{d}.jpg, ..., XE.{d}.jpg
        // X.A.{d}.jpg, ..., X.E.{d}.jpg
        // removing files having 'copy' in their name happens later
        const wildcard = path.join(src, '**', `${file}?(|.)?(A|B|C|D|E).?.jpg`);

        return new PromisifiedGlob(wildcard, {})
          .then(matchingFiles => {

            return Promise
              .filter(matchingFiles, matchingFile => !R.test(new RegExp(dest), matchingFile)) // don't copy from subfolder
              .then(matchingFiles => {
                cb(`Start processing input file ${file}`);
                cb(`Found ${matchingFiles.length} matching file(s) : ${matchingFiles}`);
                return matchingFiles;
              })
              .filter(matchingFile => {
                // remove files with the term 'copy' in the name
                if (/copy/i.test(matchingFile)) {
                  cb(`Decided not to process following file: ${matchingFile}`);
                  return false;
                } else {
                  return true;
                }


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
              .then(data => cb(`Done processing input file ${file}`))
              .catch(err => {
                debugger;
                console.error(err)
                cb(`Error processing input file ${file} - ${err}`)
              })
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

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
// ain't not much consistency in file naming tho, gotta have to make it work
// with:
//  - x = reference
   //  - y = number from 0 to 9
//  - Q = quality (caps) from A to G
         //  - q = quality (min) from a to g
//
//  match:
//  - xq.jpg          [xa.jpg ... xg.jpg]
//  - x.y.jpg         [x.1.jpg ... x.9.jpg]
//  - x.q.jpg         [x.a.jpg ... x.g.jpg]
//  - xQ.y.jpg        [xA.1.jpg ... xA.9.jpg ... xG.1.jpg ... xG.9.jpg]
//  - xQ.q.jpg        [xA.a.jpg ... xA.g.jpg ... xG.a.jpg ... xG.g.jpg]
//  - xBis.y.jpg      [xBis.1.jpg ... xBis.9.jpg]
//  - xBis.q.jpg      [xBis.a.jpg ... xBis.g.jpg]
export function copyFiles(src, dest, files, cb) {

  cb(`Starting copy process`);
  cb(`Starting async copy process for ${files.length} file(s): ${files}`);

  const promise = new Promise((resolve, reject) => {
    let copyCounter = 0,
        missingRefs = [];

    Promise.each(files, file => {

      const wildcard = path.join(src, '**', `${file}?(?|?(|Bis|A|B|C|D|E|G).??(|.?)).+(jpg|jpeg|JPG|JPEG)`);

      return new PromisifiedGlob(wildcard, {})
        .then(matchingFiles => {

          return Promise
            .filter(matchingFiles, matchingFile => !R.test(new RegExp(dest), matchingFile)) // don't copy from subfolder
            .then(matchingFiles => {
              cb(`Start processing input file ${file}`);

              if (matchingFiles.length) {
                cb(`Found ${matchingFiles.length} matching file(s) : ${matchingFiles}`);
              }
              else {
                // we store that to show users all the missing refs
                cb(`No matching file found for ${file}`);
                missingRefs.push(file);
              }

              return matchingFiles;
            })
            .each(fileToCopy => {
              const fileName = R.last(fileToCopy.split('/'));

              return copySingleFile(fileToCopy, dest, fileName)
                .then(data => {
                  copyCounter++;
                  cb('Done copying ' + fileName)
                })
                .catch(err => cb('ERROR copying ' + fileName))
            })
            .then(data => cb(`Done processing input file ${file}`))
            .catch(err => {
              console.error(err)
              cb(`Error processing input file ${file} - ${err}`)
            })
          });
    })
    .then(data => {
      cb(`A total of ${copyCounter} file(s) have been copied`);
      cb(`Missing refs: ${missingRefs.join(', ')}`);
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

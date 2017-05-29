# Katalogz
Node/React/Electron-based file copier

## Notes
* Boilerplate based on [electron-react-boilerplate](https://github.com/chentsulin/react-electron-boilerplate)
* Redux setup is there but not in use
* Check [copy.js](https://github.com/lhache/katalogz/blob/master/app/scripts/copy.js) to see the file copy code

## File specs

With
x = reference 
y = number from 0 to 9
 Q = quality (caps) from A to G
 q = quality (min) from a to g

Match
* xq.jpg          [xa.jpg ... xg.jpg]
* x.y.jpg         [x.1.jpg ... x.9.jpg]
* x.q.jpg         [x.a.jpg ... x.g.jpg]
* xQ.y.jpg        [xA.1.jpg ... xA.9.jpg ... xG.1.jpg ... xG.9.jpg]
* xQ.q.jpg        [xA.a.jpg ... xA.g.jpg ... xG.a.jpg ... xG.g.jpg]
* xBis.y.jpg      [xBis.1.jpg ... xBis.9.jpg]
* xBis.q.jpg      [xBis.a.jpg ... xBis.g.jpg]

The reg exp looks like `${file}?(?|?(|Bis|A|B|C|D|E|G).??(|.?)).+(jpg|jpeg|JPG|JPEG)` (js string)
Check [node-glob specs](https://github.com/isaacs/node-glob)

## Dependencies
- In order to package from a mac, make sure you have wine installed => [ref](https://github.com/electron-userland/electron-builder/wiki/Multi-Platform-Build)

## Release
* run `npm run package` to build for mac
* run `npm run package-win` to build for windows

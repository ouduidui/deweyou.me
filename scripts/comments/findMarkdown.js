const fs = require('fs');

/**
 * 查找markdown
 * @param dir {string}
 * @param cb {function}
 */
const findMarkdown = (dir, cb) => {
    fs.readdir(dir, (err, files) => {
        if(err) throw err;
        filesHandle(dir, files, cb);
    })
}

const filesHandle = (dir, files, cb) => {
    files.forEach(fileName => {
        let innerDir = `${dir}/${fileName}`;
        if(fileName.includes('.')) {
            fs.stat(innerDir, (err, stat) => {
                if(err) throw err;

                if(stat.isDirectory()) {
                    findMarkdown(innerDir, cb);
                }else if (/\.md$/.test(fileName)) {
                    cb(innerDir);
                }
            })
        }
    })
}

module.exports = findMarkdown;
const fs = require('fs');
const findMarkdown = require('./findMarkdown');
const rootDir = "./docs";

const writeComponents = (dir) => {
    fs.appendFile(dir, `\n \n <Comment /> \n `, err => {
        if(err) throw err;
        console.log(dir + '：Add Components Success')
    })
}

findMarkdown(rootDir, writeComponents);
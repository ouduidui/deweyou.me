const fs = require('fs');
const findMarkdown = require('./findMarkdown');
const rootDir = "./docs";

const removeComponents = (dir) => {
    fs.readFile(dir, 'utf-8', (err,content) => {
        if(err) throw err;

        fs.writeFile(dir, content.replace(/\n \n <Comment \/> \n /g, ""), err => {
            if (err) throw err;
            console.log(dir + '：Remove Components Success')
        })
    })
}

findMarkdown(rootDir, removeComponents);
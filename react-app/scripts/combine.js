const fs = require('fs');

function combineFiles(sourceDir, destinationFile) {
    fs.readdir(sourceDir, (err, files) => {
        if (err) {
            throw err;
        }

        // files object contains all files names
        // log them on console
        const data = files.filter((file) => {
            return (
                file.match(/\.json$/) &&
                !file.match(new RegExp(`${destinationFile}$`))
            );
        })
            .map(file => {
                console.log(file);
                const content = fs.readFileSync(file, 'utf-8');
                return JSON.parse(content);
            });

        fs.writeFileSync([sourceDir, destinationFile].join('/'), JSON.stringify(data, null, 4));
    });
}

combineFiles('.', 'schemas.json');
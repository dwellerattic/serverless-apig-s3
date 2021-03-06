const { map } = require('lodash');
const path = require('path');
const pify = require('pify');
const fs = pify(require('fs'));

module.exports = {
    async uploadFolderToBucket(folder, bucket) {
        const dirContents = map(await fs.readdir(folder),
            name => path.join(folder, name)
        );

        await Promise.all(dirContents.map(async item => {

            const stat = await fs.stat(item);

            if (stat.isFile()) {
                return this.uploadFileToBucket(item, bucket);

            } else if (stat.isDirectory()) {
                return this.uploadFolderToBucket(item, bucket);
            }
        }));
    }
};

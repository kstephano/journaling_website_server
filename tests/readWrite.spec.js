const helpers = require('../helpers/readWrite');
const entries = require('../data/entries');

describe('readFromFile', () => {
    it('should successfully read data from entries.json and populate the array in entries.js with data', () => {
        helpers.readFromFile();
        expect(entries[0]).toHaveProperty(
            'id', 'timestamp', 'title', 'body', 'comments', 'emojis'
        );
    });
});

// writeFromFile has been tested and correctly overwrites the entries.json file
// not included in the test because it would overwrite the file
const fs = require('fs');

const Entry = require('../models/entry');

/**
 * Reads from the entries.json file and converts data into 
 * JS objects to be stored in entries.js.
 */
function readFromFile() {
    try {
        const jsonString = fs.readFileSync('./data/entries.json', 'utf-8'); 
        const parsedData = JSON.parse(jsonString);
        // iterate through parsed json array and push each entry onto the entriesData array
        parsedData.forEach(parsedDataObject => {
            Entry.load(parsedDataObject)
        });
    } catch (err) {
        console.log(err);
    }
}

/**
 * Writes the data in the entries.js array to the entries.json file.
 * Overwrites the existing json file.
 * To be called when the server is closed - server.close((err) => { // TODO })
 */
function writeToFile() {
    const entriesDataStringified = JSON.stringify(Entry.all); // stringify the entriesData array

    // write to the json file, overwriting any data already in the file
    fs.writeFile('./data/entries.json', entriesDataStringified, (err) => {
        // check for error when writing file
        if (err) {
            console.log(err);
        } else {
            console.log('File successfully written');
        }
    });
}

module.exports = {
    readFromFile,
    writeToFile
}
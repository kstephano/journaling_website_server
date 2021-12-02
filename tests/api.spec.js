const request = require('supertest');
// import server
const server = require('../app');

const entriesData = require('../data/entries');
const Entry = require('../models/entry');
const { readFromFile } = require('../helpers/readWrite');

describe('API server', () => {
    let api;
    const testUid = 12345;
    const testEntry = {
        id: "another test id",
        timestamp: "another test timestamp",
        title: "Test entry title",
        body: {
            text: "Test entry body",
            gifUrl: "test gif url"
        },
        comments: [],
        emojis: {
            likeCount: 0,
            loveCount: 0,
            laughCount: 0
        }
    }
    const testComment = {
        id: "unique-comment-id",
        timestamp: "comment timestamp",
        body: "comment content"
    }

    const testEmojis = { 
        emojis: [ {id: "test id", emojis: { likeCount: true, loveCount: false, laughCount: false }}]
    };

    beforeAll(() => {
        // read the entries from the entries.json file
        readFromFile(); // 3 entries
        // add new test entries
        Entry.create(testEntry, testUid); // 4
        Entry.create(testEntry, testUid); // 5
        Entry.create(testEntry, testUid); // 6
        Entry.create(testEntry, testUid); // 7
        Entry.create(testEntry, testUid); // 8
        Entry.create(testEntry, testUid); // 9
        Entry.create(testEntry, testUid); // 10
        Entry.create(testEntry, testUid); // 11
        Entry.create(testEntry, testUid); // 12
        Entry.create(testEntry, testUid); // 13
        Entry.create(testEntry, testUid); // 14
        // start the server and store it in the api variable
        api = server.listen(5000, () => {
            console.log('Test server running on port 5000');
        });
    });

    afterAll((done) => {
        // close the server, then run done
        console.log('Stopping the test server');
        api.close(done);
    });

    it('responds to get / with status 200', (done) => {
        request(api).get('/').expect(200, done);
    });

    it('responds to get /search/all with status 200', async () => {
        const data = (await request(api).get('/search/all')).body;

        expect(data.entries.length).toEqual(entriesData.length);
        expect(data.entries).toEqual(entriesData);
    });

    it('responds to get /search/:id with status 200', (done) => {
        request(api)
            .get('/search/test id')
            .expect({
                "entry": {
                    "id": "test id",
                    "timestamp": "test timestamp",
                    "title": "test tile",
                    "body": {
                        "text": "test body",
                        "gifUrl": ""
                    },
                    "comments": [
                        {
                            "id": "test comment",
                            "timestamp": "test comment timestamp",
                            "body": "test comment body"
                        }
                    ],
                    "emojis": {
                        "likeCount": 0,
                        "loveCount": 0,
                        "laughCount": 0
                    }
                }
            })
            .expect(200, done);
    });

    it('responds to an invalid entry id with status 404', (done) => {
        request(api)
            .get('/search/invalid id')
            .expect(404)
            .expect('Entry not found', done)
    });

    it('responds to get /search/page/:num with 12 entries', async () => {
        const result = await request(api).get('/search/page/1');
        const data = await JSON.parse(result.text);

        expect(data.entries.length).toEqual(12);
        expect(data.entries).toEqual(entriesData.slice(0, 12));
    });

    it('responds to post /update/create with status 201', (done) => {
        request(api) // 14th entry added
            .post('/update/create')
            .send(testEntry)
            .set('Accept', 'application/json')
            .expect(201, done);
    });

    it('responds to post /update/comments/:id with status 201', (done) => {
        request(api)
            .post('/update/comments/test id')
            .send(testComment)
            .set('Accept', 'application/json')
            .expect(201, done);
    });

    it('responds to update comments on an invalid entry id with status 404', (done) => {
        request(api)
            .post('/update/comments/invalid id')
            .send(testComment)
            .set('Accept', 'application/json')
            .expect(404, done);
    });

    it('responds to post /update/emojis with status 201', (done) => {
        request(api)
            .post('/update/emojis')
            .send(testEmojis)
            .set('Accept', 'application/json')
            .expect(201, done);
    });

    it('responds to update emojis on an invalid entry id with status 404', (done) => {
        request(api)
            .post('/update/emojis/invalid id')
            .send({ likeCount: 1, loveCount: 0, laughCount: 0 })
            .set('Accept', 'application/json')
            .expect(404, done);
    });

    it('responds to delete /delete/:id with status 204', async () => {
        await request(api).delete('/delete/test id').expect(204); // 15th entry removed
        const result = (await request(api).get('/search/all')).text;
        const data = await JSON.parse(result);

        expect(data.entries.length).toBe(14);
    });
})
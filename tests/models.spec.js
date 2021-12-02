const helpers = require('../helpers/readWrite');
const Entry = require('../models/entry');
let entriesData = require('../data/entries');

describe('Entry model', () => {
    const testUid = 12345;
    const existingEntry = {
        id: "798859a5-5aac-4afc-a857-0e6b53585747",
        timestamp: 1637746336501,
        title: "Hello ",
        body: { 
            text: "Test",
            gifUrl: "https://media3.giphy.com/media/jpbnoe3UIa8TU8LM13/giphy.gif?cid=9cb59807lg2m2j8mvn4xdj7ef6kprsxmigs97wjlge3odk70&rid=giphy.gif&ct=g"
        },
        comments: [],
        emojis: {
            likeCount: 0,
            loveCount: 0,
            laughCount: 0
        }
    }
    const testEntry = {
        id: "another test id",
        timestamp: "another test timestamp",
        title: "Test entry title",
        body: {
            text: "Test entry body",
            gifUrl: "Test gif url"
        }
    };
    const testEmojiLike = [{
        id: "test id",
        emojis: { likeCount: true, loveCount: false, laughCount: false }
    }];
    const testEmojiLove = [{
        id: "test id",
        emojis: { likeCount: false, loveCount: true, laughCount: false }
    }];
    const testEmojiLaugh = [{
        id: "test id",
        emojis: { likeCount: false, loveCount: false, laughCount: true }
    }];

    // Read from the entries.json file to populate the entries array with 1 test entry
    beforeAll(() => {
        helpers.readFromFile(); // 3 entries
    });

    it('should make an instance of an entry', () => {
        const entry = new Entry({
            comments: [],
            emojis: {
                likeCount: 0,
                loveCount: 0,
                laughtCount: 0
            },
            ...testEntry
        });
        
        expect(entry.id).toBe("another test id");
        expect(entry.timestamp).toBe("another test timestamp");
        expect(entry.comments).toStrictEqual([]);
        expect(entry.emojis.likeCount).toBe(0);
        expect(entry.emojis.loveCount).toBe(0);
        expect(entry.emojis.laughtCount).toBe(0);
        expect(entry.title).toBe("Test entry title");
        expect(entry.body.text).toBe("Test entry body");
        expect(entry.body.gifUrl).toBe("Test gif url");
    });

    it('should return all entries', () => {
        const entries = Entry.all;

        expect(entries).toEqual(entriesData);
    });

    it('should return an entry', () => {
        const entry = Entry.findById("781dec4e-8323-4c11-9ab5-5bb4a3b890af");
        expect(entry).toEqual(entriesData[0]);
    });

    it('should return undefined if given an invalid id', () => {
        const entry = Entry.findById('invalid id');

        expect(entry).toEqual(undefined);
    });

    it('should create an entry', () => {
        Entry.create(testEntry, testUid); // 4th entry
        expect(entriesData[1]).toHaveProperty('id', 'timestamp', 'title', 'body', 'comments', 'emojis');
    });

    it('should delete an entry', () => {
        Entry.deleteById("another test id"); // 3 entries
        entriesData = Entry.all; // update entriesData
  
        expect(entriesData.length).toEqual(3);
    });

    it('should be able to get a list of 12 entries given a valid page number', () => {
        // add entries so that there are 13 in the entriesData array
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
        const retrievedEntries = Entry.getEntriesByPageNumber(1);

        expect(retrievedEntries.totalEntries).toEqual(entriesData.length);
        expect(retrievedEntries.entries.length).toEqual(12);
    });

    it('should throw an error if a page number is given is too big for the entriesData array', () => {
        function testError() {
            Entry.getEntriesByPageNumber(5);
        }
        
        expect(testError).toThrowError('Given page number not in range');
    });

    it('should be able to increment emojis.likeCount', () => {
        Entry.addEmojis(testEmojiLike);
        expect(Entry.findById('test id').emojis.likeCount).toEqual(1);
        expect(Entry.findById('test id').emojis.loveCount).toEqual(0);
        expect(Entry.findById('test id').emojis.laughCount).toEqual(0);
    });

    it('should be able to increment emojis.loveCount', () => {
        Entry.addEmojis(testEmojiLove);

        expect(Entry.findById('test id').emojis.loveCount).toEqual(1);
        expect(Entry.findById('test id').emojis.likeCount).toEqual(1);
        expect(Entry.findById('test id').emojis.laughCount).toEqual(0);
    });

    it('should be able to increment emojis.laughCount', () => {
        Entry.addEmojis(testEmojiLaugh);
        expect(Entry.findById('test id').emojis.laughCount).toEqual(1);
        expect(Entry.findById('test id').emojis.likeCount).toEqual(1);
        expect(Entry.findById('test id').emojis.loveCount).toEqual(1);
    });

    it('should be able to update the comments', () => {
        Entry.addCommment('test id', { id: "second comment", timestamp: "time", body: "contents of second comment" })

        expect(Entry.findById('test id').comments.length).toEqual(2);
        expect(Entry.findById('test id').comments[0]).toEqual({ id: "second comment", timestamp: "time", body: "contents of second comment" });
    });
    
    it('should delete a comment', () => {
        Entry.deleteCommentById('third test comment', 'test id');

        expect(Entry.findById('test id').comments.length).toEqual(2);
        expect(Entry.findById('test id').comments).not.toContain({
            id: "third test comment",
            timestamp: "time of comment",
            body: "contents"
        });
    });

    it('should throw an error if an invalid entry id is given', () => {
        function testError() {
            Entry.deleteCommentById('second test comment', 'invalid id');
        }

        expect(testError).toThrowError('Given entry ID is invalid');
    });
})
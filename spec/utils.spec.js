const { expect } = require('chai');
const {
  formatDates,
  makeRefObj,
  formatComments
} = require('../db/utils/utils');

describe('formatDates', () => {
  it('returns a non-mutated array when passed in an array as its argument', () => {
    let input = [
      {
        body:
          'Facilis corporis animi et non non minus nisi. Magnam et sequi dolorum fugiat ab assumenda.',
        belongs_to: 'Which current Premier League manager was the best player?',
        created_by: 'tickle122',
        votes: 12,
        created_at: 1468201097851
      }
    ];
    const actual = formatDates(input);
    expect(actual).to.be.length(1);
    expect(input).to.not.eql(actual);
  });
  it('returns an array with date formatted in JS time instead of unix epoch for an array with single object', () => {
    let input = [
      {
        title: 'JS through time - biography',
        topic: 'history',
        author: 'Someone Important',
        body: 'something, something, something',
        created_at: 1502921310430
      }
    ];
    const actual = formatDates(input);
    expect(actual).to.have.lengthOf(1);
    expect(actual[0].created_at).to.eql(new Date(input[0].created_at));
    expect(input).to.not.eql(actual);
  });
  it('returns an array with date formatted in JS time instead of unix epoch for an array with multiple objects ', () => {
    let input = [
      {
        title: 'JS through time - biography',
        topic: 'history',
        author: 'Someone Important',
        body: 'something, something, something',
        created_at: 1502921310430
      },
      {
        title: '2+2 is on my mind',
        topic: 'military',
        author: 'Bob Seger',
        body: 'the dark side',
        created_at: 1481662720516
      }
    ];
    const actual = formatDates(input);
    expect(actual).to.have.lengthOf(2);
    expect(actual[0].created_at).to.eql(new Date(input[0].created_at));
    expect(input).to.not.eql(actual);
  });
});

describe('makeRefObj', () => {
  it('it returns an empty object given an empty array', () => {
    expect(makeRefObj([])).to.eql({});
  });
  it('the function does not mutate the original input', () => {
    const input = [{ article_id: 1, title: 'A' }];
    const actual = makeRefObj(input, 'title', 'article_id');
    const output = { A: 1 };
    expect(input).to.not.eql(actual);
  });
  it('takes an array of objects and returns an object', () => {
    const input = [{ article_id: 1, title: 'A' }];
    const actual = makeRefObj(input, 'title', 'article_id');
    const output = { A: 1 };
    expect(actual).to.eql(output);
  });
  it('takes a complex array of objects and returns an object', () => {
    const input = [
      { article_id: 15, title: 'jar' },
      { article_id: 22, title: 'kilner' },
      { article_id: 154, title: 'peaches' }
    ];
    const actual = makeRefObj(input, 'title', 'article_id');
    const output = { jar: 15, kilner: 22, peaches: 154 };
    expect(actual).to.eql(output);
  });
});

describe('formatComments', () => {
  it('returns an empty object when passed an empty comments array', () => {
    expect(makeRefObj([])).to.eql({});
  });
  it('the function does not mutate the original data provided', () => {
    let input = [
      {
        body:
          'Seek freedom and become captive of your desires. Seek discipline and find your liberty.',
        belongs_to: 'Frank Herbert',
        created_by: 'Kwisatz Haderach',
        votes: 20,
        created_at: 1231006555
      },
      {
        body:
          'It is impossible to live in the past, difficult to live in the present and a waste to live in the future.',
        belongs_to: 'Stilgar',
        created_by: 'n00b1337',
        votes: 12,
        created_at: 1231006508
      }
    ];

    let refObj = {
      'Frank Herbert': 1,
      Stilgar: 2
    };
    const actual = formatComments(input, refObj);
    let output = [
      {
        body:
          'Seek freedom and become captive of your desires. Seek discipline and find your liberty.',
        votes: 20,
        created_at: new Date(1231006555),
        author: 'Kwisatz Haderach',
        article_id: 1
      }
    ];

    expect(input).to.not.eql(actual);
    expect(input).to.not.eql(output);
  });
  it('takes an array with one comment object and returns an array with the comment formatted', () => {
    let input = [
      {
        body:
          'Seek freedom and become captive of your desires. Seek discipline and find your liberty.',
        belongs_to: 'Frank Herbert',
        created_by: 'Kwisatz Haderach',
        votes: 20,
        created_at: 1231006555
      }
    ];

    let refObj = {
      'Frank Herbert': 1
    };

    expect(formatComments(input, refObj)).to.eql([
      {
        body:
          'Seek freedom and become captive of your desires. Seek discipline and find your liberty.',
        votes: 20,
        created_at: new Date(1231006555),
        author: 'Kwisatz Haderach',
        article_id: 1
      }
    ]);
  });
  it('takes an array of comment objects and a reference object and returns an array of of formatted comments', () => {
    let input = [
      {
        body:
          'Seek freedom and become captive of your desires. Seek discipline and find your liberty.',
        belongs_to: 'Frank Herbert',
        created_by: 'Kwisatz Haderach',
        votes: 20,
        created_at: 1231006555
      },
      {
        body:
          'It is impossible to live in the past, difficult to live in the present and a waste to live in the future.',
        belongs_to: 'Stilgar',
        created_by: 'n00b1337',
        votes: 12,
        created_at: 1231006508
      }
    ];

    let refObj = {
      'Frank Herbert': 1,
      Stilgar: 2
    };

    expect(formatComments(input, refObj)).to.eql([
      {
        body:
          'Seek freedom and become captive of your desires. Seek discipline and find your liberty.',
        votes: 20,
        created_at: new Date(1231006555),
        author: 'Kwisatz Haderach',
        article_id: 1
      },
      {
        body:
          'It is impossible to live in the past, difficult to live in the present and a waste to live in the future.',
        votes: 12,
        created_at: new Date(1231006508),
        author: 'n00b1337',
        article_id: 2
      }
    ]);
  });
});

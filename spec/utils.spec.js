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

describe('makeRefObj', () => {});

describe('formatComments', () => {});

const { test } = require('node:test');
const assert = require('node:assert/strict');
const Fastball = require('../fastball.js');

test('plainCase turns feed caps into readable words and keeps acronyms', () => {
  assert.equal(Fastball.plainCase('MEDICAL EMERGENCY'), 'Medical Emergency');
  assert.equal(Fastball.plainCase('N MARKET ST & I-49'), 'N Market St & I-49');
  assert.equal(Fastball.plainCase('CADDO EMS EVENT'), 'Caddo EMS Event');
  assert.equal(Fastball.plainCase(null), '');
});

test('friendlyTime says Today / Yesterday / date in 12-hour time', () => {
  const now = new Date('2026-11-05T02:40:00Z');
  const tz = 'America/Chicago';
  assert.deepEqual(Fastball.friendlyTime('2026-11-05T02:32:00Z', { now, timeZone: tz }), { short: '8:32 PM', long: 'Today at 8:32 PM' });
  assert.equal(Fastball.friendlyTime('2026-11-04T05:50:00Z', { now, timeZone: tz }).short, 'Yesterday 11:50 PM');
  assert.equal(Fastball.friendlyTime('2026-10-31T04:45:00Z', { now, timeZone: tz }).short, 'Oct 30, 11:45 PM');
  assert.equal(Fastball.friendlyTime('2025-10-31T04:45:00Z', { now, timeZone: tz }).short, 'Oct 30, 2025, 11:45 PM');
  assert.deepEqual(Fastball.friendlyTime('not a date'), { short: '', long: '' });
});

test('miles, distance and counts read plainly', () => {
  assert.equal(Fastball.miles(0.04), 'Under 0.1 mi');
  assert.equal(Fastball.miles(2.34), '2.3 mi');
  assert.equal(Fastball.miles(12.6), '13 mi');
  assert.ok(Math.abs(Fastball.distanceMiles([32.5, -93.75], [32.52, -93.75]) - 1.38) < 0.05);
  assert.equal(Fastball.count(1, 'call'), '1 call');
  assert.equal(Fastball.count(326, 'call'), '326 calls');
});

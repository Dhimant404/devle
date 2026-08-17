// node test.js
const assert = require('assert');
const fs = require('fs');
const { score, dayIndex } = require('./game.js');

const C = 'correct', P = 'present', A = 'absent';
const eq = (g, a, exp) => assert.deepStrictEqual(score(g, a), exp, `${g} vs ${a}`);

// basics
eq('MUTEX', 'MUTEX', [C, C, C, C, C]);
eq('QUEUE', 'MUTEX', [A, C, P, A, A]);   // one U, one E in MUTEX — the spares stay grey
eq('ARRAY', 'MUTEX', [A, A, A, A, A]);

// duplicate letters — the part that's easy to get wrong
eq('ERROR', 'ORDER', [P, C, A, P, C]);   // both R's matched exactly, the third gets nothing
eq('LEVEL', 'EMPTY', [A, P, A, A, A]);   // only one E to give
eq('SPEED', 'ERASE', [P, A, P, P, A]);   // two E's available, both guessed E's get one
eq('ALLOT', 'LOCAL', [P, P, P, P, A]);
eq('AAAAB', 'BAAAA', [P, C, C, C, P]);

// no letter is ever counted twice
for (const [g, a] of [['ERROR', 'ORDER'], ['SPEED', 'ERASE'], ['ALLOT', 'LOCAL']]) {
  for (const ch of new Set(g)) {
    const marked = [...g].filter((c, i) => c === ch && score(g, a)[i] !== A).length;
    const have = [...a].filter(c => c === ch).length;
    assert.ok(marked <= have, `${g}/${a}: marked ${marked} ${ch}, answer has ${have}`);
  }
}

// day index: local midnights, no DST/timezone drift
const EPOCH = new Date(2026, 7, 17);
assert.strictEqual(dayIndex(new Date(2026, 7, 17, 0, 0), EPOCH), 0);
assert.strictEqual(dayIndex(new Date(2026, 7, 17, 23, 59), EPOCH), 0);
assert.strictEqual(dayIndex(new Date(2026, 7, 18, 0, 1), EPOCH), 1);
assert.strictEqual(dayIndex(new Date(2027, 7, 17), EPOCH), 365);
assert.strictEqual(dayIndex(new Date(2026, 10, 5), EPOCH), 80);   // crosses US DST change

// word data integrity
const src = fs.readFileSync('./words.js', 'utf8');
const ANSWERS = eval(src.slice(src.indexOf('[', src.indexOf('const ANSWERS')), src.indexOf('];') + 1));
const VALID = new Set(src.match(/new Set\("([a-z ]+)"/)[1].split(' '));

assert.ok(ANSWERS.length > 150, 'need enough answers for months of play');
assert.strictEqual(ANSWERS[0][0], 'MUTEX', 'day one must be MUTEX');
const seen = new Set();
for (const [w, h] of ANSWERS) {
  assert.match(w, /^[A-Z]{5}$/, `${w} is not five uppercase letters`);
  assert.ok(!seen.has(w), `duplicate answer ${w}`);
  seen.add(w);
  assert.ok(h && h.length > 15, `${w} needs a real hint`);
  assert.ok(!h.toUpperCase().includes(w), `${w}'s hint gives the answer away`);
  assert.ok(VALID.has(w.toLowerCase()), `${w} is an answer but not an accepted guess`);
}
assert.ok(VALID.size > 12000, 'guess list too small to feel like Wordle');
for (const w of ['stare', 'crane', 'adieu', 'mutex', 'regex', 'nginx']) {
  assert.ok(VALID.has(w), `${w} should be guessable`);
}
assert.ok(!VALID.has('zzzzz'));

console.log(`ok — ${ANSWERS.length} answers, ${VALID.size} valid guesses`);

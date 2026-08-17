// Pure game rules. Split out from index.html only so test.js can check them in
// node without a browser. Everything else lives inline in index.html.

// Two-pass scoring, matching Wordle's duplicate-letter behaviour: exact matches
// claim their letter first, then remaining letters are consumed left-to-right
// from whatever is left over.
function score(guess, answer) {
  var n = answer.length;
  var res = new Array(n).fill('absent');
  var pool = {};
  for (var i = 0; i < n; i++) {
    if (guess[i] === answer[i]) res[i] = 'correct';
    else pool[answer[i]] = (pool[answer[i]] || 0) + 1;
  }
  for (var j = 0; j < n; j++) {
    if (res[j] === 'correct') continue;
    if (pool[guess[j]] > 0) { res[j] = 'present'; pool[guess[j]]--; }
  }
  return res;
}

// Whole days between two local midnights. Day 0 is the epoch itself.
function dayIndex(now, epoch) {
  var a = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.floor((a - epoch) / 86400000);
}

if (typeof module !== 'undefined') module.exports = { score: score, dayIndex: dayIndex };

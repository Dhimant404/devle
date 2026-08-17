# devle

A daily Wordle where every answer is a developer term. Live at **https://wordle.dhimant.fun**

Six guesses, five letters, one new word a day. Any real English word is a valid
guess, so you can still open with `CRANE` — but the answer is always something
like `MUTEX`, `NGINX` or `MONAD`. Each one has a hint behind the `?` button.

## Files

| file | what |
|---|---|
| `index.html` | the whole game — markup, CSS and logic, inline |
| `game.js` | `score()` and `dayIndex()`, split out so `test.js` can run them in node |
| `words.js` | `ANSWERS` (189 dev words + hints) and `VALID` (13,002 accepted guesses) |
| `test.js` | `node test.js` — scoring, date maths, word-data integrity |

No build step, no dependencies, no backend. It's static files.

## Running it

```sh
python3 -m http.server 8900   # then open http://localhost:8900
node test.js
```

## Adding words

Append `["WORD", "hint sentence"]` to the **end** of `ANSWERS` in `words.js`, and
add the lowercase word to the `VALID` string if it isn't already an English word.
`node test.js` checks both. Never reorder or insert — the daily word is
`ANSWERS[days since 2026-08-17]`, so inserting shifts every past puzzle.

## Where the guess list comes from

Wordle's own allowed-guess (10,657) and answer (2,315) lists, plus the 30 dev
terms that aren't English words (`mutex`, `nginx`, `xpath`, …). Committed as a
static array — nothing is fetched at runtime.

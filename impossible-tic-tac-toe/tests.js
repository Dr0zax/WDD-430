(() => {
  'use strict';
  const results = document.querySelector('#results');
  const count = document.querySelector('#count');
  const duration = document.querySelector('#duration');
  const frame = document.querySelector('#app-frame');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) { if (!condition) throw new Error(message); }
  function equal(actual, expected, message) { assert(JSON.stringify(actual) === JSON.stringify(expected), `${message}\nExpected: ${JSON.stringify(expected)}\nReceived: ${JSON.stringify(actual)}`); }
  async function test(name, callback) { try { await callback(); passed++; results.insertAdjacentHTML('beforeend', `<li class="pass">✓ ${name}</li>`); } catch (error) { failed++; results.insertAdjacentHTML('beforeend', `<li class="fail">✗ ${name}<span class="details">${error.message}</span></li>`); } }
  function app() { return frame.contentWindow.__tttTest; }
  function cells() { return [...frame.contentDocument.querySelectorAll('.cell')]; }
  function click(index) { cells()[index].click(); }
  function text(selector) { return frame.contentDocument.querySelector(selector).textContent.trim(); }
  function wait(ms = 460) { return new Promise(resolve => setTimeout(resolve, ms)); }
  function loadApp() { return new Promise(resolve => { frame.onload = resolve; frame.src = 'index.html'; }); }

  async function run() {
    const start = performance.now();
    await loadApp();
    await test('renders an empty board with both scores at zero', () => { equal(app().getState(), ['', '', '', '', '', '', '', '', ''], 'Board should start empty'); equal(app().getScores(), { player: 0, machine: 0 }, 'Scores should start at zero'); equal(cells().length, 9, 'Board should contain nine cells'); });
    await test('exposes accessible labels for empty cells', () => { assert(cells()[0].getAttribute('aria-label') === 'Top left, empty', 'Top-left cell should describe its position and state'); assert(cells()[4].getAttribute('aria-label') === 'Center, empty', 'Center cell should describe its position and state'); });
    await test('detects all horizontal, vertical, and diagonal wins', () => { [['X','X','X','','','','','',''],['','','X','','','X','','','X'],['X','','','','X','','','','X'],['','','','','','','O','O','O']].forEach(position => assert(app().getWinner(position) === position.find(Boolean), `Should detect winner for ${position.join('')}`)); });
    await test('does not report a winner for a draw position', () => { equal(app().getWinner(['X','O','X','X','O','O','O','X','X']), null, 'Draw must not have a winner'); });
    await test('takes an immediate winning move', () => { equal(app().getBestMove(['O','O','','X','X','','','','']), 2, 'Machine should complete its winning row'); });
    await test('blocks an immediate player win', () => { equal(app().getBestMove(['X','X','','O','','','','','']), 2, 'Machine should block the open row'); });
    await test('chooses the center against a corner opening', () => { equal(app().getBestMove(['X','','','','','','','','']), 4, 'Center is the optimal response to a corner'); });
    await test('chooses a corner against a center opening', () => { const move = app().getBestMove(['','','','', 'X','','','','']); assert([0,2,6,8].includes(move), `Expected a corner, received ${move}`); });
    await test('makes a player move and then replies as the machine', async () => { app().newGame(); click(0); assert(text('#round-status') === 'Machine is thinking', 'Status should announce the machine turn'); await wait(); const state = app().getState(); assert(state[0] === 'X', 'Player move should remain on the board'); assert(state.filter(mark => mark === 'O').length === 1, 'Machine should make one reply'); });
    await test('new game clears the board without changing the score', () => { const before = app().getScores(); app().newGame(); equal(app().getState(), ['', '', '', '', '', '', '', '', ''], 'New game should clear every cell'); equal(app().getScores(), before, 'New game should preserve scores'); });
    await test('reset score clears both scores', async () => { click(0); await wait(); frame.contentDocument.querySelector('#reset-score').click(); equal(app().getScores(), { player: 0, machine: 0 }, 'Reset score should clear both counters'); equal(app().getState(), ['', '', '', '', '', '', '', '', ''], 'Reset score should also start a fresh board'); });
    const elapsed = Math.round(performance.now() - start); count.textContent = `${passed + failed} tests`; count.className = failed ? 'failed' : 'passed'; duration.textContent = `${passed} passed · ${failed} failed · ${elapsed} ms`; }
  run().catch(error => { count.textContent = 'Test runner error'; count.className = 'failed'; results.insertAdjacentHTML('beforeend', `<li class="fail">✗ ${error.message}</li>`); });
})();

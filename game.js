/**
 * MARTI — Oyun Akışı ve Durum Yönetimi (game.js)
 *
 * Durumlar: 'start' -> 'question' -> 'result' -> (sonraki soru veya 'end')
 * Tüm puanlama kuralları tek SCORING nesnesinde tutulur.
 */
(function (root) {
  'use strict';

  var ROUND_SECONDS = 30;
  var TOTAL_QUESTIONS = 4;
  var MAX_TOTAL_SCORE = 400;

  var SCORING = {
    first:  { points: 100, label: 'MÜKEMMEL',   icon: '🟨', tierClass: 'tier-gold',  effect: 'perfect' },
    second: { points: 70,  label: 'ÇOK İYİ',    icon: '🟩', tierClass: 'tier-green', effect: 'perfect' },
    third:  { points: 50,  label: 'ÇOK İYİ',    icon: '🟩', tierClass: 'tier-green', effect: 'perfect' },
    mid:    { points: 30,  label: 'İDARE EDER', icon: '🟢', tierClass: 'tier-lime',  effect: 'perfect' },
    low:    { points: 10,  label: 'ZAYIF',      icon: '🟥', tierClass: 'tier-red',   effect: 'weak' },
    pass:   { points: 0,   label: 'PAS',        icon: '⬜', tierClass: 'tier-gray',  effect: 'pass' }
  };

  var state = {
    phase: 'start', // 'start' | 'question' | 'result' | 'end'
    currentQ: 0,
    totalScore: 0,
    results: [],
    deadline: 0,
    timerRaf: null
  };

  var dom = {};

  function toUpperTR(str) {
    return String(str || '').toLocaleUpperCase('tr-TR');
  }

  function formatShareTR(share) {
    return '%' + Number(share).toFixed(1).replace('.', ',');
  }

  function getQuestions() {
    return (root.QUESTIONS || []).slice(0, TOTAL_QUESTIONS);
  }

  function scoreMatch(match) {
    if (!match || match.type !== 'valid') {
      return SCORING.pass;
    }
    if (match.index === 0) return SCORING.first;
    if (match.index === 1) return SCORING.second;
    if (match.index === 2) return SCORING.third;
    if (match.answer && match.answer.share >= 5) return SCORING.mid;
    return SCORING.low;
  }

  function showScreen(name) {
    dom.startScreen.classList.toggle('active', name === 'start');
    dom.questionScreen.classList.toggle('active', name === 'question' || name === 'result');
    dom.endScreen.classList.toggle('active', name === 'end');
    dom.resultPanel.classList.toggle('open', name === 'result');
  }

  function showError(msg) {
    dom.errorMsg.textContent = toUpperTR(msg);
    dom.errorMsg.classList.add('visible');
  }

  function clearError() {
    dom.errorMsg.textContent = '';
    dom.errorMsg.classList.remove('visible');
  }

  function renderProgressBoxes() {
    var html = '';
    for (var i = 0; i < TOTAL_QUESTIONS; i++) {
      var cls = 'prog-box';
      if (state.results[i]) {
        cls += ' ' + state.results[i].tier.tierClass;
      } else if (i === state.currentQ && state.phase === 'question') {
        cls += ' current';
      }
      html += '<span class="' + cls + '"></span>';
    }
    dom.progressBoxes.innerHTML = html;
    dom.totalScore.textContent = state.totalScore + ' PUAN';
  }

  function stopTimer() {
    if (state.timerRaf) {
      root.cancelAnimationFrame(state.timerRaf);
      state.timerRaf = null;
    }
  }

  function updateTimerLoop() {
    if (state.phase !== 'question') return;

    var remainingMs = Math.max(0, state.deadline - performance.now());
    var ratio = remainingMs / (ROUND_SECONDS * 1000);
    var secs = Math.ceil(remainingMs / 1000);

    dom.timerFill.style.width = (ratio * 100).toFixed(2) + '%';
    dom.timerFill.classList.toggle('low', secs <= 7);
    dom.timerText.textContent = String(secs);
    dom.timerTrack.setAttribute('aria-valuenow', String(secs));

    if (remainingMs <= 0) {
      submitPass('timeout');
      return;
    }

    state.timerRaf = root.requestAnimationFrame(updateTimerLoop);
  }

  function startTimer() {
    stopTimer();
    state.deadline = performance.now() + ROUND_SECONDS * 1000;
    dom.timerFill.style.width = '100%';
    dom.timerFill.classList.remove('low');
    dom.timerText.textContent = String(ROUND_SECONDS);
    state.timerRaf = root.requestAnimationFrame(updateTimerLoop);
  }

  function renderQuestion() {
    var questions = getQuestions();
    var q = questions[state.currentQ];
    if (!q) {
      showEndScreen();
      return;
    }

    state.phase = 'question';
    showScreen('question');
    renderProgressBoxes();

    dom.questionCounter.textContent = 'SORU ' + (state.currentQ + 1) + '/' + TOTAL_QUESTIONS;
    dom.questionText.textContent = toUpperTR(q.text);

    clearError();
    dom.answerInput.value = '';
    dom.answerInput.disabled = false;
    dom.submitBtn.disabled = false;
    dom.passBtn.disabled = false;
    dom.answerInput.focus();

    startTimer();
  }

  function buildResultSentence(match, tier, reason) {
    if (!match || match.type !== 'valid') {
      return reason === 'timeout'
        ? 'SÜRE DOLDU! BU TURDAN PUAN YOK.'
        : 'PAS GEÇİLDİ! BU TURDAN PUAN YOK.';
    }
    var rank = match.index + 1;
    if (tier === SCORING.low) {
      return 'AZ VERİLMİŞ (' + formatShareTR(match.answer.share) + '): BİRAZ DAHA YUKARI.';
    }
    return 'BU ' + rank + ' NUMARALI CEVAP.';
  }

  function renderAnswersList(question, playerMatch) {
    var answers = question.answers || [];
    var topFive = answers.slice(0, 5);
    var playerIdx = playerMatch && playerMatch.type === 'valid' ? playerMatch.index : -1;

    var displayItems = [];
    for (var i = 0; i < topFive.length; i++) {
      displayItems.push({ idx: i, answer: topFive[i], isPlayer: i === playerIdx });
    }
    if (playerIdx >= 5 && answers[playerIdx]) {
      displayItems.push({ idx: playerIdx, answer: answers[playerIdx], isPlayer: true });
    }

    var maxShare = answers.length > 0 ? answers[0].share : 100;
    var html = '';

    for (var j = 0; j < displayItems.length; j++) {
      var entry = displayItems[j];
      var barW = Math.max(4, Math.min(100, (entry.answer.share / maxShare) * 100));
      var label = (entry.idx + 1) + '. ' + toUpperTR(entry.answer.label);
      if (entry.isPlayer) {
        label += ' (SEN)';
      }
      html += '<li class="answer-item' + (entry.isPlayer ? ' is-player' : '') + '">';
      html += '<span class="answer-bar" style="width:' + barW.toFixed(1) + '%"></span>';
      html += '<span class="answer-label">' + label + '</span>';
      html += '<span class="answer-pct">' + formatShareTR(entry.answer.share) + '</span>';
      html += '</li>';
    }

    dom.answersList.innerHTML = html;
  }

  function openResultPanel(question, match, tier, reason) {
    state.phase = 'result';
    stopTimer();

    dom.answerInput.disabled = true;
    dom.submitBtn.disabled = true;
    dom.passBtn.disabled = true;

    dom.resultHeader.className = 'result-header ' + tier.tierClass;
    dom.resultIcon.textContent = tier.icon;
    dom.resultTier.textContent = tier.label;
    dom.resultPoints.textContent = '+' + tier.points + ' PUAN';

    dom.resultSentence.textContent = buildResultSentence(match, tier, reason);
    renderAnswersList(question, match);

    dom.nextBtn.textContent = state.currentQ >= TOTAL_QUESTIONS - 1
      ? 'SONUÇLARI GÖR'
      : 'SONRAKİ SORU';

    renderProgressBoxes();
    showScreen('result');
    dom.nextBtn.focus();
  }

  function submitAnswer() {
    if (state.phase !== 'question') return;

    var raw = dom.answerInput.value.trim();
    if (!raw) {
      showError('BİR CEVAP YAZ.');
      dom.answerInput.focus();
      return;
    }

    var questions = getQuestions();
    var q = questions[state.currentQ];
    var match = root.Matcher.matchAnswer(raw, q);

    if (match.type === 'invalid') {
      showError(match.reason || 'BU CEVAP GEÇERLİ DEĞİL.');
      dom.answerInput.focus();
      return;
    }

    if (match.type === 'none') {
      showError('BU CEVABI TANIYAMADIM, BAŞKA BİR ŞEY DENE.');
      dom.answerInput.focus();
      return;
    }

    clearError();
    var tier = scoreMatch(match);
    state.totalScore += tier.points;
    state.results.push({ tier: tier, points: tier.points });

    if (root.Scene) {
      root.Scene.setAltitude(state.totalScore);
      root.Scene.effect(tier.effect);
    }

    openResultPanel(q, match, tier, 'valid');
  }

  function submitPass(reason) {
    if (state.phase !== 'question') return;

    clearError();
    var questions = getQuestions();
    var q = questions[state.currentQ];
    var tier = SCORING.pass;

    state.results.push({ tier: tier, points: 0 });

    if (root.Scene) {
      root.Scene.effect('pass');
    }

    openResultPanel(q, null, tier, reason || 'pass');
  }

  function advanceQuestion() {
    if (state.phase !== 'result') return;

    if (state.currentQ >= TOTAL_QUESTIONS - 1) {
      showEndScreen();
    } else {
      state.currentQ += 1;
      renderQuestion();
    }
  }

  function showEndScreen() {
    state.phase = 'end';
    stopTimer();

    dom.finalScore.textContent = state.totalScore + ' / ' + MAX_TOTAL_SCORE;
    var icons = state.results.map(function (r) {
      return r.tier.icon;
    }).join(' ');
    dom.finalBoxes.textContent = icons;
    dom.copyFeedback.textContent = '';

    showScreen('end');
    dom.copyBtn.focus();
  }

  function copyResultToClipboard() {
    var icons = state.results.map(function (r) {
      return r.tier.icon;
    }).join('');
    var shareText = 'Martı #1 ' + icons + ' ' + state.totalScore + '/' + MAX_TOTAL_SCORE;

    function onSuccess() {
      dom.copyFeedback.textContent = 'PANOYA KOPYALANDI!';
    }

    function fallbackCopy() {
      var ta = document.createElement('textarea');
      ta.value = shareText;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        onSuccess();
      } catch (e) {
        dom.copyFeedback.textContent = shareText;
      }
      document.body.removeChild(ta);
    }

    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard.writeText(shareText).then(onSuccess, fallbackCopy);
    } else {
      fallbackCopy();
    }
  }

  function startGame() {
    state.currentQ = 0;
    state.totalScore = 0;
    state.results = [];

    if (root.Scene) {
      root.Scene.setAltitude(0);
    }

    renderQuestion();
  }

  function init() {
    dom.canvas = document.getElementById('game-canvas');
    dom.startScreen = document.getElementById('start-screen');
    dom.questionScreen = document.getElementById('question-screen');
    dom.endScreen = document.getElementById('end-screen');
    dom.resultPanel = document.getElementById('result-panel');

    dom.startBtn = document.getElementById('start-btn');
    dom.progressBoxes = document.getElementById('progress-boxes');
    dom.totalScore = document.getElementById('total-score');
    dom.questionCounter = document.getElementById('question-counter');
    dom.questionText = document.getElementById('question-text');
    dom.timerTrack = document.getElementById('timer-track');
    dom.timerFill = document.getElementById('timer-fill');
    dom.timerText = document.getElementById('timer-text');

    dom.errorMsg = document.getElementById('error-msg');
    dom.answerInput = document.getElementById('answer-input');
    dom.submitBtn = document.getElementById('submit-btn');
    dom.passBtn = document.getElementById('pass-btn');

    dom.resultHeader = document.getElementById('result-header');
    dom.resultIcon = document.getElementById('result-icon');
    dom.resultTier = document.getElementById('result-tier');
    dom.resultPoints = document.getElementById('result-points');
    dom.resultSentence = document.getElementById('result-sentence');
    dom.answersList = document.getElementById('answers-list');
    dom.nextBtn = document.getElementById('next-btn');

    dom.finalScore = document.getElementById('final-score');
    dom.finalBoxes = document.getElementById('final-boxes');
    dom.copyBtn = document.getElementById('copy-btn');
    dom.copyFeedback = document.getElementById('copy-feedback');
    dom.restartBtn = document.getElementById('restart-btn');

    if (root.Scene) {
      root.Scene.init(dom.canvas);
      root.Scene.setAltitude(0);
    }

    dom.startBtn.addEventListener('click', startGame);
    dom.submitBtn.addEventListener('click', submitAnswer);
    dom.passBtn.addEventListener('click', function () { submitPass('pass'); });
    dom.nextBtn.addEventListener('click', advanceQuestion);
    dom.copyBtn.addEventListener('click', copyResultToClipboard);
    dom.restartBtn.addEventListener('click', startGame);

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter') return;
      if (state.phase === 'start') {
        e.preventDefault();
        startGame();
      } else if (state.phase === 'question') {
        e.preventDefault();
        submitAnswer();
      } else if (state.phase === 'result') {
        e.preventDefault();
        advanceQuestion();
      }
    });

    showScreen('start');
  }

  document.addEventListener('DOMContentLoaded', init);
})(typeof window !== 'undefined' ? window : globalThis);

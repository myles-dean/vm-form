
(function () {
  if (window.__GOAL_GUARD_INSTALLED__) return;
  window.__GOAL_GUARD_INSTALLED__ = true;

  // Tuning: window (ms) within which duplicates are considered the "same click"
  var DUP_WINDOW = 180;

  // Track last-handled timestamp by radio group (name) + active step index
  var lastHandled = new Map();

  // Utility: find current active step index from DOM (non-destructive)
  function getActiveStepIndex(root) {
    var steps = root.querySelectorAll('.goals-container .goal-step');
    for (var i = 0; i < steps.length; i++) {
      if (steps[i].classList.contains('active')) return i;
    }
    // fallback
    return 0;
  }

  // Build a key that’s stable for the current Q & step + radio group
  function eventKey(target) {
    var slide = target.closest('.question-slide');
    var stepIdx = slide ? getActiveStepIndex(slide) : -1;
    var name = target.name || (target.id || 'unknown');
    return stepIdx + '::' + name;
  }

  // Generic deduper used by both handlers
  function shouldBlock(key) {
    var now = performance.now();
    var prev = lastHandled.get(key) || 0;
    var delta = now - prev;
    if (delta >= 0 && delta < DUP_WINDOW) {
      return true; // duplicate within window → block
    }
    lastHandled.set(key, now);
    return false;
  }

  // 1) Capture-phase CHANGE handler (radios emit change)
  document.addEventListener('change', function (e) {
    var t = e.target;
    if (!(t instanceof HTMLInputElement) || t.type !== 'radio') return;

    // Only guard rating radios inside this widget
    if (!t.closest('.goals-container .rating-options')) return;

    var key = eventKey(t);
    if (shouldBlock(key)) {
      // Block the duplicate so downstream "advance" listeners won't fire twice
      e.stopImmediatePropagation();
      e.stopPropagation();
      // console.debug('[Guard] blocked duplicate change', key);
    } else {
      // console.debug('[Guard] allowed change', key);
    }
  }, { capture: true });

  // 2) Capture-phase CLICK handler on labels (often fires alongside radio change)
  document.addEventListener('click', function (e) {
    var label = e.target.closest('.rating-btn-large');
    if (!label) return;

    // Find the radio this label controls
    var input = label.querySelector('input[type="radio"]');
    if (!input) return;

    // Constrain to this widget only
    if (!label.closest('.goals-container .rating-options')) return;

    var key = eventKey(input);
    if (shouldBlock(key)) {
      // Prevent the extra click from reaching other listeners
      e.stopImmediatePropagation();
      e.stopPropagation();
      // console.debug('[Guard] blocked duplicate click', key);
    } else {
      // console.debug('[Guard] allowed click', key);
    }
  }, { capture: true });
})();

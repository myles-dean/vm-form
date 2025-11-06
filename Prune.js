
(function () {
  // Map slider IDs -> final field names + readout wrappers
  var sliders = [
    { id: 'ceilingHeight', name: 'ceilingHeight_ft', readout: 'ceilingValue',  unit: 'ft' },
    { id: 'roomWidth',     name: 'roomWidth_ft',     readout: 'roomWidthValue', unit: 'ft' },
    { id: 'roomLength',    name: 'roomLength_ft',    readout: 'roomLengthValue', unit: 'ft' },
    { id: 'stageWidth',    name: 'stageWidth_ft',    readout: 'stageWidthValue', unit: 'ft' },
    { id: 'stageDepth',    name: 'stageDepth_ft',    readout: 'stageDepthValue', unit: 'ft' },
    { id: 'seatCount',     name: 'seatCount',        readout: 'seatsValue',      unit: ''   }
  ];

  function toInt(v){ var n = parseInt(v, 10); return isNaN(n) ? 0 : n; }

  function ensureHidden(form, name, idHint){
    var existing = form.querySelector('input[type="hidden"][name="'+name+'"]');
    if (existing) return existing;
    var h = document.createElement('input');
    h.type = 'hidden';
    h.name = name;
    if (idHint) h.id = idHint + 'Hidden';
    form.appendChild(h);
    return h;
  }

  function wireSlider(cfg){
    var el = document.getElementById(cfg.id);
    if (!el) return;
    var form = el.closest('form');
    if (!form) return;

    var hidden = ensureHidden(form, cfg.name, el.id);

    var wrap = document.getElementById(cfg.readout);
    var span = wrap ? wrap.querySelector('span') : null;

    function sync(){
      var v = toInt(el.value);
      hidden.value = String(v);
      if (span){
        span.textContent = cfg.unit ? (v + ' ' + cfg.unit) : String(v);
      }
    }
    el.addEventListener('input',  sync, { passive: true });
    el.addEventListener('change', sync);
    form.addEventListener('submit', sync);
    sync();
  }

  // Temporarily remove unnamed controls before Webflow serializes the form.
  function onSubmitCapture(e){
    var form = e.target;
    if (!(form instanceof HTMLFormElement)) return;

    // Find unnamed, successful controls (inputs/selects/textareas without a name)
    var unnamed = Array.from(form.querySelectorAll('input, select, textarea')).filter(function(el){
      if (el.disabled) return false;
      var hasName = el.hasAttribute('name') && el.name.trim() !== '';
      return !hasName;
    });

    if (!unnamed.length) return;

    // Stash original positions with placeholders, then remove from DOM
    var removed = [];
    unnamed.forEach(function(el){
      var ph = document.createComment('unnamed-ph');
      var parent = el.parentNode;
      if (!parent) return;
      parent.insertBefore(ph, el);
      parent.removeChild(el);
      removed.push({ el: el, ph: ph });
    });

    // Function to restore elements to original positions
    function restore(){
      removed.forEach(function(rec){
        if (rec.ph && rec.ph.parentNode){
          rec.ph.parentNode.insertBefore(rec.el, rec.ph);
          rec.ph.parentNode.removeChild(rec.ph);
        }
      });
      removed = [];
    }

    // Observe Webflow success/fail toggles, then restore
    var done = form.querySelector('.w-form-done');
    var fail = form.querySelector('.w-form-fail');
    var observer;

    if (done || fail){
      observer = new MutationObserver(function(){
        var doneVisible = done && getComputedStyle(done).display !== 'none' && done.innerHTML.trim() !== '';
        var failVisible = fail && getComputedStyle(fail).display !== 'none' && fail.innerHTML.trim() !== '';
        if (doneVisible || failVisible){
          observer.disconnect();
          restore();
        }
      });
      observer.observe(form, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });
    }

    // Fallback: always restore after 1500ms in case Webflow doesn't flip blocks
    setTimeout(function(){
      if (observer) observer.disconnect();
      restore();
    }, 1500);
  }

  document.addEventListener('DOMContentLoaded', function(){
    // 1) Mirror your sliders into clean, named hidden inputs
    sliders.forEach(wireSlider);

    // 2) Remove unnamed fields at the CAPTURE phase submit (before Webflow AJAX)
    document.addEventListener('submit', onSubmitCapture, true);

    // (Optional) One-time console preview per form for debugging
    document.querySelectorAll('form').forEach(function(form){
      if (form.__loggedOnce) return;
      form.addEventListener('submit', function(){
        try {
          var fd = new FormData(form);
          console.group('Submitting form #' + (form.id || '(no-id)'));
          Array.from(fd.entries()).forEach(function([k,v]){ console.log(k, '→', v); });
          console.groupEnd();
        } catch(e){}
      }, { once: true });
      form.__loggedOnce = true;
    });
  });
})();

(() => {
  const root = document.querySelector('#agent-workspace');
  if (!root) return;
  const runButton = root.querySelector('#agent-demo-run');
  const resetButton = root.querySelector('#agent-demo-reset');
  const timeline = root.querySelector('#agent-timeline');
  const progress = root.querySelector('#agent-progress');
  const progressFill = root.querySelector('#agent-progress-fill');
  const status = root.querySelector('#agent-run-status');
  const badge = root.querySelector('#agent-run-badge');
  if (!runButton || !resetButton || !timeline || !progress || !progressFill || !status || !badge) return;

  const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const steps = [
    { agent: 'orchestrator', title: 'Sample enquiry queued', detail: 'A fictional solar enquiry enters the local demo queue.' },
    { agent: 'intake', title: 'Required fields checked', detail: 'The preview checks example name, company and enquiry topic fields.' },
    { agent: 'sales', title: 'Enquiry topic classified', detail: 'Sample intent identified: site-survey follow-up.' },
    { agent: 'followup', title: 'Reminder draft prepared', detail: 'A draft next step is prepared for a human to review.' },
    { agent: 'security', title: 'Approval gates checked', detail: 'Consent, human review and no-auto-send rules are shown as checks.' },
    { agent: null, title: 'Waiting for human approval', detail: 'The preview stops here. No email, message or call is sent.' }
  ];
  let timers = [];
  let runToken = 0;

  function clearTimers() {
    timers.forEach(window.clearTimeout);
    timers = [];
  }

  function reset() {
    runToken += 1;
    clearTimers();
    root.classList.remove('is-running', 'is-complete');
    root.querySelectorAll('[data-agent-card]').forEach(card => {
      card.classList.remove('is-active', 'is-complete');
      const state = card.querySelector('[data-agent-state]');
      if (!state) return;
      const initial = {
        orchestrator: 'Blueprint only',
        intake: 'Blueprint only',
        sales: 'Demo responses only',
        followup: 'Draft-only design',
        security: 'Checklist design'
      }[card.dataset.agentCard] || 'Not connected';
      state.textContent = initial;
    });
    timeline.innerHTML = '<li class="timeline-idle"><span class="timeline-mark" aria-hidden="true">•</span><span><strong>Waiting to start</strong><small>No real enquiry is being processed.</small></span></li>';
    progressFill.style.width = '0%';
    progress.setAttribute('aria-valuenow', '0');
    status.textContent = 'Ready to run a sample workflow.';
    badge.textContent = 'READY';
    badge.className = 'agent-run-badge';
    runButton.disabled = false;
    runButton.innerHTML = 'Run demo workflow <span class="arrow" aria-hidden="true">↗</span>';
  }

  function renderSteps() {
    timeline.innerHTML = '';
    steps.forEach((step, index) => {
      const item = document.createElement('li');
      item.dataset.step = String(index);
      const mark = document.createElement('span');
      mark.className = 'timeline-mark';
      mark.setAttribute('aria-hidden', 'true');
      mark.textContent = String(index + 1).padStart(2, '0');
      const body = document.createElement('span');
      const title = document.createElement('strong');
      title.textContent = step.title;
      const detail = document.createElement('small');
      detail.textContent = step.detail;
      body.append(title, detail);
      item.append(mark, body);
      timeline.appendChild(item);
    });
  }

  function activateStep(index, token) {
    if (token !== runToken) return;
    const step = steps[index];
    const item = timeline.querySelector(`[data-step="${index}"]`);
    if (!item) return;
    item.classList.add('is-active');
    const mark = item.querySelector('.timeline-mark');
    if (mark) mark.textContent = '✓';
    if (index > 0) {
      const prior = timeline.querySelector(`[data-step="${index - 1}"]`);
      if (prior) prior.classList.add('is-complete');
    }
    root.querySelectorAll('[data-agent-card]').forEach(card => {
      if (card.dataset.agentCard === step.agent) {
        card.classList.add('is-active');
        card.classList.remove('is-complete');
        const state = card.querySelector('[data-agent-state]');
        if (state) state.textContent = 'Demo step active';
      } else if (card.classList.contains('is-active')) {
        card.classList.remove('is-active');
        card.classList.add('is-complete');
        const state = card.querySelector('[data-agent-state]');
        if (state) state.textContent = 'Demo step complete';
      }
    });
    const pct = Math.round(((index + 1) / steps.length) * 100);
    progressFill.style.width = `${pct}%`;
    progress.setAttribute('aria-valuenow', String(pct));
    status.textContent = `${index + 1} of ${steps.length}: ${step.title}. Sample data only.`;
    timeline.querySelectorAll('li').forEach(li => { if (li !== item && Number(li.dataset.step) < index) li.classList.add('is-complete'); });

    if (index === steps.length - 1) {
      root.classList.remove('is-running');
      root.classList.add('is-complete');
      item.classList.add('is-complete');
      badge.textContent = 'DEMO COMPLETE';
      badge.className = 'agent-run-badge is-complete';
      status.textContent = 'Preview complete. Workflow paused for a human; no external action was taken.';
      runButton.disabled = false;
      runButton.innerHTML = 'Run again <span class="arrow" aria-hidden="true">↻</span>';
    }
  }

  function run() {
    reset();
    const token = runToken;
    renderSteps();
    root.classList.add('is-running');
    badge.textContent = 'SIMULATING';
    badge.className = 'agent-run-badge is-running';
    status.textContent = 'Running a local preview with fictional data. No live services are being called.';
    runButton.disabled = true;
    runButton.textContent = 'Running preview…';
    steps.forEach((_, index) => {
      const delay = reducedMotion ? index * 80 : index * 1050;
      timers.push(window.setTimeout(() => activateStep(index, token), delay));
    });
  }

  runButton.addEventListener('click', run);
  resetButton.addEventListener('click', reset);
  reset();
})();

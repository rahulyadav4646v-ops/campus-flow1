// Health & Wellness Management Component

let pomodoroTimerInterval = null;
let pomodoroSecondsLeft = 25 * 60; // default 25 min
let isTimerRunning = false;
let currentTimerMode = 'work'; // 'work', 'shortBreak', 'eyeBreak'

function initHealth() {
  renderHealth();
}

function playTimerChime() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5

    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.8);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.8);
  } catch (e) {
    console.log("Audio alert not permitted without user interaction");
  }
}

function renderHealth() {
  const container = document.getElementById('health-content');
  if (!container) return;

  const state = window.store.getState();
  const health = state.health || {};
  const waterGlasses = health.waterGlasses || 0;
  const targetGlasses = state.settings.dailyWaterGoal || 8;
  const waterPct = Math.round((waterGlasses / targetGlasses) * 100);

  const sleepHours = health.sleepHours || 7.0;
  const targetSleep = state.settings.dailySleepGoal || 8.0;
  const sleepDebt = (targetSleep - sleepHours).toFixed(1);

  const workouts = health.workouts || [];
  const habits = health.habits || [];
  const wearables = state.wearables || {
    connectedApp: 'fitbit',
    deviceName: 'Fitbit Charge 6 (Connected)',
    lastSync: 'Just now',
    heartRate: 72,
    steps: 8420,
    stepGoal: 10000,
    activeCalories: 485,
    spo2: 98,
    battery: 82
  };

  const stepsPct = Math.min(100, Math.round(((wearables.steps || 0) / (wearables.stepGoal || 10000)) * 100));

  let html = `
    <!-- Health Header -->
    <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div>
        <h3 class="text-xl font-bold text-white flex items-center gap-2">
          ${window.getIcon('heart', 'text-rose-400')}
          Student Health & Wearables Monitoring Hub
        </h3>
        <p class="text-xs text-slate-400">Live health sync from Fitbit, Apple Health & Google Fit plus sleep and hydration</p>
      </div>

      <!-- Quick Mood Badge -->
      <div class="flex items-center gap-2 p-1.5 px-3 rounded-xl bg-slate-900/60 border border-slate-700/60 text-xs">
        <span class="text-slate-400">Current Mood:</span>
        <button onclick="promptMoodUpdate()" class="font-semibold text-indigo-300 hover:text-white flex items-center gap-1 transition">
          ${window.getIcon('smile', 'w-3.5 h-3.5 text-amber-400')}
          <span>${health.mood || 'Good'}</span>
          <span class="text-[10px] text-slate-400 ml-1">✏️</span>
        </button>
      </div>
    </div>

    <!-- WEARABLES / FITBIT / APPLE HEALTH SYNC MODULE -->
    <div class="glass-card p-6 rounded-3xl border border-indigo-500/40 bg-gradient-to-r from-indigo-950/40 via-slate-900 to-purple-950/40 shadow-xl mb-8">
      <div class="flex flex-wrap items-center justify-between gap-4 mb-5 pb-3 border-b border-indigo-500/20">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
            ${window.getIcon('activity', 'w-6 h-6')}
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Connected Device
              </span>
              <span class="text-xs text-slate-300">${wearables.deviceName}</span>
            </div>
            <h4 class="text-lg font-bold text-white mt-0.5">Live Health Monitoring & Wearable App Gateway</h4>
            <p class="text-xs text-slate-400">Auto-fetching vitals, steps & sleep from your connected fitness tracking apps</p>
          </div>
        </div>

        <!-- Sync Button & App Selector -->
        <div class="flex flex-wrap items-center gap-2.5">
          <div class="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-700 text-xs">
            <button onclick="switchWearableApp('Fitbit')" class="px-3 py-1 rounded-lg transition ${wearables.connectedApp === 'fitbit' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'}">
              Fitbit
            </button>
            <button onclick="switchWearableApp('Apple Health')" class="px-3 py-1 rounded-lg transition ${wearables.connectedApp === 'applehealth' ? 'bg-rose-600 text-white font-bold' : 'text-slate-400 hover:text-white'}">
              Apple Health
            </button>
            <button onclick="switchWearableApp('Google Fit')" class="px-3 py-1 rounded-lg transition ${wearables.connectedApp === 'googlefit' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'}">
              Google Fit
            </button>
          </div>

          <button onclick="triggerWearableSync()" class="px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center gap-2">
            ${window.getIcon('refresh', 'w-3.5 h-3.5')}
            <span>Fetch Data Now</span>
          </button>
        </div>
      </div>

      <!-- Live Vitals Dashboard Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <!-- Steps -->
        <div class="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-700/60">
          <div class="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Daily Steps</span>
            <span class="text-cyan-400 font-mono font-bold">${stepsPct}%</span>
          </div>
          <div class="text-xl md:text-2xl font-black font-mono text-white">${(wearables.steps || 0).toLocaleString()}</div>
          <div class="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div class="h-full bg-cyan-400 rounded-full" style="width: ${stepsPct}%"></div>
          </div>
          <span class="text-[10px] text-slate-500 mt-1 block font-mono">Goal: 10,000 steps</span>
        </div>

        <!-- Heart Rate -->
        <div class="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-700/60">
          <div class="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Heart Rate</span>
            <span class="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
          </div>
          <div class="text-xl md:text-2xl font-black font-mono text-rose-400 flex items-baseline gap-1">
            ${wearables.heartRate || 72} <span class="text-xs font-normal text-slate-400">BPM</span>
          </div>
          <p class="text-[11px] text-slate-400 mt-1">Status: Resting Normal</p>
        </div>

        <!-- Active Burn -->
        <div class="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-700/60">
          <div class="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Active Calories</span>
            <span>🔥</span>
          </div>
          <div class="text-xl md:text-2xl font-black font-mono text-amber-400 flex items-baseline gap-1">
            ${wearables.activeCalories || 485} <span class="text-xs font-normal text-slate-400">kcal</span>
          </div>
          <p class="text-[11px] text-slate-400 mt-1">Tracked via accelerometer</p>
        </div>

        <!-- Blood Oxygen & Battery -->
        <div class="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-700/60 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>SpO2 Oxygen</span>
              <span class="text-emerald-400 font-mono">${wearables.battery || 82}% Batt</span>
            </div>
            <div class="text-xl md:text-2xl font-black font-mono text-emerald-400">${wearables.spo2 || 98}%</div>
          </div>
          <span class="text-[10px] text-slate-500 font-mono mt-1">Last Synced: ${wearables.lastSync || 'Today'}</span>
        </div>
      </div>
    </div>

    <!-- 3-Column Wellness Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

      <!-- 1. Water Intake Card -->
      <div class="glass-card p-5 rounded-2xl border border-slate-700/70 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              ${window.getIcon('droplets', 'text-cyan-400')}
              Hydration Tracker
            </span>
            <span class="font-mono text-xs text-slate-300 font-semibold">${waterGlasses * 250} / ${targetGlasses * 250} ml</span>
          </div>

          <h4 class="text-2xl font-black text-white font-mono mb-1">
            ${waterGlasses} <span class="text-sm font-normal text-slate-400">/ ${targetGlasses} glasses</span>
          </h4>
          <p class="text-xs text-slate-400 mb-4">Click glasses to fill or log water intake</p>

          <!-- Interactive Glasses Grid -->
          <div class="grid grid-cols-4 gap-2.5 mb-4">
            ${Array.from({ length: targetGlasses }).map((_, i) => {
              const isFilled = i < waterGlasses;
              return `
                <button onclick="setWaterLevel(${i + 1})" class="water-cup flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${isFilled ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400 shadow-md shadow-cyan-500/20' : 'bg-slate-800/40 border-slate-700 text-slate-600 hover:border-slate-500'}">
                  ${window.getIcon('droplets', 'w-5 h-5')}
                  <span class="text-[10px] font-mono mt-1 font-medium">${(i + 1) * 250}ml</span>
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <div class="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
          <div class="flex items-center gap-2">
            <button onclick="logWaterStep(1)" class="px-3 py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white border border-cyan-500/30 font-medium transition">
              +1 Glass (250ml)
            </button>
            <button onclick="logWaterStep(-1)" class="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition">
              -1
            </button>
          </div>
          <button onclick="resetWaterIntake()" class="text-[11px] text-slate-500 hover:text-slate-400">Reset</button>
        </div>
      </div>

      <!-- 2. Sleep & Sleep Debt Card -->
      <div class="glass-card p-5 rounded-2xl border border-slate-700/70 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
              ${window.getIcon('moon', 'text-purple-400')}
              Sleep & Recovery
            </span>
            <button onclick="openLogSleepModal()" class="text-xs text-indigo-400 hover:text-indigo-300">
              Log Sleep
            </button>
          </div>

          <div class="flex items-baseline gap-2 mb-1">
            <span class="text-2xl font-black text-white font-mono">${sleepHours} hrs</span>
            <span class="text-xs text-slate-400">Quality: <strong class="text-purple-300">${health.sleepQuality || 'Good'}</strong></span>
          </div>

          <!-- Sleep Debt Alert -->
          <div class="p-3 rounded-xl ${Number(sleepDebt) > 0 ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'} border text-xs my-3 flex items-start gap-2">
            ${window.getIcon('alert', 'w-4 h-4 flex-shrink-0 mt-0.5')}
            <div>
              ${Number(sleepDebt) > 0
                ? `<span>You have <strong>${sleepDebt}h sleep deficit</strong> from the 8h target. Plan an early bedtime tonight!</span>`
                : `<span>Optimal recovery achieved! You hit your 8h rest goal.</span>`}
            </div>
          </div>

          <!-- Weekly Sleep Mini Bar Chart -->
          <div class="mt-4">
            <span class="text-[11px] font-semibold text-slate-400 block mb-2">Past 7 Days Rest</span>
            <div class="flex items-end justify-between gap-1.5 h-20 pt-2 border-b border-slate-800">
              ${(health.sleepHistory || []).map(day => {
                const heightPct = Math.min(100, Math.round((day.hours / 9) * 100));
                return `
                  <div class="flex-1 flex flex-col items-center gap-1 h-full justify-end group relative">
                    <div class="w-full rounded-t-md bg-purple-500/60 hover:bg-purple-400 transition" style="height: ${heightPct}%;"></div>
                    <span class="text-[10px] font-mono text-slate-400">${day.day}</span>
                    <span class="absolute -top-7 hidden group-hover:block bg-slate-900 border border-slate-700 px-1.5 py-0.5 rounded text-[10px] text-white font-mono shadow z-10 whitespace-nowrap">
                      ${day.hours}h
                    </span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>

        <div class="pt-3 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Target: 8.0 hrs/night</span>
          <span class="text-purple-400">Sleep Score: 88/100</span>
        </div>
      </div>

      <!-- 3. Study Pomodoro & 20-20-20 Eye Strain Timer -->
      <div class="glass-card p-5 rounded-2xl border border-slate-700/70 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
              ${window.getIcon('clock', 'text-rose-400')}
              Focus & Eye-Strain Timer
            </span>
            <span class="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
              ${currentTimerMode === 'work' ? 'Deep Work' : (currentTimerMode === 'eyeBreak' ? '20-20-20 Eye Break' : 'Rest Break')}
            </span>
          </div>

          <!-- Mode Selector Tabs -->
          <div class="grid grid-cols-3 gap-1 p-1 bg-slate-900/80 rounded-xl border border-slate-800 mb-4 text-xs">
            <button onclick="setTimerPreset('work')" class="py-1 rounded-lg transition ${currentTimerMode === 'work' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'}">
              25m Focus
            </button>
            <button onclick="setTimerPreset('shortBreak')" class="py-1 rounded-lg transition ${currentTimerMode === 'shortBreak' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-400 hover:text-white'}">
              5m Rest
            </button>
            <button onclick="setTimerPreset('eyeBreak')" class="py-1 rounded-lg transition ${currentTimerMode === 'eyeBreak' ? 'bg-cyan-600 text-white font-semibold' : 'text-slate-400 hover:text-white'}" title="20-20-20 rule for eye strain">
              Eye Break
            </button>
          </div>

          <!-- Big Countdown Display -->
          <div class="text-center py-4">
            <div id="pomodoro-display" class="text-4xl md:text-5xl font-black font-mono tracking-wider text-white">
              ${formatTimerSeconds(pomodoroSecondsLeft)}
            </div>
            <p id="timer-subtext" class="text-xs text-slate-400 mt-2">
              ${currentTimerMode === 'eyeBreak' ? 'Look 20 feet away for 20 seconds to relax ciliary eye muscles' : 'Stay locked in. No campus social media distractions.'}
            </p>
          </div>
        </div>

        <!-- Timer Controls -->
        <div class="flex items-center justify-center gap-3 pt-3 border-t border-slate-800">
          <button onclick="togglePomodoroTimer()" id="timer-toggle-btn" class="px-5 py-2 rounded-xl ${isTimerRunning ? 'bg-amber-600 hover:bg-amber-500' : 'bg-indigo-600 hover:bg-indigo-500'} text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition flex items-center gap-1.5">
            ${isTimerRunning ? window.getIcon('pause') : window.getIcon('play')}
            <span>${isTimerRunning ? 'Pause' : 'Start Focus'}</span>
          </button>
          <button onclick="resetPomodoroTimer()" class="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition" title="Reset Timer">
            ${window.getIcon('refresh')}
          </button>
        </div>
      </div>

    </div>

    <!-- Bottom Row: Workouts + Daily Healthy Habits Checklist -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

      <!-- Healthy Habits Checklist -->
      <div class="glass-card p-5 rounded-2xl border border-slate-700/70">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h4 class="text-base font-bold text-white flex items-center gap-2">
              ${window.getIcon('checkCircle', 'text-emerald-400')}
              Daily Campus Habit Checklist
            </h4>
            <p class="text-xs text-slate-400">Micro-habits to sustain peak academic stamina</p>
          </div>
          <span class="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
            ${habits.filter(h => h.done).length} / ${habits.length} Done
          </span>
        </div>

        <div class="space-y-2.5">
          ${habits.map(habit => `
            <div class="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 hover:bg-slate-800/80 transition">
              <label class="flex items-center gap-3 cursor-pointer flex-1">
                <input type="checkbox" onchange="toggleHabitItem('${habit.id}')" ${habit.done ? 'checked' : ''} class="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700 focus:ring-0">
                <span class="text-xs md:text-sm ${habit.done ? 'line-through text-slate-500' : 'text-slate-200 font-medium'}">${habit.text}</span>
              </label>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Physical Activity & Workout Log -->
      <div class="glass-card p-5 rounded-2xl border border-slate-700/70">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h4 class="text-base font-bold text-white flex items-center gap-2">
              ${window.getIcon('activity', 'text-cyan-400')}
              Workouts & Physical Activity
            </h4>
            <p class="text-xs text-slate-400">Gym, jogging, college sports & stretching</p>
          </div>
          <button onclick="openLogWorkoutModal()" class="text-xs px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition flex items-center gap-1">
            ${window.getIcon('plus')} Log Activity
          </button>
        </div>

        <div class="space-y-2.5">
          ${workouts.length === 0 ? `
            <div class="text-center py-6 text-slate-500 text-xs">No workout logged yet today. Go for a quick 15-minute campus walk!</div>
          ` : workouts.map(w => `
            <div class="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700/60">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-cyan-600/20 text-cyan-400 flex items-center justify-center">
                  ${window.getIcon('activity', 'w-4 h-4')}
                </div>
                <div>
                  <h5 class="text-xs md:text-sm font-semibold text-white">${w.type}</h5>
                  <span class="text-[11px] text-slate-400">${w.time || 'Today'} • ${w.durationMinutes} mins</span>
                </div>
              </div>
              <span class="text-xs font-mono font-bold text-cyan-400">${w.calories} kcal</span>
            </div>
          `).join('')}
        </div>
      </div>

    </div>
  `;

  container.innerHTML = html;
}

function formatTimerSeconds(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function setTimerPreset(mode) {
  clearInterval(pomodoroTimerInterval);
  isTimerRunning = false;
  currentTimerMode = mode;

  if (mode === 'work') {
    pomodoroSecondsLeft = 25 * 60;
  } else if (mode === 'shortBreak') {
    pomodoroSecondsLeft = 5 * 60;
  } else if (mode === 'eyeBreak') {
    pomodoroSecondsLeft = 20; // 20 seconds for the 20-20-20 rule
  }

  renderHealth();
}

function togglePomodoroTimer() {
  if (isTimerRunning) {
    clearInterval(pomodoroTimerInterval);
    isTimerRunning = false;
    renderHealth();
  } else {
    isTimerRunning = true;
    pomodoroTimerInterval = setInterval(() => {
      if (pomodoroSecondsLeft > 0) {
        pomodoroSecondsLeft--;
        const display = document.getElementById('pomodoro-display');
        if (display) display.innerText = formatTimerSeconds(pomodoroSecondsLeft);
      } else {
        clearInterval(pomodoroTimerInterval);
        isTimerRunning = false;
        playTimerChime();
        window.showToast("Timer completed! Time to take a breather.", "success");
        if (currentTimerMode === 'work') {
          setTimerPreset('shortBreak');
        } else {
          setTimerPreset('work');
        }
      }
    }, 1000);
    renderHealth();
  }
}

function resetPomodoroTimer() {
  clearInterval(pomodoroTimerInterval);
  isTimerRunning = false;
  setTimerPreset(currentTimerMode);
}

function logWaterStep(amount) {
  window.store.logWater(amount);
  renderHealth();
}

function setWaterLevel(glasses) {
  const state = window.store.getState();
  const current = state.health.waterGlasses || 0;
  const delta = glasses - current;
  window.store.logWater(delta);
  renderHealth();
}

function resetWaterIntake() {
  if (confirm("Reset today's water counter?")) {
    window.store.resetWater();
    renderHealth();
  }
}

function toggleHabitItem(id) {
  window.store.toggleHabit(id);
  renderHealth();
}

function promptMoodUpdate() {
  const mood = prompt("How are you feeling right now? (e.g. Energized, Focused, Stressed, Tired, Awesome):", "Energized");
  if (mood && mood.trim()) {
    const note = prompt("Any quick gratitude or mental check-in note?", "");
    window.store.logMood(mood.trim(), note ? note.trim() : undefined);
    window.showToast("Mood log saved!", "success");
    renderHealth();
  }
}

function openLogSleepModal() {
  const state = window.store.getState();
  const currentSleep = state.health.sleepHours || 7.0;

  const modalHtml = `
    <div id="sleep-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay">
      <div class="glass-card bg-slate-900 border border-slate-700 w-full max-w-sm p-6 rounded-2xl shadow-2xl relative">
        <button onclick="closeModal('sleep-modal')" class="absolute top-5 right-5 text-slate-400 hover:text-white">
          ${window.getIcon('x')}
        </button>
        <h3 class="text-lg font-bold text-white mb-1 flex items-center gap-2">
          ${window.getIcon('moon', 'text-purple-400')}
          Log Sleep
        </h3>
        <p class="text-xs text-slate-400 mb-4">Track your hours slept last night</p>

        <form onsubmit="handleSaveSleep(event)" class="space-y-4">
          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Hours Slept (0 - 14)</label>
            <input type="number" step="0.1" id="sleep-input-hours" required min="1" max="14" value="${currentSleep}" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none font-mono">
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Sleep Quality</label>
            <select id="sleep-input-quality" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none">
              <option value="Refreshed">Refreshed & Energized</option>
              <option value="Good" selected>Good</option>
              <option value="Average">Average</option>
              <option value="Tired">Tired / Interrupted</option>
              <option value="Exhausted">Exhausted / Pulled All-Nighter</option>
            </select>
          </div>

          <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button type="button" onclick="closeModal('sleep-modal')" class="px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs">
              Cancel
            </button>
            <button type="submit" class="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow transition">
              Save Sleep Log
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function handleSaveSleep(e) {
  e.preventDefault();
  const hours = document.getElementById('sleep-input-hours').value;
  const quality = document.getElementById('sleep-input-quality').value;
  window.store.logSleep(hours, quality);
  window.showToast("Sleep logged successfully!", "success");
  closeModal('sleep-modal');
  renderHealth();
}

function openLogWorkoutModal() {
  const modalHtml = `
    <div id="workout-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay">
      <div class="glass-card bg-slate-900 border border-slate-700 w-full max-w-sm p-6 rounded-2xl shadow-2xl relative">
        <button onclick="closeModal('workout-modal')" class="absolute top-5 right-5 text-slate-400 hover:text-white">
          ${window.getIcon('x')}
        </button>
        <h3 class="text-lg font-bold text-white mb-1 flex items-center gap-2">
          ${window.getIcon('activity', 'text-cyan-400')}
          Log Workout / Exercise
        </h3>
        <p class="text-xs text-slate-400 mb-4">Keep your physical fitness on point</p>

        <form onsubmit="handleSaveWorkout(event)" class="space-y-4">
          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Activity Type *</label>
            <input type="text" id="wkt-type" required placeholder="e.g. Weight Training, Basketball, Jogging" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none">
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Duration (mins) *</label>
              <input type="number" id="wkt-duration" required min="5" max="300" value="30" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none">
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Calories Burned</label>
              <input type="number" id="wkt-calories" min="10" max="2000" value="200" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none">
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button type="button" onclick="closeModal('workout-modal')" class="px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs">
              Cancel
            </button>
            <button type="submit" class="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow transition">
              Log Exercise
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function handleSaveWorkout(e) {
  e.preventDefault();
  const type = document.getElementById('wkt-type').value.trim();
  const durationMinutes = Number(document.getElementById('wkt-duration').value);
  const calories = Number(document.getElementById('wkt-calories').value);
  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  window.store.addWorkout({ type, durationMinutes, calories, time });
  window.showToast("Workout activity logged!", "success");
  closeModal('workout-modal');
  renderHealth();
}

function triggerWearableSync() {
  const state = window.store.getState();
  const currentApp = (state.wearables && state.wearables.connectedApp) ? state.wearables.connectedApp : 'Fitbit';
  const appDisplay = currentApp === 'applehealth' ? 'Apple Health' : (currentApp === 'googlefit' ? 'Google Fit' : 'Fitbit');

  window.store.syncWearables(appDisplay);
  window.showToast(`Fetched live health telemetry from ${appDisplay}!`, "success");
  renderHealth();
}

function switchWearableApp(appName) {
  window.store.syncWearables(appName);
  window.showToast(`Connected ${appName} account & fetched latest sensor data!`, "success");
  renderHealth();
}

window.initHealth = initHealth;
window.renderHealth = renderHealth;
window.triggerWearableSync = triggerWearableSync;
window.switchWearableApp = switchWearableApp;
window.logWaterStep = logWaterStep;
window.setWaterLevel = setWaterLevel;
window.resetWaterIntake = resetWaterIntake;
window.setTimerPreset = setTimerPreset;
window.togglePomodoroTimer = togglePomodoroTimer;
window.resetPomodoroTimer = resetPomodoroTimer;
window.toggleHabitItem = toggleHabitItem;
window.promptMoodUpdate = promptMoodUpdate;
window.openLogSleepModal = openLogSleepModal;
window.handleSaveSleep = handleSaveSleep;
window.openLogWorkoutModal = openLogWorkoutModal;
window.handleSaveWorkout = handleSaveWorkout;

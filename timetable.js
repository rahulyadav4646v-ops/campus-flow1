// Timetable Management Component

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
let currentDayFilter = "all"; // 'all' or specific day
let currentTypeFilter = "all";

function initTimetable() {
  renderTimetable();
  renderLiveClassAlert();
  setInterval(renderLiveClassAlert, 60000); // refresh live class every minute
}

function renderTimetable() {
  const container = document.getElementById('timetable-content');
  if (!container) return;

  const state = window.store.getState();
  const slots = (state.timetableSlots || []).filter(s => s.day !== 'Saturday');

  // Filter slots
  const filtered = slots.filter(slot => {
    const matchDay = currentDayFilter === "all" || slot.day.toLowerCase() === currentDayFilter.toLowerCase();
    const matchType = currentTypeFilter === "all" || slot.type.toLowerCase() === currentTypeFilter.toLowerCase();
    return matchDay && matchType && slot.day.toLowerCase() !== 'saturday';
  });

  const isHost = window.store.isHost();

  // Sort slots by time
  filtered.sort((a, b) => a.startTime.localeCompare(b.startTime));

  let html = `
    <!-- Timetable Top Bar: Day Tabs, Filters, Actions -->
    <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
      <!-- Day Selector Pills -->
      <div class="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900/60 backdrop-blur rounded-xl border border-slate-700/50">
        <button onclick="setDayFilter('all')" class="px-3.5 py-1.5 text-xs md:text-sm font-medium rounded-lg transition-all ${currentDayFilter === 'all' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}">
          All Days (Mon-Fri)
        </button>
        ${daysOfWeek.map(day => `
          <button onclick="setDayFilter('${day}')" class="px-3 py-1.5 text-xs md:text-sm font-medium rounded-lg transition-all ${currentDayFilter.toLowerCase() === day.toLowerCase() ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}">
            ${day.slice(0, 3)}
          </button>
        `).join('')}
      </div>

      <!-- Action Buttons & Type Filter -->
      <div class="flex items-center gap-2.5">
        <select onchange="setTypeFilter(this.value)" class="bg-slate-800/80 text-xs md:text-sm text-slate-200 border border-slate-700 rounded-lg px-3 py-2 outline-none focus:border-indigo-500">
          <option value="all" ${currentTypeFilter === 'all' ? 'selected' : ''}>All Categories</option>
          <option value="lecture" ${currentTypeFilter === 'lecture' ? 'selected' : ''}>Lectures</option>
          <option value="lab" ${currentTypeFilter === 'lab' ? 'selected' : ''}>Labs</option>
          <option value="tutorial" ${currentTypeFilter === 'tutorial' ? 'selected' : ''}>Tutorials</option>
          <option value="club" ${currentTypeFilter === 'club' ? 'selected' : ''}>Clubs</option>
          <option value="study" ${currentTypeFilter === 'study' ? 'selected' : ''}>Self Study</option>
        </select>

        <button onclick="window.print()" class="no-print p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition flex items-center gap-1.5 text-xs md:text-sm" title="Print Timetable">
          ${window.getIcon('printer')}
          <span class="hidden sm:inline">Print</span>
        </button>

        ${isHost ? `
          <button onclick="openAddSlotModal()" class="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs md:text-sm rounded-lg shadow-lg shadow-indigo-600/30 transition flex items-center gap-1.5">
            ${window.getIcon('plus')}
            <span>Add Slot</span>
          </button>
        ` : `
          <div class="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-400 text-xs font-mono">
            Student View
          </div>
        `}
      </div>
    </div>
  `;

  if (currentDayFilter === "all") {
    // Render weekly column view (Mon to Fri)
    html += `
      <div class="timetable-grid-wrapper">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          ${daysOfWeek.map(day => {
            const daySlots = filtered.filter(s => s.day.toLowerCase() === day.toLowerCase());
            return `
              <div class="glass-card flex flex-col rounded-xl overflow-hidden border border-slate-700/60 bg-slate-900/50">
                <div class="py-2.5 px-3.5 bg-slate-800/80 border-b border-slate-700/60 flex items-center justify-between">
                  <span class="font-semibold text-sm tracking-wide text-indigo-300">${day}</span>
                  <span class="text-xs px-2 py-0.5 rounded-full bg-slate-700/60 text-slate-400 font-mono">${daySlots.length} slots</span>
                </div>
                <div class="p-2.5 flex flex-col gap-2.5 flex-1 min-h-[300px]">
                  ${daySlots.length === 0 ? `
                    <div class="flex-1 flex flex-col items-center justify-center text-slate-500 text-xs py-8">
                      <span class="opacity-40 mb-1">${window.getIcon('sparkles')}</span>
                      No classes scheduled
                    </div>
                  ` : daySlots.map(slot => renderSlotCard(slot)).join('')}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  } else {
    // Single Day Focus View (Timeline style)
    const daySlots = filtered.filter(s => s.day.toLowerCase() === currentDayFilter.toLowerCase());
    html += `
      <div class="glass-card p-6 rounded-2xl border border-slate-700/60 max-w-4xl mx-auto">
        <div class="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div>
            <h3 class="text-xl font-bold text-white flex items-center gap-2">
              ${window.getIcon('calendar', 'text-indigo-400')}
              ${currentDayFilter} Schedule
            </h3>
            <p class="text-xs text-slate-400 mt-1">${daySlots.length} sessions planned for this day</p>
          </div>
          <button onclick="openAddSlotModal('${currentDayFilter}')" class="text-xs px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 border border-indigo-500/30 transition flex items-center gap-1">
            ${window.getIcon('plus')} Add to ${currentDayFilter}
          </button>
        </div>

        ${daySlots.length === 0 ? `
          <div class="text-center py-16 text-slate-400">
            <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-500">
              ${window.getIcon('coffee')}
            </div>
            <p class="text-base font-medium">Free Day!</p>
            <p class="text-xs text-slate-500 mt-1">No lectures or lab sessions scheduled for ${currentDayFilter}.</p>
          </div>
        ` : `
          <div class="space-y-3.5">
            ${daySlots.map(slot => renderSingleDaySlotItem(slot)).join('')}
          </div>
        `}
      </div>
    `;
  }

  container.innerHTML = html;
}

function renderSlotCard(slot) {
  const isHost = window.store.isHost();
  const typeBadgeClass = `badge-${slot.type.toLowerCase()}`;
  return `
    <div class="group relative rounded-xl p-3 border transition-all duration-200 hover:shadow-lg bg-slate-800/90 border-slate-700/80 hover:border-indigo-500/50" style="border-left: 4px solid ${slot.color || '#6366f1'};">
      <div class="flex items-center justify-between gap-1 mb-1.5">
        <span class="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-md ${typeBadgeClass}">
          ${slot.type}
        </span>
        ${isHost ? `
          <div class="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
            <button onclick="openEditSlotModal('${slot.id}')" class="p-1 text-slate-400 hover:text-white rounded" title="Edit">
              ${window.getIcon('edit')}
            </button>
            <button onclick="confirmDeleteSlot('${slot.id}')" class="p-1 text-slate-400 hover:text-red-400 rounded" title="Delete">
              ${window.getIcon('trash')}
            </button>
          </div>
        ` : ''}
      </div>

      <h4 class="font-semibold text-xs md:text-sm text-slate-100 line-clamp-1 mb-1">${slot.title}</h4>

      <div class="flex flex-col gap-1 text-[11px] text-slate-400 mt-2">
        <div class="flex items-center gap-1.5">
          ${window.getIcon('clock', 'w-3 h-3 text-slate-400')}
          <span class="font-mono text-slate-300 font-medium">${slot.startTime} - ${slot.endTime}</span>
        </div>
        ${slot.room ? `
          <div class="flex items-center gap-1.5 text-slate-400">
            ${window.getIcon('mapPin', 'w-3 h-3 text-slate-500')}
            <span class="truncate">${slot.room}</span>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

function renderSingleDaySlotItem(slot) {
  const isHost = window.store.isHost();
  const typeBadgeClass = `badge-${slot.type.toLowerCase()}`;
  const state = window.store.getState();
  const subject = state.subjects.find(s => s.id === slot.subjectId);

  return `
    <div class="flex items-start gap-4 p-4 rounded-xl bg-slate-800/60 border border-slate-700/70 hover:border-indigo-500/40 transition group" style="border-left: 5px solid ${slot.color || '#6366f1'};">
      <div class="min-w-[110px] text-left">
        <span class="font-mono font-bold text-sm text-indigo-300 block">${slot.startTime}</span>
        <span class="text-xs text-slate-400 font-mono">to ${slot.endTime}</span>
      </div>

      <div class="flex-1">
        <div class="flex items-center gap-2 mb-1">
          <span class="text-xs font-semibold uppercase px-2.5 py-0.5 rounded-full ${typeBadgeClass}">
            ${slot.type}
          </span>
          ${subject ? `<span class="text-xs font-mono text-slate-400">(${subject.code})</span>` : ''}
        </div>
        <h4 class="text-base font-semibold text-white">${slot.title}</h4>
        <div class="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2">
          ${slot.room ? `
            <span class="flex items-center gap-1.5">
              ${window.getIcon('mapPin', 'w-3.5 h-3.5 text-slate-400')}
              ${slot.room}
            </span>
          ` : ''}
          ${subject && subject.faculty ? `
            <span class="flex items-center gap-1.5">
              ${window.getIcon('user', 'w-3.5 h-3.5 text-slate-400')}
              ${subject.faculty}
            </span>
          ` : ''}
        </div>
      </div>

      ${isHost ? `
        <div class="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition">
          <button onclick="openEditSlotModal('${slot.id}')" class="p-2 bg-slate-700/60 hover:bg-indigo-600 text-slate-300 hover:text-white rounded-lg transition" title="Edit">
            ${window.getIcon('edit')}
          </button>
          <button onclick="confirmDeleteSlot('${slot.id}')" class="p-2 bg-slate-700/60 hover:bg-red-600 text-slate-300 hover:text-white rounded-lg transition" title="Delete">
            ${window.getIcon('trash')}
          </button>
        </div>
      ` : ''}
    </div>
  `;
}

// Live alert widget for the current class / upcoming class
function renderLiveClassAlert() {
  const container = document.getElementById('live-class-alert');
  if (!container) return;

  const state = window.store.getState();
  const slots = state.timetableSlots || [];

  const now = new Date();
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const currentDayName = days[now.getDay()];

  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const toMinutes = (timeStr) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  const todaySlots = slots
    .filter(s => s.day.toLowerCase() === currentDayName.toLowerCase())
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  let currentSlot = null;
  let upcomingSlot = null;

  for (const slot of todaySlots) {
    const start = toMinutes(slot.startTime);
    const end = toMinutes(slot.endTime);
    if (currentMinutes >= start && currentMinutes < end) {
      currentSlot = slot;
      break;
    } else if (start > currentMinutes && !upcomingSlot) {
      upcomingSlot = slot;
    }
  }

  if (currentSlot) {
    const endMin = toMinutes(currentSlot.endTime);
    const minsLeft = endMin - currentMinutes;
    container.innerHTML = `
      <div class="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-indigo-950/70 border border-emerald-500/40 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-3.5">
          <div class="w-3.5 h-3.5 rounded-full bg-emerald-500 live-pulse"></div>
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold uppercase tracking-wider text-emerald-400">Class in Session Now</span>
              <span class="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">${minsLeft} mins left</span>
            </div>
            <h3 class="text-lg font-bold text-white mt-0.5">${currentSlot.title}</h3>
            <p class="text-xs text-slate-300 flex items-center gap-3 mt-1">
              <span>${window.getIcon('clock', 'w-3 h-3 inline mr-1')} ${currentSlot.startTime} - ${currentSlot.endTime}</span>
              ${currentSlot.room ? `<span>${window.getIcon('mapPin', 'w-3 h-3 inline mr-1')} ${currentSlot.room}</span>` : ''}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          ${currentSlot.subjectId ? `
            <button onclick="quickAttendanceAction('${currentSlot.subjectId}', 'present')" class="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow transition flex items-center gap-1.5">
              ${window.getIcon('check')} Mark Present
            </button>
          ` : ''}
        </div>
      </div>
    `;
  } else if (upcomingSlot) {
    const startMin = toMinutes(upcomingSlot.startTime);
    const minsTill = startMin - currentMinutes;
    const hours = Math.floor(minsTill / 60);
    const mins = minsTill % 60;
    const timeFormatted = hours > 0 ? `${hours}h ${mins}m` : `${mins} mins`;

    container.innerHTML = `
      <div class="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/30 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-3.5">
          <div class="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            ${window.getIcon('clock')}
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-semibold uppercase tracking-wider text-indigo-400">Next Lecture Today</span>
              <span class="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">Starts in ${timeFormatted}</span>
            </div>
            <h3 class="text-base font-bold text-white mt-0.5">${upcomingSlot.title}</h3>
            <p class="text-xs text-slate-400 flex items-center gap-3 mt-0.5">
              <span>${upcomingSlot.startTime} - ${upcomingSlot.endTime}</span>
              ${upcomingSlot.room ? `<span>• ${upcomingSlot.room}</span>` : ''}
            </p>
          </div>
        </div>
        <button onclick="setDayFilter('${upcomingSlot.day}')" class="text-xs px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition">
          View Details
        </button>
      </div>
    `;
  } else {
    container.innerHTML = `
      <div class="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50 flex items-center justify-between text-xs text-slate-400">
        <div class="flex items-center gap-2">
          ${window.getIcon('checkCircle', 'w-4 h-4 text-emerald-400')}
          <span>No more classes scheduled for today. Have a productive study session or unwind!</span>
        </div>
        <span class="font-mono text-slate-400">${currentDayName}</span>
      </div>
    `;
  }
}

function quickAttendanceAction(subjectId, status) {
  window.store.markAttendance(subjectId, status);
  window.showToast("Attendance marked!", "success");
  renderLiveClassAlert();
}

function setDayFilter(day) {
  currentDayFilter = day;
  renderTimetable();
}

function setTypeFilter(type) {
  currentTypeFilter = type;
  renderTimetable();
}

// Modal Handlers
function openAddSlotModal(prefillDay = "Monday") {
  const state = window.store.getState();
  const subjects = state.subjects || [];

  const modalHtml = `
    <div id="slot-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay">
      <div class="glass-card bg-slate-900 border border-slate-700 w-full max-w-lg p-6 rounded-2xl shadow-2xl relative animate-scale-up">
        <button onclick="closeModal('slot-modal')" class="absolute top-5 right-5 text-slate-400 hover:text-white">
          ${window.getIcon('x')}
        </button>
        <h3 class="text-xl font-bold text-white mb-1 flex items-center gap-2">
          ${window.getIcon('calendar', 'text-indigo-400')}
          Add Timetable Slot
        </h3>
        <p class="text-xs text-slate-400 mb-5">Schedule a lecture, lab, tutorial, or club session</p>

        <form id="slot-form" onsubmit="handleSaveSlot(event)" class="space-y-4">
          <input type="hidden" id="slot-id" value="">

          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Slot Title / Course Name *</label>
            <input type="text" id="slot-title" required placeholder="e.g. Operating Systems Lecture" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none">
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Day of Week *</label>
              <select id="slot-day" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none">
                ${daysOfWeek.map(d => `<option value="${d}" ${d.toLowerCase() === prefillDay.toLowerCase() ? 'selected' : ''}>${d}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Slot Category *</label>
              <select id="slot-type" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none">
                <option value="Lecture">Lecture</option>
                <option value="Lab">Lab Practical</option>
                <option value="Tutorial">Tutorial / Problem Solving</option>
                <option value="Club">Club Meeting / Activity</option>
                <option value="Study">Self Study / Gym / Review</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Start Time *</label>
              <input type="time" id="slot-start" required value="09:00" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none">
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">End Time *</label>
              <input type="time" id="slot-end" required value="10:15" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none">
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Link Subject (Optional)</label>
              <select id="slot-subject" onchange="autoFillSubjectColor(this.value)" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none">
                <option value="">-- Standalone Slot / Club --</option>
                ${subjects.map(s => `<option value="${s.id}" data-color="${s.color}" data-name="${s.name}" data-room="${s.room}">${s.code}: ${s.name}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Room / Venue</label>
              <input type="text" id="slot-room" placeholder="e.g. LH-302 / Lab 4" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none">
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Color Tag</label>
            <div class="flex items-center gap-2">
              <input type="color" id="slot-color" value="#4f46e5" class="h-9 w-14 rounded cursor-pointer bg-transparent border-0">
              <span class="text-xs text-slate-400">Choose accent indicator for this block</span>
            </div>
          </div>

          <!-- Conflict Warning Banner -->
          <div id="conflict-warning" class="hidden p-3 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs flex items-center gap-2">
            ${window.getIcon('alert', 'w-4 h-4 text-amber-400 flex-shrink-0')}
            <span id="conflict-text"></span>
          </div>

          <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button type="button" onclick="closeModal('slot-modal')" class="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition">
              Cancel
            </button>
            <button type="submit" class="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium shadow-lg shadow-indigo-600/30 transition">
              Save Slot
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function autoFillSubjectColor(subId) {
  if (!subId) return;
  const state = window.store.getState();
  const sub = state.subjects.find(s => s.id === subId);
  if (sub) {
    const titleInput = document.getElementById('slot-title');
    const roomInput = document.getElementById('slot-room');
    const colorInput = document.getElementById('slot-color');
    if (titleInput && !titleInput.value) titleInput.value = sub.name;
    if (roomInput && !roomInput.value && sub.room) roomInput.value = sub.room;
    if (colorInput && sub.color) colorInput.value = sub.color;
  }
}

function openEditSlotModal(slotId) {
  const state = window.store.getState();
  const slot = state.timetableSlots.find(s => s.id === slotId);
  if (!slot) return;

  openAddSlotModal(slot.day);

  setTimeout(() => {
    document.getElementById('slot-id').value = slot.id;
    document.getElementById('slot-title').value = slot.title;
    document.getElementById('slot-day').value = slot.day;
    document.getElementById('slot-type').value = slot.type;
    document.getElementById('slot-start').value = slot.startTime;
    document.getElementById('slot-end').value = slot.endTime;
    document.getElementById('slot-subject').value = slot.subjectId || '';
    document.getElementById('slot-room').value = slot.room || '';
    document.getElementById('slot-color').value = slot.color || '#4f46e5';
  }, 20);
}

function handleSaveSlot(e) {
  e.preventDefault();
  const id = document.getElementById('slot-id').value;
  const title = document.getElementById('slot-title').value.trim();
  const day = document.getElementById('slot-day').value;
  const type = document.getElementById('slot-type').value;
  const startTime = document.getElementById('slot-start').value;
  const endTime = document.getElementById('slot-end').value;
  const subjectId = document.getElementById('slot-subject').value || null;
  const room = document.getElementById('slot-room').value.trim();
  const color = document.getElementById('slot-color').value;

  if (startTime >= endTime) {
    alert("End time must be after Start time!");
    return;
  }

  // Conflict detection
  const conflicts = window.store.checkConflicts(day, startTime, endTime, id || null);
  if (conflicts.length > 0) {
    const confirmOverlap = confirm(`Conflict Warning: This overlaps with "${conflicts[0].title}" (${conflicts[0].startTime} - ${conflicts[0].endTime}). Do you still want to schedule it?`);
    if (!confirmOverlap) return;
  }

  const slotData = { title, day, type, startTime, endTime, subjectId, room, color };

  if (id) {
    window.store.updateTimetableSlot(id, slotData);
    window.showToast("Slot updated successfully!", "success");
  } else {
    window.store.addTimetableSlot(slotData);
    window.showToast("New slot added to timetable!", "success");
  }

  closeModal('slot-modal');
  renderTimetable();
  renderLiveClassAlert();
}

function confirmDeleteSlot(slotId) {
  if (confirm("Are you sure you want to delete this timetable slot?")) {
    window.store.deleteTimetableSlot(slotId);
    window.showToast("Slot deleted", "info");
    renderTimetable();
    renderLiveClassAlert();
  }
}

function closeModal(modalId) {
  const el = document.getElementById(modalId);
  if (el) el.remove();
}

window.initTimetable = initTimetable;
window.renderTimetable = renderTimetable;
window.renderLiveClassAlert = renderLiveClassAlert;
window.setDayFilter = setDayFilter;
window.setTypeFilter = setTypeFilter;
window.openAddSlotModal = openAddSlotModal;
window.openEditSlotModal = openEditSlotModal;
window.confirmDeleteSlot = confirmDeleteSlot;
window.handleSaveSlot = handleSaveSlot;
window.closeModal = closeModal;
window.quickAttendanceAction = quickAttendanceAction;
window.autoFillSubjectColor = autoFillSubjectColor;

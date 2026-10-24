// Clinical & Hospital Outpatient Department (OPD) Timetable Component
// Editable for Host only; Read-only for Students

let selectedOpdDay = "all";
let selectedOpdDept = "all";

function initOpd() {
  renderOpd();
}

function setOpdDayFilter(day) {
  selectedOpdDay = day;
  renderOpd();
}

function setOpdDeptFilter(dept) {
  selectedOpdDept = dept;
  renderOpd();
}

function renderOpd() {
  const container = document.getElementById('opd-content');
  if (!container) return;

  const isHost = window.store.isHost();
  const state = window.store.getState();
  const opdSchedule = state.opdSchedule || [];

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  // Filter sessions
  const filtered = opdSchedule.filter(item => {
    const matchDay = selectedOpdDay === "all" || item.day.toLowerCase() === selectedOpdDay.toLowerCase();
    const matchDept = selectedOpdDept === "all" || item.department.toLowerCase().includes(selectedOpdDept.toLowerCase());
    return matchDay && matchDept;
  });

  // Extract unique departments for filter dropdown
  const allDepts = Array.from(new Set(opdSchedule.map(s => s.department)));

  let html = `
    <!-- Top Action Bar -->
    <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div>
        <div class="flex items-center gap-2">
          <h3 class="text-xl font-bold text-white flex items-center gap-2">
            <span class="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center text-sm font-bold">
              🏥
            </span>
            Clinical & Hospital OPD Timetable
          </h3>
          <span class="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full ${isHost ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-teal-500/20 text-teal-300 border border-teal-500/30'}">
            ${isHost ? 'Host / Admin Editable' : 'Student Posting Roster'}
          </span>
        </div>
        <p class="text-xs text-slate-400 mt-1">Outpatient clinics, consulting doctors, chamber numbers & posted student batches across all days</p>
      </div>

      <div class="flex items-center gap-2.5">
        ${isHost ? `
          <button onclick="openAddOpdModal()" class="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs md:text-sm rounded-xl shadow-lg shadow-teal-600/30 transition flex items-center gap-1.5">
            ${window.getIcon('plus')}
            <span>Schedule OPD Clinic</span>
          </button>
        ` : `
          <div class="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-400 text-xs flex items-center gap-1.5 font-mono">
            <span>🔒 Read-Only Clinical View</span>
          </div>
        `}
      </div>
    </div>

    <!-- Day & Specialty Filter Bar -->
    <div class="flex flex-wrap items-center justify-between gap-3 p-2 bg-slate-900/70 backdrop-blur rounded-2xl border border-slate-700/60 mb-6">
      <!-- Day Pills (Monday to Sunday) -->
      <div class="flex items-center gap-1 overflow-x-auto no-scrollbar">
        <button onclick="setOpdDayFilter('all')" class="px-3.5 py-1.5 text-xs md:text-sm font-medium rounded-xl transition ${selectedOpdDay === 'all' ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'}">
          All Days
        </button>
        ${daysOfWeek.map(d => `
          <button onclick="setOpdDayFilter('${d}')" class="px-3.5 py-1.5 text-xs md:text-sm font-medium rounded-xl transition ${selectedOpdDay.toLowerCase() === d.toLowerCase() ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'}">
            ${d.slice(0, 3)}
          </button>
        `).join('')}
      </div>

      <!-- Specialty Dropdown -->
      <div class="flex items-center gap-2">
        <span class="text-xs text-slate-400">Specialty:</span>
        <select onchange="setOpdDeptFilter(this.value)" class="bg-slate-800 text-xs text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1.5 outline-none focus:border-teal-500">
          <option value="all" ${selectedOpdDept === 'all' ? 'selected' : ''}>All Clinical Units (${allDepts.length})</option>
          ${allDepts.map(dept => `<option value="${dept}" ${selectedOpdDept === dept ? 'selected' : ''}>${dept}</option>`).join('')}
        </select>
      </div>
    </div>

    <!-- OPD Sessions Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      ${filtered.length === 0 ? `
        <div class="col-span-full py-16 text-center text-slate-400 glass-card p-8 rounded-2xl">
          <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
            🏥
          </div>
          <h4 class="text-base font-semibold text-white">No OPD Clinics Scheduled</h4>
          <p class="text-xs text-slate-400 mt-1 mb-4">No outpatient clinics match the selected day or specialty filter.</p>
          ${isHost ? `
            <button onclick="openAddOpdModal()" class="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold">
              + Schedule First OPD Clinic
            </button>
          ` : ''}
        </div>
      ` : filtered.map(item => renderOpdCard(item, isHost)).join('')}
    </div>
  `;

  container.innerHTML = html;
}

function renderOpdCard(item, isHost) {
  return `
    <div class="glass-card rounded-2xl overflow-hidden border border-slate-700/80 hover:border-teal-500/40 transition flex flex-col justify-between shadow-lg" style="border-top: 4px solid ${item.color || '#14b8a6'};">
      <div class="p-5">
        <!-- Top Day & Shift Badge -->
        <div class="flex items-start justify-between gap-2 mb-2.5">
          <div class="flex items-center gap-2">
            <span class="text-xs font-mono font-bold uppercase px-2.5 py-0.5 rounded-lg bg-teal-950/60 text-teal-300 border border-teal-500/30">
              ${item.day}
            </span>
            <span class="text-[11px] text-slate-400 font-medium">
              ${item.shift || 'Morning Shift'}
            </span>
          </div>

          ${isHost ? `
            <div class="flex items-center gap-1">
              <button onclick="openEditOpdModal('${item.id}')" class="p-1 text-slate-400 hover:text-white rounded" title="Edit OPD Session">
                ${window.getIcon('edit', 'w-3.5 h-3.5')}
              </button>
              <button onclick="confirmDeleteOpd('${item.id}')" class="p-1 text-slate-400 hover:text-red-400 rounded" title="Delete Session">
                ${window.getIcon('trash', 'w-3.5 h-3.5')}
              </button>
            </div>
          ` : `
            <span class="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Active Rota
            </span>
          `}
        </div>

        <h4 class="text-base font-bold text-white mb-2 line-clamp-1">
          ${item.department}
        </h4>

        <!-- Details -->
        <div class="space-y-2 text-xs text-slate-300">
          <div class="flex items-center gap-2 text-slate-300">
            ${window.getIcon('mapPin', 'w-3.5 h-3.5 text-teal-400 flex-shrink-0')}
            <span class="font-medium text-white">${item.clinicRoom || 'OPD Block'}</span>
          </div>
          
          <div class="flex items-center gap-2 text-slate-300">
            ${window.getIcon('user', 'w-3.5 h-3.5 text-indigo-400 flex-shrink-0')}
            <span>Doctor: <strong class="text-slate-100">${item.doctor || 'Faculty Physician'}</strong></span>
          </div>

          <div class="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 mt-3">
            <div class="flex items-center justify-between text-[11px] mb-1">
              <span class="text-slate-400">Clinical Posting:</span>
              <span class="text-teal-300 font-semibold font-mono">${item.batch || 'Batch A'}</span>
            </div>
            <div class="flex items-center justify-between text-[11px]">
              <span class="text-slate-400">Patient Intake:</span>
              <span class="text-slate-300 font-mono">${item.maxTokens || 40} Tokens Max</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Card Footer -->
      <div class="px-5 py-3 bg-slate-900/60 border-t border-slate-800 flex items-center justify-between text-[11px]">
        <span class="text-slate-400">Hospital Duty Posting</span>
        <span class="text-teal-400 font-semibold">Attendance Face-Scan Ready</span>
      </div>
    </div>
  `;
}

// Modal: Add / Edit OPD Session (Host Only)
function openAddOpdModal(prefillDay = null) {
  if (!window.store.isHost()) {
    window.showToast("Permission Denied: OPD Schedule is editable by Host only.", "warning");
    return;
  }

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const day = prefillDay || (selectedOpdDay !== 'all' ? selectedOpdDay : "Monday");

  const modalHtml = `
    <div id="opd-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay">
      <div class="glass-card bg-slate-900 border border-slate-700 w-full max-w-lg p-6 rounded-2xl shadow-2xl relative animate-scale-up">
        <button onclick="closeModal('opd-modal')" class="absolute top-5 right-5 text-slate-400 hover:text-white">
          ${window.getIcon('x')}
        </button>
        <h3 class="text-xl font-bold text-white mb-1 flex items-center gap-2">
          🏥 Schedule OPD Clinic Shift
        </h3>
        <p class="text-xs text-slate-400 mb-5">Create outpatient clinical rotation for doctors and student batches</p>

        <form onsubmit="handleSaveOpd(event)" class="space-y-4">
          <input type="hidden" id="opd-id" value="">

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Day of the Week *</label>
              <select id="opd-form-day" required class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-teal-500 focus:outline-none">
                ${daysOfWeek.map(d => `<option value="${d}" ${d.toLowerCase() === day.toLowerCase() ? 'selected' : ''}>${d}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Shift Timings *</label>
              <select id="opd-form-shift" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-teal-500 focus:outline-none">
                <option value="Morning (08:30 AM - 01:00 PM)">Morning (08:30 AM - 01:00 PM)</option>
                <option value="Afternoon (02:00 PM - 05:00 PM)">Afternoon (02:00 PM - 05:00 PM)</option>
                <option value="Evening (04:00 PM - 07:00 PM)">Evening (04:00 PM - 07:00 PM)</option>
                <option value="Emergency Walk-In (24/7 Shift)">Emergency Walk-In (24/7 Shift)</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Department / Specialty *</label>
            <input type="text" id="opd-form-dept" required placeholder="e.g. General Medicine, Pediatrics, Orthopedics" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-white text-sm focus:border-teal-500 focus:outline-none">
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Clinic Room / Chamber *</label>
              <input type="text" id="opd-form-room" required placeholder="e.g. OPD Room 101 (Block C)" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-white text-sm focus:border-teal-500 focus:outline-none">
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Consultant Incharge *</label>
              <input type="text" id="opd-form-doctor" required placeholder="e.g. Dr. Aris Thorne, MD" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-white text-sm focus:border-teal-500 focus:outline-none">
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Posted Student Batch *</label>
              <input type="text" id="opd-form-batch" required placeholder="e.g. Clinical Batch A (8 Students)" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-white text-sm focus:border-teal-500 focus:outline-none">
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Patient Capacity / Tokens</label>
              <input type="number" id="opd-form-tokens" value="45" min="10" max="150" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-white text-sm focus:border-teal-500 focus:outline-none">
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button type="button" onclick="closeModal('opd-modal')" class="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition">
              Cancel
            </button>
            <button type="submit" class="px-5 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-sm font-medium shadow-lg shadow-teal-600/30 transition">
              Save OPD Shift
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function openEditOpdModal(id) {
  if (!window.store.isHost()) {
    window.showToast("Permission Denied: OPD Schedule is editable by Host only.", "warning");
    return;
  }

  const state = window.store.getState();
  const session = (state.opdSchedule || []).find(o => o.id === id);
  if (!session) return;

  openAddOpdModal(session.day);

  setTimeout(() => {
    const idEl = document.getElementById('opd-id');
    const dayEl = document.getElementById('opd-form-day');
    const shiftEl = document.getElementById('opd-form-shift');
    const deptEl = document.getElementById('opd-form-dept');
    const roomEl = document.getElementById('opd-form-room');
    const docEl = document.getElementById('opd-form-doctor');
    const batchEl = document.getElementById('opd-form-batch');
    const tokensEl = document.getElementById('opd-form-tokens');

    if (idEl) idEl.value = session.id;
    if (dayEl) dayEl.value = session.day;
    if (shiftEl) shiftEl.value = session.shift;
    if (deptEl) deptEl.value = session.department;
    if (roomEl) roomEl.value = session.clinicRoom;
    if (docEl) docEl.value = session.doctor;
    if (batchEl) batchEl.value = session.batch;
    if (tokensEl) tokensEl.value = session.maxTokens || 40;
  }, 30);
}

function handleSaveOpd(e) {
  e.preventDefault();
  if (!window.store.isHost()) {
    window.showToast("Permission Denied: Only Host can save OPD sessions.", "warning");
    return;
  }

  const id = document.getElementById('opd-id').value;
  const day = document.getElementById('opd-form-day').value;
  const shift = document.getElementById('opd-form-shift').value;
  const department = document.getElementById('opd-form-dept').value.trim();
  const clinicRoom = document.getElementById('opd-form-room').value.trim();
  const doctor = document.getElementById('opd-form-doctor').value.trim();
  const batch = document.getElementById('opd-form-batch').value.trim();
  const maxTokens = Number(document.getElementById('opd-form-tokens').value) || 45;

  const sessionData = { day, shift, department, clinicRoom, doctor, batch, maxTokens };

  if (id) {
    window.store.updateOpdSession(id, sessionData);
    window.showToast("OPD shift updated!", "success");
  } else {
    window.store.addOpdSession(sessionData);
    window.showToast("New OPD shift scheduled!", "success");
  }

  closeModal('opd-modal');
  renderOpd();
}

function confirmDeleteOpd(id) {
  if (!window.store.isHost()) {
    window.showToast("Permission Denied: Only Host can delete OPD sessions.", "warning");
    return;
  }

  if (confirm("Remove this OPD shift from the clinical timetable?")) {
    window.store.deleteOpdSession(id);
    window.showToast("OPD shift removed", "info");
    renderOpd();
  }
}

// Global exports
window.initOpd = initOpd;
window.renderOpd = renderOpd;
window.setOpdDayFilter = setOpdDayFilter;
window.setOpdDeptFilter = setOpdDeptFilter;
window.openAddOpdModal = openAddOpdModal;
window.openEditOpdModal = openEditOpdModal;
window.handleSaveOpd = handleSaveOpd;
window.confirmDeleteOpd = confirmDeleteOpd;

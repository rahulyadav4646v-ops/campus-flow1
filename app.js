// Main Application Controller & Navigation

let activeTab = 'timetable';

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  applyTheme();
  renderStudentHeader();
  renderRoleBadge();
  setupTabListeners();
  setupGlobalSearch();

  // Initialize active tab
  switchTab(activeTab);

  // Subscribe store changes to re-render header info
  window.store.subscribe((state) => {
    renderStudentHeader();
    renderRoleBadge();
  });
}

function renderRoleBadge() {
  const isHost = window.store.isHost();
  const hostBtn = document.getElementById('role-host-btn');
  const studentBtn = document.getElementById('role-student-btn');

  if (hostBtn && studentBtn) {
    if (isHost) {
      hostBtn.className = 'flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition bg-indigo-600 text-white shadow-sm';
      studentBtn.className = 'flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition text-slate-400 hover:text-white';
    } else {
      hostBtn.className = 'flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition text-slate-400 hover:text-white';
      studentBtn.className = 'flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition bg-emerald-600 text-white shadow-sm';
    }
  }

  // Department Clash Radar tab is reserved strictly for Host Mode
  const deptNavBtn = document.getElementById('nav-tab-departments');
  const deptMobileNavBtn = document.getElementById('mobile-nav-tab-departments');

  if (deptNavBtn) {
    if (isHost) {
      deptNavBtn.style.display = 'inline-flex';
    } else {
      deptNavBtn.style.display = 'none';
    }
  }

  if (deptMobileNavBtn) {
    if (isHost) {
      deptMobileNavBtn.style.display = 'flex';
    } else {
      deptMobileNavBtn.style.display = 'none';
    }
  }

  // If in student mode and current tab is departments, redirect to timetable
  if (!isHost && activeTab === 'departments') {
    switchTab('timetable');
  }
}

function toggleUserRole(role) {
  window.store.setRole(role);
  renderRoleBadge();
  if (role === 'host') {
    window.showToast("Switched to Host Profile: You now have full editing permissions & Department Clash Radar.", "success");
  } else {
    window.showToast("Switched to Student Profile: Read-only views active (Department Clash Radar hidden).", "info");
  }
  // Re-render current active tab to immediately reflect permissions
  switchTab(activeTab);
}

function switchTab(tabId) {
  // Guard: Department Clash Radar is reserved for Host Mode
  if (tabId === 'departments' && !window.store.isHost()) {
    window.showToast("Department Clash Radar is an administrative module reserved for Host Mode.", "warning");
    tabId = 'timetable';
  }

  activeTab = tabId;

  // Update navigation buttons styling
  document.querySelectorAll('.nav-tab').forEach(btn => {
    const isCurrent = btn.getAttribute('data-tab') === tabId;
    btn.classList.toggle('active', isCurrent);
    if (isCurrent) {
      btn.classList.add('bg-indigo-600/20', 'text-indigo-400');
      btn.classList.remove('text-slate-400');
    } else {
      btn.classList.remove('bg-indigo-600/20', 'text-indigo-400');
      btn.classList.add('text-slate-400');
    }
  });

  // Hide all tab contents
  const sections = ['timetable-section', 'departments-section', 'rooms-section', 'biometrics-section', 'subjects-section', 'clubs-section', 'opd-section', 'weekend-section'];
  sections.forEach(sec => {
    const el = document.getElementById(sec);
    if (el) el.classList.add('hidden');
  });

  // Show active tab
  const activeEl = document.getElementById(`${tabId}-section`);
  if (activeEl) {
    activeEl.classList.remove('hidden');
  }

  // Trigger component render
  if (tabId === 'timetable') {
    if (window.initTimetable) window.initTimetable();
  } else if (tabId === 'departments') {
    if (window.initDepartments) window.initDepartments();
  } else if (tabId === 'rooms') {
    if (window.initRooms) window.initRooms();
  } else if (tabId === 'biometrics') {
    if (window.initBiometrics) window.initBiometrics();
  } else if (tabId === 'subjects') {
    if (window.initSubjects) window.initSubjects();
  } else if (tabId === 'clubs') {
    if (window.initClubs) window.initClubs();
  } else if (tabId === 'opd') {
    if (window.initOpd) window.initOpd();
  } else if (tabId === 'weekend') {
    if (window.initWeekend) window.initWeekend();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setupTabListeners() {
  document.querySelectorAll('.nav-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab');
      if (tab) switchTab(tab);
    });
  });

  // Mobile menu tab buttons
  document.querySelectorAll('.mobile-nav-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab');
      if (tab) {
        switchTab(tab);
        const mobileDrawer = document.getElementById('mobile-drawer');
        if (mobileDrawer) mobileDrawer.classList.add('hidden');
      }
    });
  });
}

function renderStudentHeader() {
  const state = window.store.getState();
  const student = state.student || {};

  const nameEl = document.getElementById('student-name-display');
  const detailsEl = document.getElementById('student-details-display');

  if (nameEl) nameEl.textContent = student.name || 'College Student';
  if (detailsEl) {
    detailsEl.textContent = `${student.branch || 'Engineering'} • ${student.semester || 'Semester 5'} • ${student.rollNo || ''}`;
  }
}

// Global Search
function setupGlobalSearch() {
  const searchInput = document.getElementById('global-search');
  const resultsDropdown = document.getElementById('search-results-dropdown');

  if (!searchInput || !resultsDropdown) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();
    if (!query) {
      resultsDropdown.classList.add('hidden');
      return;
    }

    const state = window.store.getState();
    const results = [];

    // Search Subjects
    (state.subjects || []).forEach(s => {
      if (s.name.toLowerCase().includes(query) || s.code.toLowerCase().includes(query) || (s.faculty && s.faculty.toLowerCase().includes(query))) {
        results.push({ type: 'Subject', title: `${s.code} - ${s.name}`, subtitle: `Faculty: ${s.faculty || 'N/A'} • Attendance: ${s.attended}/${s.total}`, tab: 'subjects' });
      }
    });

    // Search Department Classes
    (state.departmentClasses || []).forEach(dc => {
      if (dc.subjectName.toLowerCase().includes(query) || (dc.subjectCode && dc.subjectCode.toLowerCase().includes(query)) || (dc.room && dc.room.toLowerCase().includes(query)) || (dc.faculty && dc.faculty.toLowerCase().includes(query))) {
        results.push({ type: 'Dept Class', title: `${dc.subjectCode ? dc.subjectCode + ': ' : ''}${dc.subjectName}`, subtitle: `${dc.day} @ ${dc.startTime}-${dc.endTime} (${dc.room || 'No Room'})`, tab: 'departments' });
      }
    });

    // Search Timetable Slots
    (state.timetableSlots || []).forEach(s => {
      if (s.title.toLowerCase().includes(query) || s.day.toLowerCase().includes(query) || (s.room && s.room.toLowerCase().includes(query))) {
        results.push({ type: 'Class Slot', title: s.title, subtitle: `${s.day} @ ${s.startTime} - ${s.endTime} (${s.room || 'No venue'})`, tab: 'timetable' });
      }
    });

    // Search Clubs
    (state.clubs || []).forEach(c => {
      if (c.name.toLowerCase().includes(query) || c.category.toLowerCase().includes(query)) {
        results.push({ type: 'Club', title: c.name, subtitle: `${c.category} • ${c.meetingSchedule || 'Campus society'}`, tab: 'clubs' });
      }
    });

    // Search Weekend suggestions
    (state.weekend.suggestions || []).forEach(w => {
      if (w.title.toLowerCase().includes(query) || (w.tags && w.tags.some(t => t.toLowerCase().includes(query)))) {
        results.push({ type: 'Weekend Plan', title: w.title, subtitle: `${w.duration} • ${w.vibe}`, tab: 'weekend' });
      }
    });

    // Search Campus Rooms
    (state.rooms || []).forEach(r => {
      if (r.name.toLowerCase().includes(query) || r.id.toLowerCase().includes(query) || r.building.toLowerCase().includes(query)) {
        results.push({ type: 'Campus Room', title: `${r.id} - ${r.name}`, subtitle: `${r.building} • Cap: ${r.capacity} seats`, tab: 'rooms' });
      }
    });

    // Search Teachers & Free Periods
    (state.teachers || []).forEach(t => {
      if (t.name.toLowerCase().includes(query) || t.dept.toLowerCase().includes(query) || (t.cabin && t.cabin.toLowerCase().includes(query))) {
        results.push({ type: 'Faculty Free Time', title: `${t.name} (${t.title})`, subtitle: `${t.cabin} • ${t.email}`, tab: 'rooms' });
      }
    });

    // Search OPD Clinical Rotations
    (state.opdSchedule || []).forEach(o => {
      if (o.department.toLowerCase().includes(query) || o.doctor.toLowerCase().includes(query) || o.day.toLowerCase().includes(query) || (o.clinicRoom && o.clinicRoom.toLowerCase().includes(query))) {
        results.push({ type: 'OPD Clinic', title: `${o.department} (${o.day})`, subtitle: `${o.shift} • ${o.clinicRoom} • ${o.doctor}`, tab: 'opd' });
      }
    });

    if (results.length === 0) {
      resultsDropdown.innerHTML = `<div class="p-4 text-xs text-slate-400 text-center">No matching courses, slots, clubs, or weekend plans found for "${query}"</div>`;
    } else {
      resultsDropdown.innerHTML = results.slice(0, 7).map(item => `
        <div onclick="handleSearchResultClick('${item.tab}')" class="p-3 border-b border-slate-800 hover:bg-slate-800/80 cursor-pointer transition flex items-center justify-between text-xs">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">${item.type}</span>
              <strong class="text-white">${item.title}</strong>
            </div>
            <p class="text-slate-400 text-[11px] mt-1">${item.subtitle}</p>
          </div>
          <span class="text-indigo-400 text-[11px] ml-2 font-medium">Go &rarr;</span>
        </div>
      `).join('');
    }

    resultsDropdown.classList.remove('hidden');
  });

  // Close dropdown on outside click
  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !resultsDropdown.contains(e.target)) {
      resultsDropdown.classList.add('hidden');
    }
  });

  // Keyboard shortcut Ctrl + K
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      searchInput.focus();
    }
  });
}

function handleSearchResultClick(tab) {
  const resultsDropdown = document.getElementById('search-results-dropdown');
  const searchInput = document.getElementById('global-search');
  if (resultsDropdown) resultsDropdown.classList.add('hidden');
  if (searchInput) searchInput.value = '';
  switchTab(tab);
}

// Toast Notifications
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const iconName = type === 'success' ? 'checkCircle' : (type === 'error' ? 'alert' : 'sparkles');
  toast.innerHTML = `
    <span>${window.getIcon(iconName)}</span>
    <span class="flex-1">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Dark / Light Theme Toggle
function toggleTheme() {
  const isLight = document.body.classList.toggle('light-theme');
  const state = window.store.getState();
  state.settings.theme = isLight ? 'light' : 'dark';
  window.store.save();
  updateThemeIcon();
}

function applyTheme() {
  const state = window.store.getState();
  const theme = state.settings.theme || 'dark';
  if (theme === 'light') {
    document.body.classList.add('light-theme');
  } else {
    document.body.classList.remove('light-theme');
  }
  updateThemeIcon();
}

function updateThemeIcon() {
  const btn = document.getElementById('theme-toggle-btn');
  if (btn) {
    const isLight = document.body.classList.contains('light-theme');
    btn.innerHTML = isLight ? window.getIcon('moon') : window.getIcon('sun');
  }
}

// Student Profile Edit Modal
function openProfileModal() {
  const state = window.store.getState();
  const s = state.student || {};

  const modalHtml = `
    <div id="profile-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay">
      <div class="glass-card bg-slate-900 border border-slate-700 w-full max-w-md p-6 rounded-2xl shadow-2xl relative">
        <button onclick="closeModal('profile-modal')" class="absolute top-5 right-5 text-slate-400 hover:text-white">
          ${window.getIcon('x')}
        </button>
        <h3 class="text-xl font-bold text-white mb-1 flex items-center gap-2">
          ${window.getIcon('user', 'text-indigo-400')}
          Student Profile Settings
        </h3>
        <p class="text-xs text-slate-400 mb-5">Customize your college credentials and attendance target</p>

        <form onsubmit="handleSaveProfile(event)" class="space-y-4">
          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Your Full Name</label>
            <input type="text" id="prof-name" required value="${s.name || ''}" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none">
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Roll / Student ID</label>
              <input type="text" id="prof-roll" value="${s.rollNo || ''}" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none">
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Min Attendance Target %</label>
              <input type="number" id="prof-target" min="50" max="100" value="${state.settings.minAttendanceGoal || 75}" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none font-mono">
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Degree & Major / Branch</label>
            <input type="text" id="prof-branch" value="${s.branch || ''}" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none">
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Current Semester / Academic Term</label>
            <input type="text" id="prof-sem" value="${s.semester || ''}" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none">
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">College / University Name</label>
            <input type="text" id="prof-college" value="${s.college || ''}" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none">
          </div>

          <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button type="button" onclick="closeModal('profile-modal')" class="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-sm">
              Cancel
            </button>
            <button type="submit" class="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow transition">
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function handleSaveProfile(e) {
  e.preventDefault();
  const name = document.getElementById('prof-name').value.trim();
  const rollNo = document.getElementById('prof-roll').value.trim();
  const branch = document.getElementById('prof-branch').value.trim();
  const semester = document.getElementById('prof-sem').value.trim();
  const college = document.getElementById('prof-college').value.trim();
  const minGoal = Number(document.getElementById('prof-target').value);

  const state = window.store.getState();
  state.student = { name, rollNo, branch, semester, college };
  state.settings.minAttendanceGoal = minGoal;
  window.store.save();

  window.showToast("Student profile updated!", "success");
  closeModal('profile-modal');
  renderStudentHeader();
  if (activeTab === 'subjects') window.renderSubjects();
}

function resetAllDataConfirm() {
  if (confirm("Reset everything back to demo college schedule? All personal changes will be replaced with default template data.")) {
    window.store.resetToDefault();
    window.showToast("Reset to default college schedule!", "info");
    initApp();
  }
}

function handleImportJSON(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const success = window.store.importData(e.target.result);
      if (success) {
        window.showToast("Schedule imported successfully!", "success");
        initApp();
      }
    } catch (err) {
      alert("Failed to parse file: " + err.message);
    }
  };
  reader.readAsText(file);
}

// Expose globals
window.switchTab = switchTab;
window.showToast = showToast;
window.toggleTheme = toggleTheme;
window.toggleUserRole = toggleUserRole;
window.renderRoleBadge = renderRoleBadge;
window.openProfileModal = openProfileModal;
window.handleSaveProfile = handleSaveProfile;
window.resetAllDataConfirm = resetAllDataConfirm;
window.handleImportJSON = handleImportJSON;
window.handleSearchResultClick = handleSearchResultClick;

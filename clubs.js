// Clubs & Campus Organizations Management Component

let currentClubTab = 'joined'; // 'joined' or 'discover'

function initClubs() {
  renderClubs();
}

function setClubTab(tab) {
  currentClubTab = tab;
  renderClubs();
}

function renderClubs() {
  const container = document.getElementById('clubs-content');
  if (!container) return;

  const state = window.store.getState();
  const clubs = state.clubs || [];

  const joinedClubs = clubs.filter(c => c.isMember);
  const discoverClubs = clubs.filter(c => !c.isMember);

  let html = `
    <!-- Clubs Header & Tabs -->
    <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div>
        <h3 class="text-xl font-bold text-white flex items-center gap-2">
          ${window.getIcon('users', 'text-indigo-400')}
          Student Clubs & Societies
        </h3>
        <p class="text-xs text-slate-400">Manage club roles, meeting sync, tasks & campus events</p>
      </div>

      <div class="flex items-center gap-3">
        <div class="flex items-center gap-1 p-1 bg-slate-900/60 rounded-xl border border-slate-700/50">
          <button onclick="setClubTab('joined')" class="px-4 py-1.5 text-xs md:text-sm font-medium rounded-lg transition ${currentClubTab === 'joined' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}">
            My Clubs (${joinedClubs.length})
          </button>
          <button onclick="setClubTab('discover')" class="px-4 py-1.5 text-xs md:text-sm font-medium rounded-lg transition ${currentClubTab === 'discover' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}">
            Discover Campus Clubs (${discoverClubs.length})
          </button>
        </div>

        ${window.store.isHost() ? `
          <button onclick="openAddClubModal()" class="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs md:text-sm rounded-lg shadow-lg shadow-indigo-600/30 transition flex items-center gap-1.5">
            ${window.getIcon('plus')} New Club
          </button>
        ` : `
          <div class="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-400 text-xs font-mono">
            Student Member View
          </div>
        `}
      </div>
    </div>
  `;

  if (currentClubTab === 'joined') {
    if (joinedClubs.length === 0) {
      html += `
        <div class="text-center py-16 text-slate-400 glass-card p-8 rounded-2xl">
          <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
            ${window.getIcon('users')}
          </div>
          <h4 class="text-base font-semibold text-white">No joined clubs yet!</h4>
          <p class="text-xs text-slate-400 mt-1 mb-4">Explore campus societies and join tech chapters, cultural teams, or sports guilds.</p>
          <button onclick="setClubTab('discover')" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition">
            Explore Directory
          </button>
        </div>
      `;
    } else {
      html += `
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          ${joinedClubs.map(club => renderJoinedClubCard(club)).join('')}
        </div>
      `;
    }
  } else {
    // Discover Clubs tab
    html += `
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        ${discoverClubs.map(club => renderDiscoverClubCard(club)).join('')}
      </div>
    `;
  }

  container.innerHTML = html;
}

function renderJoinedClubCard(club) {
  const pendingTasks = (club.tasks || []).filter(t => !t.done);

  return `
    <div class="glass-card rounded-2xl overflow-hidden border border-slate-700/70 hover:border-indigo-500/40 transition flex flex-col justify-between">
      <!-- Card Banner -->
      <div class="bg-gradient-to-r ${club.bannerColor || 'from-indigo-600 to-purple-600'} p-5 text-white">
        <div class="flex items-center justify-between mb-2">
          <span class="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-black/30 backdrop-blur">
            ${club.category}
          </span>
          <span class="text-xs font-medium px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur">
            Role: ${club.role || 'Member'}
          </span>
        </div>
        <h4 class="text-xl font-bold">${club.name}</h4>
        <p class="text-xs text-white/80 line-clamp-1 mt-1">${club.description}</p>
      </div>

      <!-- Card Body -->
      <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
        <!-- Meeting Info Box -->
        <div class="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between">
          <div>
            <div class="flex items-center gap-1.5 text-xs text-indigo-400 font-semibold mb-0.5">
              ${window.getIcon('clock', 'w-3.5 h-3.5')}
              <span>Meeting: ${club.meetingSchedule || 'TBA'}</span>
            </div>
            <div class="flex items-center gap-1.5 text-xs text-slate-400">
              ${window.getIcon('mapPin', 'w-3.5 h-3.5 text-slate-500')}
              <span>${club.venue || 'Campus Quad'}</span>
            </div>
          </div>
          <button onclick="syncClubMeetingToTimetable('${club.id}')" class="px-2.5 py-1.5 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white rounded-lg border border-indigo-500/30 text-xs font-medium transition flex items-center gap-1" title="Add meeting to your timetable">
            ${window.getIcon('calendar', 'w-3.5 h-3.5')}
            <span class="hidden sm:inline">Pin to Timetable</span>
          </button>
        </div>

        <!-- Club Tasks Checklist -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              ${window.getIcon('checkCircle', 'w-3.5 h-3.5 text-emerald-400')}
              My Club Tasks & Action Items (${pendingTasks.length} pending)
            </span>
            <button onclick="promptAddClubTask('${club.id}')" class="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
              ${window.getIcon('plus', 'w-3 h-3')} Add Task
            </button>
          </div>

          <div class="space-y-1.5 max-h-40 overflow-y-auto pr-1">
            ${(club.tasks && club.tasks.length > 0) ? club.tasks.map(task => `
              <div class="flex items-center justify-between p-2 rounded-lg bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800 text-xs transition">
                <label class="flex items-center gap-2 cursor-pointer flex-1">
                  <input type="checkbox" onchange="toggleClubTask('${club.id}', '${task.id}')" ${task.done ? 'checked' : ''} class="rounded text-indigo-600 bg-slate-900 border-slate-700 focus:ring-0">
                  <span class="${task.done ? 'line-through text-slate-500' : 'text-slate-200'}">${task.title}</span>
                </label>
                <span class="text-[10px] text-slate-400 font-mono ml-2">${task.due}</span>
              </div>
            `).join('') : `
              <p class="text-xs text-slate-500 italic py-2">No active tasks assigned.</p>
            `}
          </div>
        </div>

        <!-- Upcoming Events / Flagship Dates -->
        ${(club.events && club.events.length > 0) ? `
          <div class="pt-3 border-t border-slate-800">
            <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">Upcoming Events</span>
            <div class="space-y-1.5">
              ${club.events.map(ev => `
                <div class="flex items-center justify-between p-2 rounded-lg bg-indigo-950/30 border border-indigo-500/20 text-xs">
                  <span class="font-medium text-indigo-200">${ev.title}</span>
                  <span class="font-mono text-slate-400 text-[11px]">${ev.date}</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Actions footer -->
        <div class="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
          <span class="text-slate-400">Lead / Incharge: <strong class="text-slate-300">${club.leads || 'Faculty Advisor'}</strong></span>
          <div class="flex items-center gap-2">
            ${window.store.isHost() ? `
              <button onclick="openManageClubMembersModal('${club.id}')" class="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow transition flex items-center gap-1.5" title="Manage student enrollments for this club">
                ${window.getIcon('users', 'w-3 h-3')} Members (${(club.memberStudentIds || []).length})
              </button>
              <button onclick="openEditClubModal('${club.id}')" class="p-1.5 text-slate-400 hover:text-white rounded bg-slate-800 hover:bg-indigo-600 transition" title="Edit Club Details">
                ${window.getIcon('edit', 'w-3.5 h-3.5')}
              </button>
              <button onclick="confirmDeleteClub('${club.id}')" class="p-1.5 text-slate-400 hover:text-red-400 rounded bg-slate-800 hover:bg-red-900/60 transition" title="Delete Club">
                ${window.getIcon('trash', 'w-3.5 h-3.5')}
              </button>
            ` : `
              <span class="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                Official Enrolled Member
              </span>
            `}
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderDiscoverClubCard(club) {
  const isHost = window.store.isHost();
  return `
    <div class="glass-card rounded-2xl overflow-hidden border border-slate-700/70 hover:border-indigo-500/40 transition flex flex-col justify-between p-5">
      <div>
        <div class="flex items-center justify-between mb-3">
          <span class="text-[11px] font-semibold uppercase px-2 py-0.5 rounded bg-indigo-600/20 text-indigo-300 border border-indigo-500/30">
            ${club.category}
          </span>
          ${isHost ? `
            <div class="flex items-center gap-1">
              <button onclick="openEditClubModal('${club.id}')" class="p-1 text-slate-400 hover:text-white transition" title="Edit Club">
                ${window.getIcon('edit', 'w-3 h-3')}
              </button>
              <button onclick="confirmDeleteClub('${club.id}')" class="p-1 text-slate-400 hover:text-red-400 transition" title="Delete Club">
                ${window.getIcon('trash', 'w-3 h-3')}
              </button>
            </div>
          ` : ''}
        </div>
        <h4 class="text-lg font-bold text-white mb-1.5">${club.name}</h4>
        <p class="text-xs text-slate-400 line-clamp-3 mb-4">${club.description}</p>
        <div class="text-xs text-slate-400 space-y-1">
          <p class="flex items-center gap-1.5">
            ${window.getIcon('mapPin', 'w-3 h-3 text-slate-500')}
            <span>${club.venue || 'Campus'}</span>
          </p>
          <p class="flex items-center gap-1.5">
            ${window.getIcon('user', 'w-3 h-3 text-slate-500')}
            <span>Lead / Incharge: ${club.leads || 'Student Council'}</span>
          </p>
        </div>
      </div>

      ${isHost ? `
        <div class="pt-4 border-t border-slate-800 mt-4 flex items-center justify-between">
          <button onclick="openManageClubMembersModal('${club.id}')" class="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow transition flex items-center justify-center gap-1.5">
            ${window.getIcon('users')} Manage Student Enrollments (${(club.memberStudentIds || []).length})
          </button>
        </div>
      ` : `
        <div class="pt-4 border-t border-slate-800 mt-4 flex items-center justify-between">
          <span class="text-xs text-slate-400 italic">Enrollment managed by Host</span>
          <span class="text-[11px] font-mono text-slate-500 bg-slate-800/60 px-2 py-0.5 rounded">Host Managed</span>
        </div>
      `}
    </div>
  `;
}

function toggleClubMembership(clubId) {
  if (!window.store.isHost()) {
    window.showToast("Enrollment Policy: Students cannot add or leave clubs directly. Club membership is managed exclusively by the Host.", "warning");
    return;
  }
  window.store.toggleClubMembership(clubId);
  window.showToast("Club membership updated!", "success");
  renderClubs();
}

// Modal: Host Club Member Roster Manager
function openManageClubMembersModal(clubId) {
  const state = window.store.getState();
  const club = (state.clubs || []).find(c => c.id === clubId);
  if (!club) return;

  const studentsList = state.studentsList || [];
  const memberIds = club.memberStudentIds || [];

  const modalHtml = `
    <div id="club-members-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay">
      <div class="glass-card bg-slate-900 border border-slate-700 w-full max-w-2xl p-6 rounded-2xl shadow-2xl relative max-h-[90vh] flex flex-col animate-scale-up">
        
        <!-- Header -->
        <div class="flex items-start justify-between pb-4 border-b border-slate-800 mb-4">
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-lg font-bold text-white flex items-center gap-2">
                ${window.getIcon('users', 'text-indigo-400')}
                Club Member Roster & Enrollments
              </h3>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                Host Only
              </span>
            </div>
            <p class="text-xs text-slate-300 mt-1 font-medium">${club.name} (${club.category})</p>
            <p class="text-[11px] text-slate-400">Enrolled Students: <strong class="text-emerald-400 font-mono">${memberIds.length}</strong> / ${studentsList.length}</p>
          </div>
          <button onclick="closeModal('club-members-modal')" class="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800">
            ${window.getIcon('x')}
          </button>
        </div>

        <!-- Quick Mass Actions -->
        <div class="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 mb-4 text-xs">
          <span class="text-slate-300">
            Total Student Directory: <strong class="text-white font-mono">${studentsList.length} students</strong>
          </span>
          <div class="flex items-center gap-2">
            <button onclick="massUpdateClubMembers('${club.id}', true)" class="px-2.5 py-1 bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white rounded-lg border border-emerald-500/40 font-medium transition text-[11px]">
              Enroll All Students
            </button>
            <button onclick="massUpdateClubMembers('${club.id}', false)" class="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white rounded-lg transition text-[11px]">
              Remove All
            </button>
          </div>
        </div>

        <!-- Students List -->
        <div class="overflow-y-auto flex-1 space-y-2 pr-1">
          ${studentsList.map(st => {
            const isMember = memberIds.includes(st.id);
            return `
              <div class="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800/80 transition text-xs">
                <div class="flex items-center gap-3">
                  <span class="text-xl">${st.avatar || '👨‍🎓'}</span>
                  <div>
                    <strong class="text-white block text-xs md:text-sm leading-tight">${st.name}</strong>
                    <div class="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                      <span>Roll: ${st.rollNo}</span>
                      <span>•</span>
                      <span>${st.branch} (${st.batch})</span>
                    </div>
                  </div>
                </div>

                <div class="flex items-center gap-2.5">
                  <span class="text-[10px] font-mono px-2 py-0.5 rounded ${isMember ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold' : 'text-slate-500'}">
                    ${isMember ? 'Enrolled' : 'Not Member'}
                  </span>
                  <button onclick="toggleStudentClubEnrollment('${club.id}', '${st.id}')" class="px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${isMember ? 'bg-red-500/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/30' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow'}">
                    ${isMember ? 'Remove' : '+ Enroll'}
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Footer -->
        <div class="pt-4 border-t border-slate-800 mt-4 flex items-center justify-end">
          <button onclick="closeModal('club-members-modal')" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow">
            Done
          </button>
        </div>

      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function toggleStudentClubEnrollment(clubId, studentId) {
  const state = window.store.getState();
  const club = (state.clubs || []).find(c => c.id === clubId);
  if (!club) return;

  const memberIds = club.memberStudentIds || [];
  const isMember = memberIds.includes(studentId);

  window.store.setClubStudentMember(clubId, studentId, !isMember);
  window.showToast("Student club enrollment updated!", "info");

  closeModal('club-members-modal');
  openManageClubMembersModal(clubId);
  renderClubs();
}

function massUpdateClubMembers(clubId, shouldEnroll) {
  const state = window.store.getState();
  const studentsList = state.studentsList || [];
  studentsList.forEach(st => {
    window.store.setClubStudentMember(clubId, st.id, shouldEnroll);
  });
  window.showToast(`Updated enrollments for all students`, "success");
  closeModal('club-members-modal');
  openManageClubMembersModal(clubId);
  renderClubs();
}

function toggleClubTask(clubId, taskId) {
  window.store.toggleClubTask(clubId, taskId);
  renderClubs();
}

function promptAddClubTask(clubId) {
  const title = prompt("Enter new action item or task for this club:");
  if (title && title.trim()) {
    const due = prompt("Enter target due date (e.g. Next Meet, Oct 30):", "Next Meet");
    window.store.addClubTask(clubId, title.trim(), due || "Next Meet");
    window.showToast("Task added to club board!", "success");
    renderClubs();
  }
}

// Automatically pin club meeting time into weekly timetable
function syncClubMeetingToTimetable(clubId) {
  const state = window.store.getState();
  const club = state.clubs.find(c => c.id === clubId);
  if (!club) return;

  // Let student pick day and time
  const day = prompt(`Which day is the ${club.name} meeting? (e.g. Monday, Tuesday, Friday, Saturday)`, "Monday");
  if (!day) return;

  const startTime = prompt(`Meeting start time? (HH:MM in 24hr format)`, "16:00");
  if (!startTime) return;

  const endTime = prompt(`Meeting end time? (HH:MM in 24hr format)`, "17:30");
  if (!endTime) return;

  const newSlot = {
    title: `${club.name} Meet`,
    day: day.trim(),
    type: "Club",
    startTime: startTime.trim(),
    endTime: endTime.trim(),
    subjectId: null,
    room: club.venue || "Campus Hub",
    color: "#f97316"
  };

  window.store.addTimetableSlot(newSlot);
  window.showToast(`Pinned ${club.name} meeting to your timetable for ${day}!`, "success");
  if (window.renderTimetable) window.renderTimetable();
}

function openAddClubModal() {
  const modalHtml = `
    <div id="club-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay">
      <div class="glass-card bg-slate-900 border border-slate-700 w-full max-w-md p-6 rounded-2xl shadow-2xl relative animate-scale-up">
        <button onclick="closeModal('club-modal')" class="absolute top-5 right-5 text-slate-400 hover:text-white">
          ${window.getIcon('x')}
        </button>
        <h3 id="club-modal-title" class="text-xl font-bold text-white mb-1 flex items-center gap-2">
          ${window.getIcon('users', 'text-indigo-400')}
          Register Campus Club
        </h3>
        <p class="text-xs text-slate-400 mb-5">Add or update student chapter, sports team, or society</p>

        <form onsubmit="handleSaveClub(event)" class="space-y-4">
          <input type="hidden" id="clb-id" value="">

          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Club / Society Name *</label>
            <input type="text" id="clb-name" required placeholder="e.g. Artificial Intelligence Club" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none">
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Category</label>
              <select id="clb-category" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none">
                <option value="Technical">Technical</option>
                <option value="Cultural">Cultural / Arts</option>
                <option value="Sports">Sports & Fitness</option>
                <option value="Social Impact">Social Impact</option>
                <option value="Literary">Literary / Debate</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Your Role</label>
              <input type="text" id="clb-role" placeholder="e.g. Core Team / Member" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none">
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Club Lead / Faculty Incharge</label>
            <input type="text" id="clb-leads" placeholder="e.g. Prof. David / Alex Rivera" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none">
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Meeting Schedule</label>
              <input type="text" id="clb-schedule" placeholder="e.g. Wednesdays @ 5 PM" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none">
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Venue</label>
              <input type="text" id="clb-venue" placeholder="e.g. Lab 3 / Quad" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none">
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Description / Goals</label>
            <textarea id="clb-desc" rows="2" placeholder="Brief outline of club activities and projects" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none"></textarea>
          </div>

          <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button type="button" onclick="closeModal('club-modal')" class="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition">
              Cancel
            </button>
            <button type="submit" class="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium shadow-lg shadow-indigo-600/30 transition">
              Save Club
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function openEditClubModal(clubId) {
  const state = window.store.getState();
  const club = (state.clubs || []).find(c => c.id === clubId);
  if (!club) return;

  openAddClubModal();

  setTimeout(() => {
    if (document.getElementById('club-modal-title')) {
      document.getElementById('club-modal-title').innerHTML = `${window.getIcon('edit', 'text-indigo-400')} Edit Campus Club`;
    }
    if (document.getElementById('clb-id')) document.getElementById('clb-id').value = club.id;
    if (document.getElementById('clb-name')) document.getElementById('clb-name').value = club.name;
    if (document.getElementById('clb-category')) document.getElementById('clb-category').value = club.category;
    if (document.getElementById('clb-role')) document.getElementById('clb-role').value = club.role || 'Member';
    if (document.getElementById('clb-leads')) document.getElementById('clb-leads').value = club.leads || '';
    if (document.getElementById('clb-schedule')) document.getElementById('clb-schedule').value = club.meetingSchedule || '';
    if (document.getElementById('clb-venue')) document.getElementById('clb-venue').value = club.venue || '';
    if (document.getElementById('clb-desc')) document.getElementById('clb-desc').value = club.description || '';
  }, 20);
}

function handleSaveClub(e) {
  e.preventDefault();
  const id = document.getElementById('clb-id').value;
  const name = document.getElementById('clb-name').value.trim();
  const category = document.getElementById('clb-category').value;
  const role = document.getElementById('clb-role').value.trim() || 'Member';
  const leads = document.getElementById('clb-leads').value.trim() || 'Student Council';
  const meetingSchedule = document.getElementById('clb-schedule').value.trim() || 'Weekly meets';
  const venue = document.getElementById('clb-venue').value.trim() || 'Campus';
  const description = document.getElementById('clb-desc').value.trim() || 'Student campus society.';

  if (id) {
    window.store.updateClub(id, { name, category, role, leads, meetingSchedule, venue, description });
    window.showToast(`Updated "${name}"!`, "success");
  } else {
    window.store.addClub({ name, category, role, leads, meetingSchedule, venue, description });
    window.showToast("New club created!", "success");
  }

  closeModal('club-modal');
  renderClubs();
}

function confirmDeleteClub(clubId) {
  const state = window.store.getState();
  const club = (state.clubs || []).find(c => c.id === clubId);
  if (!club) return;

  if (confirm(`Are you sure you want to delete ${club.name}?`)) {
    window.store.deleteClub(clubId);
    window.showToast(`Club ${club.name} removed`, "info");
    renderClubs();
  }
}

window.initClubs = initClubs;
window.renderClubs = renderClubs;
window.setClubTab = setClubTab;
window.toggleClubMembership = toggleClubMembership;
window.toggleClubTask = toggleClubTask;
window.promptAddClubTask = promptAddClubTask;
window.syncClubMeetingToTimetable = syncClubMeetingToTimetable;
window.openAddClubModal = openAddClubModal;
window.openEditClubModal = openEditClubModal;
window.handleSaveClub = handleSaveClub;
window.confirmDeleteClub = confirmDeleteClub;
window.openManageClubMembersModal = openManageClubMembersModal;
window.toggleStudentClubEnrollment = toggleStudentClubEnrollment;
window.massUpdateClubMembers = massUpdateClubMembers;

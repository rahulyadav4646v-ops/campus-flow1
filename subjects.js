// Subjects & Attendance Management Component

function initSubjects() {
  renderSubjects();
}

function calculateAttendanceAdvice(attended, total, targetGoal = 75) {
  if (total === 0) return { pct: 100, status: 'safe', text: 'No classes held yet.' };

  const pct = Math.round((attended / total) * 100);
  const targetFraction = targetGoal / 100;

  if (pct >= targetGoal) {
    // How many classes can be safely missed?
    // (attended) / (total + x) >= targetFraction => attended >= targetFraction * total + targetFraction * x
    // x <= (attended - targetFraction * total) / targetFraction
    const safeMiss = Math.floor((attended - targetFraction * total) / targetFraction);
    return {
      pct,
      status: pct >= 85 ? 'excellent' : 'good',
      safeMiss: Math.max(0, safeMiss),
      text: safeMiss > 0
        ? `You can safely miss ${safeMiss} more ${safeMiss === 1 ? 'class' : 'classes'} without falling below ${targetGoal}%.`
        : `On the edge! Don't miss the next class to stay above ${targetGoal}%.`
    };
  } else {
    // How many consecutive classes needed to recover?
    // (attended + y) / (total + y) >= targetFraction
    // attended + y >= targetFraction * total + targetFraction * y
    // y * (1 - targetFraction) >= targetFraction * total - attended
    // y >= (targetFraction * total - attended) / (1 - targetFraction)
    const needed = Math.ceil((targetFraction * total - attended) / (1 - targetFraction));
    return {
      pct,
      status: 'danger',
      needed: Math.max(1, needed),
      text: `Low Attendance Warning! Attend the next ${needed} consecutive ${needed === 1 ? 'class' : 'classes'} to reach ${targetGoal}%.`
    };
  }
}

function renderSubjects() {
  const container = document.getElementById('subjects-content');
  if (!container) return;

  const state = window.store.getState();
  const subjects = state.subjects || [];
  const assignments = state.assignments || [];
  const targetGoal = state.settings.minAttendanceGoal || 75;

  // Calculate overall attendance aggregate
  const totalClasses = subjects.reduce((acc, s) => acc + (s.total || 0), 0);
  const attendedClasses = subjects.reduce((acc, s) => acc + (s.attended || 0), 0);
  const overallPct = totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 100;

  let html = `
    <!-- Top Stats Banner -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="glass-card p-4 rounded-xl border border-slate-700/60 bg-slate-900/40">
        <div class="flex items-center justify-between text-slate-400 text-xs mb-1">
          <span>Overall Attendance</span>
          ${window.getIcon('activity', 'text-indigo-400')}
        </div>
        <div class="flex items-baseline gap-2">
          <span class="text-2xl font-bold font-mono ${overallPct >= targetGoal ? 'text-emerald-400' : 'text-red-400'}">${overallPct}%</span>
          <span class="text-xs text-slate-400">Target: ${targetGoal}%</span>
        </div>
        <div class="w-full bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
          <div class="h-full rounded-full ${overallPct >= targetGoal ? 'bg-emerald-500' : 'bg-red-500'}" style="width: ${Math.min(100, overallPct)}%"></div>
        </div>
      </div>

      <div class="glass-card p-4 rounded-xl border border-slate-700/60 bg-slate-900/40">
        <div class="flex items-center justify-between text-slate-400 text-xs mb-1">
          <span>Total Courses</span>
          ${window.getIcon('book', 'text-blue-400')}
        </div>
        <div class="text-2xl font-bold font-mono text-white">${subjects.length}</div>
        <span class="text-xs text-slate-400 mt-1 block">${subjects.reduce((sum, s) => sum + (s.credits || 0), 0)} Total Credits</span>
      </div>

      <div class="glass-card p-4 rounded-xl border border-slate-700/60 bg-slate-900/40">
        <div class="flex items-center justify-between text-slate-400 text-xs mb-1">
          <span>Classes Attended</span>
          ${window.getIcon('checkCircle', 'text-emerald-400')}
        </div>
        <div class="text-2xl font-bold font-mono text-emerald-400">${attendedClasses} <span class="text-sm font-normal text-slate-400">/ ${totalClasses}</span></div>
        <span class="text-xs text-slate-400 mt-1 block">Lectures & Practical labs</span>
      </div>

      <div class="glass-card p-4 rounded-xl border border-slate-700/60 bg-slate-900/40 flex flex-col justify-between">
        <div class="flex items-center justify-between text-slate-400 text-xs">
          <span>Pending Submissions</span>
          ${window.getIcon('alert', 'text-amber-400')}
        </div>
        <div class="text-2xl font-bold font-mono text-amber-400">${assignments.filter(a => a.status !== 'completed').length}</div>
        <button onclick="openAddAssignmentModal()" class="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
          ${window.getIcon('plus')} New Assignment
        </button>
      </div>
    </div>

    <!-- Section Header & Add Subject Button -->
    <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div>
        <h3 class="text-lg font-bold text-white flex items-center gap-2">
          ${window.getIcon('book', 'text-indigo-400')}
          Academic Courses & Attendance Calculator
        </h3>
        <p class="text-xs text-slate-400">Track 75% criteria, syllabus progress, and course faculty</p>
      </div>
      ${window.store.isHost() ? `
        <button onclick="openAddSubjectModal()" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs md:text-sm rounded-lg shadow-lg shadow-indigo-600/30 transition flex items-center gap-1.5">
          ${window.getIcon('plus')} Add Subject
        </button>
      ` : `
        <div class="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-400 text-xs font-mono">
          Student Portal
        </div>
      `}
    </div>

    <!-- Subjects Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
      ${subjects.map(subject => renderSubjectCard(subject, targetGoal)).join('')}
    </div>

    <!-- Assignment & Submission Tracker Section -->
    <div class="glass-card p-6 rounded-2xl border border-slate-700/60">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h4 class="text-base font-bold text-white flex items-center gap-2">
            ${window.getIcon('award', 'text-amber-400')}
            Assignments, Projects & Deadlines
          </h4>
          <p class="text-xs text-slate-400">Never miss a submission deadline</p>
        </div>
        ${window.store.isHost() ? `
          <button onclick="openAddAssignmentModal()" class="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition flex items-center gap-1">
            ${window.getIcon('plus')} Add Assignment
          </button>
        ` : ''}
      </div>

      <div class="space-y-2.5">
        ${assignments.length === 0 ? `
          <div class="text-center py-6 text-slate-500 text-xs">No pending assignments! You're completely up to date.</div>
        ` : assignments.map(a => renderAssignmentRow(a, subjects)).join('')}
      </div>
    </div>
  `;

  container.innerHTML = html;
}

function renderSubjectCard(subject, targetGoal) {
  const advice = calculateAttendanceAdvice(subject.attended || 0, subject.total || 0, targetGoal);
  const syllabusPct = subject.syllabusTotal > 0 ? Math.round(((subject.syllabusCompleted || 0) / subject.syllabusTotal) * 100) : 0;

  let badgeBorder = 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400';
  if (advice.status === 'danger') {
    badgeBorder = 'border-red-500/40 bg-red-500/15 text-red-400';
  } else if (advice.status === 'good') {
    badgeBorder = 'border-amber-500/40 bg-amber-500/15 text-amber-400';
  }

  return `
    <div class="glass-card flex flex-col justify-between p-5 rounded-2xl border border-slate-700/70 hover:border-indigo-500/40 transition group relative" style="border-top: 4px solid ${subject.color || '#4f46e5'};">
      <div>
        <!-- Header row -->
        <div class="flex items-start justify-between gap-2 mb-2">
          <div>
            <span class="text-[11px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-slate-800 text-indigo-400 border border-slate-700">
              ${subject.code}
            </span>
            <span class="text-[11px] text-slate-400 ml-2">${subject.credits} Credits</span>
          </div>
          ${window.store.isHost() ? `
            <div class="flex items-center gap-1">
              <button onclick="openEditSubjectModal('${subject.id}')" class="p-1 text-slate-400 hover:text-white rounded" title="Edit Subject">
                ${window.getIcon('edit')}
              </button>
              <button onclick="confirmDeleteSubject('${subject.id}')" class="p-1 text-slate-400 hover:text-red-400 rounded" title="Delete">
                ${window.getIcon('trash')}
              </button>
            </div>
          ` : `
            <div class="flex items-center gap-1 text-[11px] font-mono text-cyan-400">
              ${window.getIcon('shield', 'w-3.5 h-3.5 text-cyan-400')}
              <span>Enrolled</span>
            </div>
          `}
        </div>

        <h4 class="text-base font-bold text-white group-hover:text-indigo-300 transition line-clamp-1 mb-1">
          ${subject.name}
        </h4>

        <div class="text-xs text-slate-400 space-y-0.5 mb-4">
          <p class="flex items-center gap-1.5">
            ${window.getIcon('user', 'w-3 h-3 text-slate-500')}
            <span>${subject.faculty || 'Unassigned'}</span>
          </p>
          ${subject.room ? `
            <p class="flex items-center gap-1.5">
              ${window.getIcon('mapPin', 'w-3 h-3 text-slate-500')}
              <span>${subject.room}</span>
            </p>
          ` : ''}
        </div>

        <!-- Attendance Calculator Box -->
        <div class="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 mb-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs text-slate-300 font-medium">Attendance</span>
            <div class="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-mono font-bold ${badgeBorder}">
              ${advice.pct}%
            </div>
          </div>

          <div class="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span>Attended: <strong class="text-slate-200 font-mono">${subject.attended || 0}</strong> / ${subject.total || 0}</span>
            <span>Target: ${targetGoal}%</span>
          </div>

          <div class="w-full bg-slate-700/60 h-2 rounded-full overflow-hidden mb-2.5">
            <div class="h-full rounded-full transition-all duration-300 ${advice.status === 'danger' ? 'bg-red-500' : 'bg-emerald-500'}" style="width: ${Math.min(100, advice.pct)}%"></div>
          </div>

          <!-- Attendance Advice Text -->
          <p class="text-[11px] leading-tight ${advice.status === 'danger' ? 'text-red-400 font-medium' : 'text-slate-300'}">
            ${advice.text}
          </p>

          <!-- Attendance Action / Machine Status -->
          ${window.store.isHost() ? `
            <div class="grid grid-cols-3 gap-1.5 mt-3 pt-2.5 border-t border-slate-700/60">
              <button onclick="handleAttendance('${subject.id}', 'present')" class="py-1 px-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 text-[11px] font-medium transition text-center">
                + Present
              </button>
              <button onclick="handleAttendance('${subject.id}', 'absent')" class="py-1 px-2 rounded-lg bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/30 text-[11px] font-medium transition text-center">
                - Absent
              </button>
              <button onclick="handleAttendance('${subject.id}', 'undo')" class="py-1 px-2 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-400 hover:text-white text-[11px] font-medium transition text-center" title="Undo last">
                Undo
              </button>
            </div>
          ` : `
            <div class="mt-3 pt-2.5 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
              <span class="flex items-center gap-1.5 text-cyan-400 font-medium">
                ${window.getIcon('camera', 'w-3.5 h-3.5 text-cyan-400')} Biometric Face-Scan Sync
              </span>
              <span class="font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Machine Auto</span>
            </div>
          `}
        </div>

        <!-- Syllabus Progress -->
        <div class="text-xs text-slate-400">
          <div class="flex items-center justify-between mb-1">
            <span>Syllabus Covered</span>
            <span class="font-mono text-slate-300">${subject.syllabusCompleted || 0} / ${subject.syllabusTotal || 5} Units (${syllabusPct}%)</span>
          </div>
          <div class="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div class="h-full bg-indigo-500 rounded-full" style="width: ${Math.min(100, syllabusPct)}%"></div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderAssignmentRow(assignment, subjects) {
  const sub = subjects.find(s => s.id === assignment.subjectId);
  const isHost = window.store.isHost();
  const state = window.store.getState();
  const studentsList = state.studentsList || [];
  const submissions = assignment.studentSubmissions || {};

  const totalStudents = studentsList.length;
  const submittedCount = studentsList.filter(st => submissions[st.id] && submissions[st.id].submitted).length;

  // For student mode: find current logged in student (Alex Rivera std-1) status
  const currentStudentSub = submissions["std-1"] || { submitted: false };
  const isStudentDone = currentStudentSub.submitted;

  const priorityColors = {
    high: 'text-red-400 bg-red-500/10 border-red-500/30',
    medium: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    low: 'text-blue-400 bg-blue-500/10 border-blue-500/30'
  };

  return `
    <div class="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 hover:bg-slate-800/80 transition">
      <div class="flex items-center gap-3">
        ${isHost ? `
          <div class="w-6 h-6 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-xs" title="Managed by Host">
            📋
          </div>
        ` : `
          <div class="w-6 h-6 rounded-lg flex items-center justify-center ${isStudentDone ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}">
            ${isStudentDone ? window.getIcon('check', 'w-3.5 h-3.5') : '⏳'}
          </div>
        `}
        <div>
          <div class="flex items-center gap-2">
            <h5 class="text-xs md:text-sm font-semibold text-white">
              ${assignment.title}
            </h5>
            <span class="text-[10px] uppercase font-semibold px-2 py-0.5 rounded border ${priorityColors[assignment.priority] || priorityColors.medium}">
              ${assignment.priority}
            </span>
          </div>
          <div class="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 mt-1">
            ${sub ? `<span class="text-indigo-400 font-mono font-medium">${sub.code}</span>` : ''}
            <span>Due: <strong class="text-slate-200">${assignment.dueDate || 'No date'}</strong></span>
            ${!isHost ? `
              <span class="font-medium ${isStudentDone ? 'text-emerald-400' : 'text-amber-400'}">
                Status: ${isStudentDone ? `✓ Verified Submitted (${currentStudentSub.date || 'On Record'})` : '⏳ Pending Submission (Host Verified)'}
              </span>
            ` : ''}
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2">
        ${isHost ? `
          <!-- Host Roster Tracker & Edit Actions -->
          <div class="flex items-center gap-2">
            <span class="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 ${submittedCount === totalStudents ? 'text-emerald-400' : 'text-indigo-300'}">
              ${submittedCount} / ${totalStudents} Submitted
            </span>
            <button onclick="openManageStudentSubmissionsModal('${assignment.id}')" class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow transition flex items-center gap-1.5" title="View & edit each student's submission status">
              ${window.getIcon('users', 'w-3.5 h-3.5')}
              <span>Student Roster</span>
            </button>
            <button onclick="deleteAssignmentItem('${assignment.id}')" class="p-1.5 text-slate-400 hover:text-red-400 rounded bg-slate-800 hover:bg-red-950/60 transition" title="Delete Assignment">
              ${window.getIcon('trash', 'w-3.5 h-3.5')}
            </button>
          </div>
        ` : `
          <!-- Student View Badge (Locked) -->
          <div class="text-[11px] font-mono text-slate-400 px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-700/80 flex items-center gap-1.5">
            <span>🔒 Faculty Managed</span>
          </div>
        `}
      </div>
    </div>
  `;
}

function handleAttendance(subjectId, status) {
  if (!window.store.isHost()) {
    window.showToast("Biometric Policy: Attendance is recorded automatically by Face-Scan Machine terminal.", "warning");
    return;
  }
  window.store.markAttendance(subjectId, status);
  window.showToast(`Updated attendance for ${status}`, "info");
  renderSubjects();
  if (window.renderLiveClassAlert) window.renderLiveClassAlert();
}

function toggleAssignment(id) {
  if (!window.store.isHost()) {
    window.showToast("Faculty Policy: Assignment submission statuses are verified and edited only by the Host / Professor.", "warning");
    return;
  }
  window.store.toggleAssignmentStatus(id);
  renderSubjects();
}

function deleteAssignmentItem(id) {
  if (!window.store.isHost()) {
    window.showToast("Permission Denied: Only Host can delete assignments.", "warning");
    return;
  }
  window.store.deleteAssignment(id);
  renderSubjects();
}

// Modal: Host Student Submissions Roster Manager
function openManageStudentSubmissionsModal(assignmentId) {
  const state = window.store.getState();
  const assignment = (state.assignments || []).find(a => a.id === assignmentId);
  if (!assignment) return;

  const studentsList = state.studentsList || [];
  const submissions = assignment.studentSubmissions || {};

  const modalHtml = `
    <div id="submissions-roster-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay">
      <div class="glass-card bg-slate-900 border border-slate-700 w-full max-w-2xl p-6 rounded-2xl shadow-2xl relative max-h-[90vh] flex flex-col animate-scale-up">
        
        <!-- Header -->
        <div class="flex items-start justify-between pb-4 border-b border-slate-800 mb-4">
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-lg font-bold text-white flex items-center gap-2">
                ${window.getIcon('award', 'text-indigo-400')}
                Student Submissions Roster
              </h3>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                Host Portal
              </span>
            </div>
            <p class="text-xs text-slate-300 mt-1 font-medium">${assignment.title}</p>
            <p class="text-[11px] text-slate-400">Due Date: ${assignment.dueDate || 'N/A'}</p>
          </div>
          <button onclick="closeModal('submissions-roster-modal')" class="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800">
            ${window.getIcon('x')}
          </button>
        </div>

        <!-- Quick Mass Actions -->
        <div class="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 mb-4 text-xs">
          <span class="text-slate-300">
            Enrolled Students: <strong class="text-white font-mono">${studentsList.length}</strong>
          </span>
          <div class="flex items-center gap-2">
            <button onclick="markAllSubmissionsForAssignment('${assignment.id}', true)" class="px-2.5 py-1 bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white rounded-lg border border-emerald-500/40 font-medium transition text-[11px]">
              Mark All Submitted
            </button>
            <button onclick="markAllSubmissionsForAssignment('${assignment.id}', false)" class="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white rounded-lg transition text-[11px]">
              Reset All
            </button>
          </div>
        </div>

        <!-- Students List Table -->
        <div class="overflow-y-auto flex-1 space-y-2 pr-1">
          ${studentsList.map(st => {
            const sub = submissions[st.id] || { submitted: false };
            const isDone = sub.submitted;
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

                <div class="flex items-center gap-3">
                  ${isDone ? `
                    <div class="text-right hidden sm:block">
                      <span class="text-[10px] text-emerald-400 font-mono block">Submitted: ${sub.date || 'Today'}</span>
                      <span class="text-[10px] text-slate-400 font-mono">Grade: ${sub.grade || 'A'}</span>
                    </div>
                  ` : `
                    <span class="text-[11px] text-amber-400 font-medium hidden sm:block">Pending</span>
                  `}

                  <button onclick="toggleStudentSubmission('${assignment.id}', '${st.id}')" class="px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${isDone ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600'}">
                    ${isDone ? `${window.getIcon('check', 'w-3 h-3')} Submitted` : `Mark Submitted`}
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Footer -->
        <div class="pt-4 border-t border-slate-800 mt-4 flex items-center justify-end">
          <button onclick="closeModal('submissions-roster-modal')" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow">
            Done
          </button>
        </div>

      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function toggleStudentSubmission(assignmentId, studentId) {
  const state = window.store.getState();
  const assignment = (state.assignments || []).find(a => a.id === assignmentId);
  if (!assignment) return;

  const currentSub = (assignment.studentSubmissions && assignment.studentSubmissions[studentId]) || { submitted: false };
  const newStatus = !currentSub.submitted;

  window.store.setAssignmentStudentSubmission(assignmentId, studentId, newStatus);
  window.showToast(`Updated submission for student`, "info");

  // Re-render modal list
  closeModal('submissions-roster-modal');
  openManageStudentSubmissionsModal(assignmentId);
  renderSubjects();
}

function markAllSubmissionsForAssignment(assignmentId, status) {
  const state = window.store.getState();
  const studentsList = state.studentsList || [];
  studentsList.forEach(st => {
    window.store.setAssignmentStudentSubmission(assignmentId, st.id, status);
  });
  window.showToast(`Updated all ${studentsList.length} students`, "success");
  closeModal('submissions-roster-modal');
  openManageStudentSubmissionsModal(assignmentId);
  renderSubjects();
}

// Modals
function openAddSubjectModal() {
  const modalHtml = `
    <div id="subject-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay">
      <div class="glass-card bg-slate-900 border border-slate-700 w-full max-w-md p-6 rounded-2xl shadow-2xl relative">
        <button onclick="closeModal('subject-modal')" class="absolute top-5 right-5 text-slate-400 hover:text-white">
          ${window.getIcon('x')}
        </button>
        <h3 class="text-xl font-bold text-white mb-1 flex items-center gap-2">
          ${window.getIcon('book', 'text-indigo-400')}
          Add Subject
        </h3>
        <p class="text-xs text-slate-400 mb-5">Add a new academic course to track attendance & syllabus</p>

        <form onsubmit="handleSaveSubject(event)" class="space-y-4">
          <input type="hidden" id="sub-id" value="">

          <div class="grid grid-cols-3 gap-3">
            <div class="col-span-1">
              <label class="block text-xs font-medium text-slate-300 mb-1">Code *</label>
              <input type="text" id="sub-code" required placeholder="e.g. CS401" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none uppercase">
            </div>
            <div class="col-span-2">
              <label class="block text-xs font-medium text-slate-300 mb-1">Subject Name *</label>
              <input type="text" id="sub-name" required placeholder="e.g. Computer Networks" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none">
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Faculty Name</label>
              <input type="text" id="sub-faculty" placeholder="e.g. Dr. A. Thorne" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none">
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Room / Hall</label>
              <input type="text" id="sub-room" placeholder="e.g. LH-201" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none">
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Credits</label>
              <input type="number" id="sub-credits" min="1" max="8" value="4" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none">
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Theme Color</label>
              <input type="color" id="sub-color" value="#3b82f6" class="h-9 w-full rounded cursor-pointer bg-transparent border-0">
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Classes Attended</label>
              <input type="number" id="sub-attended" min="0" value="0" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none">
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Total Classes Held</label>
              <input type="number" id="sub-total" min="0" value="0" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none">
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Total Syllabus Units</label>
              <input type="number" id="sub-syllabus-total" min="1" max="10" value="5" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none">
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Completed Units</label>
              <input type="number" step="0.5" id="sub-syllabus-done" min="0" max="10" value="0" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none">
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button type="button" onclick="closeModal('subject-modal')" class="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition">
              Cancel
            </button>
            <button type="submit" class="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium shadow-lg shadow-indigo-600/30 transition">
              Save Course
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function openEditSubjectModal(subId) {
  const state = window.store.getState();
  const sub = state.subjects.find(s => s.id === subId);
  if (!sub) return;

  openAddSubjectModal();

  setTimeout(() => {
    document.getElementById('sub-id').value = sub.id;
    document.getElementById('sub-code').value = sub.code;
    document.getElementById('sub-name').value = sub.name;
    document.getElementById('sub-faculty').value = sub.faculty || '';
    document.getElementById('sub-room').value = sub.room || '';
    document.getElementById('sub-credits').value = sub.credits || 4;
    document.getElementById('sub-color').value = sub.color || '#3b82f6';
    document.getElementById('sub-attended').value = sub.attended || 0;
    document.getElementById('sub-total').value = sub.total || 0;
    document.getElementById('sub-syllabus-total').value = sub.syllabusTotal || 5;
    document.getElementById('sub-syllabus-done').value = sub.syllabusCompleted || 0;
  }, 20);
}

function handleSaveSubject(e) {
  e.preventDefault();
  const id = document.getElementById('sub-id').value;
  const code = document.getElementById('sub-code').value.trim();
  const name = document.getElementById('sub-name').value.trim();
  const faculty = document.getElementById('sub-faculty').value.trim();
  const room = document.getElementById('sub-room').value.trim();
  const credits = Number(document.getElementById('sub-credits').value);
  const color = document.getElementById('sub-color').value;
  const attended = Number(document.getElementById('sub-attended').value);
  const total = Number(document.getElementById('sub-total').value);
  const syllabusTotal = Number(document.getElementById('sub-syllabus-total').value);
  const syllabusCompleted = Number(document.getElementById('sub-syllabus-done').value);

  if (attended > total) {
    alert("Attended classes cannot exceed total classes!");
    return;
  }

  const subjectData = { code, name, faculty, room, credits, color, attended, total, syllabusTotal, syllabusCompleted };

  if (id) {
    window.store.updateSubject(id, subjectData);
    window.showToast("Course details updated!", "success");
  } else {
    window.store.addSubject(subjectData);
    window.showToast("New course registered!", "success");
  }

  closeModal('subject-modal');
  renderSubjects();
  if (window.renderTimetable) window.renderTimetable();
}

function confirmDeleteSubject(id) {
  if (confirm("Delete this subject and its associated timetable slots?")) {
    window.store.deleteSubject(id);
    window.showToast("Subject removed", "info");
    renderSubjects();
    if (window.renderTimetable) window.renderTimetable();
  }
}

function openAddAssignmentModal() {
  const state = window.store.getState();
  const subjects = state.subjects || [];

  const modalHtml = `
    <div id="assignment-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay">
      <div class="glass-card bg-slate-900 border border-slate-700 w-full max-w-md p-6 rounded-2xl shadow-2xl relative">
        <button onclick="closeModal('assignment-modal')" class="absolute top-5 right-5 text-slate-400 hover:text-white">
          ${window.getIcon('x')}
        </button>
        <h3 class="text-xl font-bold text-white mb-1 flex items-center gap-2">
          ${window.getIcon('award', 'text-amber-400')}
          Add Assignment / Project
        </h3>
        <p class="text-xs text-slate-400 mb-5">Record a homework, report, or project deadline</p>

        <form onsubmit="handleSaveAssignment(event)" class="space-y-4">
          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Title / Topic *</label>
            <input type="text" id="asg-title" required placeholder="e.g. Implement Dijkstra's Algorithm in C++" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none">
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Subject</label>
            <select id="asg-subject" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none">
              ${subjects.map(s => `<option value="${s.id}">${s.code}: ${s.name}</option>`).join('')}
            </select>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Due Date *</label>
              <input type="date" id="asg-due" required class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none">
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Priority</label>
              <select id="asg-priority" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none">
                <option value="high">High (Due soon)</option>
                <option value="medium" selected>Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button type="button" onclick="closeModal('assignment-modal')" class="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition">
              Cancel
            </button>
            <button type="submit" class="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium shadow-lg shadow-indigo-600/30 transition">
              Add Deadline
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function handleSaveAssignment(e) {
  e.preventDefault();
  const title = document.getElementById('asg-title').value.trim();
  const subjectId = document.getElementById('asg-subject').value;
  const dueDate = document.getElementById('asg-due').value;
  const priority = document.getElementById('asg-priority').value;

  window.store.addAssignment({ title, subjectId, dueDate, priority });
  window.showToast("Assignment added to tracker!", "success");
  closeModal('assignment-modal');
  renderSubjects();
}

window.initSubjects = initSubjects;
window.renderSubjects = renderSubjects;
window.handleAttendance = handleAttendance;
window.openAddSubjectModal = openAddSubjectModal;
window.openEditSubjectModal = openEditSubjectModal;
window.handleSaveSubject = handleSaveSubject;
window.confirmDeleteSubject = confirmDeleteSubject;
window.openAddAssignmentModal = openAddAssignmentModal;
window.handleSaveAssignment = handleSaveAssignment;
window.toggleAssignment = toggleAssignment;
window.deleteAssignmentItem = deleteAssignmentItem;
window.openManageStudentSubmissionsModal = openManageStudentSubmissionsModal;
window.toggleStudentSubmission = toggleStudentSubmission;
window.markAllSubmissionsForAssignment = markAllSubmissionsForAssignment;

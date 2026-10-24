// Department Classes, Subjects Sub-section & Intersection Management Component
// Full CRUD: Add, Edit, Delete for Departments, Class Incharges, Subjects & Day Classes

let selectedDeptDay = "Monday"; // defaults to Monday
let selectedDeptFilter = "all";  // 'all' or specific department ID

function initDepartments() {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const todayName = days[new Date().getDay()];
  if (todayName !== "Sunday" && todayName !== "Saturday") {
    selectedDeptDay = todayName;
  } else {
    selectedDeptDay = "Monday";
  }
  renderDepartments();
}

function setDeptDay(day) {
  selectedDeptDay = day;
  renderDepartments();
}

function setDeptFilter(deptId) {
  selectedDeptFilter = deptId;
  renderDepartments();
}

function renderDepartments() {
  const container = document.getElementById('departments-content');
  if (!container) return;

  if (selectedDeptDay === "Saturday" || selectedDeptDay === "Sunday") {
    selectedDeptDay = "Monday";
  }

  const isHost = window.store.isHost();
  const state = window.store.getState();
  const departments = state.departments || [];

  // Run day-wise collision/intersection analysis
  const clashAnalysis = window.store.detectDayIntersections(selectedDeptDay);

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  // Filter departments
  const filteredDepts = selectedDeptFilter === "all"
    ? departments
    : departments.filter(d => d.id === selectedDeptFilter);

  let html = `
    <!-- Top Action Bar & Day Selector -->
    <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div>
        <div class="flex items-center gap-2">
          <h3 class="text-xl font-bold text-white flex items-center gap-2">
            ${window.getIcon('book', 'text-indigo-400')}
            ${isHost ? 'Department Management & Day Clash Radar' : 'Academic Departments & Course Directory'}
          </h3>
          ${isHost ? `
            <span class="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Host / Admin Portal
            </span>
          ` : ''}
        </div>
        <p class="text-xs text-slate-400 mt-0.5">
          ${isHost ? 'Add/Edit departments, subjects & class incharge names with instant intersection detection' : 'View departments, faculties and syllabus courses across campus'}
        </p>
      </div>

      <div class="flex items-center gap-2.5">
        ${isHost ? `
          <button onclick="openAddDeptClassModal()" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs md:text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center gap-1.5">
            ${window.getIcon('plus')} Schedule Class
          </button>
          <button onclick="openAddDepartmentModal()" class="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-xs md:text-sm rounded-xl border border-slate-700 transition flex items-center gap-1.5">
            ${window.getIcon('plus')} New Department
          </button>
        ` : `
          <div class="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-400 text-xs flex items-center gap-1.5">
            <span>🔒 Student View (Portal Editing Locked)</span>
          </div>
        `}
      </div>
    </div>

    <!-- Day Navigation Bar -->
    <div class="flex flex-wrap items-center justify-between gap-3 p-2 bg-slate-900/70 backdrop-blur rounded-2xl border border-slate-700/60 mb-6">
      <div class="flex items-center gap-1 overflow-x-auto no-scrollbar">
        <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 hidden sm:inline">Day:</span>
        ${daysOfWeek.map(d => `
          <button onclick="setDeptDay('${d}')" class="px-3.5 py-1.5 text-xs md:text-sm font-medium rounded-xl transition ${selectedDeptDay.toLowerCase() === d.toLowerCase() ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'}">
            ${d}
          </button>
        `).join('')}
      </div>

      <div class="flex items-center gap-2">
        <span class="text-xs text-slate-400">Filter Department:</span>
        <select onchange="setDeptFilter(this.value)" class="bg-slate-800 text-xs text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1.5 outline-none focus:border-indigo-500">
          <option value="all" ${selectedDeptFilter === 'all' ? 'selected' : ''}>All Departments (${departments.length})</option>
          ${departments.map(d => `<option value="${d.id}" ${selectedDeptFilter === d.id ? 'selected' : ''}>${d.code} - ${d.name}</option>`).join('')}
        </select>
      </div>
    </div>

    <!-- REAL-TIME INTERSECTION RADAR ALERT BANNER (HOST ONLY) -->
    ${isHost ? renderIntersectionRadar(clashAnalysis, selectedDeptDay) : ''}

    <!-- Department Sections with Subjects & Classes of the Day -->
    <div class="space-y-8">
      ${filteredDepts.length === 0 ? `
        <div class="text-center py-16 text-slate-400 glass-card p-8 rounded-2xl">
          <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
            ${window.getIcon('book')}
          </div>
          <h4 class="text-base font-semibold text-white">No Departments Configured</h4>
          <p class="text-xs text-slate-400 mt-1 mb-4">Add your academic departments to start managing subjects and class schedules.</p>
          <button onclick="openAddDepartmentModal()" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition">
            + Add First Department
          </button>
        </div>
      ` : filteredDepts.map(dept => renderDepartmentCard(dept, selectedDeptDay, clashAnalysis)).join('')}
    </div>
  `;

  container.innerHTML = html;
}

// Render the Live Intersection Radar Banner
function renderIntersectionRadar(clashAnalysis, day) {
  if (clashAnalysis.hasIntersections) {
    return `
      <div class="glass-card p-5 rounded-2xl border border-red-500/50 bg-gradient-to-r from-red-950/40 via-slate-900 to-amber-950/40 shadow-xl mb-8">
        <div class="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-xl bg-red-600/20 text-red-400 border border-red-500/40 flex items-center justify-center flex-shrink-0 animate-pulse">
              ${window.getIcon('alert', 'w-6 h-6')}
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold uppercase tracking-wider text-red-400 px-2.5 py-0.5 rounded-full bg-red-500/20 border border-red-500/30">
                  Intersection Collision Detected
                </span>
                <span class="text-xs font-mono text-slate-400">${day} Schedule</span>
              </div>
              <h4 class="text-lg font-bold text-white mt-1">
                ${clashAnalysis.totalCollisions} schedule intersection${clashAnalysis.totalCollisions > 1 ? 's' : ''} detected on ${day}!
              </h4>
              <p class="text-xs text-slate-300 mt-0.5">
                Two or more classes across departments are competing for the same venue, instructor, or student cohort simultaneously.
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            ${clashAnalysis.roomCollisions.length > 0 ? `
              <span class="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300">
                ${clashAnalysis.roomCollisions.length} Room Clash${clashAnalysis.roomCollisions.length > 1 ? 'es' : ''}
              </span>
            ` : ''}
            ${clashAnalysis.facultyCollisions.length > 0 ? `
              <span class="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300">
                ${clashAnalysis.facultyCollisions.length} Instructor Clash${clashAnalysis.facultyCollisions.length > 1 ? 'es' : ''}
              </span>
            ` : ''}
            ${clashAnalysis.batchCollisions.length > 0 ? `
              <span class="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-purple-500/20 border border-purple-500/40 text-purple-300">
                ${clashAnalysis.batchCollisions.length} Batch Overlap${clashAnalysis.batchCollisions.length > 1 ? 's' : ''}
              </span>
            ` : ''}
          </div>
        </div>

        <!-- Breakdown List of Collisions -->
        <div class="space-y-2.5 pt-3 border-t border-red-500/20">
          ${clashAnalysis.collisions.map(collision => `
            <div class="p-3 rounded-xl bg-slate-900/90 border border-red-500/30 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div class="flex items-center gap-2.5">
                <span class="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                <div>
                  <span class="font-bold text-red-300">${collision.title}</span>
                  <p class="text-slate-300 text-[11px] mt-0.5">${collision.message}</p>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <span class="font-mono text-[11px] text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                  Overlap Window: ${collision.overlapWindow}
                </span>
                <button onclick="openEditDeptClassModal('${collision.class2.id}')" class="px-2.5 py-1 bg-red-600/30 hover:bg-red-600 text-red-200 hover:text-white rounded-lg border border-red-500/40 font-medium transition text-[11px]">
                  Reschedule ${collision.dept2Code}
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else {
    // Conflict-free state
    return `
      <div class="glass-card p-4 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/30 via-slate-900 to-slate-900 shadow-md mb-8 flex items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            ${window.getIcon('checkCircle', 'w-5 h-5')}
          </div>
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-emerald-400">Zero Schedule Intersections</span>
            <p class="text-xs text-slate-300">
              All ${clashAnalysis.classesCount} classes scheduled on <strong>${day}</strong> have completely clear rooms, faculty allocations, and student cohorts!
            </p>
          </div>
        </div>
        <span class="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
          Status: Optimal
        </span>
      </div>
    `;
  }
}

// Render Department Card with Editable Class Incharge & Actions
function renderDepartmentCard(dept, day, clashAnalysis) {
  const isHost = window.store.isHost();
  const state = window.store.getState();
  const classesOnDay = (state.departmentClasses || []).filter(
    c => c.departmentId === dept.id && c.day && c.day.toLowerCase() === day.toLowerCase()
  );

  const subjects = dept.subjects || [];

  return `
    <div class="glass-card rounded-2xl overflow-hidden border border-slate-700/80 shadow-xl" style="border-top: 4px solid ${dept.color || '#6366f1'};">
      <!-- Department Header -->
      <div class="p-5 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div class="flex-1 min-w-[260px]">
          <div class="flex items-center gap-2.5 mb-1.5">
            <span class="text-xs font-mono font-bold uppercase px-2.5 py-0.5 rounded-lg bg-slate-800 text-indigo-300 border border-slate-700">
              ${dept.code}
            </span>
            <h4 class="text-lg font-bold text-white">${dept.name}</h4>
          </div>

          <!-- Incharge & HOD Row (Editable with 1-click for Host) -->
          <div class="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-300">
            <!-- HOD field -->
            <div class="flex items-center gap-1.5">
              <span class="text-slate-400">HOD:</span>
              <strong class="text-slate-200">${dept.hod || 'Unassigned'}</strong>
            </div>

            <span>•</span>

            <!-- Class Incharge (Specifically Requested & Highlighted) -->
            <div class="flex items-center gap-1.5 bg-indigo-950/40 px-2 py-0.5 rounded-lg border border-indigo-500/30">
              <span class="text-indigo-400 font-semibold">Class Incharge:</span>
              <span class="text-white font-medium">${dept.classIncharge || 'Click to assign'}</span>
              ${isHost ? `
                <button onclick="quickEditIncharge('${dept.id}')" class="p-0.5 text-indigo-300 hover:text-white transition" title="Edit Class Incharge">
                  ${window.getIcon('edit', 'w-3 h-3')}
                </button>
              ` : ''}
            </div>

            <span>•</span>
            <span class="text-slate-400">${subjects.length} Subjects</span>
            <span>•</span>
            <span class="text-indigo-400 font-mono font-medium">${classesOnDay.length} Classes on ${day}</span>
          </div>
        </div>

        <!-- Department Action Buttons: Add Subject, Add Class, Edit Dept, Delete Dept (Host Only) -->
        <div class="flex items-center gap-2">
          ${isHost ? `
            <button onclick="openAddSubjectToDeptModal('${dept.id}')" class="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition flex items-center gap-1">
              ${window.getIcon('plus', 'w-3 h-3')} Subject
            </button>
            <button onclick="openAddDeptClassModal('${dept.id}', null, '${day}')" class="text-xs px-3.5 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/40 font-medium transition flex items-center gap-1">
              ${window.getIcon('plus', 'w-3 h-3')} Class (${day.slice(0,3)})
            </button>
            <button onclick="openEditDepartmentModal('${dept.id}')" class="p-2 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white border border-slate-700 transition" title="Edit Department Details & Incharges">
              ${window.getIcon('edit', 'w-3.5 h-3.5')}
            </button>
            <button onclick="confirmDeleteDepartment('${dept.id}')" class="p-2 rounded-lg bg-slate-800 hover:bg-red-600 text-slate-400 hover:text-white border border-slate-700 transition" title="Delete Department">
              ${window.getIcon('trash', 'w-3.5 h-3.5')}
            </button>
          ` : `
            <span class="text-[11px] text-slate-500 font-mono bg-slate-800/40 px-2.5 py-1 rounded-lg">View Only</span>
          `}
        </div>
      </div>

      <div class="p-5 space-y-6">
        <!-- 1. SUB-SECTION: Department Subjects Catalog -->
        <div>
          <div class="flex items-center justify-between mb-3 pb-2 border-b border-slate-800/80">
            <h5 class="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              ${window.getIcon('book', 'w-3.5 h-3.5 text-indigo-400')}
              Subjects Sub-Section (${subjects.length})
            </h5>
            ${isHost ? `
              <button onclick="openAddSubjectToDeptModal('${dept.id}')" class="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium">
                ${window.getIcon('plus', 'w-3 h-3')} Add New Subject
              </button>
            ` : ''}
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            ${subjects.length === 0 ? `
              <div class="col-span-full py-4 text-center text-xs text-slate-500 italic bg-slate-900/30 rounded-xl border border-dashed border-slate-800">
                No subjects registered under ${dept.name} yet.
              </div>
            ` : subjects.map(sub => `
              <div class="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 hover:border-indigo-500/40 transition flex flex-col justify-between group">
                <div>
                  <div class="flex items-center justify-between gap-1 mb-1">
                    <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300">
                      ${sub.code}
                    </span>
                    <span class="text-[10px] text-slate-400 font-mono">${sub.credits || 4} Credits</span>
                  </div>
                  <h6 class="text-xs font-semibold text-white group-hover:text-indigo-300 transition line-clamp-1 mb-1">
                    ${sub.name}
                  </h6>
                  <p class="text-[11px] text-slate-400 line-clamp-1 mb-2">
                    Faculty: <span class="text-slate-300">${sub.faculty || 'Unassigned'}</span>
                  </p>
                </div>

                <!-- Subject Actions (Host Only) -->
                <div class="pt-2 border-t border-slate-800 flex items-center justify-between">
                  ${isHost ? `
                    <button onclick="openAddDeptClassModal('${dept.id}', '${sub.id}', '${day}')" class="text-[10px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                      + Schedule
                    </button>
                    <div class="flex items-center gap-1">
                      <button onclick="openEditSubjectModal('${dept.id}', '${sub.id}')" class="p-1 text-slate-400 hover:text-white rounded" title="Edit Subject Details">
                        ${window.getIcon('edit', 'w-3 h-3')}
                      </button>
                      <button onclick="confirmDeleteDeptSubject('${dept.id}', '${sub.id}')" class="p-1 text-slate-400 hover:text-red-400 rounded" title="Remove Subject">
                        ${window.getIcon('trash', 'w-3 h-3')}
                      </button>
                    </div>
                  ` : `
                    <span class="text-[10px] text-slate-500 font-mono">${sub.code} Verified</span>
                  `}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- 2. SUB-SECTION: Classes of the Day -->
        <div>
          <div class="flex items-center justify-between mb-3 pb-2 border-b border-slate-800/80">
            <h5 class="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              ${window.getIcon('calendar', 'w-3.5 h-3.5 text-indigo-400')}
              ${dept.code} Classes of the Day (${day})
            </h5>
            <span class="text-[11px] text-slate-500 font-mono">${classesOnDay.length} class sessions</span>
          </div>

          ${classesOnDay.length === 0 ? `
            <div class="p-6 rounded-xl bg-slate-900/40 border border-slate-800/60 text-center text-xs text-slate-400">
              No classes scheduled for <strong>${dept.name}</strong> on ${day}.
              ${isHost ? `
                <button onclick="openAddDeptClassModal('${dept.id}', null, '${day}')" class="text-indigo-400 hover:underline ml-1 font-semibold">
                  Schedule a class now &rarr;
                </button>
              ` : ''}
            </div>
          ` : `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              ${classesOnDay.map(cls => renderClassItem(cls, clashAnalysis, isHost)).join('')}
            </div>
          `}
        </div>
      </div>
    </div>
  `;
}

// Render individual class card with Intersection Alert Badge & Full Editability
function renderClassItem(cls, clashAnalysis, isHost = true) {
  const isColliding = isHost && clashAnalysis.collidingClassIds.includes(cls.id);

  // Find reasons if colliding
  const conflictReasons = isColliding
    ? clashAnalysis.collisions.filter(c => c.class1.id === cls.id || c.class2.id === cls.id)
    : [];

  return `
    <div class="p-3.5 rounded-xl transition-all duration-200 border ${isColliding ? 'bg-red-950/20 border-red-500/70 shadow-lg shadow-red-950/40 ring-1 ring-red-500/40' : 'bg-slate-800/70 border-slate-700/80 hover:border-slate-500/50'}">
      <div class="flex items-center justify-between gap-1 mb-2">
        <span class="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${cls.type === 'Lab' ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'}">
          ${cls.type || 'Lecture'}
        </span>

        ${isHost ? (isColliding ? `
          <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-500/30 text-red-300 border border-red-500/50 flex items-center gap-1 animate-pulse" title="${conflictReasons.map(r => r.message).join(' | ')}">
            ⚠️ Intersection Clash
          </span>
        ` : `
          <span class="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
            ${window.getIcon('check', 'w-3 h-3')} No Clash
          </span>
        `) : ''}
      </div>

      <h5 class="text-sm font-bold text-white mb-1 line-clamp-1">
        ${cls.subjectCode ? `${cls.subjectCode} - ` : ''}${cls.subjectName}
      </h5>

      <div class="space-y-1 text-xs text-slate-300 mt-2">
        <div class="flex items-center gap-1.5 font-mono text-indigo-300 font-semibold">
          ${window.getIcon('clock', 'w-3.5 h-3.5')}
          <span>${cls.startTime} - ${cls.endTime}</span>
        </div>
        <div class="flex items-center justify-between text-slate-400 text-[11px]">
          <span class="flex items-center gap-1">
            ${window.getIcon('mapPin', 'w-3 h-3 text-slate-500')}
            <strong class="${isColliding && conflictReasons.some(r => r.type === 'room') ? 'text-red-400 font-bold underline' : 'text-slate-300'}">${cls.room || 'No Room'}</strong>
          </span>
          <span>Batch: <strong class="text-slate-300">${cls.batch || 'All'}</strong></span>
        </div>
        <div class="text-[11px] text-slate-400 truncate">
          Instructor: <span class="${isColliding && conflictReasons.some(r => r.type === 'faculty') ? 'text-amber-400 font-bold' : 'text-slate-300'}">${cls.faculty || 'Unassigned'}</span>
        </div>
        ${cls.classIncharge ? `
          <div class="text-[10px] text-indigo-300 truncate">
            Incharge: <span class="font-medium">${cls.classIncharge}</span>
          </div>
        ` : ''}
      </div>

      ${isColliding && conflictReasons.length > 0 ? `
        <div class="mt-2.5 p-2 rounded-lg bg-red-900/40 border border-red-500/40 text-[10px] text-red-200 leading-tight">
          ${conflictReasons[0].message}
        </div>
      ` : ''}

      ${isHost ? `
        <div class="pt-2.5 border-t border-slate-700/60 mt-3 flex items-center justify-end gap-2">
          <button onclick="openEditDeptClassModal('${cls.id}')" class="p-1 text-slate-400 hover:text-white rounded" title="Edit Class Details">
            ${window.getIcon('edit')}
          </button>
          <button onclick="deleteDeptClass('${cls.id}')" class="p-1 text-slate-400 hover:text-red-400 rounded" title="Delete Class">
            ${window.getIcon('trash')}
          </button>
        </div>
      ` : `
        <div class="pt-2 border-t border-slate-800 text-[10px] text-slate-500 text-right mt-2 font-mono">
          Scheduled by Faculty
        </div>
      `}
    </div>
  `;
}

// Quick 1-click Incharge Edit
function quickEditIncharge(deptId) {
  const state = window.store.getState();
  const dept = (state.departments || []).find(d => d.id === deptId);
  if (!dept) return;

  const current = dept.classIncharge || '';
  const newIncharge = prompt(`Enter Class Incharge name for ${dept.name} (${dept.code}):`, current);
  if (newIncharge !== null && newIncharge.trim()) {
    window.store.updateDepartmentIncharge(deptId, newIncharge.trim());
    window.showToast(`Updated Class Incharge for ${dept.code}!`, "success");
    renderDepartments();
  }
}

// Modal: Add New Department
function openAddDepartmentModal() {
  const modalHtml = `
    <div id="dept-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay">
      <div class="glass-card bg-slate-900 border border-slate-700 w-full max-w-md p-6 rounded-2xl shadow-2xl relative animate-scale-up">
        <button onclick="closeModal('dept-modal')" class="absolute top-5 right-5 text-slate-400 hover:text-white">
          ${window.getIcon('x')}
        </button>
        <h3 class="text-xl font-bold text-white mb-1 flex items-center gap-2">
          ${window.getIcon('book', 'text-indigo-400')}
          Add Academic Department
        </h3>
        <p class="text-xs text-slate-400 mb-5">Create a department, assign HOD and Class Incharge</p>

        <form onsubmit="handleSaveDepartment(event)" class="space-y-4">
          <input type="hidden" id="dept-id-input" value="">

          <div class="grid grid-cols-3 gap-3">
            <div class="col-span-1">
              <label class="block text-xs font-medium text-slate-300 mb-1">Code *</label>
              <input type="text" id="dept-code" required placeholder="e.g. CSE" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none uppercase font-mono">
            </div>
            <div class="col-span-2">
              <label class="block text-xs font-medium text-slate-300 mb-1">Department Name *</label>
              <input type="text" id="dept-name" required placeholder="e.g. Computer Science & Eng" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none">
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">HOD / Department Chair</label>
            <input type="text" id="dept-hod" placeholder="e.g. Dr. Aris Thorne" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none">
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Class Incharge / Batch Coordinator *</label>
            <input type="text" id="dept-incharge" required placeholder="e.g. Prof. Michael Brooks" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none">
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Department Theme Color</label>
            <input type="color" id="dept-color" value="#6366f1" class="h-9 w-full rounded cursor-pointer bg-transparent border-0">
          </div>

          <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button type="button" onclick="closeModal('dept-modal')" class="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-sm">
              Cancel
            </button>
            <button type="submit" class="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow transition">
              Save Department
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

// Modal: Edit Department Details & Class Incharge
function openEditDepartmentModal(deptId) {
  const state = window.store.getState();
  const dept = (state.departments || []).find(d => d.id === deptId);
  if (!dept) return;

  openAddDepartmentModal();

  setTimeout(() => {
    if (document.getElementById('dept-id-input')) document.getElementById('dept-id-input').value = dept.id;
    if (document.getElementById('dept-code')) document.getElementById('dept-code').value = dept.code;
    if (document.getElementById('dept-name')) document.getElementById('dept-name').value = dept.name;
    if (document.getElementById('dept-hod')) document.getElementById('dept-hod').value = dept.hod || '';
    if (document.getElementById('dept-incharge')) document.getElementById('dept-incharge').value = dept.classIncharge || '';
    if (document.getElementById('dept-color')) document.getElementById('dept-color').value = dept.color || '#6366f1';
  }, 20);
}

function handleSaveDepartment(e) {
  e.preventDefault();
  const id = document.getElementById('dept-id-input').value;
  const code = document.getElementById('dept-code').value.trim().toUpperCase();
  const name = document.getElementById('dept-name').value.trim();
  const hod = document.getElementById('dept-hod').value.trim() || 'HOD';
  const classIncharge = document.getElementById('dept-incharge').value.trim() || 'Class Incharge';
  const color = document.getElementById('dept-color').value;

  if (id) {
    window.store.updateDepartment(id, { code, name, hod, classIncharge, color });
    window.showToast(`Updated Department "${code}"!`, "success");
  } else {
    window.store.addDepartment({ code, name, hod, classIncharge, color });
    window.showToast(`New Department "${code}" added!`, "success");
  }

  closeModal('dept-modal');
  renderDepartments();
}

function confirmDeleteDepartment(deptId) {
  const state = window.store.getState();
  const dept = (state.departments || []).find(d => d.id === deptId);
  if (!dept) return;

  if (confirm(`Are you sure you want to delete ${dept.name} (${dept.code})? This will also remove its subjects and classes.`)) {
    window.store.deleteDepartment(deptId);
    window.showToast(`Department ${dept.code} deleted`, "info");
    if (selectedDeptFilter === deptId) selectedDeptFilter = "all";
    renderDepartments();
  }
}

// Modal: Add Subject to Department
function openAddSubjectToDeptModal(deptId) {
  const state = window.store.getState();
  const dept = (state.departments || []).find(d => d.id === deptId);
  if (!dept) return;

  const modalHtml = `
    <div id="dept-subject-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay">
      <div class="glass-card bg-slate-900 border border-slate-700 w-full max-w-md p-6 rounded-2xl shadow-2xl relative animate-scale-up">
        <button onclick="closeModal('dept-subject-modal')" class="absolute top-5 right-5 text-slate-400 hover:text-white">
          ${window.getIcon('x')}
        </button>
        <h3 class="text-xl font-bold text-white mb-1 flex items-center gap-2">
          ${window.getIcon('book', 'text-indigo-400')}
          Add Subject to ${dept.code}
        </h3>
        <p class="text-xs text-slate-400 mb-5">Add a course to ${dept.name}</p>

        <form onsubmit="handleSaveSubjectToDept(event, '${deptId}')" class="space-y-4">
          <input type="hidden" id="dsub-id-input" value="">

          <div class="grid grid-cols-3 gap-3">
            <div class="col-span-1">
              <label class="block text-xs font-medium text-slate-300 mb-1">Code *</label>
              <input type="text" id="dsub-code" required placeholder="e.g. ${dept.code}305" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none uppercase font-mono">
            </div>
            <div class="col-span-2">
              <label class="block text-xs font-medium text-slate-300 mb-1">Subject Name *</label>
              <input type="text" id="dsub-name" required placeholder="e.g. Distributed Cloud Computing" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none">
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Faculty / Instructor</label>
              <input type="text" id="dsub-faculty" placeholder="e.g. Dr. H. Vance" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none">
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Credits</label>
              <input type="number" id="dsub-credits" min="1" max="8" value="4" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none">
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button type="button" onclick="closeModal('dept-subject-modal')" class="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-sm">
              Cancel
            </button>
            <button type="submit" class="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow transition">
              Save Subject
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

// Modal: Edit Subject Details
function openEditSubjectModal(deptId, subId) {
  const state = window.store.getState();
  const dept = (state.departments || []).find(d => d.id === deptId);
  if (!dept || !dept.subjects) return;

  const sub = dept.subjects.find(s => s.id === subId);
  if (!sub) return;

  openAddSubjectToDeptModal(deptId);

  setTimeout(() => {
    if (document.getElementById('dsub-id-input')) document.getElementById('dsub-id-input').value = sub.id;
    if (document.getElementById('dsub-code')) document.getElementById('dsub-code').value = sub.code;
    if (document.getElementById('dsub-name')) document.getElementById('dsub-name').value = sub.name;
    if (document.getElementById('dsub-faculty')) document.getElementById('dsub-faculty').value = sub.faculty || '';
    if (document.getElementById('dsub-credits')) document.getElementById('dsub-credits').value = sub.credits || 4;
  }, 20);
}

function handleSaveSubjectToDept(e, deptId) {
  e.preventDefault();
  const subId = document.getElementById('dsub-id-input').value;
  const code = document.getElementById('dsub-code').value.trim().toUpperCase();
  const name = document.getElementById('dsub-name').value.trim();
  const faculty = document.getElementById('dsub-faculty').value.trim();
  const credits = Number(document.getElementById('dsub-credits').value) || 4;

  if (subId) {
    window.store.updateDepartmentSubject(deptId, subId, { code, name, faculty, credits });
    window.showToast(`Updated course "${code}"!`, "success");
  } else {
    window.store.addDepartmentSubject(deptId, { code, name, faculty, credits });
    window.showToast(`Course "${code}" added to catalog!`, "success");
  }

  closeModal('dept-subject-modal');
  renderDepartments();
}

function confirmDeleteDeptSubject(deptId, subId) {
  if (confirm("Remove this subject from the department catalog?")) {
    window.store.deleteDepartmentSubject(deptId, subId);
    window.showToast("Subject removed", "info");
    renderDepartments();
  }
}

// Modal: Add / Edit Class of the Day with Real-time Collision Checker
function openAddDeptClassModal(prefillDeptId = null, prefillSubjectId = null, prefillDay = null) {
  const state = window.store.getState();
  const departments = state.departments || [];
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const defaultDeptId = prefillDeptId || (departments[0] ? departments[0].id : '');
  const day = prefillDay || selectedDeptDay || "Monday";

  const modalHtml = `
    <div id="dept-class-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay">
      <div class="glass-card bg-slate-900 border border-slate-700 w-full max-w-lg p-6 rounded-2xl shadow-2xl relative animate-scale-up">
        <button onclick="closeModal('dept-class-modal')" class="absolute top-5 right-5 text-slate-400 hover:text-white">
          ${window.getIcon('x')}
        </button>
        <h3 class="text-xl font-bold text-white mb-1 flex items-center gap-2">
          ${window.getIcon('calendar', 'text-indigo-400')}
          Schedule Class of the Day
        </h3>
        <p class="text-xs text-slate-400 mb-5">Assign department course to a room & slot with live collision detection</p>

        <form id="dept-class-form" onsubmit="handleSaveDeptClass(event)" class="space-y-4">
          <input type="hidden" id="dcls-id" value="">

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Department *</label>
              <select id="dcls-dept" onchange="updateDeptModalSubjects(this.value); triggerLiveConflictCheck();" required class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none">
                ${departments.map(d => `<option value="${d.id}" ${d.id === defaultDeptId ? 'selected' : ''}>${d.code} - ${d.name}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Day of the Week *</label>
              <select id="dcls-day" onchange="triggerLiveConflictCheck();" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none">
                ${daysOfWeek.map(d => `<option value="${d}" ${d.toLowerCase() === day.toLowerCase() ? 'selected' : ''}>${d}</option>`).join('')}
              </select>
            </div>
          </div>

          <!-- Subject Selector (Sub-section) -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="block text-xs font-medium text-slate-300">Department Subject *</label>
              <button type="button" onclick="quickPromptNewSubject()" class="text-[11px] text-indigo-400 hover:underline">+ New Subject</button>
            </div>
            <select id="dcls-subject" onchange="handleSubjectSelectChange(this.value); triggerLiveConflictCheck();" required class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none">
              <!-- Dynamically populated -->
            </select>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Start Time *</label>
              <input type="time" id="dcls-start" oninput="triggerLiveConflictCheck();" required value="09:00" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none">
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">End Time *</label>
              <input type="time" id="dcls-end" oninput="triggerLiveConflictCheck();" required value="10:30" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none">
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Room / Venue *</label>
              <input type="text" id="dcls-room" oninput="triggerLiveConflictCheck();" required placeholder="e.g. LH-302 / Lab 2" value="LH-302" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none">
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Student Batch / Section</label>
              <input type="text" id="dcls-batch" oninput="triggerLiveConflictCheck();" placeholder="e.g. CSE-A / Batch-1" value="Batch-1" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none">
            </div>
          </div>

          <div class="grid grid-cols-3 gap-3">
            <div class="col-span-1">
              <label class="block text-xs font-medium text-slate-300 mb-1">Instructor / Faculty</label>
              <input type="text" id="dcls-faculty" oninput="triggerLiveConflictCheck();" placeholder="e.g. Dr. A. Thorne" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none">
            </div>
            <div class="col-span-1">
              <label class="block text-xs font-medium text-slate-300 mb-1">Class Incharge</label>
              <input type="text" id="dcls-incharge" placeholder="e.g. Prof. Michael" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none">
            </div>
            <div class="col-span-1">
              <label class="block text-xs font-medium text-slate-300 mb-1">Session Type</label>
              <select id="dcls-type" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none">
                <option value="Lecture">Lecture</option>
                <option value="Lab">Practical Lab</option>
                <option value="Tutorial">Tutorial</option>
                <option value="Seminar">Seminar</option>
              </select>
            </div>
          </div>

          <!-- REAL-TIME INTERSECTION WARNING BOX -->
          <div id="modal-conflict-box" class="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-xs">
            <span class="text-slate-400">⚡ Checking schedule intersection...</span>
          </div>

          <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button type="button" onclick="closeModal('dept-class-modal')" class="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition">
              Cancel
            </button>
            <button type="submit" class="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium shadow-lg shadow-indigo-600/30 transition">
              Save Class
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);

  // Populate subjects & default incharge
  updateDeptModalSubjects(defaultDeptId, prefillSubjectId);
  triggerLiveConflictCheck();
}

function updateDeptModalSubjects(deptId, prefillSubjectId = null) {
  const state = window.store.getState();
  const dept = (state.departments || []).find(d => d.id === deptId);
  const subjectSelect = document.getElementById('dcls-subject');
  const inchargeInput = document.getElementById('dcls-incharge');

  if (dept && inchargeInput && !inchargeInput.value) {
    inchargeInput.value = dept.classIncharge || '';
  }

  if (!subjectSelect) return;

  const subjects = dept ? (dept.subjects || []) : [];

  if (subjects.length === 0) {
    subjectSelect.innerHTML = `<option value="">-- No subjects found. Click '+ New Subject' above --</option>`;
  } else {
    subjectSelect.innerHTML = subjects.map(s => `
      <option value="${s.id}" data-name="${s.name}" data-code="${s.code}" data-faculty="${s.faculty || ''}" ${s.id === prefillSubjectId ? 'selected' : ''}>
        ${s.code}: ${s.name} (${s.credits || 4} cr)
      </option>
    `).join('');
  }

  handleSubjectSelectChange(subjectSelect.value);
}

function handleSubjectSelectChange(subId) {
  if (!subId) return;
  const subjectSelect = document.getElementById('dcls-subject');
  const facultyInput = document.getElementById('dcls-faculty');
  if (subjectSelect && facultyInput) {
    const selectedOpt = subjectSelect.options[subjectSelect.selectedIndex];
    if (selectedOpt && selectedOpt.dataset.faculty && !facultyInput.value) {
      facultyInput.value = selectedOpt.dataset.faculty;
    }
  }
}

// Live real-time collision detection inside modal
function triggerLiveConflictCheck() {
  const conflictBox = document.getElementById('modal-conflict-box');
  if (!conflictBox) return;

  const id = document.getElementById('dcls-id') ? document.getElementById('dcls-id').value : null;
  const day = document.getElementById('dcls-day').value;
  const startTime = document.getElementById('dcls-start').value;
  const endTime = document.getElementById('dcls-end').value;
  const room = document.getElementById('dcls-room').value.trim();
  const faculty = document.getElementById('dcls-faculty').value.trim();
  const batch = document.getElementById('dcls-batch').value.trim();

  if (!startTime || !endTime || startTime >= endTime) {
    conflictBox.className = "p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300";
    conflictBox.innerHTML = `⚠️ End time must be after Start time!`;
    return;
  }

  const candidate = { day, startTime, endTime, room, faculty, batch };
  const clashes = window.store.checkNewClassIntersection(candidate, id || null);

  if (clashes.length > 0) {
    conflictBox.className = "p-3 rounded-xl bg-red-500/15 border border-red-500/40 text-xs text-red-300 space-y-1";
    conflictBox.innerHTML = `
      <div class="font-bold flex items-center gap-1.5 text-red-400">
        ${window.getIcon('alert', 'w-4 h-4')}
        Intersection Alert on ${day}:
      </div>
      ${clashes.map(c => `<div>${c}</div>`).join('')}
    `;
  } else {
    conflictBox.className = "p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2";
    conflictBox.innerHTML = `
      ${window.getIcon('checkCircle', 'w-4 h-4 text-emerald-400')}
      <span>Clear Slot: No room, instructor or batch collision on ${day}.</span>
    `;
  }
}

function handleSaveDeptClass(e) {
  e.preventDefault();
  const id = document.getElementById('dcls-id').value;
  const departmentId = document.getElementById('dcls-dept').value;
  const day = document.getElementById('dcls-day').value;
  const subjectSelect = document.getElementById('dcls-subject');
  const subjectId = subjectSelect.value;

  if (!subjectId) {
    alert("Please select or add a subject first!");
    return;
  }

  const selectedOpt = subjectSelect.options[subjectSelect.selectedIndex];
  const subjectName = selectedOpt.dataset.name || "Subject";
  const subjectCode = selectedOpt.dataset.code || "";

  const startTime = document.getElementById('dcls-start').value;
  const endTime = document.getElementById('dcls-end').value;
  const room = document.getElementById('dcls-room').value.trim();
  const batch = document.getElementById('dcls-batch').value.trim();
  const faculty = document.getElementById('dcls-faculty').value.trim();
  const classIncharge = document.getElementById('dcls-incharge').value.trim();
  const type = document.getElementById('dcls-type').value;

  if (startTime >= endTime) {
    alert("End time must be after Start time!");
    return;
  }

  // Conflict confirmation warning
  const candidate = { day, startTime, endTime, room, faculty, batch };
  const clashes = window.store.checkNewClassIntersection(candidate, id || null);
  if (clashes.length > 0) {
    const proceed = confirm(`Intersection Warning:\n${clashes.join('\n')}\n\nDo you still want to schedule this class with an overlap?`);
    if (!proceed) return;
  }

  const classData = { departmentId, day, subjectId, subjectName, subjectCode, startTime, endTime, room, batch, faculty, classIncharge, type };

  if (id) {
    window.store.updateDepartmentClass(id, classData);
    window.showToast("Class updated successfully!", "success");
  } else {
    window.store.addDepartmentClass(classData);
    window.showToast(`Class scheduled for ${day}!`, "success");
  }

  closeModal('dept-class-modal');
  selectedDeptDay = day;
  renderDepartments();
}

function openEditDeptClassModal(clsId) {
  const state = window.store.getState();
  const cls = (state.departmentClasses || []).find(c => c.id === clsId);
  if (!cls) return;

  openAddDeptClassModal(cls.departmentId, cls.subjectId, cls.day);

  setTimeout(() => {
    if (document.getElementById('dcls-id')) document.getElementById('dcls-id').value = cls.id;
    if (document.getElementById('dcls-dept')) document.getElementById('dcls-dept').value = cls.departmentId;
    if (document.getElementById('dcls-day')) document.getElementById('dcls-day').value = cls.day;
    updateDeptModalSubjects(cls.departmentId, cls.subjectId);
    if (document.getElementById('dcls-start')) document.getElementById('dcls-start').value = cls.startTime;
    if (document.getElementById('dcls-end')) document.getElementById('dcls-end').value = cls.endTime;
    if (document.getElementById('dcls-room')) document.getElementById('dcls-room').value = cls.room || '';
    if (document.getElementById('dcls-batch')) document.getElementById('dcls-batch').value = cls.batch || '';
    if (document.getElementById('dcls-faculty')) document.getElementById('dcls-faculty').value = cls.faculty || '';
    if (document.getElementById('dcls-incharge')) document.getElementById('dcls-incharge').value = cls.classIncharge || '';
    if (document.getElementById('dcls-type')) document.getElementById('dcls-type').value = cls.type || 'Lecture';
    triggerLiveConflictCheck();
  }, 30);
}

function deleteDeptClass(clsId) {
  if (confirm("Delete this department class?")) {
    window.store.deleteDepartmentClass(clsId);
    window.showToast("Class removed", "info");
    renderDepartments();
  }
}

function quickPromptNewSubject() {
  const deptSelect = document.getElementById('dcls-dept');
  if (!deptSelect) return;
  const deptId = deptSelect.value;
  openAddSubjectToDeptModal(deptId);
}

window.initDepartments = initDepartments;
window.renderDepartments = renderDepartments;
window.setDeptDay = setDeptDay;
window.setDeptFilter = setDeptFilter;
window.openAddDeptClassModal = openAddDeptClassModal;
window.openEditDeptClassModal = openEditDeptClassModal;
window.deleteDeptClass = deleteDeptClass;
window.handleSaveDeptClass = handleSaveDeptClass;
window.updateDeptModalSubjects = updateDeptModalSubjects;
window.handleSubjectSelectChange = handleSubjectSelectChange;
window.triggerLiveConflictCheck = triggerLiveConflictCheck;
window.openAddDepartmentModal = openAddDepartmentModal;
window.openEditDepartmentModal = openEditDepartmentModal;
window.handleSaveDepartment = handleSaveDepartment;
window.confirmDeleteDepartment = confirmDeleteDepartment;
window.quickEditIncharge = quickEditIncharge;
window.openAddSubjectToDeptModal = openAddSubjectToDeptModal;
window.openEditSubjectModal = openEditSubjectModal;
window.handleSaveSubjectToDept = handleSaveSubjectToDept;
window.confirmDeleteDeptSubject = confirmDeleteDeptSubject;
window.quickPromptNewSubject = quickPromptNewSubject;

// Room Availability & Teacher Free Period Management Component

let currentRoomsTab = 'rooms'; // 'rooms' or 'teachers'
let selectedRoomDay = 'Monday';
let selectedRoomBuildingFilter = 'all';
let selectedTeacherDeptFilter = 'all';

function initRooms() {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const todayName = days[new Date().getDay()];
  if (todayName !== "Sunday") {
    selectedRoomDay = todayName;
  }
  renderRoomsSection();
}

function setRoomsTab(tab) {
  currentRoomsTab = tab;
  renderRoomsSection();
}

function setRoomDay(day) {
  selectedRoomDay = day;
  renderRoomsSection();
}

function renderRoomsSection() {
  const container = document.getElementById('rooms-content');
  if (!container) return;

  const isHost = window.store.isHost();
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  let html = `
    <!-- Top Bar: Title & Tab Switcher -->
    <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div>
        <h3 class="text-xl font-bold text-white flex items-center gap-2">
          ${window.getIcon('mapPin', 'text-indigo-400')}
          Campus Space & Faculty Free Period Portal
        </h3>
        <p class="text-xs text-slate-400">Live room occupancy radar & professors' free office hours</p>
      </div>

      <!-- Mode Pill Tabs: Rooms vs Teachers -->
      <div class="flex items-center gap-2 p-1 bg-slate-900/80 rounded-xl border border-slate-700/60">
        <button onclick="setRoomsTab('rooms')" class="px-4 py-1.5 text-xs md:text-sm font-semibold rounded-lg transition ${currentRoomsTab === 'rooms' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:text-white'}">
          🚪 Room Vacancy Radar
        </button>
        <button onclick="setRoomsTab('teachers')" class="px-4 py-1.5 text-xs md:text-sm font-semibold rounded-lg transition ${currentRoomsTab === 'teachers' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:text-white'}">
          👨‍🏫 Teacher Free Periods
        </button>
      </div>
    </div>

    <!-- Day & Filter Selector Bar -->
    <div class="flex flex-wrap items-center justify-between gap-3 p-2.5 bg-slate-900/70 backdrop-blur rounded-2xl border border-slate-700/60 mb-6">
      <div class="flex items-center gap-1 overflow-x-auto no-scrollbar">
        <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 hidden sm:inline">Day:</span>
        ${daysOfWeek.map(d => `
          <button onclick="setRoomDay('${d}')" class="px-3.5 py-1.5 text-xs md:text-sm font-medium rounded-xl transition ${selectedRoomDay.toLowerCase() === d.toLowerCase() ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'}">
            ${d}
          </button>
        `).join('')}
      </div>

      <div class="flex items-center gap-2">
        ${currentRoomsTab === 'rooms' ? `
          <span class="text-xs text-slate-400">Building:</span>
          <select onchange="selectedRoomBuildingFilter = this.value; renderRoomsSection();" class="bg-slate-800 text-xs text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1.5 outline-none focus:border-indigo-500">
            <option value="all">All Campus Wings</option>
            <option value="Academic Block A">Block A</option>
            <option value="Academic Block B">Block B</option>
            <option value="Tech Wing">Tech Wing</option>
            <option value="Central Audi Complex">Auditorium</option>
            <option value="Innovation Hub">Innovation Hub</option>
          </select>
        ` : `
          <span class="text-xs text-slate-400">Department:</span>
          <select onchange="selectedTeacherDeptFilter = this.value; renderRoomsSection();" class="bg-slate-800 text-xs text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1.5 outline-none focus:border-indigo-500">
            <option value="all">All Departments</option>
            <option value="CSE">Computer Science (CSE)</option>
            <option value="ECE">Electronics (ECE)</option>
            <option value="MECH">Mechanical (MECH)</option>
            <option value="EE">Electrical (EE)</option>
          </select>
        `}
      </div>
    </div>
  `;

  if (currentRoomsTab === 'rooms') {
    html += renderRoomVacancyView(selectedRoomDay);
  } else {
    html += renderTeacherFreePeriodView(selectedRoomDay);
  }

  container.innerHTML = html;
}

// Render Room Vacancy Grid
function renderRoomVacancyView(day) {
  const roomsData = window.store.getRoomAvailability(day);

  const filtered = selectedRoomBuildingFilter === 'all'
    ? roomsData
    : roomsData.filter(r => r.room.building.includes(selectedRoomBuildingFilter) || selectedRoomBuildingFilter.includes(r.room.building));

  const totalRooms = filtered.length;
  const vacantNowCount = filtered.filter(r => !r.isOccupied).length;
  const occupiedCount = totalRooms - vacantNowCount;

  return `
    <!-- Top Summary Pills -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <div class="glass-card p-4 rounded-xl border border-slate-700/60 bg-slate-900/40 flex items-center justify-between">
        <div>
          <span class="text-xs text-slate-400 block mb-1">Total Rooms Tracked</span>
          <span class="text-2xl font-bold font-mono text-white">${totalRooms} Rooms</span>
        </div>
        <div class="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
          ${window.getIcon('mapPin')}
        </div>
      </div>

      <div class="glass-card p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 flex items-center justify-between">
        <div>
          <span class="text-xs text-emerald-400 font-semibold block mb-1">🟢 Vacant Right Now</span>
          <span class="text-2xl font-bold font-mono text-emerald-400">${vacantNowCount} Available</span>
        </div>
        <div class="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
          ${window.getIcon('checkCircle')}
        </div>
      </div>

      <div class="glass-card p-4 rounded-xl border border-red-500/30 bg-red-950/20 flex items-center justify-between">
        <div>
          <span class="text-xs text-red-400 font-semibold block mb-1">🔴 Occupied (Class in Session)</span>
          <span class="text-2xl font-bold font-mono text-red-400">${occupiedCount} Busy</span>
        </div>
        <div class="w-10 h-10 rounded-xl bg-red-500/20 text-red-300 flex items-center justify-center">
          ${window.getIcon('clock')}
        </div>
      </div>
    </div>

    <!-- Rooms Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      ${filtered.map(item => {
        const { room, isOccupied, currentSession, nextSession, todayBookings, hoursMap } = item;
        return `
          <div class="glass-card p-5 rounded-2xl border ${isOccupied ? 'border-red-500/40 bg-slate-900/80' : 'border-emerald-500/40 bg-slate-900/60'} hover:border-indigo-500/50 transition flex flex-col justify-between">
            <div>
              <!-- Header -->
              <div class="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span class="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    ${room.type || 'Room'}
                  </span>
                  <h4 class="text-base font-bold text-white mt-1">${room.name} (${room.id})</h4>
                  <p class="text-xs text-slate-400">${room.building} • ${room.floor} • Cap: ${room.capacity} seats</p>
                </div>

                <!-- Live Status Badge -->
                <span class="text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${isOccupied ? 'bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'}">
                  ${isOccupied ? '🔴 Occupied' : '🟢 Vacant'}
                </span>
              </div>

              <!-- Current / Next Session Status -->
              <div class="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs my-3 space-y-1">
                ${isOccupied && currentSession ? `
                  <div class="text-red-300 font-semibold flex items-center gap-1.5">
                    ${window.getIcon('clock', 'w-3.5 h-3.5')}
                    <span>Ongoing: ${currentSession.startTime} - ${currentSession.endTime}</span>
                  </div>
                  <p class="text-white font-medium">${currentSession.title}</p>
                  <p class="text-slate-400 text-[11px]">Instructor: ${currentSession.faculty || 'Faculty'} • Batch: ${currentSession.batch || 'All'}</p>
                ` : `
                  <div class="text-emerald-300 font-semibold flex items-center gap-1.5">
                    ${window.getIcon('checkCircle', 'w-3.5 h-3.5 text-emerald-400')}
                    <span>Currently Free for Self-Study or Meetings</span>
                  </div>
                  ${nextSession ? `
                    <p class="text-slate-400 text-[11px] mt-1">Next Class: <strong class="text-slate-200">${nextSession.title}</strong> at ${nextSession.startTime}</p>
                  ` : `
                    <p class="text-slate-400 text-[11px] mt-1">No further classes scheduled in this room today.</p>
                  `}
                `}
              </div>

              <!-- Visual Hourly Bar (8 AM to 6 PM) -->
              <div class="mt-3">
                <div class="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                  <span>8 AM</span>
                  <span class="font-mono">Day Timeline (${day.slice(0,3)})</span>
                  <span>6 PM</span>
                </div>
                <div class="grid grid-cols-11 gap-1 h-3 rounded-lg overflow-hidden bg-slate-800 p-0.5 border border-slate-700">
                  ${hoursMap.map(slot => `
                    <div class="h-full rounded-sm ${slot.busy ? 'bg-red-500' : 'bg-emerald-500/70'}" title="${slot.timeLabel}: ${slot.busy ? 'Occupied' : 'Vacant'}"></div>
                  `).join('')}
                </div>
              </div>
            </div>

            <div class="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between mt-4">
              <span>${todayBookings.length} booking${todayBookings.length === 1 ? '' : 's'} on ${day}</span>
              ${window.store.isHost() ? `
                <button onclick="openAddDeptClassModal(null, null, '${day}')" class="text-indigo-400 hover:text-indigo-300">
                  + Book Slot
                </button>
              ` : `
                <span class="text-slate-500">Student View</span>
              `}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// Render Teacher Free Periods View
function renderTeacherFreePeriodView(day) {
  const teachersData = window.store.getTeacherFreePeriods(day);

  const filtered = selectedTeacherDeptFilter === 'all'
    ? teachersData
    : teachersData.filter(t => t.teacher.deptCode === selectedTeacherDeptFilter || t.teacher.dept.includes(selectedTeacherDeptFilter));

  const totalTeachers = filtered.length;
  const freeNowCount = filtered.filter(t => t.isFreeNow).length;

  return `
    <!-- Top Summary Pills -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <div class="glass-card p-4 rounded-xl border border-slate-700/60 bg-slate-900/40 flex items-center justify-between">
        <div>
          <span class="text-xs text-slate-400 block mb-1">Faculty Tracked</span>
          <span class="text-2xl font-bold font-mono text-white">${totalTeachers} Professors</span>
        </div>
        <div class="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
          ${window.getIcon('user')}
        </div>
      </div>

      <div class="glass-card p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 flex items-center justify-between">
        <div>
          <span class="text-xs text-emerald-400 font-semibold block mb-1">🟢 Free Period Now</span>
          <span class="text-2xl font-bold font-mono text-emerald-400">${freeNowCount} In Cabin</span>
        </div>
        <div class="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
          ${window.getIcon('checkCircle')}
        </div>
      </div>

      <div class="glass-card p-4 rounded-xl border border-indigo-500/30 bg-indigo-950/20 flex items-center justify-between">
        <div>
          <span class="text-xs text-indigo-400 font-semibold block mb-1">🔴 In Lecture / Lab</span>
          <span class="text-2xl font-bold font-mono text-indigo-300">${totalTeachers - freeNowCount} Teaching</span>
        </div>
        <div class="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center">
          ${window.getIcon('book')}
        </div>
      </div>
    </div>

    <!-- Teacher Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
      ${filtered.map(item => {
        const { teacher, isFreeNow, currentTeachingSession, teachingClasses, freePeriods } = item;
        return `
          <div class="glass-card p-5 rounded-2xl border ${isFreeNow ? 'border-emerald-500/40 bg-slate-900/60' : 'border-slate-700/80 bg-slate-900/80'} hover:border-indigo-500/50 transition flex flex-col justify-between">
            <div>
              <!-- Header -->
              <div class="flex items-start justify-between gap-3 mb-3">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center text-xl font-bold font-mono">
                    ${teacher.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700">
                        ${teacher.deptCode}
                      </span>
                      <h4 class="text-base font-bold text-white">${teacher.name}</h4>
                    </div>
                    <p class="text-xs text-slate-400">${teacher.title} • ${teacher.dept}</p>
                    <p class="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                      ${window.getIcon('mapPin', 'w-3 h-3 text-slate-500')}
                      <span>${teacher.cabin}</span>
                    </p>
                  </div>
                </div>

                <!-- Live Status Badge -->
                <span class="text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${isFreeNow ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-red-500/20 text-red-300 border border-red-500/40'}">
                  ${isFreeNow ? '🟢 Free in Cabin' : '🔴 In Lecture'}
                </span>
              </div>

              <!-- Live Status Banner -->
              <div class="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs mb-4">
                ${isFreeNow ? `
                  <div class="flex items-center gap-2 text-emerald-300 font-semibold mb-0.5">
                    ${window.getIcon('checkCircle', 'w-3.5 h-3.5 text-emerald-400')}
                    <span>Available Right Now for Doubts & Office Hours</span>
                  </div>
                  <p class="text-slate-400 text-[11px]">Visit ${teacher.cabin} or contact via email: <span class="text-indigo-300 font-mono">${teacher.email}</span></p>
                ` : `
                  <div class="flex items-center gap-2 text-red-300 font-semibold mb-0.5">
                    ${window.getIcon('clock', 'w-3.5 h-3.5 text-red-400')}
                    <span>Teaching Right Now: ${currentTeachingSession.subject} (${currentTeachingSession.startTime} - ${currentTeachingSession.endTime})</span>
                  </div>
                  <p class="text-slate-400 text-[11px]">Location: <strong class="text-slate-200">${currentTeachingSession.room}</strong> • Batch: ${currentTeachingSession.batch || 'All'}</p>
                `}
              </div>

              <!-- Available Free Periods on This Day -->
              <div>
                <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  🗓️ Scheduled Free Periods Today (${day}):
                </span>

                <div class="flex flex-wrap gap-2">
                  ${freePeriods.length === 0 ? `
                    <span class="text-xs text-slate-500 italic">No free periods between 8:30 AM and 5:30 PM (Fully booked).</span>
                  ` : freePeriods.map(p => `
                    <div class="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-medium flex items-center gap-1.5">
                      ${window.getIcon('clock', 'w-3 h-3 text-emerald-400')}
                      <span>${p.start} - ${p.end}</span>
                      <span class="text-[10px] text-slate-400">(${p.durationMins}m)</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>

            <!-- Teaching Load Footer -->
            <div class="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between mt-4">
              <span>Teaching ${teachingClasses.length} class${teachingClasses.length === 1 ? '' : 'es'} on ${day}</span>
              <span class="text-indigo-300 font-mono">${teacher.email}</span>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

window.initRooms = initRooms;
window.renderRoomsSection = renderRoomsSection;
window.setRoomsTab = setRoomsTab;
window.setRoomDay = setRoomDay;

// Biometric Face-Scan Attendance Machine Gateway Component

let isWebcamActive = false;
let webcamStream = null;
let biometricFilter = 'all'; // 'all', 'student', 'teacher'

function initBiometrics() {
  renderBiometrics();
}

function setBiometricFilter(filter) {
  biometricFilter = filter;
  renderBiometrics();
}

function renderBiometrics() {
  const container = document.getElementById('biometrics-content');
  if (!container) return;

  const state = window.store.getState();
  const biometrics = state.biometrics || {};
  const scanLogs = biometrics.scanLogs || [];
  const registeredFaces = biometrics.registeredFaces || [];
  const isHost = window.store.isHost();

  const filteredLogs = scanLogs.filter(log => {
    if (biometricFilter === 'all') return true;
    return log.role === biometricFilter;
  });

  const studentScans = scanLogs.filter(l => l.role === 'student').length;
  const teacherScans = scanLogs.filter(l => l.role === 'teacher').length;

  let html = `
    <!-- Top Bar: Machine Status & Info -->
    <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div>
        <div class="flex items-center gap-2">
          <h3 class="text-xl font-bold text-white flex items-center gap-2">
            ${window.getIcon('checkCircle', 'text-cyan-400')}
            Biometric Face-Scan Attendance Gateway
          </h3>
          <span class="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 animate-pulse">
            <span class="w-2 h-2 rounded-full bg-emerald-400"></span> Machine Online
          </span>
        </div>
        <p class="text-xs text-slate-400 mt-0.5">Automated facial recognition terminal collecting student & teacher attendance</p>
      </div>

      <!-- Machine Hardware Details -->
      <div class="flex items-center gap-3">
        <div class="p-2 px-3 rounded-xl bg-slate-900/80 border border-slate-700/60 text-xs">
          <span class="text-slate-400">Terminal:</span>
          <strong class="text-cyan-300 font-mono ml-1">${biometrics.terminalName || 'BioCam Pro Terminal #102'}</strong>
        </div>
      </div>
    </div>

    <!-- Main Terminal Row: Live Scanner + Terminal Stats -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">

      <!-- 1. Live Face Recognition Terminal Viewfinder (5 cols) -->
      <div class="lg:col-span-5 glass-card p-5 rounded-3xl border border-cyan-500/30 bg-slate-900/90 shadow-2xl flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
            <span class="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
              Optical AI Face Scanner
            </span>
            <span class="text-[10px] font-mono text-slate-400">FPS: 30 • 1080p AI</span>
          </div>

          <!-- Viewfinder Window -->
          <div class="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-950 border-2 border-cyan-500/40 flex items-center justify-center group shadow-inner">
            <video id="biometric-video" autoplay playsinline muted class="w-full h-full object-cover ${isWebcamActive ? '' : 'hidden'}"></video>

            <!-- Simulated Viewfinder Animation when camera is off -->
            <div id="simulated-viewfinder" class="w-full h-full flex flex-col items-center justify-center p-6 text-center ${isWebcamActive ? 'hidden' : ''}">
              <!-- High-Tech Bounding Box Overlay -->
              <div class="relative w-36 h-36 border-2 border-dashed border-cyan-400/80 rounded-2xl flex items-center justify-center mb-2 shadow-lg shadow-cyan-500/20">
                <span class="text-4xl animate-bounce">👤</span>
                <!-- Corner brackets -->
                <div class="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-cyan-400"></div>
                <div class="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-cyan-400"></div>
                <div class="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-cyan-400"></div>
                <div class="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-cyan-400"></div>
              </div>
              <p class="text-xs font-mono text-cyan-300 font-semibold tracking-wide">AI FACE-DETECTION READY</p>
              <p class="text-[11px] text-slate-400 mt-1">Stand in front of the terminal gate for biometric attendance</p>
            </div>

            <!-- Scanning Laser Line -->
            <div class="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-lg shadow-cyan-400 animate-bounce pointer-events-none opacity-80"></div>

            <!-- Terminal Info Watermark -->
            <div class="absolute bottom-2 left-3 text-[10px] font-mono text-cyan-300/80 pointer-events-none bg-black/60 px-2 py-0.5 rounded backdrop-blur">
              TERMINAL: LH-302 GATE • CONF: 99.4%
            </div>
          </div>
        </div>

        <!-- Scanner Trigger Actions -->
        <div class="space-y-2.5 mt-4 pt-3 border-t border-slate-800">
          <div class="grid grid-cols-2 gap-2">
            <button onclick="simulateFaceScan('student')" class="py-2.5 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-lg shadow-cyan-600/30 transition flex items-center justify-center gap-1.5">
              <span>👨‍🎓 Scan Student Face</span>
            </button>
            <button onclick="simulateFaceScan('teacher')" class="py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-1.5">
              <span>👨‍🏫 Scan Teacher Face</span>
            </button>
          </div>

          <div class="flex items-center justify-between text-xs pt-1">
            <button onclick="toggleWebcamPreview()" class="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium">
              ${window.getIcon('activity', 'w-3.5 h-3.5')}
              <span id="webcam-btn-text">${isWebcamActive ? 'Switch to AI Simulator' : 'Enable Real Webcam'}</span>
            </button>
            <span class="text-[11px] text-slate-400 font-mono">Auto-Attendance: Active</span>
          </div>
        </div>
      </div>

      <!-- 2. Terminal Live Metrics & Registered Faces Catalog (7 cols) -->
      <div class="lg:col-span-7 flex flex-col justify-between space-y-4">
        <!-- Stats Row -->
        <div class="grid grid-cols-3 gap-3">
          <div class="glass-card p-4 rounded-2xl border border-slate-700/60 bg-slate-900/60">
            <span class="text-xs text-slate-400 block mb-1">Today's Machine Scans</span>
            <span class="text-2xl font-bold font-mono text-white">${scanLogs.length} Scans</span>
          </div>
          <div class="glass-card p-4 rounded-2xl border border-cyan-500/30 bg-cyan-950/20">
            <span class="text-xs text-cyan-400 font-semibold block mb-1">Students Verified</span>
            <span class="text-2xl font-bold font-mono text-cyan-300">${studentScans} Present</span>
          </div>
          <div class="glass-card p-4 rounded-2xl border border-indigo-500/30 bg-indigo-950/20">
            <span class="text-xs text-indigo-400 font-semibold block mb-1">Teachers Checked In</span>
            <span class="text-2xl font-bold font-mono text-indigo-300">${teacherScans} Faculty</span>
          </div>
        </div>

        <!-- Registered Faces in Machine Database -->
        <div class="glass-card p-5 rounded-2xl border border-slate-700/60 flex-1 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                ${window.getIcon('users', 'w-3.5 h-3.5 text-cyan-400')}
                Enrolled Face Templates in Machine Database (${registeredFaces.length})
              </span>
              <span class="text-[11px] text-emerald-400 font-mono">100% Neural Encrypted</span>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-48 overflow-y-auto pr-1">
              ${registeredFaces.map(rf => `
                <div class="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs flex items-center gap-2">
                  <span class="text-2xl">${rf.avatar || '👤'}</span>
                  <div class="overflow-hidden">
                    <span class="font-bold text-white block truncate text-[11px]">${rf.name}</span>
                    <span class="text-[10px] text-slate-400 font-mono block">${rf.idNumber} (${rf.role})</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <p class="text-[11px] text-slate-400 italic mt-3 pt-2 border-t border-slate-800">
            💡 Attendance recorded by this machine is instantly verified and automatically increments student academic attendance records.
          </p>
        </div>
      </div>

    </div>

    <!-- Machine Log Feed Section: Live Biometric Records Collected -->
    <div class="glass-card p-6 rounded-3xl border border-slate-700/80">
      <div class="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800">
        <div>
          <h4 class="text-base font-bold text-white flex items-center gap-2">
            ${window.getIcon('checkCircle', 'text-cyan-400')}
            Biometric Data Feed Collected by Machine
          </h4>
          <p class="text-xs text-slate-400">Timestamped facial verification logs collected from campus terminals</p>
        </div>

        <!-- Filter pills -->
        <div class="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-700">
          <button onclick="setBiometricFilter('all')" class="px-3 py-1 text-xs font-medium rounded-lg transition ${biometricFilter === 'all' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'}">
            All Records (${scanLogs.length})
          </button>
          <button onclick="setBiometricFilter('student')" class="px-3 py-1 text-xs font-medium rounded-lg transition ${biometricFilter === 'student' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'}">
            Students (${studentScans})
          </button>
          <button onclick="setBiometricFilter('teacher')" class="px-3 py-1 text-xs font-medium rounded-lg transition ${biometricFilter === 'teacher' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'}">
            Teachers (${teacherScans})
          </button>
        </div>
      </div>

      <!-- Logs Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider">
              <th class="py-2.5 px-3">Person</th>
              <th class="py-2.5 px-3">Role</th>
              <th class="py-2.5 px-3">ID Number</th>
              <th class="py-2.5 px-3">Terminal / Room</th>
              <th class="py-2.5 px-3">Time</th>
              <th class="py-2.5 px-3">AI Confidence</th>
              <th class="py-2.5 px-3">Verification Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/60">
            ${filteredLogs.length === 0 ? `
              <tr>
                <td colspan="7" class="py-8 text-center text-slate-500 italic">No biometric scan records matching filter.</td>
              </tr>
            ` : filteredLogs.map(log => `
              <tr class="hover:bg-slate-800/40 transition">
                <td class="py-3 px-3">
                  <div class="flex items-center gap-2">
                    <span class="text-lg">${log.photo || '👤'}</span>
                    <strong class="text-white font-semibold">${log.personName}</strong>
                  </div>
                </td>
                <td class="py-3 px-3">
                  <span class="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${log.role === 'teacher' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'}">
                    ${log.role}
                  </span>
                </td>
                <td class="py-3 px-3 font-mono text-slate-300">${log.idNumber}</td>
                <td class="py-3 px-3 text-slate-300 font-medium">${log.room}</td>
                <td class="py-3 px-3 font-mono text-indigo-300 font-medium">${log.timestamp}</td>
                <td class="py-3 px-3 font-mono text-emerald-400 font-bold">${log.confidence}</td>
                <td class="py-3 px-3">
                  <span class="text-[11px] font-semibold text-emerald-300 flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    ${log.status}
                  </span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  container.innerHTML = html;
}

// Simulate Scanning Face
function simulateFaceScan(role = 'student') {
  const state = window.store.getState();
  const biometrics = state.biometrics || {};
  const registeredFaces = biometrics.registeredFaces || [];

  const candidates = registeredFaces.filter(f => f.role === role);
  if (candidates.length === 0) return;

  const picked = candidates[Math.floor(Math.random() * candidates.length)];
  const confidence = (98.5 + Math.random() * 1.4).toFixed(1) + '%';
  const rooms = ["LH-302", "CS Lab 2", "Audi-1", "Room 204"];
  const room = rooms[Math.floor(Math.random() * rooms.length)];

  // Log scan into store
  const scan = window.store.logBiometricScan(picked.name, picked.role, picked.idNumber, room, confidence);

  window.showToast(`Biometric Scan Verified: ${picked.name} (${picked.role.toUpperCase()}) Marked Present at ${room}!`, "success");
  renderBiometrics();
}

// Toggle Real Webcam preview
async function toggleWebcamPreview() {
  const videoEl = document.getElementById('biometric-video');
  const simView = document.getElementById('simulated-viewfinder');
  const btnText = document.getElementById('webcam-btn-text');

  if (isWebcamActive) {
    if (webcamStream) {
      webcamStream.getTracks().forEach(track => track.stop());
      webcamStream = null;
    }
    isWebcamActive = false;
    if (videoEl) videoEl.classList.add('hidden');
    if (simView) simView.classList.remove('hidden');
    if (btnText) btnText.innerText = 'Enable Real Webcam';
    window.showToast("Switched back to AI Face Scanner Simulator", "info");
  } else {
    try {
      webcamStream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } });
      isWebcamActive = true;
      if (videoEl) {
        videoEl.srcObject = webcamStream;
        videoEl.classList.remove('hidden');
      }
      if (simView) simView.classList.add('hidden');
      if (btnText) btnText.innerText = 'Turn Off Real Camera';
      window.showToast("Real Camera Connected to Biometric Terminal!", "success");
    } catch (err) {
      alert("Camera access was not granted or not available. Using high-tech AI Simulator.");
    }
  }
}

window.initBiometrics = initBiometrics;
window.renderBiometrics = renderBiometrics;
window.setBiometricFilter = setBiometricFilter;
window.simulateFaceScan = simulateFaceScan;
window.toggleWebcamPreview = toggleWebcamPreview;

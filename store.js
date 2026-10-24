// Central State Management & LocalStorage Persistence for College Timetable Hub

const STORAGE_KEY = 'COLLEGE_HUB_DATA_V1';

const defaultState = {
  currentRole: 'host', // 'host' (Admin/Faculty with full edit permissions) or 'student' (Read-only view)
  student: {
    name: "Alex Rivera",
    rollNo: "CS23-B042",
    branch: "Computer Science & Engineering",
    semester: "Semester 5 (Fall 2026)",
    college: "Institute of Technology & Science"
  },
  wearables: {
    connectedApp: 'fitbit', // 'fitbit', 'applehealth', 'googlefit', 'garmin', 'none'
    deviceName: 'Fitbit Charge 6 (Connected)',
    lastSync: '10 mins ago',
    heartRate: 72,
    heartRateStatus: 'Resting Normal',
    steps: 8420,
    stepGoal: 10000,
    activeCalories: 485,
    spo2: 98,
    battery: 82,
    sleepMinutes: 445, // 7h 25m
    sleepScore: 88,
    syncHistory: [
      { id: 'wh-1', app: 'Fitbit', time: '11:30 AM', text: 'Steps & HR Auto-Sync (8,420 steps, 72 bpm)' },
      { id: 'wh-2', app: 'Fitbit', time: '08:00 AM', text: 'Sleep Stages Imported (7h 25m, 88 Sleep Score)' }
    ]
  },
  biometrics: {
    terminalName: 'BioCam Pro AI Vision Gate (Terminal #102)',
    terminalStatus: 'online',
    currentLocation: 'Academic Block A - LH-302 Terminal',
    autoAttendanceEnabled: true,
    scanLogs: [
      { id: 'scan-1', personName: 'Alex Rivera', role: 'student', idNumber: 'CS23-B042', dept: 'CSE', timestamp: '08:58 AM', date: 'Today', room: 'LH-302', confidence: '99.6%', status: 'Present Verified', photo: '👨‍🎓' },
      { id: 'scan-2', personName: 'Dr. Aris Thorne', role: 'teacher', idNumber: 'FAC-012', dept: 'CSE', timestamp: '08:52 AM', date: 'Today', room: 'LH-302', confidence: '99.8%', status: 'Faculty Checked In', photo: '👨‍🏫' },
      { id: 'scan-3', personName: 'Prof. Meera Sen', role: 'teacher', idNumber: 'FAC-015', dept: 'CSE', timestamp: '10:25 AM', date: 'Today', room: 'CS Lab 2', confidence: '99.2%', status: 'Faculty Checked In', photo: '👩‍🏫' },
      { id: 'scan-4', personName: 'Tanya Sharma', role: 'student', idNumber: 'CS23-B012', dept: 'CSE', timestamp: '10:28 AM', date: 'Today', room: 'CS Lab 2', confidence: '99.1%', status: 'Present Verified', photo: '👩‍🎓' },
      { id: 'scan-5', personName: 'Dr. Priya Nair', role: 'teacher', idNumber: 'FAC-019', dept: 'ECE', timestamp: '09:55 AM', date: 'Today', room: 'LH-302', confidence: '98.9%', status: 'Faculty Checked In', photo: '👩‍🏫' }
    ],
    registeredFaces: [
      { id: 'rf-1', name: 'Alex Rivera', role: 'student', idNumber: 'CS23-B042', dept: 'CSE', registered: true, avatar: '👨‍🎓' },
      { id: 'rf-2', name: 'Tanya Sharma', role: 'student', idNumber: 'CS23-B012', dept: 'CSE', registered: true, avatar: '👩‍🎓' },
      { id: 'rf-3', name: 'Rohan Verma', role: 'student', idNumber: 'EC23-A015', dept: 'ECE', registered: true, avatar: '👨‍🎓' },
      { id: 'rf-4', name: 'Dr. Aris Thorne', role: 'teacher', idNumber: 'FAC-012', dept: 'CSE', registered: true, avatar: '👨‍🏫' },
      { id: 'rf-5', name: 'Prof. Meera Sen', role: 'teacher', idNumber: 'FAC-015', dept: 'CSE', registered: true, avatar: '👩‍🏫' },
      { id: 'rf-6', name: 'Dr. Priya Nair', role: 'teacher', idNumber: 'FAC-019', dept: 'ECE', registered: true, avatar: '👩‍🏫' },
      { id: 'rf-7', name: 'Dr. Rajesh Kulkarni', role: 'teacher', idNumber: 'FAC-024', dept: 'MECH', registered: true, avatar: '👨‍🏫' },
      { id: 'rf-8', name: 'Dr. Sunita Ghosh', role: 'teacher', idNumber: 'FAC-031', dept: 'EE', registered: true, avatar: '👩‍🏫' }
    ]
  },
  studentsList: [
    { id: "std-1", name: "Alex Rivera", rollNo: "CS23-B042", branch: "CSE", batch: "Batch A", email: "a.rivera@college.edu", avatar: "👨‍🎓" },
    { id: "std-2", name: "Tanya Sharma", rollNo: "CS23-B012", branch: "CSE", batch: "Batch A", email: "t.sharma@college.edu", avatar: "👩‍🎓" },
    { id: "std-3", name: "Rohan Verma", rollNo: "EC23-A015", branch: "ECE", batch: "Batch B", email: "r.verma@college.edu", avatar: "👨‍🎓" },
    { id: "std-4", name: "Priya Patel", rollNo: "CS23-B028", branch: "CSE", batch: "Batch A", email: "p.patel@college.edu", avatar: "👩‍🎓" },
    { id: "std-5", name: "Kevin Zhang", rollNo: "CS23-B035", branch: "CSE", batch: "Batch B", email: "k.zhang@college.edu", avatar: "👨‍🎓" },
    { id: "std-6", name: "Neha Gupta", rollNo: "EC23-A022", branch: "ECE", batch: "Batch A", email: "n.gupta@college.edu", avatar: "👩‍🎓" },
    { id: "std-7", name: "Marcus Brody", rollNo: "ME23-C009", branch: "MECH", batch: "Batch C", email: "m.brody@college.edu", avatar: "👨‍🎓" },
    { id: "std-8", name: "Sunil Shenoy", rollNo: "EE23-D014", branch: "EE", batch: "Batch D", email: "s.shenoy@college.edu", avatar: "👨‍🎓" }
  ],
  opdSchedule: [
    {
      id: "opd-1",
      day: "Monday",
      department: "General Medicine & Internal Health",
      clinicRoom: "OPD Room 101 (Block C - Ground Floor)",
      shift: "Morning (08:30 AM - 01:00 PM)",
      doctor: "Dr. Aris Thorne, MD (Senior Consultant)",
      batch: "Clinical Batch A (8 Students)",
      maxTokens: 50,
      status: "Active",
      color: "#3b82f6"
    },
    {
      id: "opd-2",
      day: "Monday",
      department: "Pediatrics & Neonatal Care",
      clinicRoom: "Pediatric OPD 2 (Child Wing)",
      shift: "Morning (09:00 AM - 01:00 PM)",
      doctor: "Dr. Sunita Ghosh, MD (Pediatrics HOD)",
      batch: "Clinical Batch B (6 Students)",
      maxTokens: 40,
      status: "Active",
      color: "#10b981"
    },
    {
      id: "opd-3",
      day: "Tuesday",
      department: "Orthopedics, Spine & Trauma Care",
      clinicRoom: "OPD Room 204 (Surgical Block)",
      shift: "Morning (08:30 AM - 01:00 PM)",
      doctor: "Dr. Rajesh Kulkarni, MS (Ortho)",
      batch: "Clinical Batch C (8 Students)",
      maxTokens: 45,
      status: "Active",
      color: "#f59e0b"
    },
    {
      id: "opd-4",
      day: "Tuesday",
      department: "Dermatology & Skin Specialty",
      clinicRoom: "OPD Chamber 12 (Block A)",
      shift: "Evening (04:00 PM - 07:00 PM)",
      doctor: "Dr. Priya Nair, MD (Dermatology)",
      batch: "Clinical Batch A (Interns)",
      maxTokens: 35,
      status: "Active",
      color: "#8b5cf6"
    },
    {
      id: "opd-5",
      day: "Wednesday",
      department: "Cardiology & Preventive Heart Clinic",
      clinicRoom: "Cardio Wing OPD 1 (Block B)",
      shift: "Morning (09:00 AM - 01:30 PM)",
      doctor: "Dr. Robert Vance, DM (Cardiology)",
      batch: "Clinical Batch D (6 Students)",
      maxTokens: 30,
      status: "Active",
      color: "#ec4899"
    },
    {
      id: "opd-6",
      day: "Thursday",
      department: "ENT (Ear, Nose, Throat) & Audiology",
      clinicRoom: "OPD Room 108 (Block C)",
      shift: "Morning (08:30 AM - 01:00 PM)",
      doctor: "Prof. Meera Sen, MS (ENT)",
      batch: "Clinical Batch B (8 Students)",
      maxTokens: 45,
      status: "Active",
      color: "#06b6d4"
    },
    {
      id: "opd-7",
      day: "Friday",
      department: "Ophthalmology & Eye Care",
      clinicRoom: "Eye OPD 3 (Refraction Center)",
      shift: "Morning (08:30 AM - 01:00 PM)",
      doctor: "Prof. Kavita Rao, MS (Ophthalmology)",
      batch: "Clinical Batch C (6 Students)",
      maxTokens: 55,
      status: "Active",
      color: "#6366f1"
    },
    {
      id: "opd-8",
      day: "Saturday",
      department: "Emergency & General Surgery Pre-Op",
      clinicRoom: "Surgical Suite OPD 4",
      shift: "Morning (09:00 AM - 02:00 PM)",
      doctor: "Dr. Rajesh Kulkarni, MS (Surgery)",
      batch: "Weekend Trauma Team A",
      maxTokens: 40,
      status: "Active",
      color: "#ef4444"
    },
    {
      id: "opd-9",
      day: "Sunday",
      department: "Weekend Walk-In & Specialty Consultation",
      clinicRoom: "OPD Central Atrium (Emergency Wing)",
      shift: "Morning (09:00 AM - 01:00 PM)",
      doctor: "Dr. Aris Thorne & On-Duty Fellow",
      batch: "Sunday Rotation Interns (Batch A)",
      maxTokens: 35,
      status: "Active",
      color: "#14b8a6"
    }
  ],
  rooms: [
    { id: "LH-302", name: "Lecture Hall 302", capacity: 80, building: "Academic Block A", type: "Lecture Hall", floor: "3rd Floor" },
    { id: "CS Lab 2", name: "Computer Systems Lab 2", capacity: 45, building: "Tech Wing", type: "Computer Lab", floor: "2nd Floor" },
    { id: "Audi-1", name: "Main Auditorium 1", capacity: 250, building: "Central Audi Complex", type: "Auditorium", floor: "Ground Floor" },
    { id: "Audi-2", name: "Seminar Auditorium 2", capacity: 120, building: "Central Audi Complex", type: "Auditorium", floor: "1st Floor" },
    { id: "Room 204", name: "Smart Classroom 204", capacity: 50, building: "Academic Block B", type: "Classroom", floor: "2nd Floor" },
    { id: "Sem Hall B", name: "Executive Seminar Hall B", capacity: 90, building: "Admin Block", type: "Seminar Hall", floor: "Ground Floor" },
    { id: "Systems Lab", name: "Linux & Kernel Systems Lab", capacity: 40, building: "Tech Wing", type: "Computer Lab", floor: "1st Floor" },
    { id: "AI Lab 4", name: "Machine Learning & AI Sandbox", capacity: 40, building: "Innovation Hub", type: "AI Lab", floor: "4th Floor" },
    { id: "Power Lab 1", name: "High Voltage Electrical Lab", capacity: 35, building: "Engineering Wing", type: "Engineering Lab", floor: "Ground Floor" },
    { id: "Maker Space", name: "Robotics & Hardware Prototyping", capacity: 30, building: "Innovation Hub", type: "Maker Workshop", floor: "Ground Floor" },
    { id: "VLSI Lab 1", name: "Microelectronics & VLSI Lab", capacity: 35, building: "ECE Department Wing", type: "Hardware Lab", floor: "2nd Floor" },
    { id: "Workshop 3", name: "Mechanical Machinery Workshop", capacity: 45, building: "Mechanical Shed", type: "Machinery Shop", floor: "Ground Floor" }
  ],
  teachers: [
    { id: "fac-1", name: "Dr. Aris Thorne", dept: "Computer Science & Eng", deptCode: "CSE", title: "Professor & HOD", cabin: "Cabin A-304 (Block A)", email: "a.thorne@college.edu", phone: "+1 (555) 012-304" },
    { id: "fac-2", name: "Prof. Meera Sen", dept: "Computer Science & Eng", deptCode: "CSE", title: "Associate Professor", cabin: "Cabin A-308 (Block A)", email: "m.sen@college.edu", phone: "+1 (555) 012-308" },
    { id: "fac-3", name: "Dr. Robert Vance", dept: "Computer Science & Eng", deptCode: "CSE", title: "Assistant Professor (AI)", cabin: "Cabin A-312 (Block A)", email: "r.vance@college.edu", phone: "+1 (555) 012-312" },
    { id: "fac-4", name: "Prof. Kavita Rao", dept: "Computer Science & Eng", deptCode: "CSE", title: "Associate Professor (Networks)", cabin: "Cabin A-315 (Block A)", email: "k.rao@college.edu", phone: "+1 (555) 012-315" },
    { id: "fac-5", name: "Dr. Priya Nair", dept: "Electronics & Communication", deptCode: "ECE", title: "Professor & HOD", cabin: "Cabin B-201 (Block B)", email: "p.nair@college.edu", phone: "+1 (555) 014-201" },
    { id: "fac-6", name: "Prof. Vikram Das", dept: "Electronics & Communication", deptCode: "ECE", title: "Associate Professor (VLSI)", cabin: "Cabin B-205 (Block B)", email: "v.das@college.edu", phone: "+1 (555) 014-205" },
    { id: "fac-7", name: "Dr. Rajesh Kulkarni", dept: "Mechanical Engineering", deptCode: "MECH", title: "Professor & HOD", cabin: "Cabin C-101 (Block C)", email: "r.kulkarni@college.edu", phone: "+1 (555) 016-101" },
    { id: "fac-8", name: "Dr. Sunita Ghosh", dept: "Electrical Engineering", deptCode: "EE", title: "Professor & HOD", cabin: "Cabin D-104 (Block D)", email: "s.ghosh@college.edu", phone: "+1 (555) 018-104" }
  ],
  settings: {
    theme: 'dark',
    minAttendanceGoal: 75,
    dailyWaterGoal: 8,
    dailySleepGoal: 8,
    pomodoroWork: 25,
    pomodoroBreak: 5
  },
  subjects: [
    {
      id: "sub-1",
      code: "CS301",
      name: "Operating Systems",
      faculty: "Dr. Aris Thorne",
      email: "a.thorne@college.edu",
      room: "LH-302",
      credits: 4,
      color: "#3b82f6",
      attended: 28,
      total: 32,
      syllabusTotal: 5,
      syllabusCompleted: 3.5,
      notesLink: "https://drive.google.com"
    },
    {
      id: "sub-2",
      code: "CS302",
      name: "Database Management Systems",
      faculty: "Prof. Meera Sen",
      email: "m.sen@college.edu",
      room: "CS Lab 2",
      credits: 4,
      color: "#10b981",
      attended: 26,
      total: 30,
      syllabusTotal: 5,
      syllabusCompleted: 4.0,
      notesLink: "https://drive.google.com"
    },
    {
      id: "sub-3",
      code: "CS303",
      name: "Machine Learning Foundations",
      faculty: "Dr. Robert Vance",
      email: "r.vance@college.edu",
      room: "Audi-1",
      credits: 4,
      color: "#f59e0b",
      attended: 21,
      total: 30,
      syllabusTotal: 6,
      syllabusCompleted: 3.0,
      notesLink: "https://drive.google.com"
    },
    {
      id: "sub-4",
      code: "CS304",
      name: "Computer Networks",
      faculty: "Prof. Kavita Rao",
      email: "k.rao@college.edu",
      room: "Room 204",
      credits: 3,
      color: "#8b5cf6",
      attended: 25,
      total: 28,
      syllabusTotal: 4,
      syllabusCompleted: 3.0,
      notesLink: "https://drive.google.com"
    },
    {
      id: "sub-5",
      code: "HS301",
      name: "Tech Ethics & Communication",
      faculty: "Dr. Sarah Lin",
      email: "s.lin@college.edu",
      room: "Sem Hall B",
      credits: 2,
      color: "#ec4899",
      attended: 15,
      total: 16,
      syllabusTotal: 3,
      syllabusCompleted: 2.5,
      notesLink: "https://drive.google.com"
    }
  ],
  timetableSlots: [
    // Monday
    { id: "slot-m1", day: "Monday", startTime: "09:00", endTime: "10:15", subjectId: "sub-1", title: "Operating Systems", type: "Lecture", room: "LH-302", color: "#3b82f6" },
    { id: "slot-m2", day: "Monday", startTime: "10:30", endTime: "11:45", subjectId: "sub-2", title: "DBMS Lecture", type: "Lecture", room: "CS Lab 2", color: "#10b981" },
    { id: "slot-m3", day: "Monday", startTime: "13:30", endTime: "15:30", subjectId: "sub-3", title: "ML Practical Lab", type: "Lab", room: "AI Lab 4", color: "#f59e0b" },
    { id: "slot-m4", day: "Monday", startTime: "16:00", endTime: "17:30", subjectId: null, title: "ACM Tech Chapter Meet", type: "Club", room: "Innovation Hub", color: "#f97316" },

    // Tuesday
    { id: "slot-t1", day: "Tuesday", startTime: "09:00", endTime: "10:15", subjectId: "sub-4", title: "Computer Networks", type: "Lecture", room: "Room 204", color: "#8b5cf6" },
    { id: "slot-t2", day: "Tuesday", startTime: "10:30", endTime: "11:45", subjectId: "sub-5", title: "Tech Ethics & Comm", type: "Lecture", room: "Sem Hall B", color: "#ec4899" },
    { id: "slot-t3", day: "Tuesday", startTime: "14:00", endTime: "16:00", subjectId: "sub-1", title: "OS Kernel Linux Lab", type: "Lab", room: "Systems Lab", color: "#3b82f6" },
    { id: "slot-t4", day: "Tuesday", startTime: "16:15", endTime: "17:45", subjectId: null, title: "Robotics Club Workshop", type: "Club", room: "Maker Space", color: "#f97316" },

    // Wednesday
    { id: "slot-w1", day: "Wednesday", startTime: "09:00", endTime: "10:15", subjectId: "sub-3", title: "Machine Learning", type: "Lecture", room: "Audi-1", color: "#f59e0b" },
    { id: "slot-w2", day: "Wednesday", startTime: "10:30", endTime: "11:45", subjectId: "sub-1", title: "Operating Systems", type: "Lecture", room: "LH-302", color: "#3b82f6" },
    { id: "slot-w3", day: "Wednesday", startTime: "13:30", endTime: "15:00", subjectId: "sub-2", title: "DBMS SQL Tutorial", type: "Tutorial", room: "CS Lab 2", color: "#10b981" },
    { id: "slot-w4", day: "Wednesday", startTime: "16:00", endTime: "17:30", subjectId: null, title: "Campus Badminton / Gym", type: "Study", room: "Sports Complex", color: "#06b6d4" },

    // Thursday
    { id: "slot-th1", day: "Thursday", startTime: "09:00", endTime: "10:15", subjectId: "sub-4", title: "Computer Networks", type: "Lecture", room: "Room 204", color: "#8b5cf6" },
    { id: "slot-th2", day: "Thursday", startTime: "10:30", endTime: "11:45", subjectId: "sub-2", title: "DBMS Architecture", type: "Lecture", room: "CS Lab 2", color: "#10b981" },
    { id: "slot-th3", day: "Thursday", startTime: "14:00", endTime: "16:30", subjectId: null, title: "Open Source Hack Hour", type: "Club", room: "Tech Sandbox", color: "#f97316" },

    // Friday
    { id: "slot-f1", day: "Friday", startTime: "09:00", endTime: "10:15", subjectId: "sub-3", title: "Machine Learning Math", type: "Lecture", room: "Audi-1", color: "#f59e0b" },
    { id: "slot-f2", day: "Friday", startTime: "10:30", endTime: "11:45", subjectId: "sub-4", title: "Networks Packet Lab", type: "Tutorial", room: "Room 204", color: "#8b5cf6" },
    { id: "slot-f3", day: "Friday", startTime: "14:00", endTime: "15:30", subjectId: null, title: "Photography Club Critique", type: "Club", room: "Media Center", color: "#ec4899" },
    { id: "slot-f4", day: "Friday", startTime: "16:00", endTime: "17:30", subjectId: null, title: "Weekly Review & Library Sprint", type: "Study", room: "Central Library", color: "#10b981" }
  ],
  clubs: [
    {
      id: "club-1",
      name: "ACM Student Chapter",
      category: "Technical",
      role: "Vice Lead & Dev Co-head",
      leads: "Alex & Tanya",
      meetingSchedule: "Mondays @ 4:00 PM",
      venue: "Innovation Hub (Room 402)",
      description: "Host algorithms hackathons, guest lectures from top tech engineers, and mentorship sessions.",
      bannerColor: "from-blue-600 to-indigo-700",
      isMember: true,
      memberStudentIds: ["std-1", "std-2", "std-4", "std-5"],
      tasks: [
        { id: "ct-1", title: "Finalize problem statement for Mini-Hackathon", done: true, due: "Oct 26" },
        { id: "ct-2", title: "Publish RSVP link on college Discord", done: false, due: "Oct 28" }
      ],
      events: [
        { id: "ce-1", title: "48h Fall Campus Hackathon", date: "Nov 06-08, 2026", venue: "Auditorium & Tech Hub" },
        { id: "ce-2", title: "Git & Open Source Workshop", date: "Nov 14, 2026", venue: "CS Lab 1" }
      ]
    },
    {
      id: "club-2",
      name: "Robotics & IoT Guild",
      category: "Robotics / Hardware",
      role: "Firmware Contributor",
      leads: "Rohan V.",
      meetingSchedule: "Tuesdays @ 4:15 PM",
      venue: "Maker Space Lab",
      description: "Building autonomous rovers, drone swarms, and smart campus IoT monitoring devices.",
      bannerColor: "from-amber-600 to-red-600",
      isMember: true,
      memberStudentIds: ["std-1", "std-3", "std-7"],
      tasks: [
        { id: "ct-3", title: "Order Raspberry Pi 5 & sensors for Rover", done: true, due: "Oct 22" },
        { id: "ct-4", title: "Debug motor driver PWM latency", done: false, due: "Oct 29" }
      ],
      events: [
        { id: "ce-3", title: "Battle of Bots Showcase", date: "Nov 20, 2026", venue: "Central Quad" }
      ]
    },
    {
      id: "club-3",
      name: "ShutterBug Photography & Arts",
      category: "Cultural / Creative",
      role: "Head of Photo Walk Logistics",
      leads: "Pooja Nair",
      meetingSchedule: "Fridays @ 2:00 PM",
      venue: "Media Center Studio",
      description: "Campus photography, documentary filmmaking, Lightroom/Photoshop workshops, and annual art exhibit.",
      bannerColor: "from-purple-600 to-pink-600",
      isMember: true,
      memberStudentIds: ["std-1", "std-6"],
      tasks: [
        { id: "ct-5", title: "Select 15 photos for Campus Fest Brochure", done: false, due: "Oct 30" }
      ],
      events: [
        { id: "ce-4", title: "Golden Hour Campus Photo Walk", date: "Oct 31, 2026", venue: "Campus Lake Point" }
      ]
    },
    {
      id: "club-4",
      name: "Rotaract Youth Club",
      category: "Social Impact",
      role: "Volunteer",
      leads: "Dr. K. Sharma & Megha",
      meetingSchedule: "Alternate Saturdays @ 11 AM",
      venue: "Auditorium Foyer",
      description: "Community service, blood donation drives, eco-green plantation, and charity book fairs.",
      bannerColor: "from-emerald-600 to-teal-700",
      isMember: false,
      memberStudentIds: ["std-2", "std-8"],
      tasks: [],
      events: [
        { id: "ce-5", title: "Blood Donation Camp & Health Check", date: "Nov 12, 2026", venue: "Health Center" }
      ]
    },
    {
      id: "club-5",
      name: "Debate & Literary Society",
      category: "Literary",
      role: "Debater",
      leads: "Karan Johal",
      meetingSchedule: "Thursdays @ 5:00 PM",
      venue: "Room 102",
      description: "Parliamentary debates, Model UN simulations, creative writing, and poetry slams.",
      bannerColor: "from-cyan-600 to-blue-700",
      isMember: false,
      memberStudentIds: ["std-4", "std-6"],
      tasks: [],
      events: [
        { id: "ce-6", title: "Inter-College Parliamentary Debate", date: "Nov 18, 2026", venue: "Main Audi" }
      ]
    }
  ],
  health: {
    waterGlasses: 5, // out of 8 (250ml each = 1250ml / 2000ml)
    waterLogDate: "2026-10-24",
    sleepHours: 7.2,
    sleepQuality: "Good",
    sleepHistory: [
      { day: "Mon", hours: 6.5, quality: "Average" },
      { day: "Tue", hours: 7.0, quality: "Good" },
      { day: "Wed", hours: 6.0, quality: "Tired" },
      { day: "Thu", hours: 7.5, quality: "Great" },
      { day: "Fri", hours: 6.8, quality: "Good" },
      { day: "Sat", hours: 8.2, quality: "Refreshed" },
      { day: "Sun", hours: 7.2, quality: "Good" }
    ],
    workouts: [
      { id: "w-1", type: "Campus Jog / Running", durationMinutes: 25, calories: 210, time: "07:15 AM" },
      { id: "w-2", type: "Core & Stretching", durationMinutes: 15, calories: 95, time: "07:45 AM" }
    ],
    mood: "Energized",
    gratitudeNote: "Got praised by Dr. Thorne for kernel synchronization algorithm!",
    habits: [
      { id: "h-1", text: "Healthy Breakfast eaten", done: true },
      { id: "h-2", text: "Take 20-20-20 screen eye break", done: true },
      { id: "h-3", text: "15 min outdoor sunshine walk", done: true },
      { id: "h-4", text: "Posture stretch between lectures", done: false },
      { id: "h-5", text: "No caffeine after 6:00 PM", done: false }
    ],
    pomodoro: {
      timeRemaining: 1500, // 25 min in seconds
      isRunning: false,
      mode: "work", // "work" or "break"
      sessionsCompleted: 3
    }
  },
  weekend: {
    selectedCategory: "all",
    suggestions: [
      {
        id: "wkd-1",
        title: "Campus Sunset Photo Walk & Cafe Crawl",
        category: "relax",
        duration: "3-4 hours",
        budget: "Low ($5 - $10)",
        vibe: "Serene & Refreshing",
        description: "Grab a camera or phone, wander around the botanical garden and campus lake during golden hour, followed by iced coffee at the student corner.",
        tags: ["Outdoors", "Photography", "Low Stress"],
        isSaved: true
      },
      {
        id: "wkd-2",
        title: "Weekend Project Sprint: Build an AI Agent",
        category: "productive",
        duration: "Half Day (4 hrs)",
        budget: "Free",
        vibe: "High Focus & Flow State",
        description: "Team up or solo sprint: build a practical tool or browser extension using LLMs or Python APIs to add to your portfolio resume.",
        tags: ["Coding", "Portfolio", "Hackathon"],
        isSaved: true
      },
      {
        id: "wkd-3",
        title: "Hiking & Scenic Trail at Whispering Pines",
        category: "adventure",
        duration: "Full Morning (5 hrs)",
        budget: "Bus/Metro Fare",
        vibe: "Energizing Nature High",
        description: "Hop on the early college shuttle or bus to the nearby trail. Great cardio, crisp pine air, and zero notifications.",
        tags: ["Nature", "Trek", "Fitness"],
        isSaved: false
      },
      {
        id: "wkd-4",
        title: "Dorm Board Games & Pizza Night",
        category: "social",
        duration: "Evening (3 hrs)",
        budget: "Split $6 each",
        vibe: "Laughter & Bonding",
        description: "Unplug from laptops. Play Catan, Codenames, or Uno with roommates and hostel friends with homemade or split pizza.",
        tags: ["Friends", "Board Games", "Chill"],
        isSaved: true
      },
      {
        id: "wkd-5",
        title: "Digital Detox & Sleep Debt Clearance",
        category: "relax",
        duration: "Full Weekend",
        budget: "Free",
        vibe: "Restorative",
        description: "Sleep 9+ hours uninterrupted. Switch off phone notifications from Friday night till Saturday lunch, cook a warm meal, and read a fiction novel.",
        tags: ["Self Care", "Sleep", "Wellness"],
        isSaved: false
      },
      {
        id: "wkd-6",
        title: "Open Source Bug Bash & Pull Request Quest",
        category: "skill",
        duration: "3 hours",
        budget: "Free",
        vibe: "Skill Building",
        description: "Browse GitHub 'good first issue' tags in popular repositories, fix documentation or small bugs, and earn your first merged PR.",
        tags: ["Git", "Open Source", "Career"],
        isSaved: false
      },
      {
        id: "wkd-7",
        title: "Intra-Campus 5v5 Turf Football / Basketball Match",
        category: "adventure",
        duration: "2 hours",
        budget: "Free",
        vibe: "High Energy",
        description: "Gather batchmates and host a friendly mini tournament at the college turf court followed by fruit juice smoothies.",
        tags: ["Sports", "Cardio", "Teamwork"],
        isSaved: false
      },
      {
        id: "wkd-8",
        title: "Indie Movie Marathon & Popcorn Night",
        category: "relax",
        duration: "4 hours",
        budget: "$3 Snacks",
        vibe: "Cozy & Cinematic",
        description: "Project classic sci-fi or anime films on the common room wall with friends and blanket nests.",
        tags: ["Movies", "Chill", "Entertainment"],
        isSaved: false
      }
    ],
    plannedSchedule: {
      saturday: [
        { time: "09:00 AM", title: "Sleep in & Healthy Pancake Breakfast", done: true },
        { time: "11:00 AM", title: "Weekend Project Sprint: AI Web App", done: false },
        { time: "04:30 PM", title: "Golden Hour Photo Walk at Campus Lake", done: false },
        { time: "08:00 PM", title: "Board Games & Pizza with friends", done: false }
      ],
      sunday: [
        { time: "08:30 AM", title: "Morning Trail Jog / Stretching", done: false },
        { time: "11:00 AM", title: "Organize Week 6 Notes & Revise OS Lab", done: false },
        { time: "03:00 PM", title: "Dorm Laundry & Room Reset", done: false },
        { time: "08:00 PM", title: "Plan upcoming week timetable & early sleep", done: false }
      ]
    }
  },
  assignments: [
    {
      id: "a-1",
      subjectId: "sub-1",
      title: "Implement Round-Robin CPU Scheduler in C",
      dueDate: "2026-10-27",
      priority: "high",
      studentSubmissions: {
        "std-1": { submitted: true, date: "2026-10-24 10:30 AM", grade: "A" },
        "std-2": { submitted: false, date: null, grade: null },
        "std-3": { submitted: true, date: "2026-10-23 04:15 PM", grade: "A-" },
        "std-4": { submitted: false, date: null, grade: null },
        "std-5": { submitted: true, date: "2026-10-24 09:00 AM", grade: "B+" },
        "std-6": { submitted: false, date: null, grade: null },
        "std-7": { submitted: false, date: null, grade: null },
        "std-8": { submitted: true, date: "2026-10-22 06:00 PM", grade: "A" }
      }
    },
    {
      id: "a-2",
      subjectId: "sub-2",
      title: "B+ Tree Indexing & SQL Query Optimization Report",
      dueDate: "2026-10-29",
      priority: "medium",
      studentSubmissions: {
        "std-1": { submitted: false, date: null, grade: null },
        "std-2": { submitted: true, date: "2026-10-23 11:20 AM", grade: "A" },
        "std-3": { submitted: false, date: null, grade: null },
        "std-4": { submitted: true, date: "2026-10-24 02:00 PM", grade: "A+" },
        "std-5": { submitted: false, date: null, grade: null },
        "std-6": { submitted: false, date: null, grade: null },
        "std-7": { submitted: true, date: "2026-10-24 12:45 PM", grade: "B" },
        "std-8": { submitted: false, date: null, grade: null }
      }
    },
    {
      id: "a-3",
      subjectId: "sub-3",
      title: "Linear Regression & Gradient Descent from scratch",
      dueDate: "2026-11-02",
      priority: "high",
      studentSubmissions: {
        "std-1": { submitted: false, date: null, grade: null },
        "std-2": { submitted: false, date: null, grade: null },
        "std-3": { submitted: true, date: "2026-10-24 03:30 PM", grade: "A" },
        "std-4": { submitted: false, date: null, grade: null },
        "std-5": { submitted: false, date: null, grade: null },
        "std-6": { submitted: true, date: "2026-10-23 05:00 PM", grade: "A-" },
        "std-7": { submitted: false, date: null, grade: null },
        "std-8": { submitted: false, date: null, grade: null }
      }
    },
    {
      id: "a-4",
      subjectId: "sub-4",
      title: "Wireshark Packet Analysis Lab Submission",
      dueDate: "2026-10-25",
      priority: "low",
      studentSubmissions: {
        "std-1": { submitted: true, date: "2026-10-22 03:00 PM", grade: "A" },
        "std-2": { submitted: true, date: "2026-10-22 04:30 PM", grade: "A" },
        "std-3": { submitted: true, date: "2026-10-23 09:15 AM", grade: "B+" },
        "std-4": { submitted: true, date: "2026-10-23 10:45 AM", grade: "A" },
        "std-5": { submitted: true, date: "2026-10-24 08:30 AM", grade: "A-" },
        "std-6": { submitted: true, date: "2026-10-23 01:00 PM", grade: "A" },
        "std-7": { submitted: true, date: "2026-10-24 11:00 AM", grade: "B" },
        "std-8": { submitted: true, date: "2026-10-22 05:45 PM", grade: "A" }
      }
    }
  ],
  departments: [
    {
      id: "dept-cse",
      code: "CSE",
      name: "Computer Science & Engineering",
      hod: "Dr. Aris Thorne",
      classIncharge: "Prof. Michael Brooks",
      color: "#3b82f6",
      subjects: [
        { id: "dsub-cs1", code: "CS301", name: "Operating Systems", credits: 4, faculty: "Dr. Aris Thorne" },
        { id: "dsub-cs2", code: "CS302", name: "Database Management Systems", credits: 4, faculty: "Prof. Meera Sen" },
        { id: "dsub-cs3", code: "CS303", name: "Machine Learning Foundations", credits: 4, faculty: "Dr. Robert Vance" },
        { id: "dsub-cs4", code: "CS304", name: "Computer Networks", credits: 3, faculty: "Prof. Kavita Rao" }
      ]
    },
    {
      id: "dept-ece",
      code: "ECE",
      name: "Electronics & Communication",
      hod: "Dr. Priya Nair",
      classIncharge: "Prof. Vikram Das",
      color: "#8b5cf6",
      subjects: [
        { id: "dsub-ec1", code: "EC301", name: "Signals & Digital Systems", credits: 4, faculty: "Dr. Priya Nair" },
        { id: "dsub-ec2", code: "EC302", name: "VLSI Architecture & Design", credits: 4, faculty: "Prof. Vikram Das" },
        { id: "dsub-ec3", code: "EC303", name: "Embedded IoT Microcontrollers", credits: 3, faculty: "Prof. Ananya Roy" }
      ]
    },
    {
      id: "dept-mech",
      code: "MECH",
      name: "Mechanical Engineering",
      hod: "Dr. Rajesh Kulkarni",
      classIncharge: "Dr. Sanjay Patel",
      color: "#f59e0b",
      subjects: [
        { id: "dsub-me1", code: "ME301", name: "Applied Thermodynamics", credits: 4, faculty: "Dr. Rajesh Kulkarni" },
        { id: "dsub-me2", code: "ME302", name: "Fluid Dynamics & Turbines", credits: 4, faculty: "Prof. Alok Verma" },
        { id: "dsub-me3", code: "ME303", name: "Robotics & Kinematics", credits: 3, faculty: "Dr. Sanjay Patel" }
      ]
    },
    {
      id: "dept-ee",
      code: "EE",
      name: "Electrical Engineering",
      hod: "Dr. Sunita Ghosh",
      classIncharge: "Prof. R. N. Murthy",
      color: "#10b981",
      subjects: [
        { id: "dsub-ee1", code: "EE301", name: "High Voltage Power Systems", credits: 4, faculty: "Dr. Sunita Ghosh" },
        { id: "dsub-ee2", code: "EE302", name: "Automatic Control Theory", credits: 4, faculty: "Prof. R. N. Murthy" }
      ]
    }
  ],
  departmentClasses: [
    // Monday Schedule: features an intentional Room Double-Booking clash (LH-302) to showcase intersection detection!
    {
      id: "dcls-1",
      departmentId: "dept-cse",
      subjectId: "dsub-cs1",
      subjectCode: "CS301",
      subjectName: "Operating Systems",
      day: "Monday",
      startTime: "09:00",
      endTime: "10:30",
      room: "LH-302",
      faculty: "Dr. Aris Thorne",
      batch: "CSE-A",
      type: "Lecture"
    },
    {
      id: "dcls-2",
      departmentId: "dept-ece",
      subjectId: "dsub-ec1",
      subjectCode: "EC301",
      subjectName: "Signals & Digital Systems",
      day: "Monday",
      startTime: "10:00",
      endTime: "11:30",
      room: "LH-302", // Collision! Same room LH-302 overlaps from 10:00 to 10:30 with CS301
      faculty: "Dr. Priya Nair",
      batch: "ECE-1",
      type: "Lecture"
    },
    {
      id: "dcls-3",
      departmentId: "dept-cse",
      subjectId: "dsub-cs2",
      subjectCode: "CS302",
      subjectName: "Database Management Systems",
      day: "Monday",
      startTime: "11:00",
      endTime: "12:30",
      room: "CS Lab 2",
      faculty: "Prof. Meera Sen",
      batch: "CSE-B",
      type: "Lab"
    },
    {
      id: "dcls-4",
      departmentId: "dept-mech",
      subjectId: "dsub-me1",
      subjectCode: "ME301",
      subjectName: "Applied Thermodynamics",
      day: "Monday",
      startTime: "14:00",
      endTime: "15:30",
      room: "Audi-2",
      faculty: "Dr. Rajesh Kulkarni",
      batch: "MECH-All",
      type: "Lecture"
    },
    {
      id: "dcls-5",
      departmentId: "dept-ee",
      subjectId: "dsub-ee1",
      subjectCode: "EE301",
      subjectName: "High Voltage Power Systems",
      day: "Monday",
      startTime: "14:00",
      endTime: "15:30",
      room: "Power Lab 1",
      faculty: "Dr. Sunita Ghosh",
      batch: "EE-1",
      type: "Lab"
    },
    // Tuesday Schedule: Conflict-free schedule
    {
      id: "dcls-6",
      departmentId: "dept-cse",
      subjectId: "dsub-cs4",
      subjectCode: "CS304",
      subjectName: "Computer Networks",
      day: "Tuesday",
      startTime: "09:00",
      endTime: "10:15",
      room: "Room 204",
      faculty: "Prof. Kavita Rao",
      batch: "CSE-A",
      type: "Lecture"
    },
    {
      id: "dcls-7",
      departmentId: "dept-ece",
      subjectId: "dsub-ec2",
      subjectCode: "EC302",
      subjectName: "VLSI Architecture & Design",
      day: "Tuesday",
      startTime: "10:30",
      endTime: "12:00",
      room: "VLSI Lab 1",
      faculty: "Prof. Vikram Das",
      batch: "ECE-2",
      type: "Lab"
    },
    {
      id: "dcls-8",
      departmentId: "dept-mech",
      subjectId: "dsub-me3",
      subjectCode: "ME303",
      subjectName: "Robotics & Kinematics",
      day: "Tuesday",
      startTime: "14:00",
      endTime: "15:30",
      room: "Workshop 3",
      faculty: "Dr. Sanjay Patel",
      batch: "MECH-A",
      type: "Lab"
    }
  ]
};

class Store {
  constructor() {
    this.listeners = [];
    this.state = this.loadInitialState();
  }

  loadInitialState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure new properties from defaultState exist
        const loadedDepts = (parsed.departments && parsed.departments.length > 0) ? parsed.departments : defaultState.departments;
        loadedDepts.forEach(d => {
          if (!d.classIncharge) {
            const def = defaultState.departments.find(df => df.id === d.id);
            d.classIncharge = def ? def.classIncharge : (d.hod ? `Prof. Incharge (${d.code})` : "Class Coordinator");
          }
        });

        // Filter out Saturday and Sunday from timetable slots (Mon-Fri)
        const loadedSlots = (parsed.timetableSlots || defaultState.timetableSlots).filter(s => s.day !== 'Saturday' && s.day !== 'Sunday');

        // Filter out Saturday and Sunday from departmentClasses (Mon-Fri)
        const loadedDeptClasses = (parsed.departmentClasses && parsed.departmentClasses.length > 0 ? parsed.departmentClasses : defaultState.departmentClasses)
          .filter(dc => dc.day !== 'Saturday' && dc.day !== 'Sunday');

        // Ensure studentSubmissions exist on assignments
        const loadedAssignments = (parsed.assignments && parsed.assignments.length > 0) ? parsed.assignments : defaultState.assignments;
        loadedAssignments.forEach(a => {
          if (!a.studentSubmissions || Object.keys(a.studentSubmissions).length === 0) {
            const def = defaultState.assignments.find(da => da.id === a.id);
            a.studentSubmissions = def ? def.studentSubmissions : { "std-1": { submitted: a.status === 'completed', date: "2026-10-24 10:00 AM", grade: "A" } };
          }
        });

        // Ensure memberStudentIds exist on clubs
        const loadedClubs = (parsed.clubs && parsed.clubs.length > 0) ? parsed.clubs : defaultState.clubs;
        loadedClubs.forEach(c => {
          if (!c.memberStudentIds || c.memberStudentIds.length === 0) {
            const def = defaultState.clubs.find(dc => dc.id === c.id);
            c.memberStudentIds = def ? def.memberStudentIds : (c.isMember ? ["std-1"] : []);
          }
        });

        return {
          ...defaultState,
          ...parsed,
          currentRole: parsed.currentRole || 'host',
          timetableSlots: loadedSlots,
          studentsList: (parsed.studentsList && parsed.studentsList.length > 0) ? parsed.studentsList : defaultState.studentsList,
          opdSchedule: (parsed.opdSchedule && parsed.opdSchedule.length > 0) ? parsed.opdSchedule : defaultState.opdSchedule,
          assignments: loadedAssignments,
          clubs: loadedClubs,
          rooms: (parsed.rooms && parsed.rooms.length > 0) ? parsed.rooms : defaultState.rooms,
          teachers: (parsed.teachers && parsed.teachers.length > 0) ? parsed.teachers : defaultState.teachers,
          departments: loadedDepts,
          departmentClasses: loadedDeptClasses
        };
      }
    } catch (e) {
      console.warn("Could not read local storage, using default state", e);
    }
    return JSON.parse(JSON.stringify(defaultState));
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      this.notify();
    } catch (e) {
      console.error("Failed to save state to localStorage", e);
    }
  }

  notify() {
    this.listeners.forEach(cb => {
      try {
        cb(this.state);
      } catch (err) {
        console.error("Store listener error:", err);
      }
    });
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  getState() {
    return this.state;
  }

  resetToDefault() {
    this.state = JSON.parse(JSON.stringify(defaultState));
    this.save();
  }

  exportData() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.state, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `college_timetable_backup_${new Date().toISOString().slice(0, 10)}.json`);
    dlAnchorElem.click();
  }

  importData(jsonData) {
    try {
      const parsed = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      if (parsed.timetableSlots && parsed.subjects) {
        this.state = { ...defaultState, ...parsed };
        this.save();
        return true;
      }
      throw new Error("Invalid schema: missing timetableSlots or subjects");
    } catch (err) {
      alert("Invalid backup file: " + err.message);
      return false;
    }
  }

  // --- Timetable Methods ---
  addTimetableSlot(slot) {
    const id = "slot-" + Date.now();
    const newSlot = { id, ...slot };
    this.state.timetableSlots.push(newSlot);
    this.save();
    return newSlot;
  }

  updateTimetableSlot(id, updatedFields) {
    const idx = this.state.timetableSlots.findIndex(s => s.id === id);
    if (idx !== -1) {
      this.state.timetableSlots[idx] = { ...this.state.timetableSlots[idx], ...updatedFields };
      this.save();
    }
  }

  deleteTimetableSlot(id) {
    this.state.timetableSlots = this.state.timetableSlots.filter(s => s.id !== id);
    this.save();
  }

  checkConflicts(day, startTime, endTime, excludeSlotId = null) {
    const toMinutes = (timeStr) => {
      const [h, m] = timeStr.split(':').map(Number);
      return h * 60 + m;
    };
    const newStart = toMinutes(startTime);
    const newEnd = toMinutes(endTime);

    return this.state.timetableSlots.filter(s => {
      if (s.id === excludeSlotId) return false;
      if (s.day !== day) return false;
      const slotStart = toMinutes(s.startTime);
      const slotEnd = toMinutes(s.endTime);
      return Math.max(newStart, slotStart) < Math.min(newEnd, slotEnd);
    });
  }

  // --- Subjects & Attendance Methods ---
  addSubject(subject) {
    const id = "sub-" + Date.now();
    const newSub = {
      id,
      attended: 0,
      total: 0,
      syllabusTotal: 5,
      syllabusCompleted: 0,
      color: "#3b82f6",
      ...subject
    };
    this.state.subjects.push(newSub);
    this.save();
    return newSub;
  }

  updateSubject(id, updatedFields) {
    const idx = this.state.subjects.findIndex(s => s.id === id);
    if (idx !== -1) {
      this.state.subjects[idx] = { ...this.state.subjects[idx], ...updatedFields };
      this.save();
    }
  }

  deleteSubject(id) {
    this.state.subjects = this.state.subjects.filter(s => s.id !== id);
    // Also remove timetable slots tied to this subject
    this.state.timetableSlots = this.state.timetableSlots.filter(slot => slot.subjectId !== id);
    this.save();
  }

  markAttendance(subjectId, status) {
    const sub = this.state.subjects.find(s => s.id === subjectId);
    if (!sub) return;

    if (status === 'present') {
      sub.attended = (sub.attended || 0) + 1;
      sub.total = (sub.total || 0) + 1;
    } else if (status === 'absent') {
      sub.total = (sub.total || 0) + 1;
    } else if (status === 'undo') {
      if (sub.total > 0) {
        if (sub.attended > 0) sub.attended--;
        sub.total--;
      }
    }
    this.save();
  }

  // --- Assignments Methods ---
  addAssignment(assignment) {
    const id = "a-" + Date.now();
    const studentsList = this.state.studentsList || defaultState.studentsList || [];
    const studentSubmissions = {};
    studentsList.forEach(st => {
      studentSubmissions[st.id] = { submitted: false, date: null, grade: null };
    });
    const newAss = {
      id,
      priority: "medium",
      status: "pending",
      studentSubmissions,
      ...assignment
    };
    if (!this.state.assignments) this.state.assignments = [];
    this.state.assignments.unshift(newAss);
    this.save();
    return newAss;
  }

  updateAssignment(id, updatedFields) {
    const idx = (this.state.assignments || []).findIndex(a => a.id === id);
    if (idx !== -1) {
      this.state.assignments[idx] = { ...this.state.assignments[idx], ...updatedFields };
      this.save();
    }
  }

  deleteAssignment(id) {
    this.state.assignments = (this.state.assignments || []).filter(a => a.id !== id);
    this.save();
  }

  toggleAssignmentStatus(id) {
    const assignment = (this.state.assignments || []).find(a => a.id === id);
    if (assignment) {
      assignment.status = assignment.status === 'completed' ? 'pending' : 'completed';
      // Also sync current active student (Alex Rivera std-1)
      if (assignment.studentSubmissions) {
        const isDone = assignment.status === 'completed';
        assignment.studentSubmissions["std-1"] = {
          submitted: isDone,
          date: isDone ? new Date().toLocaleString() : null,
          grade: isDone ? "A" : null
        };
      }
      this.save();
    }
  }

  setAssignmentStudentSubmission(assignmentId, studentId, isSubmitted, date = null, grade = null) {
    const assignment = (this.state.assignments || []).find(a => a.id === assignmentId);
    if (assignment) {
      if (!assignment.studentSubmissions) assignment.studentSubmissions = {};
      assignment.studentSubmissions[studentId] = {
        submitted: !!isSubmitted,
        date: isSubmitted ? (date || new Date().toLocaleString()) : null,
        grade: grade || null
      };
      // Check if student 1 (Alex Rivera) to sync legacy status field
      if (studentId === "std-1") {
        assignment.status = isSubmitted ? "completed" : "pending";
      }
      this.save();
    }
  }

  // --- Clubs Methods ---
  addClub(club) {
    const id = "club-" + Date.now();
    const newClub = {
      id,
      isMember: true,
      tasks: [],
      events: [],
      bannerColor: "from-indigo-600 to-purple-600",
      ...club
    };
    this.state.clubs.push(newClub);
    this.save();
    return newClub;
  }

  updateClub(id, updatedFields) {
    const idx = (this.state.clubs || []).findIndex(c => c.id === id);
    if (idx !== -1) {
      this.state.clubs[idx] = { ...this.state.clubs[idx], ...updatedFields };
      this.save();
    }
  }

  deleteClub(id) {
    this.state.clubs = (this.state.clubs || []).filter(c => c.id !== id);
    this.save();
  }

  toggleClubMembership(clubId) {
    const club = this.state.clubs.find(c => c.id === clubId);
    if (club) {
      club.isMember = !club.isMember;
      this.save();
    }
  }

  setClubStudentMember(clubId, studentId, isMember) {
    const club = (this.state.clubs || []).find(c => c.id === clubId);
    if (club) {
      if (!club.memberStudentIds) club.memberStudentIds = [];
      const idx = club.memberStudentIds.indexOf(studentId);
      if (isMember && idx === -1) {
        club.memberStudentIds.push(studentId);
      } else if (!isMember && idx !== -1) {
        club.memberStudentIds.splice(idx, 1);
      }
      if (studentId === "std-1") {
        club.isMember = isMember;
      }
      this.save();
    }
  }

  addClubTask(clubId, taskTitle, due = "Next Meet") {
    const club = this.state.clubs.find(c => c.id === clubId);
    if (club) {
      if (!club.tasks) club.tasks = [];
      club.tasks.push({
        id: "ct-" + Date.now(),
        title: taskTitle,
        done: false,
        due
      });
      this.save();
    }
  }

  toggleClubTask(clubId, taskId) {
    const club = this.state.clubs.find(c => c.id === clubId);
    if (club && club.tasks) {
      const task = club.tasks.find(t => t.id === taskId);
      if (task) {
        task.done = !task.done;
        this.save();
      }
    }
  }

  // --- Health Methods ---
  logWater(amount = 1) {
    const max = 12;
    this.state.health.waterGlasses = Math.min(max, Math.max(0, (this.state.health.waterGlasses || 0) + amount));
    this.save();
  }

  resetWater() {
    this.state.health.waterGlasses = 0;
    this.save();
  }

  logSleep(hours, quality) {
    this.state.health.sleepHours = Number(hours);
    this.state.health.sleepQuality = quality;
    this.save();
  }

  logMood(mood, note) {
    this.state.health.mood = mood;
    if (note !== undefined) {
      this.state.health.gratitudeNote = note;
    }
    this.save();
  }

  toggleHabit(habitId) {
    const habit = this.state.health.habits.find(h => h.id === habitId);
    if (habit) {
      habit.done = !habit.done;
      this.save();
    }
  }

  addWorkout(activity) {
    if (!this.state.health.workouts) this.state.health.workouts = [];
    this.state.health.workouts.unshift({
      id: "w-" + Date.now(),
      ...activity
    });
    this.save();
  }

  // --- Weekend Methods ---
  toggleWeekendWishlist(suggestionId) {
    const item = this.state.weekend.suggestions.find(s => s.id === suggestionId);
    if (item) {
      item.isSaved = !item.isSaved;
      this.save();
    }
  }

  addWeekendPlanItem(day, time, title) {
    if (!this.state.weekend.plannedSchedule[day]) {
      this.state.weekend.plannedSchedule[day] = [];
    }
    this.state.weekend.plannedSchedule[day].push({
      time,
      title,
      done: false
    });
    this.save();
  }

  toggleWeekendPlanItem(day, index) {
    if (this.state.weekend.plannedSchedule[day] && this.state.weekend.plannedSchedule[day][index]) {
      this.state.weekend.plannedSchedule[day][index].done = !this.state.weekend.plannedSchedule[day][index].done;
      this.save();
    }
  }

  deleteWeekendPlanItem(day, index) {
    if (this.state.weekend.plannedSchedule[day]) {
      this.state.weekend.plannedSchedule[day].splice(index, 1);
      this.save();
    }
  }

  // --- Assignment Tracker Methods ---
  addAssignment(assignment) {
    const id = "a-" + Date.now();
    this.state.assignments.push({ id, status: 'pending', ...assignment });
    this.save();
  }

  toggleAssignmentStatus(id) {
    const item = this.state.assignments.find(a => a.id === id);
    if (item) {
      item.status = item.status === 'completed' ? 'pending' : 'completed';
      this.save();
    }
  }

  deleteAssignment(id) {
    this.state.assignments = this.state.assignments.filter(a => a.id !== id);
    this.save();
  }

  // --- Departments & Intersections Management ---
  addDepartment(dept) {
    const id = "dept-" + Date.now();
    const newDept = {
      id,
      subjects: [],
      classIncharge: dept.classIncharge || "Class Incharge",
      color: "#6366f1",
      ...dept
    };
    if (!this.state.departments) this.state.departments = [];
    this.state.departments.push(newDept);
    this.save();
    return newDept;
  }

  updateDepartment(deptId, updatedFields) {
    const idx = (this.state.departments || []).findIndex(d => d.id === deptId);
    if (idx !== -1) {
      this.state.departments[idx] = { ...this.state.departments[idx], ...updatedFields };
      this.save();
    }
  }

  updateDepartmentIncharge(deptId, inchargeName) {
    const dept = (this.state.departments || []).find(d => d.id === deptId);
    if (dept) {
      dept.classIncharge = inchargeName.trim();
      this.save();
    }
  }

  deleteDepartment(deptId) {
    this.state.departments = (this.state.departments || []).filter(d => d.id !== deptId);
    this.state.departmentClasses = (this.state.departmentClasses || []).filter(c => c.departmentId !== deptId);
    this.save();
  }

  addDepartmentSubject(deptId, subject) {
    const dept = (this.state.departments || []).find(d => d.id === deptId);
    if (!dept) return;
    if (!dept.subjects) dept.subjects = [];
    const id = "dsub-" + Date.now();
    const newSub = { id, credits: 3, ...subject };
    dept.subjects.push(newSub);
    this.save();
    return newSub;
  }

  updateDepartmentSubject(deptId, subId, updatedFields) {
    const dept = (this.state.departments || []).find(d => d.id === deptId);
    if (dept && dept.subjects) {
      const sIdx = dept.subjects.findIndex(s => s.id === subId);
      if (sIdx !== -1) {
        dept.subjects[sIdx] = { ...dept.subjects[sIdx], ...updatedFields };
        // Sync any scheduled classes using this subject
        (this.state.departmentClasses || []).forEach(cls => {
          if (cls.subjectId === subId) {
            if (updatedFields.name) cls.subjectName = updatedFields.name;
            if (updatedFields.code) cls.subjectCode = updatedFields.code;
            if (updatedFields.faculty) cls.faculty = updatedFields.faculty;
          }
        });
        this.save();
      }
    }
  }

  deleteDepartmentSubject(deptId, subId) {
    const dept = (this.state.departments || []).find(d => d.id === deptId);
    if (dept && dept.subjects) {
      dept.subjects = dept.subjects.filter(s => s.id !== subId);
      this.state.departmentClasses = (this.state.departmentClasses || []).filter(c => c.subjectId !== subId);
      this.save();
    }
  }

  addDepartmentClass(cls) {
    const id = "dcls-" + Date.now();
    const newCls = { id, ...cls };
    if (!this.state.departmentClasses) this.state.departmentClasses = [];
    this.state.departmentClasses.push(newCls);
    this.save();
    return newCls;
  }

  updateDepartmentClass(id, updatedFields) {
    const idx = (this.state.departmentClasses || []).findIndex(c => c.id === id);
    if (idx !== -1) {
      this.state.departmentClasses[idx] = { ...this.state.departmentClasses[idx], ...updatedFields };
      this.save();
    }
  }

  deleteDepartmentClass(id) {
    this.state.departmentClasses = (this.state.departmentClasses || []).filter(c => c.id !== id);
    this.save();
  }

  // --- Real-time Day Intersection / Collision Engine ---
  detectDayIntersections(day) {
    const toMinutes = (timeStr) => {
      if (!timeStr) return 0;
      const [h, m] = timeStr.split(':').map(Number);
      return h * 60 + m;
    };

    const classesOnDay = (this.state.departmentClasses || []).filter(
      c => c.day && c.day.toLowerCase() === day.toLowerCase()
    );

    const collisions = [];
    const collidingClassIds = new Set();
    const roomCollisions = [];
    const facultyCollisions = [];
    const batchCollisions = [];

    // Pairwise comparison across all department classes on this day
    for (let i = 0; i < classesOnDay.length; i++) {
      for (let j = i + 1; j < classesOnDay.length; j++) {
        const c1 = classesOnDay[i];
        const c2 = classesOnDay[j];

        const start1 = toMinutes(c1.startTime);
        const end1 = toMinutes(c1.endTime);
        const start2 = toMinutes(c2.startTime);
        const end2 = toMinutes(c2.endTime);

        // Check if times overlap
        const overlap = Math.max(start1, start2) < Math.min(end1, end2);

        if (overlap) {
          const overlapStartMin = Math.max(start1, start2);
          const overlapEndMin = Math.min(end1, end2);
          const formatTime = (min) => {
            const h = String(Math.floor(min / 60)).padStart(2, '0');
            const m = String(min % 60).padStart(2, '0');
            return `${h}:${m}`;
          };
          const overlapWindow = `${formatTime(overlapStartMin)} - ${formatTime(overlapEndMin)}`;

          const dept1 = (this.state.departments || []).find(d => d.id === c1.departmentId);
          const dept2 = (this.state.departments || []).find(d => d.id === c2.departmentId);

          // 1. Room Intersection (Double booking of venue)
          if (c1.room && c2.room && c1.room.trim().toLowerCase() === c2.room.trim().toLowerCase()) {
            collidingClassIds.add(c1.id);
            collidingClassIds.add(c2.id);
            const conflictObj = {
              id: `conf-room-${c1.id}-${c2.id}`,
              type: 'room',
              severity: 'critical',
              title: `Room Collision: ${c1.room}`,
              class1: c1,
              class2: c2,
              dept1Code: dept1 ? dept1.code : 'Dept 1',
              dept2Code: dept2 ? dept2.code : 'Dept 2',
              dept1Name: dept1 ? dept1.name : 'Dept 1',
              dept2Name: dept2 ? dept2.name : 'Dept 2',
              room: c1.room,
              overlapWindow,
              message: `Venue "${c1.room}" is double-booked from ${overlapWindow} between ${dept1 ? dept1.code : ''} (${c1.subjectName}) and ${dept2 ? dept2.code : ''} (${c2.subjectName}).`
            };
            collisions.push(conflictObj);
            roomCollisions.push(conflictObj);
          }

          // 2. Faculty Intersection (Same professor booked in two classes)
          if (c1.faculty && c2.faculty && c1.faculty.trim().toLowerCase() === c2.faculty.trim().toLowerCase()) {
            collidingClassIds.add(c1.id);
            collidingClassIds.add(c2.id);
            const conflictObj = {
              id: `conf-fac-${c1.id}-${c2.id}`,
              type: 'faculty',
              severity: 'critical',
              title: `Instructor Collision: ${c1.faculty}`,
              class1: c1,
              class2: c2,
              dept1Code: dept1 ? dept1.code : 'Dept 1',
              dept2Code: dept2 ? dept2.code : 'Dept 2',
              dept1Name: dept1 ? dept1.name : 'Dept 1',
              dept2Name: dept2 ? dept2.name : 'Dept 2',
              faculty: c1.faculty,
              overlapWindow,
              message: `Instructor "${c1.faculty}" is scheduled simultaneously in two classes from ${overlapWindow} (${c1.subjectName} & ${c2.subjectName}).`
            };
            collisions.push(conflictObj);
            facultyCollisions.push(conflictObj);
          }

          // 3. Batch Intersection (Same student cohort booked in two classes)
          if (c1.batch && c2.batch && c1.batch.trim().toLowerCase() === c2.batch.trim().toLowerCase()) {
            collidingClassIds.add(c1.id);
            collidingClassIds.add(c2.id);
            const conflictObj = {
              id: `conf-batch-${c1.id}-${c2.id}`,
              type: 'batch',
              severity: 'high',
              title: `Student Batch Overlap: ${c1.batch}`,
              class1: c1,
              class2: c2,
              dept1Code: dept1 ? dept1.code : 'Dept 1',
              dept2Code: dept2 ? dept2.code : 'Dept 2',
              dept1Name: dept1 ? dept1.name : 'Dept 1',
              dept2Name: dept2 ? dept2.name : 'Dept 2',
              batch: c1.batch,
              overlapWindow,
              message: `Student cohort "${c1.batch}" has conflicting class sessions from ${overlapWindow} (${c1.subjectName} vs ${c2.subjectName}).`
            };
            collisions.push(conflictObj);
            batchCollisions.push(conflictObj);
          }
        }
      }
    }

    return {
      hasIntersections: collisions.length > 0,
      totalCollisions: collisions.length,
      collisions,
      collidingClassIds: Array.from(collidingClassIds),
      roomCollisions,
      facultyCollisions,
      batchCollisions,
      classesCount: classesOnDay.length
    };
  }

  // Real-time conflict tester for candidate class
  checkNewClassIntersection(candidate, excludeId = null) {
    const toMinutes = (timeStr) => {
      if (!timeStr) return 0;
      const [h, m] = timeStr.split(':').map(Number);
      return h * 60 + m;
    };

    const candStart = toMinutes(candidate.startTime);
    const candEnd = toMinutes(candidate.endTime);

    const classesOnDay = (this.state.departmentClasses || []).filter(
      c => c.id !== excludeId && c.day && c.day.toLowerCase() === candidate.day.toLowerCase()
    );

    const conflicts = [];

    for (const c of classesOnDay) {
      const cStart = toMinutes(c.startTime);
      const cEnd = toMinutes(c.endTime);

      if (Math.max(candStart, cStart) < Math.min(candEnd, cEnd)) {
        // Room clash
        if (candidate.room && c.room && candidate.room.trim().toLowerCase() === c.room.trim().toLowerCase()) {
          conflicts.push(`⚠️ Room Clash: Venue "${c.room}" is already booked by [${c.subjectName}] (${c.startTime} - ${c.endTime})`);
        }
        // Faculty clash
        if (candidate.faculty && c.faculty && candidate.faculty.trim().toLowerCase() === c.faculty.trim().toLowerCase()) {
          conflicts.push(`⚠️ Instructor Clash: "${c.faculty}" is already teaching [${c.subjectName}] (${c.startTime} - ${c.endTime})`);
        }
        // Batch clash
        if (candidate.batch && c.batch && candidate.batch.trim().toLowerCase() === c.batch.trim().toLowerCase()) {
          conflicts.push(`⚠️ Cohort Clash: Batch "${c.batch}" is already scheduled for [${c.subjectName}] (${c.startTime} - ${c.endTime})`);
        }
      }
    }

    return conflicts;
  }

  // --- ROLE-BASED ACCESS CONTROL (HOST vs STUDENT) ---
  setRole(role) {
    this.state.currentRole = (role === 'student' ? 'student' : 'host');
    this.save();
  }

  isHost() {
    return (this.state.currentRole || 'host') === 'host';
  }

  // --- WEARABLE DATA SYNC (Fitbit, Apple Health, Google Fit) ---
  syncWearables(appName = 'Fitbit') {
    if (!this.state.wearables) this.state.wearables = defaultState.wearables;

    // Simulate real wearable sensor readings
    const randomStepsDelta = Math.floor(Math.random() * 300) + 120;
    const currentSteps = Math.min(12500, (this.state.wearables.steps || 8420) + randomStepsDelta);
    const simulatedBpm = Math.floor(Math.random() * 8) + 70; // 70 - 77 bpm
    const simulatedCals = Math.floor(currentSteps * 0.045) + 120;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    this.state.wearables.connectedApp = appName.toLowerCase().replace(/\s+/g, '');
    this.state.wearables.deviceName = `${appName} Sensor Link`;
    this.state.wearables.steps = currentSteps;
    this.state.wearables.heartRate = simulatedBpm;
    this.state.wearables.activeCalories = simulatedCals;
    this.state.wearables.lastSync = `Today @ ${timeStr}`;

    if (!this.state.wearables.syncHistory) this.state.wearables.syncHistory = [];
    this.state.wearables.syncHistory.unshift({
      id: 'wh-' + Date.now(),
      app: appName,
      time: timeStr,
      text: `Live Sync: ${currentSteps.toLocaleString()} steps, ${simulatedBpm} BPM resting HR, ${simulatedCals} kcal burned`
    });

    // Also update health section metrics
    if (this.state.health) {
      this.state.health.sleepHours = 7.4;
      this.state.health.sleepQuality = 'Good (Fitbit Tracked)';
    }

    this.save();
    return this.state.wearables;
  }

  // --- BIOMETRIC FACIAL RECOGNITION MACHINE GATEWAY ---
  logBiometricScan(personName, role, idNumber, room = "LH-302", confidence = "99.4%") {
    if (!this.state.biometrics) this.state.biometrics = defaultState.biometrics;
    if (!this.state.biometrics.scanLogs) this.state.biometrics.scanLogs = [];

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newScan = {
      id: 'scan-' + Date.now(),
      personName,
      role, // 'student' or 'teacher'
      idNumber,
      dept: 'CSE',
      timestamp: timeStr,
      date: 'Today',
      room,
      confidence,
      status: role === 'student' ? 'Present Verified' : 'Faculty Checked In',
      photo: role === 'student' ? '👨‍🎓' : '👨‍🏫'
    };

    this.state.biometrics.scanLogs.unshift(newScan);

    // Auto-increment student attendance if logged as current student
    const studentName = this.state.student ? this.state.student.name : 'Alex Rivera';
    if (role === 'student' && personName.toLowerCase() === studentName.toLowerCase()) {
      // Find current subject in that room or first subject
      const sub = this.state.subjects && this.state.subjects[0];
      if (sub) {
        this.markAttendance(sub.id, 'present');
      }
    }

    this.save();
    return newScan;
  }

  // --- ROOM AVAILABILITY & VACANCY ENGINE ---
  getRoomAvailability(day = "Monday", customTimeMinutes = null) {
    const toMinutes = (timeStr) => {
      if (!timeStr) return 0;
      const [h, m] = timeStr.split(':').map(Number);
      return h * 60 + m;
    };

    const now = new Date();
    const currentMinutes = customTimeMinutes !== null ? customTimeMinutes : (now.getHours() * 60 + now.getMinutes());

    const allBookings = [
      ...(this.state.departmentClasses || []).map(c => ({
        id: c.id,
        day: c.day,
        startTime: c.startTime,
        endTime: c.endTime,
        room: c.room,
        title: `${c.subjectCode ? c.subjectCode + ': ' : ''}${c.subjectName}`,
        faculty: c.faculty,
        batch: c.batch,
        type: c.type || 'Lecture'
      })),
      ...(this.state.timetableSlots || []).map(s => ({
        id: s.id,
        day: s.day,
        startTime: s.startTime,
        endTime: s.endTime,
        room: s.room,
        title: s.title,
        faculty: '',
        batch: '',
        type: s.type || 'Class'
      }))
    ].filter(b => b.room && b.day && b.day.toLowerCase() === day.toLowerCase());

    const rooms = this.state.rooms || defaultState.rooms;

    return rooms.map(room => {
      const roomBookings = allBookings
        .filter(b => b.room.trim().toLowerCase() === room.id.trim().toLowerCase() || b.room.trim().toLowerCase() === room.name.trim().toLowerCase())
        .sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime));

      let currentSession = null;
      let nextSession = null;

      for (const b of roomBookings) {
        const start = toMinutes(b.startTime);
        const end = toMinutes(b.endTime);

        if (currentMinutes >= start && currentMinutes < end) {
          currentSession = b;
        } else if (start > currentMinutes && !nextSession) {
          nextSession = b;
        }
      }

      const isOccupied = !!currentSession;

      // Hourly timeline (8:00 AM to 6:00 PM)
      const hoursMap = [];
      for (let h = 8; h <= 18; h++) {
        const slotStart = h * 60;
        const slotEnd = (h + 1) * 60;
        const busy = roomBookings.some(b => {
          const bStart = toMinutes(b.startTime);
          const bEnd = toMinutes(b.endTime);
          return Math.max(slotStart, bStart) < Math.min(slotEnd, bEnd);
        });
        hoursMap.push({ hour: h, timeLabel: `${h > 12 ? h - 12 : h} ${h >= 12 ? 'PM' : 'AM'}`, busy });
      }

      return {
        room,
        isOccupied,
        currentSession,
        nextSession,
        todayBookings: roomBookings,
        hoursMap
      };
    });
  }

  // --- TEACHER FREE PERIODS & OFFICE HOURS ENGINE ---
  getTeacherFreePeriods(day = "Monday", customTimeMinutes = null) {
    const toMinutes = (timeStr) => {
      if (!timeStr) return 0;
      const [h, m] = timeStr.split(':').map(Number);
      return h * 60 + m;
    };

    const formatMinutes = (mins) => {
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      const ampm = h >= 12 ? 'PM' : 'AM';
      const formattedH = h > 12 ? h - 12 : (h === 0 ? 12 : h);
      return `${formattedH}:${String(m).padStart(2, '0')} ${ampm}`;
    };

    const now = new Date();
    const currentMinutes = customTimeMinutes !== null ? customTimeMinutes : (now.getHours() * 60 + now.getMinutes());

    const allScheduled = [
      ...(this.state.departmentClasses || []).map(c => ({
        day: c.day,
        startTime: c.startTime,
        endTime: c.endTime,
        faculty: c.faculty,
        subject: c.subjectName,
        room: c.room,
        batch: c.batch
      })),
      ...(this.state.timetableSlots || []).map(s => {
        const sub = (this.state.subjects || []).find(sub => sub.id === s.subjectId);
        return {
          day: s.day,
          startTime: s.startTime,
          endTime: s.endTime,
          faculty: sub ? sub.faculty : '',
          subject: s.title,
          room: s.room,
          batch: ''
        };
      })
    ].filter(s => s.faculty && s.day && s.day.toLowerCase() === day.toLowerCase());

    const teachers = this.state.teachers || defaultState.teachers;

    return teachers.map(teacher => {
      // Find classes taught by this teacher on this day
      const teachingClasses = allScheduled
        .filter(s => s.faculty.trim().toLowerCase().includes(teacher.name.trim().toLowerCase()) || teacher.name.trim().toLowerCase().includes(s.faculty.trim().toLowerCase()))
        .sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime));

      // Calculate if currently teaching
      let currentTeachingSession = null;
      for (const cls of teachingClasses) {
        const start = toMinutes(cls.startTime);
        const end = toMinutes(cls.endTime);
        if (currentMinutes >= start && currentMinutes < end) {
          currentTeachingSession = cls;
          break;
        }
      }

      const isFreeNow = !currentTeachingSession;

      // Compute free period slots between 08:30 AM (510 min) and 05:30 PM (1050 min)
      const campusStart = 8 * 60 + 30; // 08:30 AM
      const campusEnd = 17 * 60 + 30;   // 05:30 PM
      const freePeriods = [];

      let pointer = campusStart;
      teachingClasses.forEach(cls => {
        const clsStart = toMinutes(cls.startTime);
        const clsEnd = toMinutes(cls.endTime);

        if (clsStart > pointer) {
          freePeriods.push({
            start: formatMinutes(pointer),
            end: formatMinutes(clsStart),
            durationMins: clsStart - pointer
          });
        }
        pointer = Math.max(pointer, clsEnd);
      });

      if (pointer < campusEnd) {
        freePeriods.push({
          start: formatMinutes(pointer),
          end: formatMinutes(campusEnd),
          durationMins: campusEnd - pointer
        });
      }

      return {
        teacher,
        isFreeNow,
        currentTeachingSession,
        teachingClasses,
        freePeriods
      };
    });
  }

  // --- OPD Clinical Timetable Methods ---
  addOpdSession(session) {
    const id = "opd-" + Date.now();
    const newSession = {
      id,
      status: "Active",
      maxTokens: 40,
      color: "#3b82f6",
      ...session
    };
    if (!this.state.opdSchedule) this.state.opdSchedule = [];
    this.state.opdSchedule.push(newSession);
    this.save();
    return newSession;
  }

  updateOpdSession(id, updatedFields) {
    const idx = (this.state.opdSchedule || []).findIndex(o => o.id === id);
    if (idx !== -1) {
      this.state.opdSchedule[idx] = { ...this.state.opdSchedule[idx], ...updatedFields };
      this.save();
    }
  }

  deleteOpdSession(id) {
    this.state.opdSchedule = (this.state.opdSchedule || []).filter(o => o.id !== id);
    this.save();
  }
}

// Global store instance
window.store = new Store();

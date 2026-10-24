# CampusFlow — College Timetable & Student Life Hub 🎓

**CampusFlow** is an all-in-one web portal designed specifically for college students to effortlessly balance academics, societies, fitness, and weekends.

---

## 🌟 Key Modules & Features

### 1. 📅 Interactive Weekly Timetable (Monday – Friday)
- **Monday to Friday Focus Grid**: Clean 5-day academic week (Saturday slot removed from weekly timetable).
- **Smart Conflict Detector**: Automatically alerts you if two classes or meetings overlap.
- **Live Class Alert**: Real-time ticker showing your active ongoing lecture, countdown to the next class, room number, and 1-click attendance marking.
- **Color Coded Categories**: Lectures (Blue), Practical Labs (Purple), Tutorials (Teal), Clubs (Orange), and Self Study (Green).
- **Print Friendly**: Clean, paper-optimized printing for hostel pinboards or binder inserts (`Ctrl + P` / Print button).

### 2. 🏛️ Department Classes & Day Intersection Radar (Monday – Friday, Host Exclusive)
- **Visibility**: Strictly reserved for **Host Mode** (hidden in Student Mode so students only see their personal timetable and enrolled courses).
- **Monday to Friday Academic Schedule**: Focused 5-day academic week (Saturday and Sunday slots removed).
- **Multi-Department Organization**: Group classes by academic departments (Computer Science, Electronics & Communication, Mechanical, Electrical, etc.).
- **Department Subjects Sub-Section**: Dedicated curriculum catalog under each department with credits, course code, and faculty.
- **Live Day-Wise Intersection Detector**:
  - Automatically identifies whether any classes on that day intersect in time.
  - **Room Double-Booking Collision**: Detects if two departments or subjects booked the same classroom/hall simultaneously.
  - **Instructor Double-Booking Collision**: Detects if a professor is booked in two classes at the same time.
  - **Student Batch Overlap**: Detects if the same student section is scheduled for conflicting classes.

### 3. 🏥 Hospital & Clinical OPD Timetable (Host Editable Only)
- **Multi-Specialty Clinical Rotations**: Outpatient department schedule across all days (Monday through Sunday).
- **Specialty Units**: General Medicine, Pediatrics, Orthopedics, Dermatology, Cardiology, ENT, Ophthalmology, Surgery, etc.
- **Session Details**: Clinic chambers/rooms, shifts (Morning / Afternoon / Evening), supervising physicians, and posted student batches.
- **Host vs Student Control**: Editable only by Host; clean read-only duty roster view for students.

### 4. 📚 Subjects & Pending Submissions (Student Roster Submission Manager)
- **75% Attendance Advisor**: Safe bunk calculator and recovery planner.
- **Host-Exclusive Assignment Management**: Adding, editing, and deleting assignments is restricted to Host Mode.
- **Student Submission Roster**: Host can view the full roster of students (Alex Rivera, Tanya Sharma, Rohan Verma, etc.) and toggle who has submitted vs pending with submission dates and grades.
- **Student View**: Students can view deadlines and their verified personal submission status without unauthorized self-toggling.

### 5. 👥 Student Clubs & Societies (Host-Managed Enrollments)
- **Administrative Membership Roster**: Students cannot add or leave clubs directly. Club memberships are assigned and managed exclusively by the Host from the student directory.
- **Host Member Manager**: 1-click modal for Host to enroll or remove students into any club society.
- **Pin to Timetable**: Sync weekly club meetings directly into timetable slots.
- **Club Action Items & Events**: Track society hackathons, fests, and workshops.

### 6. 🚪 Campus Room Availability Radar & Teacher Free Periods
- **Room Vacancy Radar**: Live vacant vs occupied status for 12 campus classrooms, lecture halls, and laboratories with hourly occupancy bars.
- **Teacher Free Periods & Office Hours**: Live faculty cabin status, contact emails, and day-wise free period windows for doubt clearing.

### 7. 📷 Biometric Face-Scan Machine Gateway
- **Terminal Hardware Online**: Automated face recognition scanning for students and faculty.
- **Tamper-Proof Attendance**: Automatic attendance verification eliminating manual student attendance manipulation.

### 8. 🎒 Weekend Suggestions Engine
- Curated weekend plans categorized by mood (Relax, Productive, Outdoor, Social, Skill Up).
- Saturday & Sunday itinerary builder with custom plan addition.

### 5. 🎒 Weekend Suggestions Engine
- **Curated Weekend Ideas**: Categorized by student mood & goals:
  - 🔋 *Relax & Recharge* (Dorm movie marathon, sleep debt recovery, comfort cooking)
  - 🚀 *Productive Sprint* (Hackathon building, GitHub open-source, portfolio sprint)
  - 🎒 *Adventure & Outdoor* (Nearby nature trails, budget cafe crawl, turf football)
  - 👥 *Social & Friends* (Board games night, dorm pizza party, music jam)
  - 💡 *Skill Up* (Framework mastery, AWS/Docker certification, resume polish)
- **"Surprise Me!" Random Idea Generator**: Interactive generator for indecisive weekends.
- **Saturday & Sunday Itinerary Builder**: Schedule activities into time blocks with interactive checkboxes.
- **Custom Idea Creator**: Add your own favorite hangout spots or personal weekend projects.

---

## 🚀 How to Launch

### Option 1: Direct Browser Launch (Instant, No Installation Needed)
Simply open `index.html` in any web browser (Google Chrome, Microsoft Edge, Brave, Firefox):
- Double-click [index.html](file:///C:/Users/rahul/.gemini/antigravity/scratch/college-timetable-hub/index.html) in Windows File Explorer.

### Option 2: Run via Local Server
Double-click `start.bat` in the project directory, or run with Node.js:
```powershell
node server.js
```
Then visit: **`http://localhost:3000`**

---

## 💾 Data Persistence & Portability
- **Automatic LocalStorage**: All timetable slots, attendance counts, club tasks, workouts, and weekend plans stay saved in your browser.
- **Export Backup**: Download your entire semester setup as a `.json` backup file.
- **Import Backup**: Share timetable setups with batchmates or restore from backup.
- **Demo Data Reset**: Instant 1-click restore to pre-populated realistic student sample data.

---

## 🎨 Design & Customization
- **Dark Mode & Light Mode**: Seamless toggle in the header.
- **Student Profile**: Customize Student Name, Roll Number, Branch, Semester, College Name, and Minimum Attendance percentage target in the profile modal.
- **Global Search (`Ctrl + K`)**: Instantly search across all subjects, timetable slots, clubs, and weekend activities.

// Weekend Suggestions & Activity Planner Component

let weekendCategoryFilter = 'all';

function initWeekend() {
  renderWeekend();
}

function setWeekendFilter(cat) {
  weekendCategoryFilter = cat;
  renderWeekend();
}

function renderWeekend() {
  const container = document.getElementById('weekend-content');
  if (!container) return;

  const state = window.store.getState();
  const suggestions = state.weekend.suggestions || [];
  const plannedSchedule = state.weekend.plannedSchedule || { saturday: [], sunday: [] };

  const filteredSuggestions = suggestions.filter(s => {
    if (weekendCategoryFilter === 'all') return true;
    if (weekendCategoryFilter === 'saved') return s.isSaved;
    return s.category === weekendCategoryFilter;
  });

  let html = `
    <!-- Top Hero Banner: Smart Weekend Recommendation Engine -->
    <div class="relative overflow-hidden rounded-3xl p-6 md:p-8 mb-8 border border-indigo-500/30 bg-gradient-to-r from-indigo-900/50 via-purple-900/40 to-slate-900 shadow-2xl">
      <div class="relative z-10 max-w-2xl">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-3">
          ${window.getIcon('sparkles', 'w-3.5 h-3.5')}
          Smart Weekend Engine for College Students
        </div>
        <h3 class="text-2xl md:text-3xl font-extrabold text-white mb-2 leading-tight">
          Don't let your weekend slip by scrolling.
        </h3>
        <p class="text-slate-300 text-xs md:text-sm mb-6 leading-relaxed">
          Balance deep project sprints, campus socializing, and restorative self-care. Choose your vibe or let our engine surprise you!
        </p>

        <div class="flex flex-wrap items-center gap-3">
          <button onclick="spinRandomWeekendIdea()" class="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs md:text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/40 transition flex items-center gap-2">
            ${window.getIcon('sparkles')}
            <span>Surprise Me! (Random Pick)</span>
          </button>
          <button onclick="openAddCustomIdeaModal()" class="px-4 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs md:text-sm font-medium rounded-xl border border-slate-700 transition flex items-center gap-1.5">
            ${window.getIcon('plus')}
            <span>Submit Weekend Idea</span>
          </button>
        </div>
      </div>
      <!-- Background subtle decorative element -->
      <div class="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
    </div>

    <!-- Category Filters -->
    <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div class="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900/60 rounded-xl border border-slate-700/50">
        <button onclick="setWeekendFilter('all')" class="px-3.5 py-1.5 text-xs md:text-sm font-medium rounded-lg transition ${weekendCategoryFilter === 'all' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}">
          All Ideas
        </button>
        <button onclick="setWeekendFilter('relax')" class="px-3.5 py-1.5 text-xs md:text-sm font-medium rounded-lg transition ${weekendCategoryFilter === 'relax' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}">
          🔋 Relax & Recharge
        </button>
        <button onclick="setWeekendFilter('productive')" class="px-3.5 py-1.5 text-xs md:text-sm font-medium rounded-lg transition ${weekendCategoryFilter === 'productive' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}">
          🚀 Productive Sprint
        </button>
        <button onclick="setWeekendFilter('adventure')" class="px-3.5 py-1.5 text-xs md:text-sm font-medium rounded-lg transition ${weekendCategoryFilter === 'adventure' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}">
          🎒 Adventure & Outing
        </button>
        <button onclick="setWeekendFilter('social')" class="px-3.5 py-1.5 text-xs md:text-sm font-medium rounded-lg transition ${weekendCategoryFilter === 'social' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}">
          👥 Social & Games
        </button>
        <button onclick="setWeekendFilter('skill')" class="px-3.5 py-1.5 text-xs md:text-sm font-medium rounded-lg transition ${weekendCategoryFilter === 'skill' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}">
          💡 Skill Up
        </button>
        <button onclick="setWeekendFilter('saved')" class="px-3.5 py-1.5 text-xs md:text-sm font-medium rounded-lg transition ${weekendCategoryFilter === 'saved' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}">
          ⭐ Saved (${suggestions.filter(s => s.isSaved).length})
        </button>
      </div>

      <span class="text-xs text-slate-400 font-mono">${filteredSuggestions.length} suggestions available</span>
    </div>

    <!-- Main Grid: Suggestions Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      ${filteredSuggestions.map(item => renderSuggestionCard(item)).join('')}
    </div>

    <!-- Weekend Planner Timeline: Saturday & Sunday Plan Builder -->
    <div class="glass-card p-6 md:p-8 rounded-3xl border border-slate-700/70">
      <div class="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <h4 class="text-xl font-bold text-white flex items-center gap-2">
            ${window.getIcon('calendar', 'text-indigo-400')}
            My Weekend Itinerary Builder
          </h4>
          <p class="text-xs text-slate-400">Map out your Saturday & Sunday time blocks to stay balanced</p>
        </div>

        <div class="flex items-center gap-2">
          <button onclick="promptAddPlanItem('saturday')" class="text-xs px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 border border-indigo-500/30 transition flex items-center gap-1">
            ${window.getIcon('plus')} + Saturday Slot
          </button>
          <button onclick="promptAddPlanItem('sunday')" class="text-xs px-3 py-1.5 rounded-lg bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 border border-purple-500/30 transition flex items-center gap-1">
            ${window.getIcon('plus')} + Sunday Slot
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Saturday Column -->
        <div class="p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
          <div class="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
            <span class="font-bold text-sm text-indigo-300 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-indigo-500"></span>
              Saturday Timeline
            </span>
            <span class="text-xs text-slate-500 font-mono">${(plannedSchedule.saturday || []).length} blocks</span>
          </div>
          <div class="space-y-2">
            ${(plannedSchedule.saturday || []).length === 0 ? `
              <p class="text-xs text-slate-500 py-4 text-center italic">No slots scheduled for Saturday yet.</p>
            ` : plannedSchedule.saturday.map((item, idx) => renderScheduleItem('saturday', item, idx)).join('')}
          </div>
        </div>

        <!-- Sunday Column -->
        <div class="p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
          <div class="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
            <span class="font-bold text-sm text-purple-300 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-purple-500"></span>
              Sunday Timeline
            </span>
            <span class="text-xs text-slate-500 font-mono">${(plannedSchedule.sunday || []).length} blocks</span>
          </div>
          <div class="space-y-2">
            ${(plannedSchedule.sunday || []).length === 0 ? `
              <p class="text-xs text-slate-500 py-4 text-center italic">No slots scheduled for Sunday yet.</p>
            ` : plannedSchedule.sunday.map((item, idx) => renderScheduleItem('sunday', item, idx)).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = html;
}

function renderSuggestionCard(item) {
  const categoryLabels = {
    relax: { label: "Relax & Recharge", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" },
    productive: { label: "Productive Sprint", color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30" },
    adventure: { label: "Adventure & Outing", color: "text-amber-400 bg-amber-500/10 border-amber-500/30" },
    social: { label: "Social & Fun", color: "text-pink-400 bg-pink-500/10 border-pink-500/30" },
    skill: { label: "Skill Building", color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30" }
  };

  const catMeta = categoryLabels[item.category] || { label: item.category, color: "text-slate-300 bg-slate-800 border-slate-700" };

  return `
    <div class="glass-card p-5 rounded-2xl border border-slate-700/70 hover:border-indigo-500/50 transition flex flex-col justify-between group">
      <div>
        <div class="flex items-center justify-between mb-3">
          <span class="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border ${catMeta.color}">
            ${catMeta.label}
          </span>
          <button onclick="toggleSaveWeekendIdea('${item.id}')" class="p-1 text-slate-400 hover:text-amber-400 transition" title="Save to favorites">
            ${item.isSaved ? `<span class="text-amber-400">★</span>` : `<span>☆</span>`}
          </button>
        </div>

        <h4 class="text-base font-bold text-white group-hover:text-indigo-300 transition mb-2">
          ${item.title}
        </h4>

        <p class="text-xs text-slate-400 leading-relaxed mb-4">
          ${item.description}
        </p>

        <!-- Meta tags: Duration, Budget, Vibe -->
        <div class="flex flex-wrap items-center gap-2 mb-4 text-[11px]">
          <span class="px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700">
            ⏳ ${item.duration}
          </span>
          <span class="px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700">
            💵 ${item.budget}
          </span>
          <span class="px-2 py-0.5 rounded bg-slate-800/80 text-purple-300 border border-purple-500/20">
            ✨ ${item.vibe}
          </span>
        </div>

        <!-- Tags -->
        <div class="flex flex-wrap gap-1 mb-4">
          ${(item.tags || []).map(tag => `
            <span class="text-[10px] text-slate-400 bg-slate-800/50 px-2 py-0.5 rounded-md">#${tag}</span>
          `).join('')}
        </div>
      </div>

      <!-- Action: Pin to Saturday or Sunday -->
      <div class="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
        <span class="text-[11px] text-slate-400">Plan for:</span>
        <div class="flex items-center gap-1.5">
          <button onclick="addIdeaToSchedule('saturday', '${item.title.replace(/'/g, "\\'")}')" class="text-[11px] px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 transition">
            + Sat
          </button>
          <button onclick="addIdeaToSchedule('sunday', '${item.title.replace(/'/g, "\\'")}')" class="text-[11px] px-2.5 py-1 rounded-lg bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 transition">
            + Sun
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderScheduleItem(day, item, index) {
  return `
    <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800 text-xs transition">
      <label class="flex items-center gap-2.5 cursor-pointer flex-1">
        <input type="checkbox" onchange="toggleWeekendScheduleItem('${day}', ${index})" ${item.done ? 'checked' : ''} class="rounded text-indigo-600 bg-slate-900 border-slate-700 focus:ring-0">
        <div>
          <span class="font-mono text-slate-400 text-[11px] mr-1.5 font-medium">${item.time}</span>
          <span class="${item.done ? 'line-through text-slate-500' : 'text-slate-200 font-medium'}">${item.title}</span>
        </div>
      </label>
      <button onclick="deleteWeekendScheduleItem('${day}', ${index})" class="text-slate-500 hover:text-red-400 p-1 transition">
        ${window.getIcon('x', 'w-3.5 h-3.5')}
      </button>
    </div>
  `;
}

function toggleSaveWeekendIdea(id) {
  window.store.toggleWeekendWishlist(id);
  renderWeekend();
}

function addIdeaToSchedule(day, title) {
  const time = prompt(`Enter time slot for ${day.toUpperCase()} (e.g. 10:00 AM, 03:30 PM):`, "02:00 PM");
  if (time && time.trim()) {
    window.store.addWeekendPlanItem(day, time.trim(), title);
    window.showToast(`Scheduled for ${day}!`, "success");
    renderWeekend();
  }
}

function promptAddPlanItem(day) {
  const title = prompt(`Enter task or activity for ${day.toUpperCase()}:`);
  if (!title || !title.trim()) return;

  const time = prompt("Enter scheduled time (e.g. 10:00 AM, 04:00 PM):", "10:00 AM");
  if (!time || !time.trim()) return;

  window.store.addWeekendPlanItem(day, time.trim(), title.trim());
  window.showToast("Added to itinerary!", "success");
  renderWeekend();
}

function toggleWeekendScheduleItem(day, index) {
  window.store.toggleWeekendPlanItem(day, index);
  renderWeekend();
}

function deleteWeekendScheduleItem(day, index) {
  window.store.deleteWeekendPlanItem(day, index);
  renderWeekend();
}

// "Surprise Me" Wheel / Random Generator
function spinRandomWeekendIdea() {
  const state = window.store.getState();
  const suggestions = state.weekend.suggestions || [];
  if (suggestions.length === 0) return;

  const randomItem = suggestions[Math.floor(Math.random() * suggestions.length)];

  const modalHtml = `
    <div id="surprise-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay">
      <div class="glass-card bg-slate-900 border border-indigo-500/40 w-full max-w-md p-6 rounded-3xl shadow-2xl relative text-center">
        <button onclick="closeModal('surprise-modal')" class="absolute top-5 right-5 text-slate-400 hover:text-white">
          ${window.getIcon('x')}
        </button>

        <div class="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
          ${window.getIcon('sparkles', 'w-8 h-8')}
        </div>

        <span class="text-xs uppercase font-bold tracking-wider text-indigo-400">Your Weekend Mission</span>
        <h3 class="text-xl font-black text-white mt-1 mb-2">${randomItem.title}</h3>
        <p class="text-xs text-slate-300 mb-4 px-2 leading-relaxed">${randomItem.description}</p>

        <div class="flex items-center justify-center gap-2 mb-6 text-xs text-slate-400">
          <span class="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700">⏳ ${randomItem.duration}</span>
          <span class="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700">💵 ${randomItem.budget}</span>
        </div>

        <div class="flex items-center justify-center gap-2">
          <button onclick="addIdeaToSchedule('saturday', '${randomItem.title.replace(/'/g, "\\'")}'); closeModal('surprise-modal');" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition">
            Plan for Saturday
          </button>
          <button onclick="addIdeaToSchedule('sunday', '${randomItem.title.replace(/'/g, "\\'")}'); closeModal('surprise-modal');" class="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow transition">
            Plan for Sunday
          </button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function openAddCustomIdeaModal() {
  const modalHtml = `
    <div id="custom-idea-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay">
      <div class="glass-card bg-slate-900 border border-slate-700 w-full max-w-md p-6 rounded-2xl shadow-2xl relative">
        <button onclick="closeModal('custom-idea-modal')" class="absolute top-5 right-5 text-slate-400 hover:text-white">
          ${window.getIcon('x')}
        </button>
        <h3 class="text-xl font-bold text-white mb-1 flex items-center gap-2">
          ${window.getIcon('sparkles', 'text-indigo-400')}
          Add Custom Weekend Idea
        </h3>
        <p class="text-xs text-slate-400 mb-5">Share an activity or place for campus students</p>

        <form onsubmit="handleSaveCustomIdea(event)" class="space-y-4">
          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Activity Title *</label>
            <input type="text" id="wkd-title" required placeholder="e.g. Midnight stargazing at astronomy dome" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none">
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Vibe Category</label>
              <select id="wkd-cat" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none">
                <option value="relax">Relax & Recharge</option>
                <option value="productive">Productive Sprint</option>
                <option value="adventure">Adventure & Outing</option>
                <option value="social">Social & Games</option>
                <option value="skill">Skill Building</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Estimated Duration</label>
              <input type="text" id="wkd-duration" placeholder="e.g. 2-3 hours" value="2-3 hours" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none">
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Budget</label>
              <input type="text" id="wkd-budget" placeholder="e.g. Free or $5" value="Free" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none">
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Vibe Tag</label>
              <input type="text" id="wkd-vibe" placeholder="e.g. Cosmic & Peaceful" value="Exciting" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none">
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Details & Highlights</label>
            <textarea id="wkd-desc" rows="2" placeholder="What to bring, where to meet, and why it's awesome" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none"></textarea>
          </div>

          <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button type="button" onclick="closeModal('custom-idea-modal')" class="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition">
              Cancel
            </button>
            <button type="submit" class="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium shadow-lg shadow-indigo-600/30 transition">
              Add Idea
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function handleSaveCustomIdea(e) {
  e.preventDefault();
  const title = document.getElementById('wkd-title').value.trim();
  const category = document.getElementById('wkd-cat').value;
  const duration = document.getElementById('wkd-duration').value.trim();
  const budget = document.getElementById('wkd-budget').value.trim();
  const vibe = document.getElementById('wkd-vibe').value.trim();
  const description = document.getElementById('wkd-desc').value.trim() || 'Exciting student weekend plan.';

  const newIdea = {
    id: "wkd-" + Date.now(),
    title,
    category,
    duration,
    budget,
    vibe,
    description,
    tags: [category, "StudentPick"],
    isSaved: true
  };

  const state = window.store.getState();
  state.weekend.suggestions.unshift(newIdea);
  window.store.save();
  window.showToast("Custom weekend idea saved!", "success");
  closeModal('custom-idea-modal');
  renderWeekend();
}

window.initWeekend = initWeekend;
window.renderWeekend = renderWeekend;
window.setWeekendFilter = setWeekendFilter;
window.toggleSaveWeekendIdea = toggleSaveWeekendIdea;
window.addIdeaToSchedule = addIdeaToSchedule;
window.promptAddPlanItem = promptAddPlanItem;
window.toggleWeekendScheduleItem = toggleWeekendScheduleItem;
window.deleteWeekendScheduleItem = deleteWeekendScheduleItem;
window.spinRandomWeekendIdea = spinRandomWeekendIdea;
window.openAddCustomIdeaModal = openAddCustomIdeaModal;
window.handleSaveCustomIdea = handleSaveCustomIdea;

/* ============================================================
   CALENDAR GENERATION
============================================================ */
const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getWeekdayLabels(weekStart) {
  const labels = [];
  for (let i = 0; i < 7; i++) {
    labels.push(WEEKDAY_LABELS[(weekStart + i) % 7]);
  }
  return labels;
}

function buildCalendar(calendarEl) {
  const month = parseInt(calendarEl.dataset.month, 10);      // 1-12
  const year = parseInt(calendarEl.dataset.year, 10);
  const weekStart = parseInt(calendarEl.dataset.weekstart, 10) || 0;
  const highlight = calendarEl.dataset.highlight ? parseInt(calendarEl.dataset.highlight, 10) : null;

  const weekdaysEl = calendarEl.querySelector('.cal__weekdays');
  const daysEl = calendarEl.querySelector('.cal__days');
  if (!weekdaysEl || !daysEl) return;

  weekdaysEl.innerHTML = getWeekdayLabels(weekStart)
    .map((label) => `<span>${label}</span>`)
    .join('');

  const firstOfMonth = new Date(year, month - 1, 1);
  const leadingBlanks = (firstOfMonth.getDay() - weekStart + 7) % 7;
  const daysInMonth = new Date(year, month, 0).getDate();
  const daysInPrevMonth = new Date(year, month - 1, 0).getDate();

  let html = '';

  for (let i = leadingBlanks; i > 0; i--) {
    html += `<span class="cal__day cal__day--muted">${daysInPrevMonth - i + 1}</span>`;
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const isHighlighted = day === highlight;
    html += `<span class="cal__day${isHighlighted ? ' cal__day--highlight' : ''}">${day}</span>`;
  }

  const totalCells = leadingBlanks + daysInMonth;
  const trailingBlanks = (7 - (totalCells % 7)) % 7;
  for (let day = 1; day <= trailingBlanks; day++) {
    html += `<span class="cal__day cal__day--muted">${day}</span>`;
  }

  daysEl.innerHTML = html;
}

document.querySelectorAll('[data-calendar]').forEach(buildCalendar);

/* ============================================================
   PHOTO SLOT UPLOAD
============================================================ */
const fileInput = document.getElementById('fileInput');
let activeSlot = null;

document.querySelectorAll('.photo-slot').forEach((slot) => {
  slot.addEventListener('click', () => {
    activeSlot = slot;
    fileInput.value = '';
    fileInput.click();
  });
});

fileInput.addEventListener('change', () => {
  const file = fileInput.files && fileInput.files[0];
  if (!file || !activeSlot) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    activeSlot.style.backgroundImage = `url(${event.target.result})`;
    activeSlot.classList.add('has-image');
    ensureRemoveButton(activeSlot);
  };
  reader.readAsDataURL(file);
});

function ensureRemoveButton(slot) {
  if (slot.querySelector('.photo-slot__remove')) return;

  const removeBtn = document.createElement('span');
  removeBtn.className = 'photo-slot__remove';
  removeBtn.textContent = '×';
  removeBtn.setAttribute('aria-label', 'Xoá ảnh');

  removeBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    slot.style.backgroundImage = '';
    slot.classList.remove('has-image');
  });

  slot.appendChild(removeBtn);
}

/* ============================================================
   REQUEST MODAL
============================================================ */
const modal = document.getElementById('requestModal');
const openBtn = document.getElementById('openRequestBtn');
const closeBtn = document.getElementById('closeRequestBtn');
const requestForm = document.getElementById('requestForm');
const successMsg = document.getElementById('modalSuccess');

function openModal() {
  modal.hidden = false;
  successMsg.hidden = true;
  requestForm.hidden = false;
}

function closeModal() {
  modal.hidden = true;
}

openBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);
modal.querySelectorAll('[data-close]').forEach((el) => el.addEventListener('click', closeModal));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !modal.hidden) closeModal();
});

requestForm.addEventListener('submit', (event) => {
  event.preventDefault();
  // No backend wired up yet — swap this for a real fetch() call to your server.
  requestForm.hidden = true;
  successMsg.hidden = false;
});

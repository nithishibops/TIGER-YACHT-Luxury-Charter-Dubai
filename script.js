const story = document.getElementById('story');
const scenes = [...document.querySelectorAll('.scene')];
const progressNum = document.getElementById('progressNum');
const progressBar = document.getElementById('progressBar');
const progressLabel = document.getElementById('progressLabel');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    scenes.forEach(s => s.classList.remove('is-active'));
    entry.target.classList.add('is-active');
    const i = scenes.indexOf(entry.target);
    progressNum.textContent = String(i + 1).padStart(2, '0');
    progressBar.style.height = `${((i + 1) / scenes.length) * 100}%`;
    progressLabel.textContent = entry.target.dataset.label || '';
    document.querySelectorAll('.scene-video').forEach(v => {
      if (v.closest('.scene') === entry.target) v.play().catch(() => {}); else v.pause();
    });
  });
}, {root: story, threshold: .58});
scenes.forEach(scene => observer.observe(scene));

const yachtSelect = document.getElementById('yacht');
const guests = document.getElementById('guests');
const hours = document.getElementById('hours');
const estimateTotal = document.getElementById('estimateTotal');
const addonInputs = [...document.querySelectorAll('.addons input[type="checkbox"]')];

function selectedRate(){
  const option = yachtSelect.options[yachtSelect.selectedIndex];
  return Number(option.dataset.rate || 0);
}
function updateEstimate(){
  let total = selectedRate() * Math.max(1, Number(hours.value || 1));
  addonInputs.forEach(input => {
    if (!input.checked) return;
    if (input.dataset.perguest) total += Number(input.dataset.perguest) * Math.max(1, Number(guests.value || 1));
    else total += Number(input.dataset.price || 0);
  });
  estimateTotal.textContent = `AED ${total.toLocaleString('en-US')}`;
}
[yachtSelect, guests, hours, ...addonInputs].forEach(el => el.addEventListener('change', updateEstimate));
[guests, hours].forEach(el => el.addEventListener('input', updateEstimate));
updateEstimate();

document.querySelectorAll('[data-yacht]').forEach(link => {
  link.addEventListener('click', () => {
    const name = link.dataset.yacht;
    [...yachtSelect.options].forEach((opt, idx) => { if (opt.textContent.includes(name)) yachtSelect.selectedIndex = idx; });
    updateEstimate();
  });
});

document.getElementById('bookingForm').addEventListener('submit', e => {
  e.preventDefault();
  const date = document.getElementById('date').value || 'Flexible';
  const time = document.getElementById('time').value || 'Flexible';
  const experience = document.getElementById('experience').value;
  const addons = addonInputs.filter(i => i.checked).map(i => i.dataset.name).join(', ') || 'None';
  const msg = `Hi Tiger Yacht, I would like to check availability.%0A%0AYacht: ${encodeURIComponent(yachtSelect.options[yachtSelect.selectedIndex].textContent)}%0ADate: ${encodeURIComponent(date)}%0ATime: ${encodeURIComponent(time)}%0AHours: ${encodeURIComponent(hours.value)}%0AGuests: ${encodeURIComponent(guests.value)}%0AOccasion: ${encodeURIComponent(experience)}%0AAdd-ons: ${encodeURIComponent(addons)}%0AEstimated total: ${encodeURIComponent(estimateTotal.textContent)}%0A%0APlease confirm availability and final quotation.`;
  window.open(`https://wa.me/971522898960?text=${msg}`, '_blank', 'noopener');
});

// script.js
const y = document.getElementById("year"); y.textContent = new Date().getFullYear();
async function loadProjects() {
  try {
    const res = await fetch('projects.json');
    const items = await res.json();
    const grid = document.getElementById('projects-grid');
    grid.innerHTML = items.map(p => `
      <article class="card">
        <h3>${p.title}</h3>
        <p>${p.desc}</p>
        <p>
          ${p.links.map(l => `<a class="btn outline" href="${l.href}" target="_blank" rel="noopener">${l.label}</a>`).join(' ')}
        </p>
      </article>
    `).join('');
  } catch(e) {
    console.error(e);
  }
}
loadProjects();
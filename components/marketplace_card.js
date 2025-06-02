const plugins = [
  { name: "Kanban Pink", creator: "tech_willow" },
  { name: "Waterfall Model", creator: "code_crusader92" },
  { name: "RAD Workflow", creator: "ui_phoenix" },
  { name: "Incremental Dev", creator: "build_loop_dev" },
  { name: "Spiral SDLC", creator: "arch_zenith" },
  { name: "Big Bang Deploy", creator: "chaos_coder" },
  { name: "Prototype Fast", creator: "mockup_mage" }
];

const themes = [
  { name: "Agile (Dark Mode)", creator: "night_scrummer" },
  { name: "Lean UX", creator: "pixel_forge" },
  { name: "Extreme Programming", creator: "pair_programmer" },
  { name: "DevOps Pipeline", creator: "docker_whiz" },
  { name: "Kanban Tracker", creator: "flow_master77" },
  { name: "Hybrid Delivery", creator: "merge_maniac" },
  { name: "Rapid UI", creator: "swift_stack" }
];

function renderCards(items, containerId, seeMoreLink) {
  const container = document.getElementById(containerId);

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-footer">
        <div>
          Template: <span class="template-name">${item.name}</span><br>
          Created by: <span class="creator-name">${item.creator}</span>
        </div>
        <div class="plus">+</div>
      </div>
    `;
    container.appendChild(card);
  });

  const seeMoreCard = document.createElement('div');
  seeMoreCard.className = 'card see-more-card';

  container.appendChild(seeMoreCard);
}

renderCards(plugins, 'plugins-grid', 'plugins.html');
renderCards(themes, 'themes-grid', 'themes.html');
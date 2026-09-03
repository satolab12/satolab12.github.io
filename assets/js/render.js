const esc = (s = "") =>
  String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));

const link = (url, label = "Link") =>
  url ? ` <a class="entry-link" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${label}</a>` : "";

const renderers = {
  news: (items) => `<ul class="entries">${items.map((n) => `
    <li class="entry">
      <div class="entry-meta">${esc(n.date)}${n.new ? '<span class="entry-new">New</span>' : ""}</div>
      <div class="entry-body">${esc(n.body)}${link(n.url)}</div>
    </li>`).join("")}</ul>`,

  publications: (items) => `<ol class="entries entries-numbered">${items.map((p) => `
    <li class="entry">
      <div class="entry-body">
        <span class="entry-title">${esc(p.title)}</span>
        <span class="entry-sub">${esc(p.authors)}</span>
        <span class="entry-sub">${esc(p.venue)}${link(p.url, "Paper")}</span>
      </div>
    </li>`).join("")}</ol>`,

  talks: (items) => `<ul class="entries">${items.map((t) => `
    <li class="entry">
      <div class="entry-body">
        <span class="entry-title">${esc(t.title)}</span>
        <span class="entry-sub">${esc(t.authors)}</span>
        <span class="entry-sub">${esc(t.venue)}${link(t.url)}</span>
      </div>
    </li>`).join("")}</ul>`,

  timeline: (items) => `<ul class="entries">${items.map((e) => `
    <li class="entry">
      <div class="entry-meta">${esc(e.period)}</div>
      <div class="entry-body">
        <span class="entry-title">${esc(e.title)}</span>
        <span class="entry-sub">${esc(e.desc).replace(/\n/g, "<br>")}${link(e.url)}</span>
      </div>
    </li>`).join("")}</ul>`,

  simple: (items) => `<ul class="entries">${items.map((a) => `
    <li class="entry">
      <div class="entry-body">
        <span class="entry-title">${esc(a.title)}</span>
        ${a.detail ? `<span class="entry-sub">${esc(a.detail)}</span>` : ""}${link(a.url)}
      </div>
    </li>`).join("")}</ul>`,
};

async function mount(el) {
  const limit = Number(el.dataset.limit) || 0;
  try {
    const items = (await (await fetch(el.dataset.source)).json()).filter((i) => !i.hidden);
    el.innerHTML = renderers[el.dataset.type](limit ? items.slice(0, limit) : items);
  } catch {
    el.innerHTML = '<p class="entry-sub">コンテンツを読み込めませんでした（ローカル確認時はHTTPサーバ経由で開いてください）。</p>';
  }
}

document.querySelectorAll("[data-source]").forEach(mount);

const toggle = document.getElementById("themeToggle");
if (toggle) toggle.textContent = document.documentElement.dataset.theme === "dark" ? "Light" : "Dark";
toggle?.addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  localStorage.setItem("sh-theme", next);
  toggle.textContent = next === "dark" ? "Light" : "Dark";
});

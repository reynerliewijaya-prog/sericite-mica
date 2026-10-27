(() => {
  fetch("/api/content", { cache: "no-store" })
    .then((r) => (r.ok ? r.json() : []))
    .then((rows) => {
      const values = {};
      for (const row of rows) {
        if (!row.published) continue;
        for (const key of ["title", "description"])
          values[row.page + "." + key] = row.published[key];
      }
      function apply() {
        document.querySelectorAll("[data-site-content]").forEach((el) => {
          const text = values[el.getAttribute("data-site-content")];
          if (typeof text === "string" && el.textContent !== text)
            el.textContent = text;
        });
      }
      const page = (location.pathname.split("/").pop() || "index.html").replace(
        ".html",
        "",
      );
      const current = rows.find((row) => row.page === page)?.published;
      if (current && (current.image || current.gallery?.length)) {
        const section = document.createElement("section");
        section.id = "sericite-published-media";
        section.style.cssText =
          "max-width:1180px;margin:40px auto;padding:24px;background:#faf7f3;border-radius:16px";
        const heading = document.createElement("h2");
        heading.textContent = current.title;
        section.appendChild(heading);
        const grid = document.createElement("div");
        grid.style.cssText =
          "display:grid;grid-template-columns:repeat(auto-fit,minmax(min(220px,100%),1fr));gap:18px";
        [current.image, ...(current.gallery || [])]
          .filter(Boolean)
          .forEach((url, index) => {
            const img = document.createElement("img");
            img.src = url;
            img.alt = current.title + " " + (index + 1);
            img.loading = "lazy";
            img.style.cssText =
              "width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:12px";
            grid.appendChild(img);
          });
        section.appendChild(grid);
        (document.querySelector("main") || document.body).appendChild(section);
      }
      apply();
      let scheduled = false;
      new MutationObserver(() => {
        if (!scheduled) {
          scheduled = true;
          requestAnimationFrame(() => {
            scheduled = false;
            apply();
          });
        }
      }).observe(document.body, { childList: true, subtree: true });
    })
    .catch(() => {});
})();

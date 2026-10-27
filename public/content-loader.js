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

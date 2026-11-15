(function () {
    const STORAGE_KEY = "recent_pages_history";
    const MAX_ITEMS = 7;

    // Get the current page filename safely, handling repo root URLs like /a/ or /a
    function getCurrentPageUrl() {
        let filename = window.location.pathname.split("/").pop() || "index.html";
        if (!filename.includes(".")) {
            filename = "index.html";
        }
        return filename;
    }

    // Detect a clean, human-readable title for the current page
    function getPageTitle() {
        const heading = document.querySelector("main h1, main h2");
        if (heading && heading.textContent.trim()) {
            return heading.textContent.trim();
        }

        const filename = getCurrentPageUrl();
        if (document.title) {
            const cleanTitle = document.title.split("-")[0].trim();
            if (cleanTitle && (filename === "index.html" || cleanTitle.toLowerCase() !== "home")) {
                return cleanTitle;
            }
        }

        // Fallback: format the filename (e.g. "indian_contracts_act.html" -> "Indian Contracts Act")
        const baseName = filename.replace(/\.html?$/i, "");
        if (!baseName || baseName === "index") return "Home";
        return baseName
            .split(/[_-]/)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    }

    // Update the history list in localStorage
    function updateHistory() {
        const currentUrl = getCurrentPageUrl();
        const currentTitle = getPageTitle();

        let history = [];
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                history = JSON.parse(stored);
            }
        } catch (e) {
            history = [];
        }

        // Avoid adding duplicate if page is simply reloaded
        const lastItem = history[history.length - 1];
        if (!lastItem || lastItem.url !== currentUrl) {
            history.push({ title: currentTitle, url: currentUrl });
        } else {
            lastItem.title = currentTitle;
        }

        // Keep only the last 7 visited pages
        if (history.length > MAX_ITEMS) {
            history = history.slice(-MAX_ITEMS);
        }

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
        } catch (e) {
            // Storage quota or disabled in private browsing
        }

        return history;
    }

    // Render the breadcrumb bar directly above <main>
    function renderBreadcrumbs() {
        const main = document.querySelector("main");
        if (!main) return;

        const history = updateHistory();
        if (!history || history.length === 0) return;

        const breadcrumbsNav = document.createElement("nav");
        breadcrumbsNav.className = "breadcrumbs";
        breadcrumbsNav.setAttribute("aria-label", "Recent browsing history");

        const label = document.createElement("span");
        label.className = "breadcrumb-label";
        label.textContent = "History: ";
        breadcrumbsNav.appendChild(label);

        history.forEach((item, index) => {
            const isLast = index === history.length - 1;

            if (isLast) {
                const currentSpan = document.createElement("span");
                currentSpan.className = "breadcrumb-current";
                currentSpan.setAttribute("aria-current", "page");
                currentSpan.textContent = item.title;
                breadcrumbsNav.appendChild(currentSpan);
            } else {
                const link = document.createElement("a");
                link.href = item.url;
                link.textContent = item.title;
                breadcrumbsNav.appendChild(link);

                const separator = document.createElement("span");
                separator.className = "breadcrumb-separator";
                separator.innerHTML = " &rsaquo; ";
                breadcrumbsNav.appendChild(separator);
            }
        });

        main.insertAdjacentElement("beforebegin", breadcrumbsNav);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", renderBreadcrumbs);
    } else {
        renderBreadcrumbs();
    }
})();

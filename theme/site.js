/*
 * VitePress-style UX enhancements for the operator-docs mdBook.
 *
 * Ported from the wp-docs theme (wp-docs/theme/site.js) so both sites share the
 * same look and behaviour. The wp-specific pieces were removed:
 *   - the "Warp Parse" top bar chip
 *   - the zh/en language switcher (operator-docs is single-language)
 *   - the alpha/beta/stable version banner and its wp-version.txt fetch
 *
 * Kept: collapsible + width-persistent sidebar, on-this-page TOC, simplified
 * theme menu, and mermaid theme reload. Keep the `operator-docs-*` localStorage
 * keys in sync with theme/head.hbs.
 */
(function() {
    function simplifyThemeMenu() {
        const labels = {
            'default_theme': 'Auto',
            'mdbook-theme-default_theme': 'Auto',
            'light': 'Light',
            'mdbook-theme-light': 'Light',
            'navy': 'Dark',
            'mdbook-theme-navy': 'Dark'
        };
        const hiddenThemes = ['rust', 'coal', 'ayu', 'mdbook-theme-rust', 'mdbook-theme-coal', 'mdbook-theme-ayu'];

        Object.keys(labels).forEach(id => {
            const item = document.getElementById(id);
            if (item) {
                item.textContent = labels[id];
            }
        });

        hiddenThemes.forEach(id => {
            const item = document.getElementById(id);
            if (item && item.parentElement) {
                item.parentElement.hidden = true;
            }
        });
    }

    function currentMermaidTheme() {
        const html = document.documentElement;
        return html.classList.contains('ayu') || html.classList.contains('navy') || html.classList.contains('coal')
            ? 'dark'
            : 'default';
    }

    function bindMermaidThemeReload() {
        const wasDark = currentMermaidTheme() === 'dark';
        ['light', 'rust', 'navy', 'coal', 'ayu', 'mdbook-theme-light', 'mdbook-theme-rust', 'mdbook-theme-navy', 'mdbook-theme-coal', 'mdbook-theme-ayu'].forEach(id => {
            const item = document.getElementById(id);
            if (!item) {
                return;
            }
            item.addEventListener('click', function() {
                const willBeDark = id === 'navy' || id === 'coal' || id === 'ayu'
                    || id === 'mdbook-theme-navy' || id === 'mdbook-theme-coal' || id === 'mdbook-theme-ayu';
                if (wasDark !== willBeDark) {
                    window.location.reload();
                }
            }, { once: true });
        });
    }

    function loadMermaidIfNeeded() {
        if (!document.querySelector('.mermaid')) {
            return;
        }

        const script = document.createElement('script');
        const siteScript = document.currentScript || document.querySelector('script[src*="/theme/site"], script[src*="theme/site"]');
        const siteScriptUrl = siteScript && siteScript.src ? siteScript.src : '';
        const docsRoot = siteScriptUrl
            ? new URL('../', siteScriptUrl).toString()
            : new URL('./', document.baseURI).toString();

        script.src = new URL('mermaid.min.js', docsRoot).toString();
        script.defer = true;
        script.onload = function() {
            if (!window.mermaid) {
                return;
            }
            window.mermaid.initialize({
                startOnLoad: true,
                theme: currentMermaidTheme()
            });
            bindMermaidThemeReload();
        };
        document.head.appendChild(script);
    }

    function pageTocText(header) {
        const anchor = header.querySelector('a.header');
        return (anchor || header).textContent.trim();
    }

    function buildPageToc() {
        const main = document.querySelector('main');
        if (!main) {
            return;
        }

        const headers = Array.from(main.querySelectorAll('h2, h3')).filter(header => {
            return header.id && pageTocText(header);
        });

        if (headers.length < 4 || document.querySelector('.page-toc')) {
            return;
        }

        const nav = document.createElement('nav');
        nav.className = 'page-toc';
        nav.setAttribute('aria-label', '本页目录');

        const title = document.createElement('div');
        title.className = 'page-toc-title';
        title.textContent = '本页目录';
        nav.appendChild(title);

        const list = document.createElement('ol');
        nav.appendChild(list);

        headers.forEach(header => {
            const item = document.createElement('li');
            item.className = 'page-toc-' + header.tagName.toLowerCase();

            const link = document.createElement('a');
            link.href = '#' + header.id;
            link.textContent = pageTocText(header);

            item.appendChild(link);
            list.appendChild(item);
        });

        document.body.appendChild(nav);

        const links = Array.from(nav.querySelectorAll('a'));

        function placeToc() {
            const mainRect = main.getBoundingClientRect();
            const tocWidth = 320;
            const gap = 42;
            const viewportPadding = 24;
            const preferredLeft = mainRect.right + gap;
            const maxLeft = window.innerWidth - tocWidth - viewportPadding;
            nav.style.left = Math.max(viewportPadding, Math.min(preferredLeft, maxLeft)) + 'px';
        }

        function setActive() {
            let active = headers[0];
            for (const header of headers) {
                if (header.getBoundingClientRect().top <= 120) {
                    active = header;
                } else {
                    break;
                }
            }

            links.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === '#' + active.id);
            });
        }

        placeToc();
        setActive();
        window.addEventListener('resize', placeToc);
        document.addEventListener('scroll', placeToc, { passive: true });
        document.addEventListener('scroll', setActive, { passive: true });
    }

    function trackSidebarClickOffset() {
        const sidebar = document.querySelector('#mdbook-sidebar');
        if (!sidebar) {
            return;
        }

        sidebar.addEventListener('click', event => {
            const link = event.target && typeof event.target.closest === 'function'
                ? event.target.closest('a[href]')
                : null;
            if (!link || !sidebar.contains(link)) {
                return;
            }

            if (!event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
                const currentUrl = window.location.href.split('#')[0];
                const targetUrl = link.href.split('#')[0];
                if (targetUrl === currentUrl) {
                    event.preventDefault();
                    event.stopPropagation();
                    return;
                }
            }

            const clientRect = link.getBoundingClientRect();
            const sidebarRect = sidebar.getBoundingClientRect();
            try {
                sessionStorage.setItem('sidebar-scroll-offset', String(clientRect.top - sidebarRect.top));
            } catch {
                // Ignore storage failures.
            }
        }, true);
    }

    function initCollapsibleSidebar() {
        const storageKey = 'operator-docs-sidebar-state';

        function getState() {
            try {
                return JSON.parse(localStorage.getItem(storageKey)) || {};
            } catch {
                return {};
            }
        }

        function saveState(state) {
            try {
                localStorage.setItem(storageKey, JSON.stringify(state));
            } catch {
                // Ignore storage failures.
            }
        }

        function enhanceChapter(chapter) {
            if (!chapter || chapter.dataset.docsSidebarEnhanced === 'true') {
                return;
            }
            chapter.dataset.docsSidebarEnhanced = 'true';

            const state = getState();

            chapter.querySelectorAll(':scope > li.chapter-item, ol.section > li.chapter-item').forEach(titleLi => {
                const childOl = titleLi.querySelector(':scope > ol.section');
                const linkWrapper = titleLi.querySelector(':scope > .chapter-link-wrapper');
                if (!childOl) {
                    return;
                }

                const link = titleLi.querySelector(':scope > .chapter-link-wrapper a[href], :scope > a[href]');
                if (!link) {
                    return;
                }

                const key = link.getAttribute('href') || link.textContent.trim();
                let toggle = titleLi.querySelector(':scope > .chapter-link-wrapper .chapter-fold-toggle, :scope > .chapter-fold-toggle');
                if (!toggle) {
                    toggle = document.createElement('div');
                    toggle.className = 'chapter-fold-toggle';
                    toggle.setAttribute('role', 'button');
                    toggle.setAttribute('tabindex', '0');
                    toggle.setAttribute('aria-label', 'Toggle section');
                    toggle.innerHTML = '<div class="chapter-fold-chevron" aria-hidden="true"></div>';

                    const onToggle = event => {
                        event.preventDefault();
                        event.stopPropagation();
                        titleLi.classList.toggle('expanded');
                        state[key] = titleLi.classList.contains('expanded');
                        saveState(state);
                    };

                    toggle.addEventListener('click', onToggle);
                    toggle.addEventListener('keydown', event => {
                        if (event.key === 'Enter' || event.key === ' ') {
                            onToggle(event);
                        }
                    });

                    if (linkWrapper) {
                        linkWrapper.appendChild(toggle);
                    } else {
                        titleLi.appendChild(toggle);
                    }
                }

            });
        }

        function tryInit() {
            const chapter = document.querySelector('.sidebar .chapter, .sidebar-scrollbox .chapter');
            if (chapter) {
                enhanceChapter(chapter);
                return true;
            }
            return false;
        }

        if (tryInit()) {
            return;
        }

        const observer = new MutationObserver(() => {
            if (tryInit()) {
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function initSidebarWidthPersistence() {
        const storageKey = 'operator-docs-sidebar-width';
        const root = document.documentElement;
        let lastWidth = root.style.getPropertyValue('--sidebar-target-width');
        const observer = new MutationObserver(() => {
            const width = root.style.getPropertyValue('--sidebar-target-width').trim();
            if (!width || width === lastWidth || !/^\d+px$/.test(width)) {
                return;
            }
            lastWidth = width;
            try {
                localStorage.setItem(storageKey, width);
            } catch {
                // Ignore storage failures.
            }
        });

        observer.observe(root, { attributes: true, attributeFilter: ['style'] });
    }

    function init() {
        initSidebarWidthPersistence();
        simplifyThemeMenu();
        loadMermaidIfNeeded();
        trackSidebarClickOffset();
        initCollapsibleSidebar();
        buildPageToc();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
})();

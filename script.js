// ---------- NAV : lien actif selon la section visible ----------
(function () {
    var links = Array.prototype.slice.call(
        document.querySelectorAll('.nav-links a[href^="#"]'),
    );
    if (!links.length) return;

    var sections = links
        .map(function (link) {
            var id = link.getAttribute("href").slice(1);
            return id ? document.getElementById(id) : null;
        })
        .filter(Boolean);
    if (!sections.length) return;

    function setActive(id) {
        links.forEach(function (link) {
            link.classList.toggle(
                "active",
                link.getAttribute("href") === "#" + id,
            );
        });
    }

    var observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) setActive(entry.target.id);
            });
        },
        { rootMargin: "-140px 0px -60% 0px", threshold: 0 },
    );

    sections.forEach(function (section) {
        observer.observe(section);
    });
})();

// ---------- BOUTON REMONTER EN HAUT ----------
(function () {
    var btn = document.getElementById("backToTop");
    if (!btn) return;

    var threshold = 600;

    function onScroll() {
        if (window.scrollY > threshold) {
            btn.classList.add("visible");
        } else {
            btn.classList.remove("visible");
        }
    }

    btn.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
})();

// ---------- HEADER : fond au scroll ----------
(function () {
    var header = document.querySelector("header");
    var threshold = 40;
    var navHideThreshold = 120; // au-delà, on considère qu'on est "dans" le contenu

    function onScroll() {
        var y = window.scrollY;

        if (y > threshold) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }

        if (y > navHideThreshold) {
            header.classList.add("nav-hidden");
        } else {
            header.classList.remove("nav-hidden");
        }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
})();

// ---------- HEADER : menu burger (mobile) ----------
(function () {
    var header = document.querySelector("header");
    var burger = document.querySelector(".burger");
    var navLinks = document.querySelector(".nav-links");
    if (!header || !burger || !navLinks) return;

    function closeMenu() {
        header.classList.remove("nav-open");
        burger.setAttribute("aria-expanded", "false");
    }

    burger.setAttribute("role", "button");
    burger.setAttribute("aria-label", "Ouvrir le menu");
    burger.setAttribute("aria-expanded", "false");

    burger.addEventListener("click", function () {
        var isOpen = header.classList.toggle("nav-open");
        burger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // Ferme le menu quand on choisit un lien ou qu'on repasse en desktop
    navLinks.addEventListener("click", function (e) {
        if (e.target.tagName === "A") closeMenu();
    });
    window.addEventListener("resize", function () {
        if (window.innerWidth > 980) closeMenu();
    });
})();

// ---------- NAV : recherche discrète ----------
(function () {
    var widget = document.getElementById("searchWidget");
    var toggle = document.getElementById("searchToggle");
    var form = document.getElementById("searchForm");
    var input = document.getElementById("searchInput");
    if (!widget || !toggle || !form || !input) return;

    function open() {
        widget.classList.add("open");
        toggle.setAttribute("aria-expanded", "true");
        toggle.setAttribute("aria-label", "Fermer la recherche");
        setTimeout(function () {
            input.focus();
        }, 150);
    }

    function close() {
        widget.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Ouvrir la recherche");
        input.value = "";
    }

    toggle.addEventListener("click", function (e) {
        e.stopPropagation();
        if (widget.classList.contains("open")) close();
        else open();
    });

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        var q = input.value.trim();
        if (q) {
            // Point d'accroche pour brancher une vraie recherche plus tard
            console.log("Recherche :", q);
        }
    });

    document.addEventListener("click", function (e) {
        if (!widget.contains(e.target)) close();
    });

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") close();
    });
})();

// ---------- NAV : menu "Accéder à la plateforme" ----------
(function () {
    var wrap = document.getElementById("platformSwitch");
    var toggle = document.getElementById("platformToggle");
    var dropdown = document.getElementById("platformDropdown");
    if (!wrap || !toggle || !dropdown) return;

    function close() {
        wrap.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
    }

    function open() {
        wrap.classList.add("open");
        toggle.setAttribute("aria-expanded", "true");
    }

    toggle.addEventListener("click", function (e) {
        e.stopPropagation();
        wrap.classList.contains("open") ? close() : open();
    });

    dropdown.addEventListener("click", function (e) {
        e.stopPropagation();
    });

    document.addEventListener("click", function (e) {
        if (!wrap.contains(e.target)) close();
    });

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") close();
    });
})();

// ---------- NAV : sélecteur de langue ----------
(function () {
    var wrap = document.getElementById("langSwitch");
    var toggle = document.getElementById("langToggle");
    var dropdown = document.getElementById("langDropdown");
    var current = document.getElementById("langCurrent");
    if (!wrap || !toggle || !dropdown || !current) return;

    var options = Array.prototype.slice.call(
        dropdown.querySelectorAll("button[data-lang]"),
    );
    var rtlLangs = ["ar"];

    function close() {
        wrap.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
    }

    function open() {
        wrap.classList.add("open");
        toggle.setAttribute("aria-expanded", "true");
    }

    function setLang(lang) {
        options.forEach(function (btn) {
            btn.classList.toggle(
                "active",
                btn.getAttribute("data-lang") === lang,
            );
        });
        current.textContent = lang.toUpperCase();
        document.documentElement.setAttribute("lang", lang);
        document.documentElement.setAttribute(
            "dir",
            rtlLangs.indexOf(lang) > -1 ? "rtl" : "ltr",
        );
        // Point d'accroche pour brancher les traductions réelles plus tard
    }

    toggle.addEventListener("click", function (e) {
        e.stopPropagation();
        wrap.classList.contains("open") ? close() : open();
    });

    options.forEach(function (btn) {
        btn.addEventListener("click", function () {
            setLang(btn.getAttribute("data-lang"));
            close();
        });
    });

    document.addEventListener("click", function (e) {
        if (!wrap.contains(e.target)) close();
    });

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") close();
    });
})();

// ---------- HERO SLIDER : fond qui change, texte fixe ----------
(function () {
    var root = document.getElementById("hero-slider");
    if (!root) return;

    var bgs = root.querySelectorAll(".hero-bg");
    var bars = root.querySelectorAll(".ctrl-slide");
    var toggleBtn = document.getElementById("hero-toggle");
    var fullscreenBtn = document.getElementById("hero-fullscreen");
    var current = 0;
    var total = bgs.length;
    var duration = 6000;
    var timer = null;
    var playing = true;

    function setBarStates() {
        bars.forEach(function (bar, i) {
            bar.classList.remove("active", "done", "paused");
            if (i < current) bar.classList.add("done");
            if (i === current) {
                bar.classList.add("active");
                if (!playing) bar.classList.add("paused");
            }
        });
    }

    function goTo(index) {
        bgs[current].classList.remove("active");
        current = (index + total) % total;
        bgs[current].classList.add("active");
        setBarStates();
        if (playing) restart();
    }

    function next() {
        goTo(current + 1);
    }

    function restart() {
        if (timer) clearInterval(timer);
        timer = setInterval(next, duration);
    }

    function stop() {
        if (timer) clearInterval(timer);
        timer = null;
    }

    bars.forEach(function (bar) {
        bar.addEventListener("click", function () {
            goTo(parseInt(bar.getAttribute("data-slide"), 10));
        });
    });

    if (toggleBtn) {
        toggleBtn.addEventListener("click", function () {
            playing = !playing;
            toggleBtn.textContent = playing ? "⏸" : "▶";
            toggleBtn.setAttribute(
                "aria-label",
                playing ? "Mettre en pause" : "Lecture",
            );
            bars[current].classList.toggle("paused", !playing);
            if (playing) {
                restart();
            } else {
                stop();
            }
        });
    }

    if (fullscreenBtn) {
        fullscreenBtn.addEventListener("click", function () {
            if (!document.fullscreenElement) {
                if (root.requestFullscreen) root.requestFullscreen();
            } else {
                if (document.exitFullscreen) document.exitFullscreen();
            }
        });
    }

    setBarStates();
    restart();
})();

// ---------- TABS scroll-driven (section "Pourquoi Investir en Algérie") ----------
(function () {
    var wrapper = document.getElementById("tabsWrapper");
    if (!wrapper) return;

    var sticky = wrapper.querySelector(".tabs-sticky");
    var tabs = Array.prototype.slice.call(
        document.querySelectorAll(".tab-item"),
    );
    var panels = Array.prototype.slice.call(
        document.querySelectorAll(".tab-info-panel"),
    );
    var total = tabs.length;
    var currentIndex = -1;

    function setActive(index) {
        if (index === currentIndex) return;
        currentIndex = index;
        tabs.forEach(function (tab, i) {
            tab.classList.toggle("active", i === index);
        });
        panels.forEach(function (panel, i) {
            panel.classList.toggle("active", i === index);
        });
    }

    function getScrollable() {
        var stickyHeight = sticky ? sticky.offsetHeight : window.innerHeight;
        return wrapper.offsetHeight - stickyHeight;
    }

    function updateFromScroll() {
        var rect = wrapper.getBoundingClientRect();
        var scrollable = getScrollable();
        if (scrollable <= 0) {
            setActive(0);
            return;
        }
        var progress = -rect.top / scrollable;
        progress = Math.max(0, Math.min(0.999, progress));
        var index = Math.floor(progress * total);
        index = Math.max(0, Math.min(total - 1, index));
        setActive(index);
    }

    tabs.forEach(function (tab, i) {
        tab.addEventListener("click", function () {
            var scrollable = getScrollable();
            var wrapperAbsoluteTop =
                wrapper.getBoundingClientRect().top + window.pageYOffset;
            var targetProgress = (i + 0.5) / total;
            var targetY = wrapperAbsoluteTop + scrollable * targetProgress;
            window.scrollTo({ top: targetY, behavior: "smooth" });
        });
    });

    window.addEventListener("scroll", updateFromScroll, { passive: true });
    window.addEventListener("resize", updateFromScroll);
    updateFromScroll();
})();

// ============================================================================
// SECTION : jn-section — slider "journeys" (photos + panel verre)
// Tout est encapsulé dans cette IIFE et scopé à #jnSection : aucun écouteur
// global (clavier, tactile, souris) n'affecte le reste de la page.
// ============================================================================
(function () {
    const section = document.getElementById("jnSection");
    if (!section) return;

    /* -------- config des slides : à modifier pour changer le contenu -------- */
    const JN_SLIDES = [
        {
            city: "Investir en Algérie : cadre légal & opportunités",
            date: "25 Fevrier 2027",
            coords: "Hôtel Mercure, Alger",
            ctaLabel: "S'inscrire à cet atelier",
            ctaLink: "#inscription",
            caption:
                "Some places don't let go.<br>They become part<br>of how you breathe.",
            bg: "linear-gradient(135deg,#1a0a04 0%,#5a2810 35%,#b85a1a 65%,#d4843a 100%)",
            image: "images/slide-workshop/1.png",
        },
        {
            city: "thématique atelier 2",
            date: "date",
            coords: "lieu",
            ctaLabel: "S'inscrire à cet atelier",
            ctaLink: "#inscription",
            region: "East Asia · Pacific",
            lat: "35°N",
            caption:
                "A city that hums<br>at frequencies you only<br>feel long after leaving.",
            bg: "linear-gradient(135deg,#040810 0%,#0a1530 40%,#162860 70%,#203880 100%)",
            image: "images/slide-workshop/2.png",
        },
        {
            city: "thématique atelier 3",
            date: "date",
            coords: "lieu",
            ctaLabel: "S'inscrire à cet atelier",
            ctaLink: "#inscription",
            region: "North Africa · Maghreb",
            lat: "31°N",
            caption:
                "The desert teaches you<br>that emptiness is<br>just silence, listening.",
            bg: "linear-gradient(135deg,#180600 0%,#5a1a00 40%,#b04010 70%,#d86020 100%)",
            image: "images/slide-workshop/3.png",
        },
        {
            city: "thématique atelier 4",
            date: "TODO : date",
            coords: "TODO : lieu",
            ctaLabel: "S'inscrire à cet atelier",
            ctaLink: "#inscription",
            region: "Aegean · Cyclades",
            lat: "36°N",
            caption:
                "Where the sea forgets<br>where it ends and<br>the sky forgets to begin.",
            bg: "linear-gradient(135deg,#060e1c 0%,#0e2040 40%,#1a3e70 70%,#2a60a0 100%)",
            image: "images/slide-workshop/4.png",
        },
        {
            city: "thématique atelier 5",
            date: "date",
            coords: "lieu",
            ctaLabel: "S'inscrire à cet atelier",
            ctaLink: "#inscription",
            region: "East Coast · Atlantic",
            lat: "40°N",
            caption:
                "Eight million souls<br>dreaming in parallel,<br>none of them alone.",
            bg: "linear-gradient(135deg,#08080e 0%,#14141e 40%,#222234 70%,#343458 100%)",
            image: "images/slide-workshop/5.png",
        },
    ];

    const sliderEl = document.getElementById("jnSl");
    const jnSlides = JN_SLIDES.map((cfg, i) => {
        const el = document.createElement("div");
        el.className =
            "jn-slider__slide" + (i === 0 ? " jn-slider__slide--active" : "");
        el.innerHTML = `
			<div class="jn-slider__ghost"><span class="jn-slider__ghost-text">${cfg.city}</span></div>
			<div class="jn-slider__photo"><img class="jn-slider__photo-img" src="${cfg.image}" alt="${cfg.city}" style="filter:${cfg.filter || "none"}"></div>
			<div class="jn-slider__vignette"></div>
		`;
        sliderEl.appendChild(el);
        return el;
    });

    const pf = document.getElementById("jnPf");
    const dotsEl = document.getElementById("jnDots");
    const cur = document.getElementById("jnCur");
    const lb = document.getElementById("jnLb");
    const bgBase = document.getElementById("jnBgBase");
    const glassOuter = document.getElementById("jnGlassOuter");
    const pCity = document.getElementById("jnPCity");
    const pCta = document.getElementById("jnPCta");
    const pCtaLabel = document.getElementById("jnPCtaLabel");
    const pDate = document.getElementById("jnPDate");
    const pCoords = document.getElementById("jnPCoords");

    const ambIdx = document.getElementById("jnIdxN");
    const ambIdxT = document.getElementById("jnIdxT");
    const ambCap = document.getElementById("jnAmbCaption");
    const ambReg = document.getElementById("jnAmbRegion");
    const ambLat = document.getElementById("jnAmbLat");

    let idx = 0,
        busy = false,
        autoT;
    const EASE = "cubic-bezier(0.76,0,0.24,1)",
        DUR = 940;
    const TOTAL_LABEL = "/ " + String(JN_SLIDES.length).padStart(2, "0");

    function setBg(i) {
        bgBase.style.background = JN_SLIDES[i].bg;
    }

    function updateAmbient(i, animate) {
        const s = JN_SLIDES[i];
        const els = [ambIdx, ambIdxT, ambCap, ambReg, ambLat];
        const apply = () => {
            ambIdx.textContent = String(i + 1).padStart(2, "0");
            ambIdxT.textContent = TOTAL_LABEL;
            ambCap.innerHTML = s.caption;
            ambReg.textContent = s.region;
            ambLat.textContent = s.lat;
        };
        if (animate) {
            els.forEach((el) => (el.style.opacity = "0"));
            setTimeout(() => {
                apply();
                els.forEach((el) => (el.style.opacity = ""));
            }, 300);
        } else {
            apply();
        }
    }

    const GLASS_FIELDS = [
        [pCity, "jn-glass-panel__city--fading"],
        [pCta, "jn-glass-panel__cta--fading"],
        [pDate, "jn-glass-panel__meta--fading"],
        [pCoords, "jn-glass-panel__meta--fading"],
    ];

    function updateGlass(i, animate) {
        const s = JN_SLIDES[i];
        const apply = () => {
            pCity.textContent = s.city;
            pCity.style.fontSize = s.citySize || "";
            pCtaLabel.textContent = s.ctaLabel || "S'inscrire";
            pCta.href = s.ctaLink || "#";
            pDate.textContent = s.date;
            pCoords.textContent = s.coords;
        };
        if (animate) {
            GLASS_FIELDS.forEach(([el, mod]) => {
                el.classList.add(mod);
                el.style.opacity = "0";
            });
            setTimeout(() => {
                apply();
                GLASS_FIELDS.forEach(([el]) => (el.style.opacity = "1"));
                setTimeout(
                    () =>
                        GLASS_FIELDS.forEach(([el, mod]) => {
                            el.classList.remove(mod);
                            el.style.opacity = "";
                        }),
                    420,
                );
            }, 260);
        } else {
            apply();
        }
    }

    setBg(0);
    updateAmbient(0, false);
    updateGlass(0, false);

    let loaded = 0;
    jnSlides.forEach((s, i) => {
        const img = s.querySelector(".jn-slider__photo-img");
        const done = () => {
            s.classList.add("jn-slider__slide--loaded");
            if (i === 0)
                setTimeout(
                    () => glassOuter.classList.add("jn-glass-panel--visible"),
                    150,
                );
            lb.style.width = (++loaded / jnSlides.length) * 100 + "%";
            if (loaded === jnSlides.length)
                setTimeout(() => (lb.style.opacity = "0"), 500);
        };
        if (img.complete && img.naturalWidth > 0) done();
        else {
            img.addEventListener("load", done, { once: true });
            img.addEventListener("error", done, { once: true });
        }
    });

    jnSlides.forEach((_, i) => {
        const d = document.createElement("div");
        d.className = "jn-dots__dot" + (i === 0 ? " jn-dots__dot--active" : "");
        d.addEventListener("click", () => go(i));
        dotsEl.appendChild(d);
    });

    function ui() {
        pf.style.width = ((idx + 1) / jnSlides.length) * 100 + "%";
        dotsEl
            .querySelectorAll(".jn-dots__dot")
            .forEach((d, i) =>
                d.classList.toggle("jn-dots__dot--active", i === idx),
            );
    }

    function go(to) {
        if (busy || to === idx) return;
        busy = true;
        clearTimeout(autoT);
        const dir = to > idx ? 1 : -1;
        const outS = jnSlides[idx],
            inS = jnSlides[to];
        const outBg = outS.querySelector(".jn-slider__photo"),
            inBg = inS.querySelector(".jn-slider__photo");

        setBg(to);
        updateAmbient(to, true);
        updateGlass(to, true);

        inS.style.transition = "none";
        inBg.style.transition = "none";
        inS.style.transform = `translateX(${dir * 100}%)`;
        inBg.style.transform = `translateX(${dir * -18}%)`;
        inS.style.zIndex = "3";
        outS.style.zIndex = "2";
        inS.getBoundingClientRect();

        const T = `transform ${DUR}ms ${EASE}`;
        outS.style.transition = T;
        outBg.style.transition = T;
        inS.style.transition = T;
        inBg.style.transition = T;
        outS.style.transform = `translateX(${dir * -100}%)`;
        outBg.style.transform = `translateX(${dir * 18}%)`;
        inS.style.transform = "translateX(0)";
        inBg.style.transform = "translateX(0)";

        outS.classList.remove("jn-slider__slide--active");
        inS.classList.add("jn-slider__slide--active");
        idx = to;
        ui();

        setTimeout(() => {
            [outS, outBg, inS, inBg].forEach((el) => {
                el.style.transform = "";
                el.style.transition = "";
            });
            outS.style.zIndex = "";
            inS.style.zIndex = "";
            busy = false;
            startAuto();
        }, DUR + 80);
    }

    const jnNext = () => go((idx + 1) % jnSlides.length);
    const jnPrev = () => go((idx - 1 + jnSlides.length) % jnSlides.length);
    document.getElementById("jnNavR").addEventListener("click", jnNext);
    document.getElementById("jnNavL").addEventListener("click", jnPrev);

    // clavier : actif uniquement quand la souris survole la section, pour ne
    // jamais intercepter les flèches ailleurs sur la page
    let jnHovering = false;
    section.addEventListener("mouseenter", () => (jnHovering = true));
    section.addEventListener("mouseleave", () => (jnHovering = false));
    document.addEventListener("keydown", (e) => {
        if (!jnHovering) return;
        if (e.key === "ArrowRight") jnNext();
        if (e.key === "ArrowLeft") jnPrev();
    });

    // tactile : écouteurs posés sur la section elle-même, pas sur tout le document
    let sx = 0;
    section.addEventListener("touchstart", (e) => (sx = e.touches[0].clientX), {
        passive: true,
    });
    section.addEventListener("touchend", (e) => {
        const dx = e.changedTouches[0].clientX - sx;
        if (Math.abs(dx) > 50) dx < 0 ? jnNext() : jnPrev();
    });

    function startAuto() {
        clearTimeout(autoT);
        autoT = setTimeout(jnNext, 6500);
    }

    // curseur custom : coordonnées calculées par rapport à la section (et non
    // à la fenêtre), visible seulement pendant le survol de la section
    section.addEventListener(
        "mousemove",
        (e) => {
            cur.style.left = e.clientX + "px";
            cur.style.top = e.clientY + "px";
        },
        { passive: true },
    );
    section.addEventListener("mouseenter", () =>
        cur.classList.add("jn-cursor--visible"),
    );
    section.addEventListener("mouseleave", () =>
        cur.classList.remove("jn-cursor--visible"),
    );
    [...section.querySelectorAll(".jn-slider-nav,.jn-dots__dot")].forEach(
        (el) => {
            el.addEventListener("mouseenter", () =>
                cur.classList.add("jn-cursor--large"),
            );
            el.addEventListener("mouseleave", () =>
                cur.classList.remove("jn-cursor--large"),
            );
        },
    );

    ui();
    startAuto();
})();

// ============================================================================
// SECTION : secteurs-carousel — carrousel horizontal "Nos secteurs d'activité"
// Encapsulé et scopé à #secteursCarousel : ne touche à rien d'autre sur la page.
// ============================================================================
(function () {
    var section = document.getElementById("secteursCarousel");
    if (!section) return;

    // ---- SECTOR DATA : modifie ce tableau pour ajouter/retirer des secteurs ----
    var sectors = [
        {
            tag: "Secteur",
            title: "Agriculture & agro-industrie",
            desc: "15 % du PIB — 34 Mds$. Plus de 8 M d'hectares cultivables sous-exploités, un Sud saharien à fort potentiel (serres, agro-tech, irrigation intelligente) et des filières de transformation et logistique frigorifique à développer.",
            image: "images/images-slide-secteurs/Agriculture & agro-industrie.png",
            icon: '<path d="M4 6h16v10H4z"/><path d="M9 20h6"/><path d="M12 16v4"/>',
        },
        {
            tag: "Secteur",
            title: "Industrie & manufacturing",
            desc: "+6,4 % de croissance en 2025. Zones industrielles saturées, substitution aux importations et filières ciblées (électronique, automobile, textile, pharmaceutique) portent une croissance industrielle cumulée de +18 % en 2025.",
            image: "images/images-slide-secteurs/Industrie & manufacturing.png",
            icon: '<path d="M3 21h18"/><path d="M5 21V9l4-4 4 4v12"/><path d="M13 21v-8l4-3 4 3v8"/>',
        },
        {
            tag: "Secteur",
            title: "Énergies renouvelables",
            desc: "15 000 MW d'ENR d'ici 2035. Mégaprojets solaires PV et éoliens ouverts aux investisseurs, hydrogène vert à fort potentiel d'export vers l'Europe, avec des financements BAD et partenariats internationaux actifs.",
            image: "images/images-slide-secteurs/Énergies renouvelables.png",
            icon: '<circle cx="12" cy="12" r="5"/><path d="M12 1v3M12 20v3M4.2 4.2l2 2M17.8 17.8l2 2M1 12h3M20 12h3M4.2 19.8l2-2M17.8 6.2l2-2"/>',
        },
        {
            tag: "Secteur",
            title: "Technologie & digital",
            desc: "1 million de diplômés par an. Incubateurs, start-up, fintech et e-commerce en forte croissance, coopération algéro-américaine sur la propriété intellectuelle et l'innovation, pour une économie numérique en pleine accélération.",
            image: "images/images-slide-secteurs/Technologie & digital.png",
            icon: '<path d="M4 6h16v10H4z"/><path d="M9 20h6"/><path d="M12 16v4"/>',
        },
        {
            tag: "Secteur",
            title: "Mines & ressources stratégiques",
            desc: "Loi minière 2025. Phosphate, zinc, lithium et minerais critiques : de nouveaux gisements ouverts à l'exploration étrangère, avec des partenariats industriels facilités dès 2026.",
            image: "images/images-slide-secteurs/Mines & ressources stratégiques.png",
            icon: '<path d="M3 21V9l6 4V9l6 4V9l6 4v8H3z"/>',
        },
    ];

    var track = section.querySelector("#scTrack");
    var viewport = section.querySelector(".sc-track-viewport");

    // duplique la liste une fois pour que la boucle paraisse continue
    var renderList = sectors.concat(sectors);

    renderList.forEach(function (s, i) {
        var card = document.createElement("div");
        card.className = "sc-card";
        card.dataset.sectorIndex = i % sectors.length;
        card.innerHTML =
            '<div class="sc-card-bg">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-opacity="0.18" stroke-width="1.2" style="position:absolute;right:-20px;bottom:-20px;width:220px;height:220px;">' +
            s.icon +
            "</svg>" +
            "</div>" +
            '<div class="sc-card-shade"></div>' +
            '<div class="sc-card-content">' +
            '<div class="sc-eyebrow-tag">' +
            s.tag +
            "</div>" +
            '<div class="sc-title">' +
            s.title +
            "</div>" +
            '<div class="sc-desc">' +
            s.desc +
            "</div>" +
            '<a class="sc-cta" href="#">Découvrir <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 6l6 6-6 6"/></svg></a>' +
            "</div>";
        track.appendChild(card);
    });

    var index = 0;
    var total = sectors.length;

    // ---- fond partagé de tout le carrousel (fondu entre deux calques) ----
    var bgLayerEls = [
        section.querySelector("#scBgLayer0"),
        section.querySelector("#scBgLayer1"),
    ];
    var bgFrontIndex = 0;
    var currentBgUrl = null;

    function setHeroBackground(url) {
        if (!url || url === currentBgUrl) return;
        currentBgUrl = url;
        var backIndex = 1 - bgFrontIndex;
        bgLayerEls[backIndex].style.backgroundImage = "url('" + url + "')";
        bgLayerEls[backIndex].classList.add("sc-visible");
        bgLayerEls[bgFrontIndex].classList.remove("sc-visible");
        bgFrontIndex = backIndex;
    }

    // une carte cliquée reste "épinglée" comme active (et garde le fond
    // synchronisé) jusqu'à ce que les flèches soient utilisées à nouveau
    var pinnedCard = null;

    function getCardWidth() {
        return track.children[0].getBoundingClientRect().width;
    }

    function updateActiveCards() {
        var vpRect = viewport.getBoundingClientRect();
        var cards = Array.prototype.slice.call(track.children);

        // repère toutes les cartes réellement visibles dans le viewport, dans l'ordre
        var visibleCards = cards.filter(function (card) {
            var r = card.getBoundingClientRect();
            var overlap =
                Math.min(r.right, vpRect.right) - Math.max(r.left, vpRect.left);
            var ratio = overlap / r.width;
            return ratio > 0.55;
        });

        cards.forEach(function (card) {
            card.classList.remove("sc-is-active");
        });

        // la carte "vedette" est la 2e depuis la gauche parmi les cartes visibles,
        // sauf si l'utilisateur en a épinglé une autre en cliquant dessus
        var activeCard = null;
        if (pinnedCard && visibleCards.indexOf(pinnedCard) !== -1) {
            activeCard = pinnedCard;
        } else if (visibleCards.length >= 2) {
            activeCard = visibleCards[1];
        } else if (visibleCards.length === 1) {
            activeCard = visibleCards[0];
        }

        if (activeCard) {
            activeCard.classList.add("sc-is-active");
            var sector = sectors[activeCard.dataset.sectorIndex];
            setHeroBackground(sector.image);
        }
    }

    // cliquer sur une carte (mais pas sur le lien "Découvrir") l'épingle comme
    // carte active, prévisualise son sous-titre et change le fond partagé
    track.addEventListener("click", function (e) {
        var card = e.target.closest(".sc-card");
        if (!card || e.target.closest(".sc-cta")) return;
        pinnedCard = card;
        updateActiveCards();
    });

    function update(animate) {
        if (animate === undefined) animate = true;
        track.style.transition = animate
            ? "transform .55s cubic-bezier(.65,0,.35,1)"
            : "none";
        track.style.transform = "translateX(-" + index * getCardWidth() + "px)";
    }

    track.addEventListener("transitionend", updateActiveCards);
    window.addEventListener("resize", function () {
        update(false);
        updateActiveCards();
    });

    function next() {
        pinnedCard = null;
        index++;
        update();
        if (index >= total) {
            setTimeout(function () {
                index = 0;
                update(false);
                updateActiveCards();
            }, 550);
        }
    }
    function prev() {
        pinnedCard = null;
        if (index === 0) {
            index = total;
            update(false);
            requestAnimationFrame(function () {
                requestAnimationFrame(function () {
                    index = total - 1;
                    update();
                });
            });
        } else {
            index--;
            update();
        }
    }

    var nextBtn = section.querySelector("#scNextBtn");
    var prevBtn = section.querySelector("#scPrevBtn");
    nextBtn.addEventListener("click", function () {
        next();
        resetAutoplay();
    });
    prevBtn.addEventListener("click", function () {
        prev();
        resetAutoplay();
    });

    // lecture automatique
    var playing = true;
    var timer = null;
    var pauseBtn = section.querySelector("#scPauseBtn");
    var pauseIcon = section.querySelector("#scPauseIcon");

    function startAutoplay() {
        timer = setInterval(next, 4200);
    }
    function stopAutoplay() {
        clearInterval(timer);
    }
    function resetAutoplay() {
        if (playing) {
            stopAutoplay();
            startAutoplay();
        }
    }

    pauseBtn.addEventListener("click", function () {
        playing = !playing;
        if (playing) {
            pauseIcon.innerHTML =
                '<rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/>';
            pauseBtn.setAttribute("aria-label", "Mettre en pause le carrousel");
            startAutoplay();
        } else {
            pauseIcon.innerHTML = '<path d="M7 5l12 7-12 7V5z"/>';
            pauseBtn.setAttribute("aria-label", "Lancer le carrousel");
            stopAutoplay();
        }
    });

    update(false);
    updateActiveCards();
    startAutoplay();
})();

// ---------- SECTION CONTACT : stub Google Sign-In + soumission démo ----------
(function () {
    var googleBtn = document.getElementById("googleSignInBtn");
    var form = document.getElementById("atContactForm");
    if (!googleBtn || !form) return;

    // Stub Google Sign-In — remplacer par l'intégration OAuth réelle plus tard
    googleBtn.addEventListener("click", function () {
        console.log(
            "Google Sign-In: stub non fonctionnel — à connecter à Google Identity Services.",
        );
    });

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        // TODO: brancher sur l'endpoint réel de soumission du formulaire
        console.log(
            "Formulaire soumis (démo) :",
            Object.fromEntries(new FormData(this)),
        );
        alert("Message envoyé (démo) — à connecter à votre backend.");
    });
})();

// ---------- SECTION "Pourquoi investir en Algérie" : compteurs animés au scroll ----------
(function () {
    var root = document.getElementById("dzInvest");
    if (!root) return;

    var reduceMotion =
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function formatNumber(value, decimals) {
        return value.toLocaleString("fr-FR", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        });
    }

    function animateCount(el) {
        var target = parseFloat(el.getAttribute("data-target"));
        var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
        var prefix = el.getAttribute("data-prefix") || "";
        if (reduceMotion || isNaN(target)) {
            el.textContent = prefix + formatNumber(target, decimals);
            return;
        }
        var duration = 1400;
        var start = null;

        function step(ts) {
            if (start === null) start = ts;
            var progress = Math.min((ts - start) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            var current = target * eased;
            el.textContent = prefix + formatNumber(current, decimals);
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = prefix + formatNumber(target, decimals);
        }
        requestAnimationFrame(step);
    }

    function revealItems(container) {
        var items = container.querySelectorAll("[data-reveal-item]");
        items.forEach(function (item, index) {
            setTimeout(
                function () {
                    item.classList.add("dz-in");
                    var num = item.querySelector(".dz-num");
                    if (num) animateCount(num);
                },
                reduceMotion ? 0 : index * 80,
            );
        });
    }

    var revealed = new WeakSet();

    var observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting && !revealed.has(entry.target)) {
                    revealed.add(entry.target);
                    entry.target.classList.add("dz-in");
                    revealItems(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15 },
    );

    root.querySelectorAll("[data-reveal]").forEach(function (card) {
        observer.observe(card);
    });
})();

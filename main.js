/* ============================================================================
   Algeria INVEST® — main.js
   Script unique de la page d'accueil (vanilla JS, aucune dépendance).
   Regroupe : header / navigation / recherche / langue / hero,
              onglets + timeline "cadre légal", carrousel "5 arguments".
   Chaque bloc est une IIFE autonome, scopée à ses propres éléments.
   ============================================================================ */

// ---------- NAV : lien actif selon la section visible ----------
(function () {
    var links = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
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
            link.classList.toggle("active", link.getAttribute("href") === "#" + id);
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
    burger.setAttribute("tabindex", "0");
    burger.setAttribute("aria-label", "Ouvrir le menu");
    burger.setAttribute("aria-expanded", "false");
    burger.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            burger.click();
        }
    });

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

    var options = Array.prototype.slice.call(dropdown.querySelectorAll("button[data-lang]"));
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
            btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
        });
        current.textContent = lang.toUpperCase();
        document.documentElement.setAttribute("lang", lang);
        document.documentElement.setAttribute("dir", rtlLangs.indexOf(lang) > -1 ? "rtl" : "ltr");
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

// ---------- HERO : vidéos indépendantes + slide de textes ----------
(function () {
    var root = document.getElementById("hero-slider");
    if (!root) return;

    // 1) Vidéos de fond : s'enchaînent seules, sans lien avec le slide ni les boutons
    var bgs = root.querySelectorAll(".hero-bg");
    var v = 0;
    if (bgs.length > 1) {
        setInterval(function () {
            bgs[v].classList.remove("active");
            v = (v + 1) % bgs.length;
            bgs[v].classList.add("active");
        }, 6000);
    }

    // 2) Slide des textes : barres + flèches gauche/droite
    var slides = root.querySelectorAll(".hero-slide");
    var bars = root.querySelectorAll(".ctrl-slide");
    var prevBtn = document.getElementById("hero-prev");
    var nextBtn = document.getElementById("hero-next");
    var current = 0;
    var duration = 8000;
    var timer = null;

    function render() {
        slides.forEach(function (s, i) {
            s.classList.toggle("active", i === current);
            s.setAttribute("aria-hidden", i === current ? "false" : "true");
        });
        bars.forEach(function (bar, i) {
            bar.classList.remove("active", "done");
            if (i < current) bar.classList.add("done");
            if (i === current) {
                void bar.offsetWidth;
                bar.classList.add("active");
            }
        });
    }

    function restart() {
        if (timer) clearInterval(timer);
        timer = setInterval(function () {
            goTo(current + 1);
        }, duration);
    }

    function goTo(index) {
        current = (index + slides.length) % slides.length;
        render();
        restart();
    }

    bars.forEach(function (bar) {
        bar.addEventListener("click", function () {
            goTo(parseInt(bar.getAttribute("data-slide"), 10));
        });
    });
    if (prevBtn)
        prevBtn.addEventListener("click", function () {
            goTo(current - 1);
        });
    if (nextBtn)
        nextBtn.addEventListener("click", function () {
            goTo(current + 1);
        });

    render();
    restart();
})();

// ============================================================================
// SECTION : onglets + timeline "Cadre de l'investissement" (#nx-cadre)
// ============================================================================
(function () {
    var tabs = Array.prototype.slice.call(document.querySelectorAll(".nx-tabs button"));
    if (!tabs.length) return;

    function select(tab, focus) {
        tabs.forEach(function (t) {
            var on = t === tab;
            t.classList.toggle("is-on", on);
            t.setAttribute("aria-selected", on ? "true" : "false");
            t.setAttribute("tabindex", on ? "0" : "-1");
            document.getElementById(t.dataset.tab).classList.toggle("is-on", on);
        });
        if (focus) tab.focus();
    }

    tabs.forEach(function (tab, i) {
        tab.addEventListener("click", function () {
            select(tab, false);
        });
        tab.addEventListener("keydown", function (e) {
            var n = tabs.length;
            var target = null;
            if (e.key === "ArrowRight") target = tabs[(i + 1) % n];
            else if (e.key === "ArrowLeft") target = tabs[(i - 1 + n) % n];
            else if (e.key === "Home") target = tabs[0];
            else if (e.key === "End") target = tabs[n - 1];
            if (target) {
                e.preventDefault();
                select(target, true);
            }
        });
    });
})();

(function () {
    var items = document.querySelectorAll(".nx-tl__i");
    if (!items.length) return;
    var hover = matchMedia("(hover:hover) and (min-width:721px)");
    var timer;
    function open(it) {
        items.forEach(function (x) {
            x.classList.toggle("is-on", x === it);
        });
    }
    items.forEach(function (it) {
        it.addEventListener("click", function () {
            open(it);
        });
        it.addEventListener("focus", function () {
            open(it);
        });
        // Intention de survol : évite les va-et-vient pendant l'animation
        it.addEventListener("mouseenter", function () {
            if (!hover.matches) return;
            clearTimeout(timer);
            timer = setTimeout(function () {
                if (it.matches(":hover")) open(it);
            }, 90);
        });
        it.addEventListener("mouseleave", function () {
            clearTimeout(timer);
        });
    });
})();

// ============================================================================
// SECTION : secteurs-carousel — carrousel horizontal "Nos secteurs d'activité"
// Encapsulé et scopé à #secteursCarousel : ne touche à rien d'autre sur la page.
// ============================================================================
(function () {
    var section = document.getElementById("secteursCarousel");
    if (!section) return;

    // ---- SECTOR DATA : modifie ce tableau pour ajouter/retirer des secteurs ----
    var IMG_DIR = "images/images-slide-secteurs/";
    function img(name) {
        return IMG_DIR + encodeURIComponent(name);
    }

    var sectors = [
        {
            tag: "01",
            title: "Un marché de grande échelle",
            desc: "Une population de plus de 46 millions d’habitants et une demande intérieure importante offrent une base de développement pour les biens, services et infrastructures.",
            cta: "Explorer le marché",
            href: "#",
            image: img("Agriculture & agro-industrie.png"),
            icon: '<path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-8"/><path d="M22 20H2"/>',
        },
        {
            tag: "02",
            title: "Une économie en diversification",
            desc: "Industrialisation, agro-industrie, mines, énergie, santé, technologies, tourisme et logistique constituent des axes de développement à analyser selon les opportunités et les contraintes sectorielles.",
            cta: "Explorer les secteurs",
            href: "#nx-secteurs",
            image: img("Industrie & manufacturing.png"),
            icon: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>',
        },
        {
            tag: "03",
            title: "Une position stratégique",
            desc: "À la croisée de l’Europe, du Maghreb et de l’Afrique, l’Algérie peut constituer une base de développement régional pour certains modèles économiques.",
            cta: "Analyser le positionnement",
            href: "#",
            image: img("Énergies renouvelables.png"),
            icon: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18"/>',
        },
        {
            tag: "04",
            title: "Un cadre d’investissement renouvelé",
            desc: "La loi n° 22-18, l’AAPI, les nouveaux régimes d’incitation et l’évolution du régime applicable aux investissements étrangers ont profondément modifié l’environnement de l’investisseur.",
            cta: "Décrypter le cadre légal",
            href: "#nx-cadre",
            image: img("Technologie & digital.png"),
            icon: '<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5"/><path d="M9 13h7M9 17h7"/>',
        },
        {
            tag: "05",
            title: "Des projets et infrastructures structurants",
            desc: "Le développement des infrastructures, de l’industrie, des transports, des mines et de la logistique crée de nouveaux besoins et de nouvelles chaînes de valeur.",
            cta: "Voir les opportunités",
            href: "#nx-secteurs",
            image: img("Mines & ressources stratégiques.png"),
            icon: '<path d="M3 21h18"/><path d="M5 21V9l4-4 4 4v12"/><path d="M13 21v-8l4-3 4 3v8"/>',
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
            '<a class="sc-cta" href="' +
            s.href +
            '">' +
            s.cta +
            ' <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 6l6 6-6 6"/></svg></a>' +
            "</div>";
        track.appendChild(card);
    });

    var index = 0;
    var total = sectors.length;

    // ---- fond partagé de tout le carrousel (fondu entre deux calques) ----
    var bgLayerEls = [section.querySelector("#scBgLayer0"), section.querySelector("#scBgLayer1")];
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
            var overlap = Math.min(r.right, vpRect.right) - Math.max(r.left, vpRect.left);
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
        track.style.transition = animate ? "transform .55s cubic-bezier(.65,0,.35,1)" : "none";
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

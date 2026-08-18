// ---------- HEADER : fond au scroll ----------
(function () {
	var header = document.querySelector('header');
	var threshold = 40;
	var navHideThreshold = 120; // au-delà, on considère qu'on est "dans" le contenu

	function onScroll() {
		var y = window.scrollY;

		if (y > threshold) {
			header.classList.add('scrolled');
		} else {
			header.classList.remove('scrolled');
		}

		if (y > navHideThreshold) {
			header.classList.add('nav-hidden');
		} else {
			header.classList.remove('nav-hidden');
		}
	}

	window.addEventListener('scroll', onScroll, { passive: true });
	onScroll();
})();

// ---------- HEADER : menu burger (mobile) ----------
(function () {
	var header = document.querySelector('header');
	var burger = document.querySelector('.burger');
	var navLinks = document.querySelector('.nav-links');
	if (!header || !burger || !navLinks) return;

	function closeMenu() {
		header.classList.remove('nav-open');
		burger.setAttribute('aria-expanded', 'false');
	}

	burger.setAttribute('role', 'button');
	burger.setAttribute('aria-label', 'Ouvrir le menu');
	burger.setAttribute('aria-expanded', 'false');

	burger.addEventListener('click', function () {
		var isOpen = header.classList.toggle('nav-open');
		burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
	});

	// Ferme le menu quand on choisit un lien ou qu'on repasse en desktop
	navLinks.addEventListener('click', function (e) {
		if (e.target.tagName === 'A') closeMenu();
	});
	window.addEventListener('resize', function () {
		if (window.innerWidth > 980) closeMenu();
	});
})();

// ---------- NAV : recherche discrète ----------
(function () {
	var widget = document.getElementById('searchWidget');
	var toggle = document.getElementById('searchToggle');
	var form = document.getElementById('searchForm');
	var input = document.getElementById('searchInput');
	if (!widget || !toggle || !form || !input) return;

	function open() {
		widget.classList.add('open');
		toggle.setAttribute('aria-expanded', 'true');
		toggle.setAttribute('aria-label', 'Fermer la recherche');
		setTimeout(function () { input.focus(); }, 150);
	}

	function close() {
		widget.classList.remove('open');
		toggle.setAttribute('aria-expanded', 'false');
		toggle.setAttribute('aria-label', 'Ouvrir la recherche');
		input.value = '';
	}

	toggle.addEventListener('click', function (e) {
		e.stopPropagation();
		if (widget.classList.contains('open')) close(); else open();
	});

	form.addEventListener('submit', function (e) {
		e.preventDefault();
		var q = input.value.trim();
		if (q) {
			// Point d'accroche pour brancher une vraie recherche plus tard
			console.log('Recherche :', q);
		}
	});

	document.addEventListener('click', function (e) {
		if (!widget.contains(e.target)) close();
	});

	document.addEventListener('keydown', function (e) {
		if (e.key === 'Escape') close();
	});
})();

// ---------- NAV : sélecteur de langue ----------
(function () {
	var wrap = document.getElementById('langSwitch');
	var toggle = document.getElementById('langToggle');
	var dropdown = document.getElementById('langDropdown');
	var current = document.getElementById('langCurrent');
	if (!wrap || !toggle || !dropdown || !current) return;

	var options = Array.prototype.slice.call(dropdown.querySelectorAll('button[data-lang]'));
	var rtlLangs = ['ar'];

	function close() {
		wrap.classList.remove('open');
		toggle.setAttribute('aria-expanded', 'false');
	}

	function open() {
		wrap.classList.add('open');
		toggle.setAttribute('aria-expanded', 'true');
	}

	function setLang(lang) {
		options.forEach(function (btn) {
			btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
		});
		current.textContent = lang.toUpperCase();
		document.documentElement.setAttribute('lang', lang);
		document.documentElement.setAttribute('dir', rtlLangs.indexOf(lang) > -1 ? 'rtl' : 'ltr');
		// Point d'accroche pour brancher les traductions réelles plus tard
	}

	toggle.addEventListener('click', function (e) {
		e.stopPropagation();
		wrap.classList.contains('open') ? close() : open();
	});

	options.forEach(function (btn) {
		btn.addEventListener('click', function () {
			setLang(btn.getAttribute('data-lang'));
			close();
		});
	});

	document.addEventListener('click', function (e) {
		if (!wrap.contains(e.target)) close();
	});

	document.addEventListener('keydown', function (e) {
		if (e.key === 'Escape') close();
	});
})();

// ---------- HERO SLIDER : fond qui change, texte fixe ----------
(function () {
	var root = document.getElementById('hero-slider');
	if (!root) return;

	var bgs = root.querySelectorAll('.hero-bg');
	var bars = root.querySelectorAll('.ctrl-slide');
	var toggleBtn = document.getElementById('hero-toggle');
	var fullscreenBtn = document.getElementById('hero-fullscreen');
	var current = 0;
	var total = bgs.length;
	var duration = 6000;
	var timer = null;
	var playing = true;

	function setBarStates() {
		bars.forEach(function (bar, i) {
			bar.classList.remove('active', 'done', 'paused');
			if (i < current) bar.classList.add('done');
			if (i === current) {
				bar.classList.add('active');
				if (!playing) bar.classList.add('paused');
			}
		});
	}

	function goTo(index) {
		bgs[current].classList.remove('active');
		current = (index + total) % total;
		bgs[current].classList.add('active');
		setBarStates();
		if (playing) restart();
	}

	function next() { goTo(current + 1); }

	function restart() {
		if (timer) clearInterval(timer);
		timer = setInterval(next, duration);
	}

	function stop() {
		if (timer) clearInterval(timer);
		timer = null;
	}

	bars.forEach(function (bar) {
		bar.addEventListener('click', function () {
			goTo(parseInt(bar.getAttribute('data-slide'), 10));
		});
	});

	if (toggleBtn) {
		toggleBtn.addEventListener('click', function () {
			playing = !playing;
			toggleBtn.textContent = playing ? '⏸' : '▶';
			toggleBtn.setAttribute('aria-label', playing ? 'Mettre en pause' : 'Lecture');
			bars[current].classList.toggle('paused', !playing);
			if (playing) { restart(); } else { stop(); }
		});
	}

	if (fullscreenBtn) {
		fullscreenBtn.addEventListener('click', function () {
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
	var wrapper = document.getElementById('tabsWrapper');
	if (!wrapper) return;

	var sticky = wrapper.querySelector('.tabs-sticky');
	var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab-item'));
	var panels = Array.prototype.slice.call(document.querySelectorAll('.tab-info-panel'));
	var total = tabs.length;
	var currentIndex = -1;

	function setActive(index) {
		if (index === currentIndex) return;
		currentIndex = index;
		tabs.forEach(function (tab, i) {
			tab.classList.toggle('active', i === index);
		});
		panels.forEach(function (panel, i) {
			panel.classList.toggle('active', i === index);
		});
	}

	function getScrollable() {
		var stickyHeight = sticky ? sticky.offsetHeight : window.innerHeight;
		return wrapper.offsetHeight - stickyHeight;
	}

	function updateFromScroll() {
		var rect = wrapper.getBoundingClientRect();
		var scrollable = getScrollable();
		if (scrollable <= 0) { setActive(0); return; }
		var progress = -rect.top / scrollable;
		progress = Math.max(0, Math.min(0.999, progress));
		var index = Math.floor(progress * total);
		index = Math.max(0, Math.min(total - 1, index));
		setActive(index);
	}

	tabs.forEach(function (tab, i) {
		tab.addEventListener('click', function () {
			var scrollable = getScrollable();
			var wrapperAbsoluteTop = wrapper.getBoundingClientRect().top + window.pageYOffset;
			var targetProgress = (i + 0.5) / total;
			var targetY = wrapperAbsoluteTop + (scrollable * targetProgress);
			window.scrollTo({ top: targetY, behavior: 'smooth' });
		});
	});

	window.addEventListener('scroll', updateFromScroll, { passive: true });
	window.addEventListener('resize', updateFromScroll);
	updateFromScroll();
})();

// ===== COMPORTEMENT / ANIMATIONS UNIQUEMENT =====
// Le contenu des programmes vit directement dans index.html.
// Ce script se contente de gérer l'onglet actif, l'affichage du bon
// panneau et le scroll animé — aucune donnée n'est injectée ici.

const tabsList = document.getElementById('tabsList');
const scrollUpBtn = document.getElementById('scrollUp');
const scrollDownBtn = document.getElementById('scrollDown');

const tabButtons = Array.from(document.querySelectorAll('.tab-btn'));
const panels = Array.from(document.querySelectorAll('.panel-content'));

let activeIndex = tabButtons.findIndex(btn => btn.classList.contains('active'));
if (activeIndex === -1) activeIndex = 0;

// Initialisation
function init() {
  tabButtons.forEach((btn, i) => {
    btn.addEventListener('click', () => showPanel(i));
  });

  updateTabStates();
  scrollToActiveTab();
}

// Affiche le panneau correspondant à l'index et met à jour les onglets
function showPanel(index) {
  if (index < 0 || index >= tabButtons.length) return;

  activeIndex = index;

  panels.forEach((panel, i) => {
    const isActive = i === index;
    panel.classList.toggle('active', isActive);
    panel.hidden = !isActive;
  });

  updateTabStates();
  scrollToActiveTab();
}

// Met à jour l'apparence des onglets (échelle, opacité, état actif/aria)
function updateTabStates() {
  tabButtons.forEach((btn, i) => {
    const distance = Math.abs(i - activeIndex);
    const maxDistance = 4;
    const clampedDistance = Math.min(distance, maxDistance);
    const scale = 1.2 - (clampedDistance / maxDistance) * 0.55;
    const opacity = 0.5 + (1 - clampedDistance / maxDistance) * 0.5;

    btn.style.transform = `scale(${scale})`;
    btn.style.opacity = opacity;

    const isActive = i === activeIndex;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });
}

// Scroll animé vers l'onglet actif
function scrollToActiveTab() {
  const activeBtn = tabButtons[activeIndex];
  if (!activeBtn) return;

  const listRect = tabsList.getBoundingClientRect();
  const btnRect = activeBtn.getBoundingClientRect();
  const delta = (btnRect.top + btnRect.height / 2) - (listRect.top + listRect.height / 2);

  const start = tabsList.scrollTop;
  const target = start + delta;
  const duration = 450;
  const startTime = performance.now();

  function animate(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3);

    tabsList.scrollTop = start + (target - start) * easeProgress;

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);
}

// Boutons de scroll (naviguent vers le programme précédent/suivant)
scrollUpBtn.addEventListener('click', () => {
  showPanel(activeIndex - 1);
});

scrollDownBtn.addEventListener('click', () => {
  showPanel(activeIndex + 1);
});

// Navigation au clavier (flèches haut/bas sur les onglets)
tabsList.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    showPanel(activeIndex + 1);
    tabButtons[activeIndex].focus();
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    showPanel(activeIndex - 1);
    tabButtons[activeIndex].focus();
  }
});

// Lancer l'app
init();

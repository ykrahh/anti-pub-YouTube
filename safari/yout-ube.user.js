// ==UserScript==
// @name         YouTube → yout-ube
// @match        *://www.youtube.com/*
// @match        *://youtube.com/*
// @match        *://m.youtube.com/*
// @match        *://youtu.be/*
// @run-at       document-start
// ==/UserScript==

(function () {
  // Renvoie l'URL yout-ube si c'est un lien de vidéo, sinon null
  function convertir(url) {
    const u = new URL(url, location.href);
    if (u.hostname === 'youtu.be' && u.pathname.length > 1) {
      return 'https://www.yout-ube.com/watch?v=' + u.pathname.slice(1);
    }
    if (u.hostname.endsWith('youtube.com') && u.pathname === '/watch' && u.searchParams.get('v')) {
      return 'https://www.yout-ube.com/watch' + u.search;
    }
    return null;
  }

  // 1) Arrivée directe sur une vidéo (lien externe, Google, etc.)
  const direct = convertir(location.href);
  if (direct) { location.replace(direct); return; }

  // 2) Clic sur une vidéo depuis YouTube
  document.addEventListener('click', (e) => {
    const lien = e.target.closest('a[href]');
    if (!lien) return;
    const cible = convertir(lien.href);
    if (!cible) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    if (e.metaKey || e.ctrlKey) window.open(cible, '_blank'); // Cmd+clic = nouvel onglet
    else location.href = cible;
  }, true);

  // 3) Filet de sécurité : navigation interne de YouTube sans rechargement
  document.addEventListener('yt-navigate-finish', () => {
    const cible = convertir(location.href);
    if (cible) location.replace(cible);
  });
})();

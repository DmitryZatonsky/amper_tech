// Події аналітики. Працює лише якщо на сторінці підключено gtag (GA4).
(function () {
  var SOCIAL = { "t.me": "telegram", "instagram.com": "instagram", "tiktok.com": "tiktok" };

  function socialNetwork(href) {
    var host;
    try {
      host = new URL(href, location.href).hostname.replace(/^www\./, "");
    } catch (e) {
      return null;
    }
    return SOCIAL[host] || null;
  }

  // Місце посилання на сторінці: нижня панель, шапка, блок кошторису, контакти, футер
  function placement(link) {
    if (link.closest(".mobile-bar")) return "mobile_bar";
    if (link.closest("header")) return "header";
    if (link.closest("#cost")) return "cost_block";
    if (link.closest("#contacts")) return "contacts";
    if (link.closest("footer")) return "footer";
    return "other";
  }

  document.addEventListener("click", function (e) {
    if (typeof window.gtag !== "function") return;
    var link = e.target.closest && e.target.closest("a[href]");
    if (!link) return;
    var href = link.getAttribute("href");

    if (href.indexOf("tel:") === 0) {
      window.gtag("event", "click_phone", { page_path: location.pathname });
      return;
    }

    var network = socialNetwork(href);
    if (network === "telegram") {
      window.gtag("event", "click_telegram", { page_path: location.pathname, placement: placement(link) });
    } else if (network) {
      window.gtag("event", "click_social", { network: network, page_path: location.pathname });
    }
  });
})();

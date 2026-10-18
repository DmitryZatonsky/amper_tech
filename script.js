document.addEventListener("DOMContentLoaded", function () {
  // 1. Відправка форми
  const form = document.getElementById("landingForm");
  const successMsg = document.getElementById("formSuccess");

  if (form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const lang = document.documentElement.lang || "uk";
    const errMsg =
      lang === "ru" ? "Ошибка при отправке. Попробуйте позже." : "Помилка при відправці. Спробуйте пізніше.";
    const netErrMsg =
      lang === "ru"
        ? "Ошибка сети. Проверьте соединение и попробуйте снова."
        : "Помилка мережі. Перевірте з'єднання та спробуйте ще раз.";

    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      const formData = new FormData(form);
      if (submitBtn) submitBtn.disabled = true;
      try {
        const response = await fetch("/handler.php", { method: "POST", body: formData });
        if (response.ok) {
          form.style.display = "none";
          successMsg.style.display = "block";
          form.reset();
          window.gtag && gtag("event", "generate_lead", { page_path: location.pathname });
        } else {
          alert(errMsg);
        }
      } catch (error) {
        console.error("Error:", error);
        alert(netErrMsg);
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  // 2. Мобільне меню
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");
  const overlay = document.getElementById("overlay");

  // Значок меню: «бургер» ↔ «хрестик» (зміна символу в SVG-спрайті)
  function setMenuIcon(isOpen) {
    const icon = menuToggle && menuToggle.querySelector(".icon");
    if (!icon) return;
    const name = isOpen ? "xmark" : "bars";
    icon.querySelector("use").setAttribute("href", "/image/icons.svg#" + name);
    icon.classList.remove("icon-bars", "icon-xmark");
    icon.classList.add("icon-" + name);
  }

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const isActive = mainNav.classList.toggle("active");
      if (overlay) overlay.classList.toggle("active");
      menuToggle.setAttribute("aria-expanded", String(isActive));
      setMenuIcon(isActive);
    });
  }

  document.querySelectorAll(".nav a").forEach((link) => {
    link.addEventListener("click", () => {
      if (mainNav) mainNav.classList.remove("active");
      if (overlay) overlay.classList.remove("active");
      if (menuToggle) {
        menuToggle.setAttribute("aria-expanded", "false");
        setMenuIcon(false);
      }
    });
  });

  if (overlay) {
    overlay.addEventListener("click", () => {
      mainNav.classList.remove("active");
      overlay.classList.remove("active");
      if (menuToggle) {
        menuToggle.setAttribute("aria-expanded", "false");
        setMenuIcon(false);
      }
    });
  }

  // 3. Кнопка "Вгору"
  const backToTop = document.getElementById("backToTop");
  if (backToTop) {
    const toggleBackToTop = () => {
      if (window.scrollY > 600) backToTop.classList.add("show");
      else backToTop.classList.remove("show");
    };
    window.addEventListener("scroll", toggleBackToTop, { passive: true });
    toggleBackToTop();

    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    backToTop.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }

  // 4. Маска телефону
  const phoneInput = document.getElementById("phone");
  if (phoneInput) {
    phoneInput.addEventListener("input", function (e) {
      let input = e.target.value.replace(/\D/g, "");
      if (input.startsWith("38")) input = input.substring(2);
      let formatted = "+38 ";
      if (input.length > 0) formatted += "(" + input.substring(0, 3);
      if (input.length >= 4) formatted += ") " + input.substring(3, 6);
      if (input.length >= 7) formatted += "-" + input.substring(6, 8);
      if (input.length >= 9) formatted += "-" + input.substring(8, 10);
      e.target.value = formatted.substring(0, 19);
    });

    phoneInput.addEventListener("keypress", function (e) {
      if (!/\d/.test(e.key)) e.preventDefault();
    });
  }

  // 5. Завантаження прайс-листа (якщо ми на сторінці прайсу)
  const priceContainer = document.querySelector("#priceContainer");
  if (priceContainer) {
    // Визначаємо поточну мову на основі тегу <html>
    const currentLang = document.documentElement.lang || "uk";
    console.log("Текущий язык:", currentLang);

    const urlUA =
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vROD4iOuzSng4WWKDeMCJeIkC90_ca00ol3ZUXyNycZcbvlIR5YjPXwSv7089B_9IgzxtcrZLCw6HYf/pub?gid=0&single=true&output=csv";
    const urlRU =
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vROD4iOuzSng4WWKDeMCJeIkC90_ca00ol3ZUXyNycZcbvlIR5YjPXwSv7089B_9IgzxtcrZLCw6HYf/pub?gid=1464136526&single=true&output=csv";

    const sheetCsvUrl = currentLang === "ru" ? urlRU : urlUA;
    const loadingText = currentLang === "ru" ? "Загрузка цен..." : "Завантаження цін...";

    priceContainer.innerHTML = `
      <div style="text-align: center; padding: 30px; font-size: 1.2rem; color: #666;">
        <svg class="icon icon-spinner icon-spin" style="margin-right: 10px;" aria-hidden="true"><use href="/image/icons.svg#spinner"></use></svg> ${loadingText}
      </div>
    `;

    function escapeHtml(value) {
      return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    }

    function parseCSVLine(text) {
      let val = "",
        char = "",
        row = [];
      let inQuotes = false;
      for (let i = 0; i < text.length; i++) {
        char = text[i];
        if (char === '"') inQuotes = !inQuotes;
        else if (char === "," && !inQuotes) {
          row.push(val.trim());
          val = "";
        } else val += char;
      }
      row.push(val.trim());
      return row;
    }

    fetch(sheetCsvUrl)
      .then((response) => response.text())
      .then((csvText) => {
        const rows = csvText.split("\n");
        const categories = {};
        const categoryOrder = [];

        for (let i = 1; i < rows.length; i++) {
          const rowText = rows[i].trim();
          if (rowText === "") continue;

          const columns = parseCSVLine(rowText);

          if (columns.length >= 5) {
            const category = columns[0].replace(/^"|"$/g, "").trim();
            const subcategory = columns[1].replace(/^"|"$/g, "").trim();
            const name = columns[2].replace(/^"|"$/g, "").trim();
            const unit = columns[3].replace(/^"|"$/g, "").trim();
            const rawPrice = columns[4].replace(/^"|"$/g, "").trim();

            if (!category) continue;

            let price = rawPrice;
            const cleanPriceStr = rawPrice
              .replace(/\s/g, "")
              .replace(",", ".")
              .replace(/[^0-9.]/g, "");
            const numericPrice = parseFloat(cleanPriceStr);
            if (!isNaN(numericPrice)) {
              price = (Math.ceil(numericPrice / 10) * 10).toString();
            }

            if (!categories[category]) {
              categories[category] = { _subOrder: [], _subcategories: {}, _noSubcategoryItems: [] };
              categoryOrder.push(category);
            }

            if (subcategory) {
              if (!categories[category]._subcategories[subcategory]) {
                categories[category]._subcategories[subcategory] = [];
                categories[category]._subOrder.push(subcategory);
              }
              categories[category]._subcategories[subcategory].push({ name, unit, price });
            } else {
              categories[category]._noSubcategoryItems.push({ name, unit, price });
            }
          }
        }

        if (categoryOrder.length === 0) {
          const emptyText = currentLang === "ru" ? "Прайс-лист пуст." : "Прайс-лист порожній.";
          priceContainer.innerHTML = `<div style="text-align:center; color:red; padding:20px;">${emptyText}</div>`;
          return;
        }

        function generateTableHtml(items) {
          const headerName = currentLang === "ru" ? "Наименование работ" : "Найменування робіт";
          const headerUnit = currentLang === "ru" ? "Единица" : "Одиниця";
          const headerPrice = currentLang === "ru" ? "Цена" : "Ціна";

          let tableHtml = `
            <div class="table-responsive" style="margin-bottom: 25px;">
              <table class="price-table">
                <thead>
                  <tr>
                    <th>${headerName}</th>
                    <th style="width: 15%;">${headerUnit}</th>
                    <th style="width: 20%;">${headerPrice}</th>
                  </tr>
                </thead>
                <tbody>
          `;
          items.forEach((item) => {
            tableHtml += `<tr><td>${escapeHtml(item.name)}</td><td>${escapeHtml(item.unit)}</td><td>${escapeHtml(item.price)} ₴</td></tr>`;
          });
          tableHtml += `</tbody></table></div>`;
          return tableHtml;
        }

        let finalHtml = "";
        categoryOrder.forEach((categoryName) => {
          const catData = categories[categoryName];
          finalHtml += `
            <div class="price-category-group" style="margin-bottom: 60px;">
              <h2 class="category-title" style="font-size: 2rem; color: var(--primary-text); margin-bottom: 30px; border-left: 5px solid var(--primary); padding-left: 15px; font-weight: 800; text-transform: uppercase;">
                ${escapeHtml(categoryName)}
              </h2>
          `;
          if (catData._noSubcategoryItems.length > 0) finalHtml += generateTableHtml(catData._noSubcategoryItems);

          catData._subOrder.forEach((subName) => {
            finalHtml += `
              <div class="price-subcategory-group">
                <h3 class="subcategory-title">
                  ${escapeHtml(subName)}
                </h3>
            `;
            finalHtml += generateTableHtml(catData._subcategories[subName]);
            finalHtml += `</div>`;
          });
          finalHtml += `</div>`;
        });

        priceContainer.innerHTML = finalHtml;
      })
      .catch((error) => {
        console.error("Помилка завантаження прайсу:", error);
        const errorText = currentLang === "ru" ? "Ошибка загрузки." : "Помилка завантаження.";
        priceContainer.innerHTML = `<div style="text-align:center; color:red; padding:30px;">${errorText}</div>`;
      });
  }

  // 6. Зміна фото на першому екрані
  (function () {
    const hero = document.querySelector(".hero");
    const slides = hero ? Array.from(hero.querySelectorAll(".hero-slide")) : [];
    const pauseBtn = hero ? hero.querySelector(".hero-pause") : null;
    if (slides.length < 2) return;

    const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = navigator.connection && navigator.connection.saveData;
    if (reduceMotion || saveData) return;

    const HOLD_MS = 6500;
    let current = 0;
    let timer = null;
    let userPaused = false;
    let tabHidden = document.hidden;
    let heroVisible = true;
    let started = false;
    const failed = new Set();

    // Підставляє справжні адреси з data-атрибутів і чекає на декодування
    function prepare(slide) {
      if (slide.dataset.ready === "1") return Promise.resolve(true);
      if (failed.has(slide)) return Promise.resolve(false);
      const img = slide.querySelector("img");
      const source = slide.querySelector("source");
      if (!img) return Promise.resolve(false);
      if (source && source.dataset.srcset) source.srcset = source.dataset.srcset;
      if (img.dataset.src) img.src = img.dataset.src;
      const ready = img.decode ? img.decode() : Promise.resolve();
      return ready.then(
        () => {
          slide.dataset.ready = "1";
          return true;
        },
        () => {
          failed.add(slide);
          return false;
        }
      );
    }

    function canRun() {
      return started && !userPaused && !tabHidden && heroVisible;
    }

    function stop() {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    }

    // Шукає наступний готовий кадр; якщо його ще немає — лишається на поточному
    function next() {
      timer = null;
      if (!canRun()) return;
      const total = slides.length;
      let target = -1;
      for (let step = 1; step < total; step++) {
        const idx = (current + step) % total;
        if (!failed.has(slides[idx])) {
          target = idx;
          break;
        }
      }
      if (target === -1) return;
      prepare(slides[target]).then((ok) => {
        if (!canRun() || timer) return;
        if (ok) {
          slides[current].classList.remove("is-active");
          slides[target].classList.add("is-active");
          current = target;
        }
        schedule();
      });
    }

    function schedule() {
      stop();
      if (canRun()) timer = setTimeout(next, HOLD_MS);
    }

    function sync() {
      if (canRun()) {
        if (!timer) schedule();
      } else {
        stop();
      }
    }

    function start() {
      if (started) return;
      started = true;
      if (pauseBtn) pauseBtn.hidden = false;
      // Наступний кадр вантажимо заздалегідь, поки показується поточний
      prepare(slides[1 % slides.length]);
      sync();
    }

    document.addEventListener("visibilitychange", () => {
      tabHidden = document.hidden;
      sync();
    });

    if ("IntersectionObserver" in window) {
      new IntersectionObserver((entries) => {
        heroVisible = entries[entries.length - 1].isIntersecting;
        sync();
      }).observe(hero);
    }

    if (pauseBtn) {
      pauseBtn.addEventListener("click", () => {
        userPaused = !userPaused;
        pauseBtn.setAttribute("aria-pressed", String(userPaused));
        pauseBtn.setAttribute(
          "aria-label",
          userPaused ? pauseBtn.dataset.labelPlay : pauseBtn.dataset.labelPause
        );
        sync();
      });
    }

    function whenIdle() {
      if ("requestIdleCallback" in window) window.requestIdleCallback(start);
      else setTimeout(start, 1500);
    }

    if (document.readyState === "complete") whenIdle();
    else window.addEventListener("load", whenIdle, { once: true });
  })();

  // 7. Фотогалерея «Наші роботи»
  (function () {
    // Фото лежать у HTML (index.html і ru/index.html, блок .carousel-slide). Скрипт лише керує показом.

    const root = document.getElementById("worksCarousel");
    if (!root) return;
    const stage = root.querySelector(".carousel-stage");
    const slides = Array.from(stage.querySelectorAll(".carousel-slide"));
    const total = slides.length;
    if (total < 2) return;
    const prevBtn = root.querySelector(".carousel-prev");
    const nextBtn = root.querySelector(".carousel-next");
    const pauseBtn = root.querySelector(".carousel-pause");
    const isRu = (document.documentElement.lang || "uk") === "ru";
    const defaultAlt = isRu ? "Электромонтажные работы Amper Tech" : "Електромонтажні роботи Amper Tech";
    const slideLabel = root.dataset.slideLabel || "{n} / {total}";

    const AUTO_MS = 2000; // автопрокрутка
    const USER_PAUSE_MS = 6000; // пауза після дії користувача
    const EAGER_COUNT = 3; // перші кадри вантажаться одразу, решта — lazy
    const GAP = 16;
    const SIDE_SCALE = 0.8;

    const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = navigator.connection && navigator.connection.saveData;
    const autoAllowed = !reduceMotion && !saveData;

    let current = 0;
    let built = false;
    let timer = null;
    let userPaused = false; // кнопка паузи
    let pausedUntil = 0; // пауза після стрілки / дотику
    let hovering = false;
    let focused = false;
    let tabHidden = document.hidden;
    let inView = true;

    function build() {
      if (built) return;
      built = true;
      slides.forEach((slide, i) => {
        slide.setAttribute("role", "group");
        slide.setAttribute("aria-roledescription", "slide");
        slide.setAttribute("aria-label", slideLabel.replace("{n}", i + 1).replace("{total}", total));
        const img = slide.querySelector("img");
        if (img && !img.getAttribute("alt")) img.alt = defaultAlt;
        if (img && i < EAGER_COUNT) img.loading = "eager";
        slide.addEventListener("click", () => {
          if (slide.classList.contains("is-center")) return;
          go(i, true);
        });
      });
      root.classList.add("is-ready");
      stage.classList.add("is-init"); // перше розташування без анімації
      [prevBtn, nextBtn].forEach((b) => b && (b.hidden = false));
      if (pauseBtn && autoAllowed) pauseBtn.hidden = false;
      layout();
      requestAnimationFrame(() => requestAnimationFrame(() => stage.classList.remove("is-init")));
    }

    function layout() {
      if (!slides.length) return;
      const w = slides[0].offsetWidth;
      const step = w * 0.5 + w * SIDE_SCALE * 0.5 + GAP;
      slides.forEach((slide, i) => {
        let d = i - current;
        d = ((((d + total / 2) % total) + total) % total) - total / 2;
        const ad = Math.abs(d);
        const x = d === 0 ? 0 : Math.sign(d) * (step + (ad - 1) * (w * SIDE_SCALE + GAP));
        slide.style.transform = `translateX(${x}px) scale(${d === 0 ? 1 : SIDE_SCALE})`;
        slide.style.opacity = ad === 0 ? "1" : ad <= 2 ? "0.6" : "0";
        slide.style.zIndex = String(10 - Math.min(ad, 9));
        slide.style.pointerEvents = ad <= 2 ? "auto" : "none";
        slide.classList.toggle("is-center", d === 0);
        slide.setAttribute("aria-hidden", d === 0 ? "false" : "true");
        const img = slide.querySelector("img");
        if (img && ad <= 2 && img.loading === "lazy") img.loading = "eager";
      });
    }

    function go(index, byUser) {
      current = ((index % total) + total) % total;
      if (byUser) pausedUntil = Date.now() + USER_PAUSE_MS;
      layout();
    }

    function canAutoplay() {
      return (
        autoAllowed && built && !userPaused && !hovering && !focused && !tabHidden && inView && Date.now() >= pausedUntil
      );
    }

    function tick() {
      if (canAutoplay()) go(current + 1, false);
    }

    function startTimer() {
      if (!autoAllowed || timer) return;
      timer = setInterval(tick, AUTO_MS);
    }

    // Кнопки
    if (prevBtn) prevBtn.addEventListener("click", () => go(current - 1, true));
    if (nextBtn) nextBtn.addEventListener("click", () => go(current + 1, true));
    if (pauseBtn) {
      pauseBtn.addEventListener("click", () => {
        userPaused = !userPaused;
        pauseBtn.setAttribute("aria-pressed", String(userPaused));
        pauseBtn.setAttribute("aria-label", userPaused ? pauseBtn.dataset.labelPlay : pauseBtn.dataset.labelPause);
      });
    }

    // Клавіатура: стрілки, коли фокус усередині каруселі
    root.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(current - 1, true);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        go(current + 1, true);
      }
    });

    // Наведення, фокус, дотик — зупиняють автопрокрутку
    root.addEventListener("mouseenter", () => (hovering = true));
    root.addEventListener("mouseleave", () => (hovering = false));
    root.addEventListener("focusin", () => (focused = true));
    root.addEventListener("focusout", () => (focused = false));

    // Свайп
    let startX = null;
    let startY = null;
    stage.addEventListener("pointerdown", (e) => {
      startX = e.clientX;
      startY = e.clientY;
      pausedUntil = Date.now() + USER_PAUSE_MS;
    });
    stage.addEventListener("pointerup", (e) => {
      if (startX === null) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      startX = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) go(current + (dx < 0 ? 1 : -1), true);
    });
    stage.addEventListener("pointercancel", () => (startX = null));

    document.addEventListener("visibilitychange", () => (tabHidden = document.hidden));
    if ("IntersectionObserver" in window) {
      new IntersectionObserver((entries) => {
        inView = entries[entries.length - 1].isIntersecting;
      }).observe(root);
    }
    window.addEventListener("resize", layout);

    // Запуск після завантаження сторінки, щоб не заважати першому екрану
    function init() {
      build();
      startTimer();
    }
    function whenIdle() {
      if ("requestIdleCallback" in window) window.requestIdleCallback(init);
      else setTimeout(init, 1500);
    }
    if (document.readyState === "complete") whenIdle();
    else window.addEventListener("load", whenIdle, { once: true });
  })();

  // 8. Відгуки: картки з'являються по черзі при скролі (без JS і при reduced-motion видно одразу)
  (function () {
    const section = document.getElementById("reviews");
    if (!section || !("IntersectionObserver" in window)) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cards = Array.from(section.querySelectorAll(".review"));
    if (!cards.length) return;
    section.classList.add("reviews-js");
    const observer = new IntersectionObserver(
      (entries) => {
        entries
          .filter((entry) => entry.isIntersecting)
          .forEach((entry, i) => {
            entry.target.style.setProperty("--d", i * 80 + "ms");
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          });
      },
      { threshold: 0.15 }
    );
    cards.forEach((card) => observer.observe(card));
  })();
});

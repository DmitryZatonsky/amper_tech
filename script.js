document.addEventListener("DOMContentLoaded", function () {
  // 1. Анімації AOS
  if (typeof AOS !== "undefined") {
    AOS.init({ duration: 1000, once: true });
  }

  // 2. Відправка форми
  const form = document.getElementById("landingForm");
  const successMsg = document.getElementById("formSuccess");

  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      const formData = new FormData(form);
      try {
        const response = await fetch("handler.php", { method: "POST", body: formData });
        if (response.ok) {
          form.style.display = "none";
          successMsg.style.display = "block";
          form.reset();
        } else {
          alert("Помилка при відправці. Спробуйте пізніше.");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    });
  }

  // 3. Мобільне меню
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");
  const overlay = document.getElementById("overlay");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      mainNav.classList.toggle("active");
      if (overlay) overlay.classList.toggle("active");
      const icon = menuToggle.querySelector("i");
      icon.classList.toggle("fa-bars");
      icon.classList.toggle("fa-xmark");
    });
  }

  document.querySelectorAll(".nav a").forEach((link) => {
    link.addEventListener("click", () => {
      if (mainNav) mainNav.classList.remove("active");
      if (overlay) overlay.classList.remove("active");
      if (menuToggle) {
        const icon = menuToggle.querySelector("i");
        if (icon) {
          icon.classList.add("fa-bars");
          icon.classList.remove("fa-xmark");
        }
      }
    });
  });

  if (overlay) {
    overlay.addEventListener("click", () => {
      mainNav.classList.remove("active");
      overlay.classList.remove("active");
      if (menuToggle) {
        const icon = menuToggle.querySelector("i");
        if (icon) {
          icon.classList.add("fa-bars");
          icon.classList.remove("fa-xmark");
        }
      }
    });
  }

  // 4. Акордеон FAQ
  document.querySelectorAll(".faq-item").forEach((item) => {
    item.addEventListener("click", () => {
      item.classList.toggle("active");
    });
  });

  // 5. Кнопка "Вгору"
  const backToTop = document.getElementById("backToTop");
  if (backToTop) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 400) backToTop.classList.add("show");
      else backToTop.classList.remove("show");
    });

    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // 6. Маска телефону
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

  // 7. Завантаження прайс-листа (якщо ми на сторінці прайсу)
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
        <i class="fa-solid fa-spinner fa-spin" style="margin-right: 10px;"></i> ${loadingText}
      </div>
    `;

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
            tableHtml += `<tr><td>${item.name}</td><td>${item.unit}</td><td>${item.price} ₴</td></tr>`;
          });
          tableHtml += `</tbody></table></div>`;
          return tableHtml;
        }

        let finalHtml = "";
        categoryOrder.forEach((categoryName) => {
          const catData = categories[categoryName];
          finalHtml += `
            <div class="price-category-group" style="margin-bottom: 60px;" data-aos="fade-up">
              <h2 class="category-title" style="font-size: 2rem; color: var(--primary); margin-bottom: 30px; border-left: 5px solid var(--primary); padding-left: 15px; font-weight: 800; text-transform: uppercase;">
                ${categoryName}
              </h2>
          `;
          if (catData._noSubcategoryItems.length > 0) finalHtml += generateTableHtml(catData._noSubcategoryItems);

          catData._subOrder.forEach((subName) => {
            finalHtml += `
              <div class="price-subcategory-group" style="margin-left: 15px; margin-bottom: 35px;">
                <h3 class="subcategory-title" style="font-size: 1.35rem; color: #333; margin-top: 25px; margin-bottom: 15px; font-weight: 700; border-bottom: 2px solid #f0f0f0; padding-bottom: 8px;">
                  ${subName}
                </h3>
            `;
            finalHtml += generateTableHtml(catData._subcategories[subName]);
            finalHtml += `</div>`;
          });
          finalHtml += `</div>`;
        });

        priceContainer.innerHTML = finalHtml;
        if (typeof AOS !== "undefined") AOS.refresh();
      })
      .catch((error) => {
        console.error("Помилка завантаження прайсу:", error);
        const errorText = currentLang === "ru" ? "Ошибка загрузки." : "Помилка завантаження.";
        priceContainer.innerHTML = `<div style="text-align:center; color:red; padding:30px;">${errorText}</div>`;
      });
  }
});

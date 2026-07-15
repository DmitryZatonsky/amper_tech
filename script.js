// ==========================================
// РОЗДІЛ 1: ДАНІ (СЛОВНИК)
// ==========================================
const translations = {
  uk: {
    menu_home: "Головна",
    menu_advantages: "Переваги",
    menu_faq: "Часті запитання",
    menu_price: "Прайс",
    menu_contacts: "Контакти",
    hero_title: "Електромонтаж без сюрпризів та «доплат»",
    hero_description:
      "Фіксуємо ціну в договорі. Створюємо цифрову карту ліній з QR-кодом на щиті. Робимо один раз і на десятиліття.",
    hero_cta: "Отримати консультацію",
    advantages_title: "Чому обирають Amper Tech?",
    advantages_subtitle_price: "Ціна не росте",
    advantages_description_price: "Сума в кошторисі остаточна. Жодних «ой, ми забули про цей дріт» у процесі ремонту.",
    advantages_subtitle_fire: "Захист від пожежі",
    advantages_description_fire:
      "Використовуємо лише сертифіковане обладнання та розраховуємо навантаження з запасом не менше ніж 20%.",
    advantages_subtitle_digital: "Цифровий паспорт",
    advantages_description_digital:
      "QR-код на щиті відкриє схему ліній на смартфоні. Ви завжди знаєте, де проходить дріт у стіні.",
    faq_title: "Часті запитання",
    faq_question_price: "Чи зміниться ціна після початку робіт?",
    faq_answer_price:
      "Ні. Ми складаємо детальний кошторис до початку монтажу. Сума фіксується в договорі і залишається незмінною, якщо ви не вирішите додати нові зміни в процесі.",
    faq_question_qr: "Що таке QR-паспорт щита?",
    faq_answer_qr:
      "Це наклейка на внутрішній стороні вашого електрощита. Відсканувавши її, ви отримуєте доступ до цифрової схеми розведення кабелів по квартирі. Ви точно знатимете, де можна свердлити стіну, а де ні.",
    faq_question_materials: "Які матеріали ви використовуєте?",
    faq_answer_materials:
      "Працюємо лише з перевіреними брендами (Schneider Electric, ABB, Hager). Використовуємо кабель ВВГнг-п LS, який не підтримує горіння та має низьке димовиділення.",
    faq_question_warranty: "Чи даєте ви гарантію на роботу?",
    faq_answer_warranty:
      "Так, ми надаємо офіційну гарантію 5 років на всі наші монтажні роботи. У разі будь-яких питань наш майстер виїжджає на об'єкт безкоштовно.",
    form_title: "Зарядіть свій дім на надійність",
    form_description: "Отримайте розрахунок кошторису, який не зміниться в процесі робіт.",
    form_name_placeholder: "Ваше ім'я",
    form_phone_placeholder: "Введіть номер у форматі +38 (XXX) XXX-XX-XX",
    form_button: "Отримати консультацію",
    form_note: "Натискаючи кнопку, ви погоджуєтеся на обробку персональних даних.",
    form_success: "Дякуємо! Ми зв'яжемося з вами протягом 10 хвилин.",
    contacts_title: "Контакти",
    contacts_address: "Україна, Київ",
    footer_copyright: "© 2026 Amper Tech. Професійний електромонтаж.",
    price_description: "Ціни актуальні на сьогодні. Кінцевий кошторис фіксується після огляду об'єкта.",
    price_loading: "Завантаження цін...",
  },
  ru: {
    menu_home: "Главная",
    menu_advantages: "Преимущества",
    menu_faq: "Частые вопросы",
    menu_price: "Прайс",
    menu_contacts: "Контакты",
    hero_title: "Электромонтаж без сюрпризов и «доплат»",
    hero_description:
      "Фиксируем цену в договоре. Создаем цифровую карту линий с QR-кодом на щите. Делаем один раз и на десятилетия.",
    hero_cta: "Получить консультацию",
    advantages_title: "Почему выбирают Amper Tech?",
    advantages_subtitle_price: "Цена не растет",
    advantages_description_price:
      "Сумма в смете окончательная. Никаких «ой, мы забыли про этот провод» в процессе ремонта.",
    advantages_subtitle_fire: "Защита от пожара",
    advantages_description_fire:
      "Используем только сертифицированное оборудование и рассчитываем нагрузку с запасом не менее 20%.",
    advantages_subtitle_digital: "Цифровой паспорт",
    advantages_description_digital:
      "QR-код на щите откроет схему линий на смартфоне. Вы всегда знаете, где проходит кабель в стене.",
    faq_title: "Частые вопросы",
    faq_question_price: "Изменится ли цена после начала работ?",
    faq_answer_price:
      "Нет. Мы составляем детальную смету до начала монтажа. Сумма фиксируется в договоре и остается неизменной, если вы не решите добавить новые изменения в процессе.",
    faq_question_qr: "Что такое QR-паспорт щита?",
    faq_answer_qr:
      "Это наклейка на внутренней стороне вашего электрощита. Отсканировав ее, вы получаете доступ к цифровой схеме разводки кабелей по квартире. Вы точно будете знать, где можно сверлить стену, а где нет.",
    faq_question_materials: "Какие материалы вы используете?",
    faq_answer_materials:
      "Работаем только с проверенными брендами (Schneider Electric, ABB, Hager). Используем кабель ВВГнг-п LS, который не поддерживает горение и имеет низкое дымовыделение.",
    faq_question_warranty: "Даете ли вы гарантию на работу?",
    faq_answer_warranty:
      "Да, мы предоставляем официальную гарантию 5 лет на все наши монтажные работы. В случае любых вопросов наш мастер выезжает на объект бесплатно.",
    form_title: "Зарядите свой дом на надежность",
    form_description: "Получите расчет сметы, которая не изменится в процессе работ.",
    form_name_placeholder: "Ваше имя",
    form_phone_placeholder: "Введите номер в формате +38 (XXX) XXX-XX-XX",
    form_button: "Получить консультацию",
    form_note: "Нажимая кнопку, вы соглашаетесь на обработку персональных данных.",
    form_success: "Спасибо! Мы свяжемся с вами в течение 10 минут.",
    contacts_title: "Контакты",
    contacts_address: "Украина, Киев",
    footer_copyright: "© 2026 Amper Tech. Профессиональный электромонтаж.",
    price_description: "Цены актуальны на сегодня. Конечная смета фиксируется после осмотра объекта.",
    price_loading: "Загрузка цен...",
  },
};

// ==========================================
// РОЗДІЛ 2: ГЛОБАЛЬНІ ФУНКЦІЇ (ЛОГІКА)
// ==========================================

// 2.1. Функція застосування мови
window.applyLanguage = function (lang) {
  const dict = translations[lang];
  if (!dict) return;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) el.innerHTML = dict[key];
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (dict[key]) el.setAttribute("placeholder", dict[key]);
  });

  document.documentElement.lang = lang;

  if (typeof window.loadPrice === "function") {
    window.loadPrice(lang);
  }
};

// 2.2. Функція збереження мови (викликається з HTML кнопок)
window.setLanguage = function (lang) {
  localStorage.setItem("amper_lang", lang);
  const langModal = document.getElementById("lang-modal");
  if (langModal) langModal.style.display = "none";
  document.body.style.overflow = "";
  window.applyLanguage(lang);
};

// 2.3. Функція завантаження прайсу
window.loadPrice = function (lang) {
  const priceContainer = document.querySelector("#priceContainer");
  if (!priceContainer) return;

  const urlUA =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vROD4iOuzSng4WWKDeMCJeIkC90_ca00ol3ZUXyNycZcbvlIR5YjPXwSv7089B_9IgzxtcrZLCw6HYf/pub?gid=0&single=true&output=csv";
  const urlRU =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vROD4iOuzSng4WWKDeMCJeIkC90_ca00ol3ZUXyNycZcbvlIR5YjPXwSv7089B_9IgzxtcrZLCw6HYf/pub?gid=1464136526&single=true&output=csv";

  const sheetCsvUrl = lang === "ru" ? urlRU : urlUA;

  priceContainer.innerHTML = `
    <div style="text-align: center; padding: 30px; font-size: 1.2rem; color: #666;">
      <i class="fa-solid fa-spinner fa-spin" style="margin-right: 10px;"></i> ${translations[lang]["price_loading"]}
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
        priceContainer.innerHTML =
          '<div style="text-align:center; color:red; padding:20px;">Прайс-лист порожній.</div>';
        return;
      }

      function generateTableHtml(items) {
        const headerName = lang === "ru" ? "Наименование работ" : "Найменування робіт";
        const headerUnit = lang === "ru" ? "Единица" : "Одиниця";
        const headerPrice = lang === "ru" ? "Цена" : "Ціна";

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
      priceContainer.innerHTML = '<div style="text-align:center; color:red; padding:30px;">Помилка завантаження.</div>';
    });
};

// ==========================================
// РОЗДІЛ 3: ІНІЦІАЛІЗАЦІЯ (Коли HTML завантажився)
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
  // 3.1. Анімації AOS
  if (typeof AOS !== "undefined") {
    AOS.init({ duration: 1000, once: true });
  }

  // 3.2. Перевірка та застосування мови
  const langModal = document.getElementById("lang-modal");
  let currentLang = localStorage.getItem("amper_lang");

  if (!currentLang) {
    if (langModal) {
      langModal.style.display = "flex";
      document.body.style.overflow = "hidden";
    }
  } else {
    window.applyLanguage(currentLang);
  }

  // 3.3. Відправка форми
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

  // 3.4. Мобільне меню
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

  // 3.5. Акордеон FAQ
  document.querySelectorAll(".faq-item").forEach((item) => {
    item.addEventListener("click", () => {
      item.classList.toggle("active");
    });
  });

  // 3.6. Кнопка "Вгору"
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

  // 3.7. Маска телефону
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
});

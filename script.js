// Файл: script.js
document.addEventListener("DOMContentLoaded", function () {
  // Инициализация анимаций
  if (typeof AOS !== "undefined") {
    AOS.init({ duration: 1000, once: true });
  }

  // Маска телефона (Vanilla JS версія)

  const phoneInput = document.getElementById("phone");

  if (phoneInput) {
    phoneInput.addEventListener("input", function (e) {
      let input = e.target.value.replace(/\D/g, ""); // Видаляємо все, крім цифр

      // Підтримуємо формат, навіть якщо користувач видаляє 38
      if (input.startsWith("38")) {
        input = input.substring(2);
      }

      let formatted = "+38 ";
      if (input.length > 0) {
        formatted += "(" + input.substring(0, 3);
      }
      if (input.length >= 4) {
        formatted += ") " + input.substring(3, 6);
      }
      if (input.length >= 7) {
        formatted += "-" + input.substring(6, 8);
      }
      if (input.length >= 9) {
        formatted += "-" + input.substring(8, 10);
      }

      e.target.value = formatted.substring(0, 19); // Обмежуємо довжину шаблоном
    });

    // Додаткова перевірка: заборона вводу будь-чого, крім цифр
    phoneInput.addEventListener("keypress", function (e) {
      if (!/\d/.test(e.key)) {
        e.preventDefault();
      }
    });
  }
  // Форма
  const form = document.getElementById("landingForm");
  const successMsg = document.getElementById("formSuccess");

  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const formData = new FormData(form);

      try {
        const response = await fetch("handler.php", {
          method: "POST",
          body: formData,
        });

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

  // Мобільне меню

  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");
  const overlay = document.getElementById("overlay"); // если есть оверлей

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      mainNav.classList.toggle("active");
      if (overlay) overlay.classList.toggle("active");

      const icon = menuToggle.querySelector("i");
      icon.classList.toggle("fa-bars");
      icon.classList.toggle("fa-xmark");
    });
  }

  // Закрытие меню при клике на пункт
  document.querySelectorAll(".nav a").forEach((link) => {
    link.addEventListener("click", () => {
      if (mainNav) mainNav.classList.remove("active");
      if (overlay) overlay.classList.remove("active");

      const icon = menuToggle.querySelector("i");
      icon.classList.add("fa-bars");
      icon.classList.remove("fa-xmark");
    });
  });

  // Закрытие меню при клике на оверлей
  if (overlay) {
    overlay.addEventListener("click", () => {
      mainNav.classList.remove("active");
      overlay.classList.remove("active");

      const icon = menuToggle.querySelector("i");
      icon.classList.add("fa-bars");
      icon.classList.remove("fa-xmark");
    });
  }

  // FAQ
  document.querySelectorAll(".faq-item").forEach((item) => {
    item.addEventListener("click", () => {
      item.classList.toggle("active");
    });
  });

  // Кнопка "Вверх"
  const backToTop = document.getElementById("backToTop");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      backToTop.classList.add("show");
    } else {
      backToTop.classList.remove("show");
    }
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // Загрузка прайса из Google Sheets

  const priceTableBody = document.querySelector("#priceTable tbody");

  if (priceTableBody) {
    const sheetCsvUrl =
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vROD4iOuzSng4WWKDeMCJeIkC90_ca00ol3ZUXyNycZcbvlIR5YjPXwSv7089B_9IgzxtcrZLCw6HYf/pub?gid=0&single=true&output=csv";

    fetch(sheetCsvUrl)
      .then((response) => response.text())
      .then((csvText) => {
        // Разбиваем текст на строки
        const rows = csvText.split("\n");
        let html = "";

        // Начинаем с 1, чтобы пропустить заголовок в самой Google таблице (если он есть)
        // Если заголовка в таблице нет, поменяйте i = 1 на i = 0
        for (let i = 1; i < rows.length; i++) {
          if (rows[i].trim() === "") continue; // Пропускаем пустые строки

          const columns = rows[i].split(",");

          // Проверяем, что колонок достаточно
          if (columns.length >= 3) {
            html += `<tr>
                                <td>${columns[0]}</td>
                                <td>${columns[1]}</td>
                                <td>${columns[2]} ₴</td>
                             </tr>`;
          }
        }

        priceTableBody.innerHTML = html;
      })
      .catch((error) => {
        console.error("Помилка завантаження прайсу:", error);
        priceTableBody.innerHTML =
          '<tr><td colspan="3" style="text-align:center; color:red;">Не вдалося завантажити ціни. Спробуйте пізніше.</td></tr>';
      });
  }
});

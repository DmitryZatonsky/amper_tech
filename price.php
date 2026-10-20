<?php
/* Прайс із таблиці на сервері (див. price-lib.php). Адреса на сайті лишається /price.html (rewrite у .htaccess). */
define('PRICE_PAGE', true);
require __DIR__ . '/price-lib.php';
$priceHtml = price_render_html('uk');
header('Content-Type: text/html; charset=utf-8');
header('Cache-Control: no-cache');
?><!doctype html>
<html lang="uk">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <title>Прайс на електромонтажні роботи | Amper Tech</title>
    <meta
      name="description"
      content="Актуальні ціни на електромонтаж у Києві: розведення проводки, підключення щитів, монтаж розеток. Фіксована вартість без прихованих доплат."
    />

    <link rel="alternate" hreflang="uk" href="https://amper-tech.kiev.ua/price.html" />
    <link rel="alternate" hreflang="ru" href="https://amper-tech.kiev.ua/ru/price.html" />
    <link rel="alternate" hreflang="x-default" href="https://amper-tech.kiev.ua/price.html" />
    <link rel="canonical" href="https://amper-tech.kiev.ua/price.html" />

    <meta property="og:type" content="website" />
    <meta property="og:locale" content="uk_UA" />
    <meta property="og:site_name" content="Amper Tech" />
    <meta property="og:title" content="Прайс на електромонтажні роботи | Amper Tech" />
    <meta
      property="og:description"
      content="Актуальні ціни на електромонтаж у Києві: розведення проводки, підключення щитів, монтаж розеток. Фіксована вартість без прихованих доплат."
    />
    <meta property="og:url" content="https://amper-tech.kiev.ua/price.html" />
    <meta property="og:image" content="https://amper-tech.kiev.ua/image/og-image.jpg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Прайс на електромонтажні роботи | Amper Tech" />
    <meta
      name="twitter:description"
      content="Актуальні ціни на електромонтаж у Києві: розведення проводки, підключення щитів, монтаж розеток. Фіксована вартість без прихованих доплат."
    />
    <meta name="twitter:image" content="https://amper-tech.kiev.ua/image/og-image.jpg" />


    <link rel="icon" type="image/png" href="favicon.png" />
    <link rel="apple-touch-icon" href="favicon.png" />
    <link rel="preload" href="/fonts/inter-cyrillic.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="preload" href="/fonts/inter-latin.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="stylesheet" href="style.css?v=20261019b" />

    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-C9MLTVKS8F"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-C9MLTVKS8F');
    </script>
    <script src="analytics.js?v=20261019b" defer></script>
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Головна",
                "item": "https://amper-tech.kiev.ua/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Прайс",
                "item": "https://amper-tech.kiev.ua/price.html"
              }
            ]
          }
        ]
      }
    </script>
  </head>

  <body>
    <section class="section-dark">
      <div class="container container-wrap">
        <header class="header">
          <a href="/"
            ><div class="logo">AMPER<span>TECH</span></div></a
          >

          <nav class="nav" id="mainNav">
            <a href="/">Головна</a>
            <a href="/price.html">Прайс</a>
            <a href="/backup-power.html">Резервне живлення</a>
          </nav>
          <div class="nav-menu-button">
            <div class="lang-switcher">
              <span class="lang-item active">UA</span>
              <span class="lang-divider">|</span>
              <a href="/ru/price.html" class="lang-item">RU</a>
            </div>

            <a href="tel:+380992618747" class="btn btn-outline" aria-label="Зателефонувати">
              <svg class="icon icon-phone" aria-hidden="true"><use href="/image/icons.svg?v=20261019b#phone"></use></svg>
            </a>

            <button class="menu-toggle" id="menuToggle" aria-label="Відкрити меню" aria-expanded="false" aria-controls="mainNav">
              <svg class="icon icon-bars" aria-hidden="true"><use href="/image/icons.svg?v=20261019b#bars"></use></svg>
            </button>
            <div class="overlay" id="overlay"></div>
          </div>
        </header>
      </div>
    </section>

    <section class="section section-light">
      <div class="container">
        <h1 class="section-title">Ціни на електромонтажні роботи в Києві</h1>
        <p style="text-align: center; margin-bottom: 40px">
          Ціни актуальні на сьогодні. Кінцевий кошторис фіксується після огляду об'єкта.
        </p>

        <div id="priceContainer"<?php if ($priceHtml !== '') { echo ' data-server-rendered="1"'; } ?>>
<?php if ($priceHtml !== '') { echo $priceHtml; } else { ?>
          <div style="text-align: center; padding: 30px; font-size: 1.2rem; color: #666">
            <svg class="icon icon-spinner icon-spin" style="margin-right: 10px" aria-hidden="true"><use href="/image/icons.svg?v=20261019b#spinner"></use></svg> Завантаження цін...
          </div>
<?php } ?>
        </div>
      </div>
    </section>

    <section id="cost-short" class="section section-alt">
      <div class="container">
        <div class="cost-box">
          <h2 class="section-title">Від чого залежить вартість</h2>
          <ul class="cost-list">
            <li>Загальна довжина кабелю та кількість точок</li>
            <li>Матеріал стін і спосіб прокладки (штроба, бетон, відкрита)</li>
            <li>Складність щита</li>
          </ul>
          <p class="estimate">Розрахунок кошторису — від 2500 грн. Якщо ми домовилися про роботи, ця сума віднімається від вартості робіт. Вартість робіт за прайсом фіксується на день домовленості.</p>
          <div class="cta-row">
            <a href="#form" class="btn btn-primary">Отримати розрахунок</a>
            <a href="https://t.me/amper_tech" class="btn btn-dark-outline" target="_blank" rel="noopener noreferrer">Надіслати фото чи план у Telegram</a>
          </div>
        </div>
      </div>
    </section>

    <section id="form" class="section section-dark">
      <div class="container">
        <div class="form-wrapper">
          <div class="form-info">
            <h2>Зарядіть свій дім на надійність</h2>
            <p>Отримайте розрахунок кошторису, який не зміниться в процесі робіт.</p>
          </div>
          <form id="landingForm" class="order-form" action="/handler.php" method="POST">
            <div class="input-group">
              <label for="name" class="sr-only">Ваше ім'я</label>
              <input type="text" id="name" name="name" placeholder="Ваше ім'я" required />
            </div>
            <div class="input-group">
              <label for="phone" class="sr-only">Телефон</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="+38 (___) ___-__-__"
                pattern="\+38 \([0-9]{3}\) [0-9]{3}-[0-9]{2}-[0-9]{2}"
                title="Введіть номер у форматі +38 (XXX) XXX-XX-XX"
                required
              />
            </div>
            <div class="input-group hp-field" aria-hidden="true">
              <label for="website">Залиште це поле порожнім</label>
              <input type="text" id="website" name="website" tabindex="-1" autocomplete="off" />
            </div>
            <button type="submit" class="btn btn-primary btn-block">Отримати консультацію</button>
            <p class="form-note">Натискаючи кнопку, ви погоджуєтесь з <a href="/privacy.html">політикою конфіденційності</a></p>
          </form>
          <div id="formSuccess" class="success-msg" style="display: none">
            <svg class="icon icon-circle-check" aria-hidden="true"><use href="/image/icons.svg?v=20261019b#circle-check"></use></svg> Дякуємо! Ми зв'яжемося з вами протягом 10 хвилин.
          </div>
        </div>
      </div>
    </section>

    <footer class="footer">
      <div class="container">
        <div class="footer-top">
          <a href="/"
            ><div class="logo">AMPER<span>TECH</span></div></a
          >
          <div class="footer-socials">
            <a href="https://www.instagram.com/amper_tech.kiev" target="_blank" rel="noopener noreferrer" aria-label="Instagram" title="Instagram"
              ><svg class="icon icon-instagram" aria-hidden="true"><use href="/image/icons.svg?v=20261019b#instagram"></use></svg></a>
            <a href="https://www.tiktok.com/@amper_tech" target="_blank" rel="noopener noreferrer" aria-label="TikTok" title="TikTok"
              ><svg class="icon icon-tiktok" aria-hidden="true"><use href="/image/icons.svg?v=20261019b#tiktok"></use></svg></a>
            <a href="https://t.me/amper_tech" target="_blank" rel="noopener noreferrer" aria-label="Telegram" title="Telegram"><svg class="icon icon-telegram" aria-hidden="true"><use href="/image/icons.svg?v=20261019b#telegram"></use></svg></a>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2026 Amper Tech. Професійний електромонтаж.</p>
          <p><a href="/privacy.html">Політика конфіденційності</a></p>
        </div>
      </div>
    </footer>

    <nav class="mobile-bar" aria-label="Швидкий зв'язок">
      <a href="tel:+380992618747" class="mobile-bar-call"><svg class="icon icon-phone" aria-hidden="true"><use href="/image/icons.svg?v=20261019b#phone"></use></svg> Подзвонити</a>
      <a href="https://t.me/amper_tech" class="mobile-bar-tg" target="_blank" rel="noopener noreferrer"
        ><svg class="icon icon-telegram" aria-hidden="true"><use href="/image/icons.svg?v=20261019b#telegram"></use></svg> Telegram</a
      >
    </nav>

    <div id="backToTop" class="back-to-top" role="button" tabindex="0" aria-label="Нагору">
      <svg class="icon icon-chevron-up" aria-hidden="true"><use href="/image/icons.svg?v=20261019b#chevron-up"></use></svg>
    </div>

    <script src="script.js?v=20261019b"></script>
  </body>
</html>

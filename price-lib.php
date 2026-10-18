<?php
/* Файл: price-lib.php
   Прайс із опублікованої Google-таблиці: серверне завантаження CSV, кеш на 1 годину і розмітка таблиці.
   Підключається з price.php та ru/price.php. Напряму не відкривається. */

if (!defined('PRICE_PAGE')) {
    http_response_code(403);
    exit('Доступ заборонено.');
}

const PRICE_CSV_URLS = [
    'uk' => 'https://docs.google.com/spreadsheets/d/e/2PACX-1vROD4iOuzSng4WWKDeMCJeIkC90_ca00ol3ZUXyNycZcbvlIR5YjPXwSv7089B_9IgzxtcrZLCw6HYf/pub?gid=0&single=true&output=csv',
    'ru' => 'https://docs.google.com/spreadsheets/d/e/2PACX-1vROD4iOuzSng4WWKDeMCJeIkC90_ca00ol3ZUXyNycZcbvlIR5YjPXwSv7089B_9IgzxtcrZLCw6HYf/pub?gid=1464136526&single=true&output=csv',
];
const PRICE_CACHE_TTL = 3600;   // 1 година
const PRICE_RETRY_AFTER = 300;  // якщо Google недоступний, наступна спроба через 5 хвилин

/* Папка кешу поза коренем сайту: <батьківська папка DOCUMENT_ROOT>/cache.
   Якщо туди писати не можна, використовується тимчасова папка системи (теж поза сайтом). */
function price_cache_dir()
{
    $candidates = [];
    if (!empty($_SERVER['DOCUMENT_ROOT'])) {
        $candidates[] = dirname(rtrim($_SERVER['DOCUMENT_ROOT'], '/\\')) . '/cache';
    }
    $candidates[] = rtrim(sys_get_temp_dir(), '/\\') . '/amper-tech-cache';
    foreach ($candidates as $dir) {
        if ((is_dir($dir) || @mkdir($dir, 0700, true)) && is_writable($dir)) {
            return $dir;
        }
    }
    return null;
}

function price_http_get($url)
{
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_MAXREDIRS => 3,
            CURLOPT_CONNECTTIMEOUT => 4,
            CURLOPT_TIMEOUT => 8,
            CURLOPT_USERAGENT => 'AmperTechPrice/1.0',
        ]);
        $body = curl_exec($ch);
        $code = curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
        curl_close($ch);
        return ($body !== false && $code === 200) ? $body : null;
    }
    $ctx = stream_context_create(['http' => [
        'timeout' => 8,
        'follow_location' => 1,
        'max_redirects' => 3,
        'user_agent' => 'AmperTechPrice/1.0',
    ]]);
    $body = @file_get_contents($url, false, $ctx);
    return $body === false ? null : $body;
}

/* Google інколи віддає HTML-сторінку помилки замість CSV */
function price_csv_valid($csv)
{
    $csv = ltrim((string)$csv, "\xEF\xBB\xBF");
    return $csv !== '' && $csv[0] !== '<' && strpos($csv, "\n") !== false && strpos($csv, ',') !== false;
}

/* Повертає CSV або null: свіжий кеш → завантаження → застарілий кеш */
function price_get_csv($lang)
{
    $dir = price_cache_dir();
    $file = $dir ? $dir . '/price-' . $lang . '.csv' : null;

    if ($file && is_file($file) && (time() - (int)@filemtime($file)) < PRICE_CACHE_TTL) {
        $cached = @file_get_contents($file);
        if ($cached !== false && price_csv_valid($cached)) {
            return $cached;
        }
    }

    $fresh = price_http_get(PRICE_CSV_URLS[$lang]);
    if ($fresh !== null && price_csv_valid($fresh)) {
        if ($file) {
            $tmp = $file . '.' . getmypid() . '.tmp';
            if (@file_put_contents($tmp, $fresh, LOCK_EX) !== false) {
                @rename($tmp, $file);
            }
        }
        return $fresh;
    }

    // Google недоступний: віддаємо останній кеш, навіть застарілий
    if ($file && is_file($file)) {
        $stale = @file_get_contents($file);
        if ($stale !== false && price_csv_valid($stale)) {
            @touch($file, time() - PRICE_CACHE_TTL + PRICE_RETRY_AFTER);
            return $stale;
        }
    }
    return null;
}

/* Розбір CSV так само, як у script.js: колонки категорія, підкатегорія, назва, одиниця, ціна;
   ціна округлюється вгору до 10 */
function price_parse($csv)
{
    $csv = ltrim($csv, "\xEF\xBB\xBF");
    $h = fopen('php://temp', 'r+');
    fwrite($h, $csv);
    rewind($h);

    $cats = [];
    $first = true;
    while (($row = fgetcsv($h, 0, ',', '"', '')) !== false) {
        if ($first) {
            $first = false; // рядок заголовків
            continue;
        }
        if (count($row) < 5) {
            continue;
        }
        list($cat, $sub, $name, $unit, $raw) = array_map('trim', array_slice($row, 0, 5));
        if ($cat === '') {
            continue;
        }

        $price = $raw;
        $clean = preg_replace('/\s/u', '', $raw);
        $clean = preg_replace('/,/', '.', $clean, 1);
        $clean = preg_replace('/[^0-9.]/', '', $clean);
        // як parseFloat у JS: береться початкове число, інакше лишається текст із таблиці
        if (preg_match('/^(\d+\.?\d*|\.\d+)/', $clean, $m)) {
            $price = (string)((int)(ceil(((float)$m[1]) / 10) * 10));
        }

        if (!isset($cats[$cat])) {
            $cats[$cat] = ['sub' => [], 'plain' => []];
        }
        $item = ['name' => $name, 'unit' => $unit, 'price' => $price];
        if ($sub !== '') {
            $cats[$cat]['sub'][$sub][] = $item;
        } else {
            $cats[$cat]['plain'][] = $item;
        }
    }
    fclose($h);
    return $cats;
}

function price_e($s)
{
    return htmlspecialchars((string)$s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function price_table($items, $lang)
{
    $hName = $lang === 'ru' ? 'Наименование работ' : 'Найменування робіт';
    $hUnit = $lang === 'ru' ? 'Единица' : 'Одиниця';
    $hPrice = $lang === 'ru' ? 'Цена' : 'Ціна';
    $html = '<div class="table-responsive" style="margin-bottom: 25px;"><table class="price-table"><thead><tr>'
        . '<th>' . $hName . '</th><th style="width: 15%;">' . $hUnit . '</th><th style="width: 20%;">' . $hPrice . '</th>'
        . '</tr></thead><tbody>';
    foreach ($items as $it) {
        $html .= '<tr><td>' . price_e($it['name']) . '</td><td>' . price_e($it['unit']) . '</td><td>' . price_e($it['price']) . ' ₴</td></tr>';
    }
    return $html . '</tbody></table></div>';
}

/* Готовий HTML таблиць або '' (тоді сторінка завантажить прайс скриптом, як раніше) */
function price_render_html($lang)
{
    $csv = price_get_csv($lang);
    if ($csv === null) {
        return '';
    }
    $cats = price_parse($csv);
    if (!$cats) {
        return '';
    }
    $out = '';
    foreach ($cats as $catName => $cat) {
        $out .= '<div class="price-category-group" style="margin-bottom: 60px;">'
            . '<h2 class="category-title" style="font-size: 2rem; color: var(--primary-text); margin-bottom: 30px; border-left: 5px solid var(--primary); padding-left: 15px; font-weight: 800; text-transform: uppercase;">'
            . price_e($catName) . '</h2>';
        if ($cat['plain']) {
            $out .= price_table($cat['plain'], $lang);
        }
        foreach ($cat['sub'] as $subName => $items) {
            $out .= '<div class="price-subcategory-group"><h3 class="subcategory-title">' . price_e($subName) . '</h3>'
                . price_table($items, $lang) . '</div>';
        }
        $out .= '</div>';
    }
    return $out;
}

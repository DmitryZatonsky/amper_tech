<?php
/* Файл: handler.php */

define('APP_ENTRY', true);
$config = require __DIR__ . '/config.php';

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(403);
    echo "Доступ заборонено.";
    exit;
}

// Honeypot: приховане поле форми, яке заповнюють лише боти
if (!empty($_POST['website'])) {
    http_response_code(200);
    echo "Дякуємо! Дані збережено.";
    exit;
}

$name = trim($_POST['name'] ?? '');
$phone = trim($_POST['phone'] ?? '');

if ($name === '' || mb_strlen($name) > 100) {
    http_response_code(400);
    echo "Некоректне ім'я.";
    exit;
}

if (!preg_match('/^\+38 \(\d{3}\) \d{3}-\d{2}-\d{2}$/', $phone)) {
    http_response_code(400);
    echo "Некоректний номер телефону.";
    exit;
}

$name = htmlspecialchars($name);
$phone = htmlspecialchars($phone);
$date = date('d.m.Y H:i:s');

// 1. Запис у файл leads.csv
$file = fopen("leads.csv", "a");
if ($file) {
    fputcsv($file, [$date, $name, $phone]);
    fclose($file);
}

// 2. Відправка в Telegram
$token = $config['telegram_token'];
$chat_id = $config['telegram_chat_id'];

$txt = "⚡️ <b>Нова заявка з сайту Amper Tech!</b>\n\n";
$txt .= "👤 <b>Ім'я:</b> " . $name . "\n";
$txt .= "📞 <b>Телефон:</b> " . $phone . "\n";
$txt .= "🕒 <b>Час:</b> " . $date;

$url = "https://api.telegram.org/bot{$token}/sendMessage?chat_id={$chat_id}&parse_mode=html&text=" . urlencode($txt);

// Виконуємо запит (приховуємо помилки, щоб не ламати сайт, якщо Telegram не відповість)
@file_get_contents($url);

http_response_code(200);
echo "Дякуємо! Дані збережено.";

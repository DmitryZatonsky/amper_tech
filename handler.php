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

// Додаткові поля форми «Резервне живлення» (на загальній формі їх немає, тоді все працює як раніше).
// Приймаємо лише відомі значення зі списків, коментар обрізаємо.
$objectLabels = ['apartment' => 'Квартира', 'house' => 'Приватний будинок', 'other' => 'Інше'];
$needsLabels = [
    'internet' => 'Інтернет і робоче місце',
    'light' => 'Світло і розетки',
    'fridge' => 'Холодильник',
    'boiler' => 'Котел і насоси',
    'other' => 'Інше',
];
$isBackupForm = isset($_POST['object']) || isset($_POST['needs']) || isset($_POST['comment']);

$objectKey = $_POST['object'] ?? '';
$objectText = (is_string($objectKey) && isset($objectLabels[$objectKey])) ? $objectLabels[$objectKey] : '';

$needsPosted = is_array($_POST['needs'] ?? null) ? $_POST['needs'] : [];
$needsList = [];
foreach ($needsLabels as $key => $label) {
    if (in_array($key, $needsPosted, true)) {
        $needsList[] = $label;
    }
}
$needsText = implode(', ', $needsList);

$commentText = is_string($_POST['comment'] ?? null) ? $_POST['comment'] : '';
$commentText = str_replace(["\r\n", "\r"], "\n", $commentText);
$commentText = preg_replace('/[^\P{C}\n]+/u', '', $commentText) ?? '';
$commentText = trim(mb_substr(trim($commentText), 0, 1000));

// CSV: значення, що починаються з = + - @, Excel сприймає як формулу, тому додаємо апостроф
function csv_safe($value)
{
    return preg_match('/^[=+\-@\t\r]/', $value) ? "'" . $value : $value;
}

$name = htmlspecialchars($name);
$phone = htmlspecialchars($phone);
$date = date('d.m.Y H:i:s');

// 1. Запис у файл leads.csv
$file = fopen("leads.csv", "a");
if ($file) {
    $row = [$date, csv_safe($name), $phone];
    if ($isBackupForm) {
        // нові колонки в кінці: об'єкт, що має працювати, коментар
        $row[] = $objectText;
        $row[] = $needsText;
        $row[] = csv_safe($commentText);
    }
    fputcsv($file, $row);
    fclose($file);
}

// 2. Відправка в Telegram
$token = $config['telegram_token'];
$chat_id = $config['telegram_chat_id'];

$txt = "⚡️ <b>Нова заявка з сайту Amper Tech!</b>\n\n";
$txt .= "👤 <b>Ім'я:</b> " . $name . "\n";
$txt .= "📞 <b>Телефон:</b> " . $phone . "\n";
if ($isBackupForm) {
    $txt .= "📄 <b>Форма:</b> Резервне живлення\n";
    if ($objectText !== '') {
        $txt .= "🏠 <b>Об'єкт:</b> " . htmlspecialchars($objectText) . "\n";
    }
    if ($needsText !== '') {
        $txt .= "🔌 <b>Що має працювати:</b> " . htmlspecialchars($needsText) . "\n";
    }
    if ($commentText !== '') {
        $txt .= "💬 <b>Коментар:</b> " . htmlspecialchars($commentText) . "\n";
    }
}
$txt .= "🕒 <b>Час:</b> " . $date;

$url = "https://api.telegram.org/bot{$token}/sendMessage?chat_id={$chat_id}&parse_mode=html&text=" . urlencode($txt);

// Виконуємо запит (приховуємо помилки, щоб не ламати сайт, якщо Telegram не відповість)
@file_get_contents($url);

// 3. Дублювання заявки на пошту. Помилка пошти не впливає ні на Telegram, ні на відповідь користувачу.
function log_mail_error($message)
{
    global $config;
    $logFile = $config['log_file'] ?? (__DIR__ . '/errors.log');
    @file_put_contents($logFile, date('d.m.Y H:i:s') . ' ' . $message . "\n", FILE_APPEND | LOCK_EX);
}

try {
    $to = $config['notify_email'] ?? 'info@amper-tech.kiev.ua';
    $mailSubject = '=?UTF-8?B?' . base64_encode('Нова заявка з сайту Amper Tech') . '?=';
    $mailBody = "Ім'я: " . html_entity_decode($name, ENT_QUOTES, 'UTF-8') . "\r\n"
        . "Телефон: " . html_entity_decode($phone, ENT_QUOTES, 'UTF-8') . "\r\n";
    if ($isBackupForm) {
        $mailBody .= "Форма: Резервне живлення\r\n";
        if ($objectText !== '') {
            $mailBody .= "Об'єкт: " . $objectText . "\r\n";
        }
        if ($needsText !== '') {
            $mailBody .= "Що має працювати: " . $needsText . "\r\n";
        }
        if ($commentText !== '') {
            $mailBody .= "Коментар: " . str_replace("\n", "\r\n", $commentText) . "\r\n";
        }
    }
    $mailBody .= "Час: " . $date . "\r\n";
    $mailHeaders = "MIME-Version: 1.0\r\n"
        . "Content-Type: text/plain; charset=UTF-8\r\n"
        . "From: Amper Tech <info@amper-tech.kiev.ua>\r\n";
    if (!@mail($to, $mailSubject, $mailBody, $mailHeaders)) {
        log_mail_error('mail() повернув false');
    }
} catch (Throwable $e) {
    log_mail_error('mail(): ' . $e->getMessage());
}

http_response_code(200);
echo "Дякуємо! Дані збережено.";

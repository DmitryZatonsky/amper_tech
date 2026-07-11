<!-- <?php
/* Файл: handler.php */
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = htmlspecialchars($_POST['name'] ?? 'Не вказано');
    $phone = htmlspecialchars($_POST['phone'] ?? 'Не вказано');
    $date = date('d.m.Y H:i:s');

    $data = [$date, $name, $phone];

    $file = fopen("leads.csv", "a");
    if ($file) {
        fputcsv($file, $data);
        fclose($file);
        http_response_code(200);
        echo "Дякуємо! Дані збережено.";
    } else {
        http_response_code(500);
        echo "Помилка сервера.";
    }
} else {
    http_response_code(403);
    echo "Доступ заборонено.";
}
?> -->

<?php
/* Файл: handler.php */
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = htmlspecialchars($_POST['name'] ?? 'Не вказано');
    $phone = htmlspecialchars($_POST['phone'] ?? 'Не вказано');
    $date = date('d.m.Y H:i:s');

    // 1. СТАРИЙ МЕХАНІЗМ: Запис у файл leads.csv
    $file = fopen("leads.csv", "a");
    if ($file) {
        fputcsv($file, [$date, $name, $phone]);
        fclose($file);
    }

    // 2. НОВИЙ МЕХАНІЗМ: Відправка в Telegram
    
    // ВСТАВТЕ ВАШІ ДАНІ СЮДИ:
    $token = "8926160016:AAGkgPCzQop_ZyyoayDZjBsjAThto-yzVQw"; 
    $chat_id = "7883821229";

    // Формуємо текст повідомлення
    $txt = "⚡️ <b>Нова заявка з сайту Amper Tech!</b>\n\n";
    $txt .= "👤 <b>Ім'я:</b> " . $name . "\n";
    $txt .= "📞 <b>Телефон:</b> " . $phone . "\n";
    $txt .= "🕒 <b>Час:</b> " . $date;

    // Відправляємо запит до API Telegram
    $url = "https://api.telegram.org/bot{$token}/sendMessage?chat_id={$chat_id}&parse_mode=html&text=" . urlencode($txt);
    
    // Виконуємо запит (приховуємо помилки, щоб не ламати сайт, якщо Telegram не відповість)
    @file_get_contents($url);

    // Віддаємо успішну відповідь сайту, щоб показати зелений текст
    http_response_code(200);
    echo "Дякуємо! Дані збережено.";
} else {
    http_response_code(403);
    echo "Доступ заборонено.";
}
?>
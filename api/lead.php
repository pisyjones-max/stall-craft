<?php
header('Content-Type: application/json');

// Читаем данные из запроса
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    echo json_encode(['success' => false, 'error' => 'No data received']);
    exit;
}

// Куда отправлять (из вашего конфига)
$to = "9252055299@mail.ru, sysoeveg@yandex.ru";
$subject = "Новая заявка с сайта (Калькулятор)";

// Формируем текст письма
$message = "Новая заявка:\n\n";
foreach ($data as $key => $value) {
    if (is_array($value)) {
        $message .= ucfirst($key) . ": " . implode(', ', $value) . "\n";
    } else {
        $message .= ucfirst($key) . ": " . $value . "\n";
    }
}

$headers = "From: no-reply@" . $_SERVER['HTTP_HOST'] . "\r\n";
$headers .= "Reply-To: " . $data['phone'] . "\r\n";
$headers .= "Content-Type: text/plain; charset=utf-8\r\n";

// Отправка
$mailSent = mail($to, $subject, $message, $headers);

echo json_encode(['success' => $mailSent]);
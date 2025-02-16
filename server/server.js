const express = require('express');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

// WebSocket сервер
const wss = new WebSocket.Server({ server });

// Хранение данных экзамена
let examData = {};

wss.on('connection', (ws) => {
    console.log('New client connected');

    // Обработка сообщений от клиента
    ws.on('message', (message) => {
        const data = JSON.parse(message);

        if (data.type === 'send_exam') {
            // Сохраняем вопросы экзамена
            examData = data.payload;
            console.log('Exam data received:', examData);
        } else if (data.type === 'send_answer') {
            // Отправляем ответ на первый сайт
            console.log('Answer received:', data.payload);
            broadcast({ type: 'receive_answer', payload: data.payload });
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Функция для отправки сообщений всем клиентам
function broadcast(message) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
}

// Раздача статических файлов
app.use(express.static(path.join(__dirname, 'public')));
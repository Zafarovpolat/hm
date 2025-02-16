const imbase = 'https://your-server-url'; // Замените на ваш URL
const socket = new WebSocket(imbase.replace(/^http/, 'ws') + '/api');

socket.onopen = () => {
    console.log('WebSocket connection established');

    // Собираем данные экзамена
    const examData = {
        name: document.querySelector(".text-info").parentElement.textContent.trim(),
        questions: [...document.querySelectorAll(".test-table")].map(table => ({
            text: table.querySelector(".test-question").innerHTML.trim(),
            answers: [...table.querySelectorAll(".test-answers li")].map(li => ({
                key: li.querySelector(".test-variant").textContent.trim().toUpperCase(),
                text: li.querySelector("label").textContent.trim()
            }))
        }))
    };

    // Отправляем данные на сервер
    socket.send(JSON.stringify({ type: 'send_exam', payload: examData }));
};

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.type === 'receive_answer') {
        // Отображаем ответ в скрытом окне
        console.log('Answer received:', data.payload);
        alert(`Ответ: ${data.payload}`);
    }
};

socket.onclose = () => {
    console.log('WebSocket connection closed');
};
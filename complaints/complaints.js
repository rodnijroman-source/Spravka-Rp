const BIN_ID = '6aa67b2fac6210605ac779cc';
const API_KEY = '$2a$10$iN0ZYsm5YpfgxXFqTiogteRLfpk4ivedGl1v7SLNZmg43tdIK3iG2';
const STORAGE_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

const form = document.getElementById('complaintForm');
const listContainer = document.getElementById('complaintsList');
const submitBtn = form.querySelector('button');

async function fetchComplaints() {
    try {
        const response = await fetch(`${STORAGE_URL}/latest`, {
            headers: { 'X-Master-Key': API_KEY }
        });
        
        if (!response.ok) {
            listContainer.innerHTML = '<p class="smooth">Жалоб пока нет. Всё чисто!</p>';
            return;
        }
        
        const data = await response.json();
        const complaints = data.record || [];

        listContainer.innerHTML = '';

        if (!Array.isArray(complaints) || complaints.length === 0) {
            listContainer.innerHTML = '<p class="smooth">Жалоб пока нет. Всё чисто!</p>';
            return;
        }

        complaints.forEach(item => {
            const card = document.createElement('div');
            card.className = 'complaint-card';
            card.innerHTML = `
                <div class="complaint-container">
                    <h3>Ник: ${escapeHtml(item.nickname)}</h3>
                    <p><b>Что сделал:</b> ${escapeHtml(item.message)}</p>
                    <span class="complaint-date">${item.date}</span>
                </div>
            `;
            listContainer.appendChild(card);
        });
    } catch (error) {
        listContainer.innerHTML = '<p class="smooth">Ошибка загрузки. Проверьте подключение.</p>';
        console.error(error);
    }
}

async function sendComplaint(nickname, message) {
    try {
        let complaints = [];
        
        const res = await fetch(`${STORAGE_URL}/latest`, {
            headers: { 'X-Master-Key': API_KEY }
        });
        if (res.ok) {
            const data = await res.json();
            complaints = data.record || [];
        }
        
        if (!Array.isArray(complaints)) complaints = [];

        complaints.unshift({
            nickname: nickname,
            message: message,
            date: new Date().toLocaleString('ru-RU', {
                day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
            })
        });

        await fetch(STORAGE_URL, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'X-Master-Key': API_KEY 
            },
            body: JSON.stringify(complaints)
        });

        await fetchComplaints();
    } catch (error) {
        alert('Не удалось отправить жалобу.');
        console.error(error);
    }
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nickname = document.getElementById('nickInput').value.trim();
    const message = document.getElementById('msgInput').value.trim();
    if (!nickname || !message) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправка...';

    await sendComplaint(nickname, message);
    
    submitBtn.disabled = false;
    submitBtn.textContent = 'Отправить жалобу';
    form.reset();
});

function escapeHtml(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

fetchComplaints();
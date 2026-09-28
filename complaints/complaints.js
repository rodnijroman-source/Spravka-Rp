const backendUrl = 'https://backend-little-valley-4700.fly.dev';

const complaintForm = document.getElementById('complaintForm');
const nameInput = document.getElementById('nickInput');
const textInput = document.getElementById('msgInput');

const complaintList = document.getElementById('complaintsList');
const complaintTemplate = document.getElementById('complaint-template');

async function loadCharges() {
    try {
        const responce = await fetch(`${backendUrl}/charges`);

        if (responce.ok) {
            const charges = await responce.json();

            complaintList.innerHTML = '';

            if (charges.length > 0) {
                charges.forEach(charge => {
                    const clone = complaintTemplate.content.cloneNode(true);

                    const chargeId = charge.id ?? charge.Id;

                    clone.querySelector('.complaint-id').textContent = `ID: ${chargeId}`;
                    clone.querySelector('.complaint-name').textContent = charge.name;
                    clone.querySelector('.complaint-text').textContent = charge.text;

                    complaintList.appendChild(clone);
                });
            } else {
                complaintList.innerHTML = '<h3 style="text-align: center; color: #aaa;">Список пуст</h3>';
            }
        }
    } catch(error) {
        console.error('Не удалось загрузить список:', error);
    }
}

loadCharges();

complaintForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const offenderName = nameInput.value;
    const textMessage = textInput.value;

    const newChargeData = {
        name: offenderName,
        text: textMessage,
    }

    try {
        const responce = await fetch(`${backendUrl}/add_charge`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newChargeData)
        });

        if (responce.ok) {
            complaintForm.reset();
        }

        loadCharges();

    } catch(error) {
        console.error('Ошибка сети или бэкенд выключен:', error);
    }
});
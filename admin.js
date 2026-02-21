// Логин и пароль (только ты знаешь)
const ADMIN_LOGIN = 'zxcpopa';
const ADMIN_PASSWORD = 'Ks110609';

// Supabase клиент
const supabaseClient = window.supabase.createClient(
    'https://cborpczfdbtggtmjzmqh.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNib3JwY3pmZGJ0Z2d0bWp6bXFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1MjY3NzQsImV4cCI6MjA4NzEwMjc3NH0.0grEF4FY94xi0V3zYRO19kOFUJiZXy2MXTpjwGxrCvE'
);

// Проверка входа
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('loginError');

    if (username === ADMIN_LOGIN && password === ADMIN_PASSWORD) {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('adminPanel').classList.add('show');
        errorDiv.classList.remove('show');
        localStorage.setItem('adminAuth', 'true');
    } else {
        errorDiv.classList.add('show');
    }
}

// Выход
function logout() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('adminPanel').classList.remove('show');
    localStorage.removeItem('adminAuth');
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}

// Сообщения
function showMessage(text, type) {
    const msg = document.getElementById('message');
    msg.textContent = text;
    msg.className = 'message ' + type;
    setTimeout(() => {
        msg.style.display = 'none';
        msg.className = 'message';
    }, 5000);
}

function clearForm(id) {
    document.getElementById(id).reset();
}

// Загрузка страницы
document.addEventListener('DOMContentLoaded', function() {
    // Проверка авторизации
    if (localStorage.getItem('adminAuth') === 'true') {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('adminPanel').classList.add('show');
    }

    // Вкладки
    const btnNews = document.getElementById('btnNews');
    const btnEvents = document.getElementById('btnEvents');
    const newsTab = document.getElementById('newsTab');
    const eventsTab = document.getElementById('eventsTab');
    
    if (btnNews && btnEvents && newsTab && eventsTab) {
        btnNews.addEventListener('click', function() {
            btnNews.classList.add('active');
            btnEvents.classList.remove('active');
            newsTab.classList.add('active');
            eventsTab.classList.remove('active');
        });
        
        btnEvents.addEventListener('click', function() {
            btnEvents.classList.add('active');
            btnNews.classList.remove('active');
            eventsTab.classList.add('active');
            newsTab.classList.remove('active');
        });
    }

    // Сегодняшняя дата
    const today = new Date().toISOString().split('T')[0];
    const newsDate = document.getElementById('newsDate');
    const eventDate = document.getElementById('eventDate');
    if (newsDate) newsDate.value = today;
    if (eventDate) eventDate.value = today;
});

// Новости
const newsForm = document.getElementById('newsForm');
if (newsForm) {
    newsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button');
        btn.disabled = true;
        btn.textContent = 'Публикация...';

        try {
            const data = {
                title: document.getElementById('newsTitle').value.trim(),
                description: document.getElementById('newsDescription').value.trim(),
                date: document.getElementById('newsDate').value,
                address: document.getElementById('newsAddress').value.trim(),
                link_url: document.getElementById('newsLink').value.trim() || null,
                photo_url: document.getElementById('newsPhoto').value.trim() || null
            };

            if (!data.title || !data.description || !data.date || !data.address) {
                throw new Error('Заполните все поля');
            }

            const { error } = await supabaseClient.from('news').insert([data]);
            if (error) throw error;

            showMessage('Новость опубликована!', 'success');
            clearForm('newsForm');

        } catch (err) {
            console.error('Ошибка:', err);
            showMessage('Ошибка: ' + err.message, 'error');
        } finally {
            btn.disabled = false;
            btn.textContent = 'Опубликовать новость';
        }
    });
}

// Мероприятия
const eventsForm = document.getElementById('eventsForm');
if (eventsForm) {
    eventsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button');
        btn.disabled = true;
        btn.textContent = 'Публикация...';

        try {
            const data = {
                title: document.getElementById('eventTitle').value.trim(),
                date: document.getElementById('eventDate').value,
                time: document.getElementById('eventTime').value,
                location: document.getElementById('eventLocation').value.trim(),
                age_rating: document.getElementById('eventAge').value,
                price: parseInt(document.getElementById('eventPrice').value),
                ticket_url: document.getElementById('eventTicket').value.trim() || null,
                photo_url: document.getElementById('eventPhoto').value.trim() || null
            };

            if (!data.title || !data.date || !data.time || !data.location || !data.age_rating || !data.price) {
                throw new Error('Заполните все поля');
            }

            const { error } = await supabaseClient.from('events').insert([data]);
            if (error) throw error;

            showMessage('Мероприятие опубликовано!', 'success');
            clearForm('eventsForm');

        } catch (err) {
            console.error('Ошибка:', err);
            showMessage('Ошибка: ' + err.message, 'error');
        } finally {
            btn.disabled = false;
            btn.textContent = 'Опубликовать мероприятие';
        }
    });
}
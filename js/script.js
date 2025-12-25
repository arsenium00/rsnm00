"use strict";

function showSection(id) {
    const sections = document.querySelectorAll('.section');
    for (const sec of sections) {
        sec.classList.remove('active');
    }
    document.getElementById(id).classList.add('active');

    const navLinks = document.querySelectorAll('.nav-link[data-section]');
    for (const link of navLinks) {
        link.classList.remove('active');
    }
    const activeLink = document.querySelector(`.nav-link[data-section="${id}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

document.querySelectorAll('.nav-link[data-section]').forEach(function(link) {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const section = this.getAttribute('data-section');
        showSection(section);
    });
});

document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value;
    if (user === 'admin' && pass === '123') {
        document.getElementById('login-section').classList.add('d-none');
        document.getElementById('main-content').classList.remove('d-none');
        loadOrders();
        loadMaterials();
        showSection('home');
    } else {
        alert('Неверный логин или пароль!');
    }
});

document.getElementById('logout-link').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('main-content').classList.add('d-none');
    document.getElementById('login-section').classList.remove('d-none');
    document.getElementById('login-form').reset();
});

document.getElementById('order-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const order = {
        number: document.getElementById('order-number').value,
        client: document.getElementById('client').value,
        service: document.getElementById('service-type').value,
        quantity: document.getElementById('quantity').value,
        date: document.getElementById('perform-date').value,
        brigade: document.getElementById('brigade').value || '-'
    };

    let orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    loadOrders();
    this.reset();
    alert('Заказ успешно зафиксирован!');
});

function loadOrders() {
    const tbody = document.querySelector('#orders-table tbody');
    tbody.innerHTML = '';
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.forEach(function(o) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${o.number}</td>
            <td>${o.client}</td>
            <td>${o.service}</td>
            <td>${o.quantity}</td>
            <td>${o.date}</td>
            <td>${o.brigade}</td>
        `;
        tbody.appendChild(tr);
    });
}

document.getElementById('material-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('material-name').value.trim();
    const qty = parseInt(document.getElementById('material-quantity').value);

    let materials = JSON.parse(localStorage.getItem('materials') || '[]');
    const existing = materials.find(function(m) { return m.name === name; });
    if (existing) {
        existing.quantity = qty;
    } else {
        materials.push({ name: name, quantity: qty });
    }
    localStorage.setItem('materials', JSON.stringify(materials));

    loadMaterials();
    this.reset();
});

function loadMaterials() {
    const tbody = document.querySelector('#materials-table tbody');
    tbody.innerHTML = '';
    const materials = JSON.parse(localStorage.getItem('materials') || '[]');
    materials.forEach(function(m) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${m.name}</td><td>${m.quantity}</td>`;
        tbody.appendChild(tr);
    });
}

document.getElementById('generate-report-btn').addEventListener('click', function() {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    if (orders.length === 0) {
        document.getElementById('report-output').innerHTML = '<p class="text-muted">Нет данных для отчёта.</p>';
        return;
    }

    let html = '<h4>Отчёт по выполненным работам</h4><ul>';
    let total = 0;
    orders.forEach(function(o) {
        html += `<li><strong>${o.number}</strong> — ${o.client}: ${o.service} (${o.quantity} ед.) — ${o.date}</li>`;
        total += parseInt(o.quantity);
    });
    html += `</ul><p><strong>Всего выполнено: ${total} единиц работ</strong></p>`;
    document.getElementById('report-output').innerHTML = html;
});
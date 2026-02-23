/**
 * SIGEW - Control Estudiantil (Versión Simplificada)
 * Proyecto: Análisis y Diseño 1
 */

const DB = {
    estudiantes: [
        { id: 1, nombre: "Eleny Nuñez", orden: 14, grado: "12vo A", salud: "Alérgica al polen", nota: 85 },
        { id: 2, nombre: "Yadelin Donais", orden: 4, grado: "12vo A", salud: "Sana", nota: 90 },
        { id: 3, nombre: "Abdias Cuevas", orden: 3, grado: "12vo A", salud: "Asma leve", nota: 95 }
    ]
};

const App = {
    user: null,
    currentPage: 'dashboard',

    init() {
        this.bindEvents();
        lucide.createIcons();
    },

    bindEvents() {
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.login();
        });

        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigate(item.getAttribute('data-page'));
            });
        });

        document.getElementById('logout-btn').addEventListener('click', () => this.logout());
        document.querySelector('.close-modal').addEventListener('click', () => {
            document.getElementById('modal-container').classList.add('hidden');
        });
    },

    login() {
        const u = document.getElementById('username').value;
        const p = document.getElementById('password').value;
        if (u === 'admin' && p === '123') {
            this.user = { name: "Administrador" };
            document.getElementById('login-overlay').classList.add('hidden');
            document.getElementById('app-container').classList.remove('hidden');
            this.navigate('dashboard');
        } else {
            alert("Acceso Denegado (admin / 123)");
        }
    },

    logout() {
        document.getElementById('login-overlay').classList.remove('hidden');
        document.getElementById('app-container').classList.add('hidden');
    },

    navigate(page) {
        this.currentPage = page;
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.getAttribute('data-page') === page);
        });
        this.render();
        lucide.createIcons();
    },

    render() {
        const container = document.getElementById('page-content');
        switch (this.currentPage) {
            case 'dashboard': container.innerHTML = this.viewDashboard(); break;
            case 'estudiantes': container.innerHTML = this.viewEstudiantes(); break;
            case 'calificaciones': container.innerHTML = this.viewCalificaciones(); break;
            case 'salud': container.innerHTML = this.viewSalud(); break;
        }
    },

    // --- ACCIONES (ALTAS Y BAJAS) ---
    abrirAddEstudiante() {
        const modal = document.getElementById('modal-container');
        document.getElementById('modal-title').innerText = "Registrar Estudiante";
        document.getElementById('modal-body').innerHTML = `
            <form id="add-form">
                <div class="input-group"><label>Nombre</label><input type="text" id="fn-nom" required></div>
                <div class="input-group"><label>Orden</label><input type="number" id="fn-ord" required></div>
                <div class="input-group"><label>Grado</label><input type="text" id="fn-gra" value="12vo A"></div>
                <div class="input-group"><label>Salud</label><input type="text" id="fn-sal" value="Sano"></div>
                <button type="submit" class="btn-primary">Guardar</button>
            </form>
        `;
        modal.classList.remove('hidden');
        document.getElementById('add-form').onsubmit = (e) => {
            e.preventDefault();
            DB.estudiantes.push({
                id: Date.now(),
                nombre: document.getElementById('fn-nom').value,
                orden: document.getElementById('fn-ord').value,
                grado: document.getElementById('fn-gra').value,
                salud: document.getElementById('fn-sal').value,
                nota: 0
            });
            modal.classList.add('hidden');
            this.render();
            lucide.createIcons();
        };
    },

    eliminarEstudiante(id) {
        if (confirm("¿Seguro que desea eliminar este registro?")) {
            const index = DB.estudiantes.findIndex(e => e.id === id);
            if (index > -1) DB.estudiantes.splice(index, 1);
            this.render();
            lucide.createIcons();
        }
    },

    actualizarNota(id, valor) {
        const est = DB.estudiantes.find(e => e.id === id);
        if (est) est.nota = parseInt(valor) || 0;
    },

    // --- VISTAS ---
    viewDashboard() {
        return `
            <h1 class="page-title">Panel de Control Estudiantil</h1>
            <div class="grid grid-cols-4">
                <div class="stat-card glass">
                    <div class="stat-icon" style="background:#6366f122;color:#818cf8"><i data-lucide="users"></i></div>
                    <div class="stat-info"><h3>Total Alumnos</h3><div class="stat-value">${DB.estudiantes.length}</div></div>
                </div>
                <div class="stat-card glass">
                    <div class="stat-icon" style="background:#10b98122;color:#34d399"><i data-lucide="award"></i></div>
                    <div class="stat-info"><h3>Promedio General</h3><div class="stat-value">${(DB.estudiantes.reduce((a, b) => a + b.nota, 0) / DB.estudiantes.length || 0).toFixed(1)}</div></div>
                </div>
            </div>
        `;
    },

    viewEstudiantes() {
        return `
            <div class="section-header">
                <h1 class="page-title">Gestión de Estudiantes</h1>
                <button class="btn-add" onclick="App.abrirAddEstudiante()"><i data-lucide="plus"></i> Nuevo Alumno</button>
            </div>
            <div class="section-card glass">
                <table>
                    <thead><tr><th>Nombre</th><th>Orden</th><th>Grado</th><th>Acción</th></tr></thead>
                    <tbody>
                        ${DB.estudiantes.map(e => `
                            <tr>
                                <td>${e.nombre}</td><td>${e.orden}</td><td>${e.grado}</td>
                                <td><button class="btn-ghost" style="color:#f43f5e" onclick="App.eliminarEstudiante(${e.id})"><i data-lucide="trash-2"></i></button></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    viewCalificaciones() {
        return `
            <h1 class="page-title">Registro de Notas</h1>
            <div class="section-card glass">
                <table>
                    <thead><tr><th>Estudiante</th><th>Nota Final</th><th>Estado</th></tr></thead>
                    <tbody>
                        ${DB.estudiantes.map(e => `
                            <tr>
                                <td>${e.nombre}</td>
                                <td><input type="number" value="${e.nota}" onchange="App.actualizarNota(${e.id}, this.value)" style="width:60px;background:none;border:1px solid #ffffff22;color:white;padding:5px;border-radius:4px"></td>
                                <td><span class="status-pill ${e.nota >= 70 ? 'status-active' : 'status-pending'}">${e.nota >= 70 ? 'Aprobado' : 'Reprobado'}</span></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    viewSalud() {
        return `
            <h1 class="page-title">Historial de Salud</h1>
            <div class="grid grid-cols-2">
                ${DB.estudiantes.map(e => `
                    <div class="section-card glass" style="display:flex;align-items:center;gap:15px">
                        <i data-lucide="heart" style="color:#f43f5e"></i>
                        <div><strong>${e.nombre}</strong><p style="color:#94a3b8;font-size:0.85rem">${e.salud}</p></div>
                        <button class="btn-ghost" style="margin-left:auto" onclick="alert('Funcionalidad de edición de salud')"><i data-lucide="edit"></i></button>
                    </div>
                `).join('')}
            </div>
        `;
    }
};

App.init();
window.App = App;

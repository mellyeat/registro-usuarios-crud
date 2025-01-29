let db;

document.addEventListener('deviceready', function() {
    db = window.sqlitePlugin.openDatabase({name: 'app.db', location: 'default'});
});

function buscarUsuario() {
    const nombre = document.getElementById('searchInput').value;
    const usersContainer = document.getElementById('usersContainer');
    usersContainer.innerHTML = '';

    if (nombre.trim() === '') {
        return; // Do not show any users if the search input is empty
    }

    db.transaction(function(tx) {
        tx.executeSql(`SELECT * FROM usuarios WHERE nombre LIKE ?`, [`%${nombre}%`], function(tx, resultSet) {
            for (let i = 0; i < resultSet.rows.length; i++) {
                const user = resultSet.rows.item(i);
                const userCard = document.createElement('div');
                userCard.className = 'brutalist-card';
                userCard.innerHTML = `
                    <div class="brutalist-card__header">
                        <div class="brutalist-card__icon">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path>
                            </svg>
                        </div>
                        <div class="brutalist-card__alert">User Info</div>
                    </div>
                    <div class="brutalist-card__message">
                        <p><strong>Nombre:</strong> ${user.nombre}</p>
                        <p><strong>Correo Electrónico:</strong> ${user.correo}</p>
                        <p><strong>Dirección:</strong> ${user.direccion}</p>
                        <p><strong>Edad:</strong> ${user.edad}</p>
                        <p><strong>Teléfono:</strong> ${user.telefono}</p>
                        <p><strong>Sexo:</strong> ${user.sexo}</p>
                        <p><strong>Escolaridad:</strong> ${user.escolaridad}</p>
                        <p><strong>Servicios:</strong> ${user.servicios}</p>
                    </div>
                    <div class="brutalist-card__actions">
                        <a class="brutalist-card__button brutalist-card__button--mark" href="#" onclick="editarUsuario(${user.id})">Editar</a>
                    </div>
                    <br>
                `;
                usersContainer.appendChild(userCard);
            }
        }, function(error) {
            console.error('Error al buscar el usuario:', error.message);
        });
    });
}

function editarUsuario(userId) {
    db.transaction(function(tx) {
        tx.executeSql(`SELECT * FROM usuarios WHERE id = ?`, [userId], function(tx, resultSet) {
            const user = resultSet.rows.item(0);
            
            // Create an inline editing form
            const userCard = document.querySelector(`.brutalist-card__actions a[onclick="editarUsuario(${userId})"]`).closest('.brutalist-card');
            userCard.innerHTML = `
                <form id="editForm${userId}">
                    <input type="text" name="nombre" value="${user.nombre}" placeholder="Nombre" required>
                    <input type="email" name="correo" value="${user.correo}" placeholder="Correo Electrónico" required>
                    <input type="text" name="direccion" value="${user.direccion}" placeholder="Dirección">
                    <input type="number" name="edad" value="${user.edad}" placeholder="Edad">
                    <input type="text" name="telefono" value="${user.telefono}" placeholder="Teléfono">
                    <select name="sexo">
                        <option value="Masculino" ${user.sexo === 'Masculino' ? 'selected' : ''}>Masculino</option>
                        <option value="Femenino" ${user.sexo === 'Femenino' ? 'selected' : ''}>Femenino</option>
                        <option value="Otro" ${user.sexo === 'Otro' ? 'selected' : ''}>Otro</option>
                    </select>
                    <select name="escolaridad">
                        <option value="Primaria" ${user.escolaridad === 'Primaria' ? 'selected' : ''}>Primaria</option>
                        <option value="Secundaria" ${user.escolaridad === 'Secundaria' ? 'selected' : ''}>Secundaria</option>
                        <option value="Preparatoria" ${user.escolaridad === 'Preparatoria' ? 'selected' : ''}>Preparatoria</option>
                        <option value="Universidad" ${user.escolaridad === 'Universidad' ? 'selected' : ''}>Universidad</option>
                        <option value="Sin formación previa" ${user.escolaridad === 'Sin formación previa' ? 'selected' : ''}>Sin formación previa</option>
                    </select>
                    <div>
                        <label>
                            <input type="checkbox" name="servicios" value="Casa" ${user.servicios.includes('Casa') ? 'checked' : ''}>
                            Casa
                        </label>
                        <label>
                            <input type="checkbox" name="servicios" value="Baño" ${user.servicios.includes('Baño') ? 'checked' : ''}>
                            Baño
                        </label>
                        <label>
                            <input type="checkbox" name="servicios" value="Cuarto" ${user.servicios.includes('Cuarto') ? 'checked' : ''}>
                            Cuarto
                        </label>
                    </div>
                    <button type="button" onclick="guardarCambios(${userId})">Guardar</button>
                </form>
            `;
        }, function(error) {
            console.error('Error al obtener el usuario:', error.message);
        });
    });
}

function guardarCambios(userId) {
    const form = document.getElementById(`editForm${userId}`);
    const formData = new FormData(form);
    
    const nombre = formData.get('nombre');
    const correo = formData.get('correo');
    const direccion = formData.get('direccion');
    const edad = formData.get('edad');
    const telefono = formData.get('telefono');
    const sexo = formData.get('sexo');
    const escolaridad = formData.get('escolaridad');
    
    // Collect selected services
    const servicios = Array.from(form.querySelectorAll('input[name="servicios"]:checked'))
        .map(cb => cb.value)
        .join(', ');

    db.transaction(function(tx) {
        tx.executeSql(
            `UPDATE usuarios SET nombre = ?, correo = ?, direccion = ?, edad = ?, telefono = ?, sexo = ?, escolaridad = ?, servicios = ? WHERE id = ?`,
            [nombre, correo, direccion, edad, telefono, sexo, escolaridad, servicios, userId],
            function(tx, resultSet) {
                alert('Cambios guardados exitosamente.');
                buscarUsuario(); // Refresh the search results
            },
            function(error) {
                console.error('Error al guardar los cambios:', error.message);
                alert('Error al guardar los cambios.');
            }
        );
    });
}

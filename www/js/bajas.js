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
                        <a class="brutalist-card__button brutalist-card__button--read" href="#" onclick="eliminarUsuario(${user.id})">Eliminar</a>
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

function eliminarUsuario(userId) {
    if (confirm("¿Está seguro de que desea eliminar este usuario?")) {
        db.transaction(function(tx) {
            tx.executeSql(`DELETE FROM usuarios WHERE id = ?`, [userId], function(tx, resultSet) {
                alert('Usuario eliminado.');
                buscarUsuario(); // Refresh the user list after deletion
            }, function(error) {
                console.error('Error al eliminar el usuario:', error.message);
            });
        });
    }
}
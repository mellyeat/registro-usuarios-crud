let db;

document.addEventListener('deviceready', function() {
    db = window.sqlitePlugin.openDatabase({name: 'app.db', location: 'default'});
    
    db.transaction(function(tx) {
        tx.executeSql(`CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT,
            correo TEXT,
            direccion TEXT,
            edad INTEGER,
            telefono INTEGER,
            sexo TEXT,
            escolaridad TEXT,
            servicios TEXT
        )`, [], function(tx, resultSet) {
            console.log('Tabla usuarios creada o ya existe.');
        }, function(error) {
            console.error('Error al crear la tabla usuarios:', error.message);
        });
    });
});

function guardarUsuario() {
    const form = document.getElementById('altaForm');
    const formData = new FormData(form);

    const nombre = formData.get('nombre');
    const correo = formData.get('correo');
    const direccion = formData.get('direccion');
    const edad = formData.get('edad');
    const telefono = formData.get('telefono');
    const sexo = formData.get('sexo');
    const escolaridad = formData.get('escolaridad');
    const servicios = Array.from(form.querySelectorAll('input[name="servicios"]:checked')).map(cb => cb.value).join(', ');

    db.transaction(function(tx) {
        tx.executeSql(`INSERT INTO usuarios (nombre, correo, direccion, edad, telefono, sexo, escolaridad, servicios) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [nombre, correo, direccion, edad, telefono, sexo, escolaridad, servicios],
        function(tx, resultSet) {
            alert('Usuario registrado exitosamente.');
            if (confirm('¿Desea mantenerse en Altas?')) {
                form.reset(); // Reset the form to allow new entries
            } else {
                window.location.href = 'index.html'; // Redirect to the menu
            }
        }, function(error) {
            console.error('Error al registrar el usuario:', error.message);
            alert('Error al registrar el usuario.');
        });
    });
}
document.addEventListener('DOMContentLoaded', function() {
    // Recuperar la info del usuario
    const dataStr = sessionStorage.getItem('infoUsuario');
    if (!dataStr) {
      // Si no hay datos, redirigimos al login o mostramos mensaje
      alert('No hay información de usuario en la sesión.');
      window.location.href = 'Login.html';
      return;
    }
  
    // Convertir a objeto
    const data = JSON.parse(dataStr);
  
    // Asignar valores en la página
    document.getElementById('nombreCliente').textContent = data.usuario.nombre;
    document.getElementById('idCliente').textContent = data.usuario.id;
    document.getElementById('tipoCuenta').textContent = data.usuario.tipoCuenta;
    document.getElementById('saldoCliente').textContent = data.usuario.saldo;
  });
  
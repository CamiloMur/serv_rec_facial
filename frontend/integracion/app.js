document.getElementById('auth-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const fileInput = document.getElementById('imagen');
    const file = fileInput.files[0];
    
    const formData = new FormData();
    formData.append('imagen', file, file.name);
    
    // Llama a tu API Gateway (por ejemplo, en http://localhost:3000/auth)
    fetch('http://localhost:3000/auth', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer mi_token_seguro'
      },
      body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log("Mi data: ",data.data.acceso);
        if (data.data.acceso === "autorizado") {
            // Guardamos la respuesta en sessionStorage (o localStorage)
            sessionStorage.setItem('infoUsuario', JSON.stringify(data));
            // Redirigimos a la página donde se mostrará la info
            window.location.href = '../login/perfil_cliente.html';
        } else {
          // Manejo de error si el usuario no está autorizado
          alert('Error: ' + (data.error || 'No autorizado'));
        }
    })
    .catch(error => console.error('Error:', error));
  });
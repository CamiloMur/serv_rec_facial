const express = require('express');
const app = express();

app.use(express.json());

// Simulamos una pequeña base de datos
const usuarios = {
  cliente456: {
    nombre: "Ana Gómez",
    id: "cliente456",
    tipoCuenta: "Cuenta Corriente",
    saldo: 850000,
    transacciones: ["transferir", "pagar facturas"]
  },
  cliente123: {
    nombre: "Juan Pérez",
    id: "cliente123",
    tipoCuenta: "Cuenta de Ahorros",
    saldo: 1500000,
    transacciones: ["transferir", "consultar saldo", "recargar servicios"]
  }
};

app.post('/autorizar', (req, res) => {
  const { userId } = req.body;

  if (!userId || !usuarios[userId]) {
    return res.status(403).json({ error: 'Usuario no autorizado o no encontrado' });
  }

  const usuario = usuarios[userId];

  res.json({
    acceso: "autorizado",
    usuario: {
      nombre: usuario.nombre,
      id: usuario.id,
      tipoCuenta: usuario.tipoCuenta,
      saldo: usuario.saldo
    },
    transacciones: usuario.transacciones
  });
});

app.listen(5000, () => {
  console.log('✅ Backend bancario corriendo en puerto 5000');
});


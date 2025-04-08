const express = require('express');
const app = express();

app.post('/autorizar', express.json(), (req, res) => {
  const { userId } = req.body;
  if (userId === 'cliente123') {
    res.json({ acceso: 'autorizado', transacciones: ['transferir', 'consultar saldo'] });
  } else {
    res.status(403).json({ acceso: 'denegado' });
  }
});

app.listen(5000, () => console.log('Backend bancario en puerto 5000'));

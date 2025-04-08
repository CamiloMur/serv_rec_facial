module.exports = function validarToken(req, res, next) {
    const token = req.headers['authorization'];
    if (token === 'Bearer mi_token_seguro') {
      next();
    } else {
      res.status(401).json({ error: 'Token inválido' });
    }
  };
  
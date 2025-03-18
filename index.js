// Requerir Express
const express = require('express');
const app = express();

// Configurar el puerto
const PORT = process.env.PORT || 3000;

// Definir una ruta simple
app.get('/', (req, res) => {
  res.send('¡Hola, mundo!');
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

const express = require('express');
const storeRoutes = require('./routes/storeRoutes');
const logger = require('./utils/logger');

const app = express();
const PORT = 3000;

app.use(express.json()); 

app.use('/api', storeRoutes);

app.get('/', (req, res) => {
    res.send('Bem-vindo à API');
});

app.listen(PORT, () => {
    logger.info(`Servidor rodando na porta ${PORT}`);
    console.log(`Servidor rodando na porta ${PORT}`);
});

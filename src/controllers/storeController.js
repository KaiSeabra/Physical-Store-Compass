const storeModel = require('../models/storeModel');
const logger = require('../utils/logger');
const axios = require('axios');

const findNearestStore = async (req, res) => {
    const userZip = req.body.cep;

    try {
        const viaCepResponse = await axios.get(`https://viacep.com.br/ws/${userZip}/json/`);
        const userAddress = viaCepResponse.data;

        if (userAddress.erro) {
            return res.status(400).json({ message: 'CEP inválido ou não encontrado.' });
        }

        storeModel.getStores((err, stores) => {
            if (err) {
                logger.error('Error fetching stores: ' + err);
                return res.status(500).json({ message: 'Internal Server Error' });
            }

            if (stores.length === 0) {
                return res.status(404).json({ message: 'No stores found.' });
            }

            return res.status(200).json(stores);
        });
    } catch (error) {
        logger.error('Error fetching location from CEP: ' + error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { findNearestStore };

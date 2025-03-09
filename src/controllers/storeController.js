const storeModel = require('../models/storeModel');
const distanceService = require('../services/distanceService');
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

        const address = `${userAddress.logradouro}, ${userAddress.bairro}, ${userAddress.localidade}, ${userAddress.uf}`;
        const nominatimResponse = await axios.get(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`);

        const userLocationData = nominatimResponse.data[0];

        if (!userLocationData || !userLocationData.lat || !userLocationData.lon) {
            return res.status(400).json({ message: 'Não foi possível encontrar as coordenadas para o endereço fornecido.' });
        }

        const userLocation = {
            latitude: parseFloat(userLocationData.lat),
            longitude: parseFloat(userLocationData.lon)
        };

        storeModel.getStores((err, stores) => {
            if (err) {
                logger.error('Error fetching stores: ' + err);
                return res.status(500).json({ message: 'Internal Server Error' });
            }

            const nearbyStores = stores.map(store => {
                const distance = distanceService.calculateDistance(userLocation, { latitude: store.latitude, longitude: store.longitude });
                console.log(`Distância de ${store.name} (${store.latitude}, ${store.longitude}) para o usuário: ${distance} km`);
                return { ...store, distance: parseFloat(distance.toFixed(2)) };
            }).filter(store => store.distance <= 100);

            if (nearbyStores.length === 0) {
                return res.status(404).json({ message: 'No stores found within 100km.' });
            }

            nearbyStores.sort((a, b) => a.distance - b.distance);

            return res.status(200).json(nearbyStores);
        });
    } catch (error) {
        logger.error('Error fetching location from CEP: ' + error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { findNearestStore };


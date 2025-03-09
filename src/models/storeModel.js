const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.resolve(__dirname, '../../database/stores.db'));

const createTable = () => {
    db.run(`CREATE TABLE IF NOT EXISTS stores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        address TEXT,
        city TEXT,
        state TEXT,
        zip_code TEXT,
        latitude REAL,
        longitude REAL
    )`, (err) => {
        if (err) {
            console.error('Error ao criar loja: ' + err.message);
        } else {
            console.log('Lojas criadas ou já existem!.');
            insertSampleStores();
        }
    });
};

const insertSampleStores = () => {
    const stores = [
        { name: 'PressaoLogisticas', address: 'Rua Pressao RI', city: 'Rio Branco', state: 'AC', zip_code: '69900-000', latitude: -9.97499, longitude: -67.8243 },
        { name: 'PressaoLogisticas', address: 'Rua Pressao MACE', city: 'Maceió', state: 'AL', zip_code: '57000-000', latitude: -9.66599, longitude: -35.7353 },
        { name: 'PressaoLogisticas', address: 'Rua Pressao MACA', city: 'Macapá', state: 'AP', zip_code: '68900-000', latitude: 0.0381, longitude: -51.0694 },
        { name: 'PressaoLogisticas', address: 'Rua Pressao SA', city: 'Salvador', state: 'BA', zip_code: '40000-000', latitude: -12.9714, longitude: -38.5014 },
        { name: 'PressaoLogisticas', address: 'Rua Pressao FO', city: 'Fortaleza', state: 'CE', zip_code: '60000-000', latitude: -3.71722, longitude: -38.5433 },
        { name: 'PressaoLogisticas', address: 'Rua Pressao BR', city: 'Brasília', state: 'DF', zip_code: '70000-000', latitude: -15.7801, longitude: -47.9292 },
        { name: 'PressaoLogisticas', address: 'Rua Pressao VI', city: 'Vitória', state: 'ES', zip_code: '29000-000', latitude: -20.3155, longitude: -40.3128 },
        { name: 'PressaoLogisticas', address: 'Rua Pressao GO', city: 'Goiânia', state: 'GO', zip_code: '74000-000', latitude: -16.6864, longitude: -49.2643 },
        { name: 'PressaoLogisticas', address: 'Rua Pressao SA', city: 'São Luís', state: 'MA', zip_code: '65000-000', latitude: -2.5299, longitude: -44.3028 },
        { name: 'PressaoLogisticas', address: 'Rua Pressao CU', city: 'Cuiabá', state: 'MT', zip_code: '78000-000', latitude: -15.6010, longitude: -56.0978 },
        { name: 'PressaoLogisticas', address: 'Rua Pressao CA', city: 'Campo Grande', state: 'MS', zip_code: '79000-000', latitude: -20.4422, longitude: -54.6464 },
        { name: 'PressaoLogisticas', address: 'Rua Pressao BE', city: 'Belo Horizonte', state: 'MG', zip_code: '30000-000', latitude: -19.9191, longitude: -43.9384 },
        { name: 'PressaoLogisticas', address: 'Rua Pressao BE', city: 'Belém', state: 'PA', zip_code: '66000-000', latitude: -1.4558, longitude: -48.4902 },
        { name: 'PressaoLogisticas', address: 'Rua Pressao JO', city: 'João Pessoa', state: 'PB', zip_code: '58000-000', latitude: -7.1150, longitude: -34.8641 },
        { name: 'PressaoLogisticas', address: 'Rua Pressao CU', city: 'Curitiba', state: 'PR', zip_code: '80000-000', latitude: -25.4284, longitude: -49.2733 },
        { name: 'PressaoLogisticas', address: 'Rua Pressao RE', city: 'Recife', state: 'PE', zip_code: '50000-000', latitude: -8.063122, longitude: -34.871075 },
        { name: 'PressaoLogisticas', address: 'Rua Pressao TR', city: 'Teresina', state: 'PI', zip_code: '64000-000', latitude: -5.0892, longitude: -42.8016 }
    ];

    stores.forEach(store => {
        db.get(`SELECT * FROM stores WHERE zip_code = ? AND address = ?`, [store.zip_code, store.address], (err, row) => {
            if (err) {
                console.error('Erro ao verificar a existência da loja: ' + err.message);
            } else if (!row) {
                insertStore(store);
            } else {
                console.log(`Loja com o CEP ${store.zip_code} já existe. Não será inserida novamente.`);
            }
        });
    });
};

const findStoreByZipCode = (zip_code) => {
    const query = 'SELECT * FROM stores WHERE zip_code = ?';
    const stmt = db.prepare(query);
    const store = stmt.get(zip_code);
    return store;
};


const insertStore = (store) => {
    const { name, address, city, state, zip_code, latitude, longitude } = store;
    db.run(`INSERT INTO stores (name, address, city, state, zip_code, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?)`, 
        [name, address, city, state, zip_code, latitude, longitude], (err) => {
            if (err) {
                console.error('Error inserting store: ' + err.message);
            }
        });
};

const getStores = (callback) => {
    db.all(`SELECT * FROM stores`, [], (err, rows) => {
        callback(err, rows);
    });
};

createTable();

module.exports = { createTable, insertStore, getStores };
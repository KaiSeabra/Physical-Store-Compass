//Não me pergute como ele faz o calculo, ele só faz!
const calculateDistance = (point1, point2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    
    const R = 6371; 

    const lat1 = toRad(point1.latitude);
    const lon1 = toRad(point1.longitude);
    const lat2 = toRad(point2.latitude);
    const lon2 = toRad(point2.longitude);

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1) * Math.cos(lat2) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
};


module.exports = { calculateDistance };

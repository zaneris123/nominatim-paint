import axios from 'axios';

export default function getPolygonGeoJSON(lat, long, zoom = 10){
    return axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${long}&format=geojson&polygon_geojson=1&zoom=${zoom}`)
        .then(res => {
            return res.data;
        })
}
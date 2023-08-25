import L, { geoJSON, marker } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import getPolygonGeoJSON from '../utils/getGeoJSON';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

export default function MapView (){
    const [currentSelectedJson, setCurrentSelectedJson] = useState(null);
    const [lastClick, setLastClick] = useState(null)
    const [isGettingJson, setIsGettingJson] = useState(false)
    const MapClick = () => {
        const map = useMapEvents({
            click: ({latlng}) =>{
                if(!isGettingJson){
                    setIsGettingJson(true)
                    if(currentSelectedJson){
                        map.removeLayer(currentSelectedJson)
                        map.removeLayer(lastClick)
                    }
                    const currentMarker = marker(latlng)
                    setLastClick(currentMarker)
                    currentMarker.addTo(map)
                    getPolygonGeoJSON(latlng.lat, latlng.lng).then(json => {
                        const currentSelection = geoJSON(json)
                        currentSelection.addTo(map)
                        setCurrentSelectedJson(currentSelection)
                        setIsGettingJson(false)
                    }).catch((err)=>{
                        setIsGettingJson(false)
                    })
                }
            }
        })
        return null
    }
    return(
        <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
            
            <MapClick/>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png"></TileLayer>
        </MapContainer>
    )
}
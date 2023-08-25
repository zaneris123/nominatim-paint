import { geoJSON } from 'leaflet';
import { useState } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import getPolygonGeoJSON from '../utils/getGeoJSON';


export default function MapView (){
    const [currentSelectedJson, setCurrentSelectedJson] = useState(null);
    const [isGettingJson, setIsGettingJson] = useState(false)
    const MapClick = () => {
        const map = useMapEvents({
            click: ({latlng}) =>{
                if(!isGettingJson){
                    setIsGettingJson(true)
                    if(currentSelectedJson){
                        map.removeLayer(currentSelectedJson)
                    }
                    getPolygonGeoJSON(latlng.lat, latlng.lng).then(json => {
                        const currentSelection = geoJSON(json)
                        currentSelection.addTo(map)
                        setCurrentSelectedJson(currentSelection)
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
                url="https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png"
            />
        </MapContainer>
    )
}
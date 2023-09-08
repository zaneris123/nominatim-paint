import { Box, Slider } from '@mui/material';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';
import { GeoJSON, MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import getPolygonGeoJSON, { jsonZoomMarks } from '../utils/getGeoJSON';
import { useSelectionStore } from '../utils/stores';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

export default function MapView (){
    const setCurrentSelectedJson = useSelectionStore((state) => state.setSelection)
    const currentSelectedJson = useSelectionStore((state) => state.selection)
    const [jsonZoom, setJsonZoom] = useState(6)
    const [isGettingJson, setIsGettingJson] = useState(false)
    const [markerPosition, setMarkerPosition] = useState(null)
    const MapClick = () => {
        const map = useMapEvents({
            click: ({latlng}) =>{
                if(!isGettingJson){
                    setIsGettingJson(true)
                    setMarkerPosition([latlng.lat, latlng.lng])
                    getPolygonGeoJSON(latlng.lat, latlng.lng, jsonZoom)
                    .then(json => {
                        setCurrentSelectedJson(json)
                        setIsGettingJson(false)
                    })
                    .catch((err)=>{
                        setIsGettingJson(false)
                    })
                }
            }
        })
        return null
    }
    return(
        <Box position="relative" width="100%" height="95vh">
        <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={true}>
            <MapClick/>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png"></TileLayer>
            {markerPosition && <Marker position={markerPosition} />}
            {currentSelectedJson && <GeoJSON key={Math.random()} data={currentSelectedJson} />}
        </MapContainer>
        <Box position="absolute" bottom="5%" left="0%" width={100} height={300} zIndex={1000}>
                <Slider
                    value={jsonZoom}
                    onChange={(event, newZoom)=> setJsonZoom(newZoom)}
                    min={0}
                    max={18}
                    orientation="vertical"
                    step={1}
                    marks={jsonZoomMarks}
                    valueLabelDisplay="auto"
                />
            </Box>
        </Box>
    )
}
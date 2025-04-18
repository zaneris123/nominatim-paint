import { Box, Slider, Tooltip } from '@mui/material';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';
import { GeoJSON, MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import getPolygonGeoJSON, { jsonZoomMarks } from '../utils/getGeoJSON';
import { useSelectionStore } from '../utils/stores';
import { getGeoJSONStyle } from '../styling/GeoJSONStyling';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

function ValueLabelComponent(props) {
    const { children, value } = props;
    
    return (
        <Tooltip
            open={true}
            enterTouchDelay={0}
            placement="left"
            title={value}
            arrow
        >
            {children}
        </Tooltip>
    );
}

export default function MapView (){
    const setCurrentSelectedJson = useSelectionStore((state) => state.setSelection)
    const currentSelectedJson = useSelectionStore((state) => state.selection)
    const currentColor = useSelectionStore((state) => state.color)
    const currentOutlineColor = useSelectionStore((state) => state.outlineColor)
    const currentOutlineStyle = useSelectionStore((state) => state.outlineStyle)
    const currentFillOpacity = useSelectionStore((state) => state.fillOpacity)
    const groups = useSelectionStore((state) => state.groups)
    const [jsonZoom, setJsonZoom] = useState(6)
    const [isGettingJson, setIsGettingJson] = useState(false)
    const [markerPosition, setMarkerPosition] = useState(null)
    
    const MapClick = () => {
        useMapEvents({
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

    // Style for the current selection using the utility function
    const selectionStyle = getGeoJSONStyle(
        currentColor, 
        currentOutlineColor, 
        currentOutlineStyle, 
        currentFillOpacity
    );

    return(
        <Box position="relative" width="100%" height="95vh">
        <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={true}>
            <MapClick/>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png"></TileLayer>
            {markerPosition && <Marker position={markerPosition} />}
            
            {/* Render all group GeoJSONs first (behind the current selection) */}
            {Object.values(groups).map(group => {
                if (group.features.length === 0) return null;
                const groupData = {
                    type: "FeatureCollection",
                    features: group.features
                };
                const groupStyle = getGeoJSONStyle(
                    group.color, 
                    group.outlineColor || group.color, 
                    group.outlineStyle || 'solid',
                    group.fillOpacity || 0.2
                );
                
                // Add length of features to the key to force re-render when features change
                return (
                    <GeoJSON 
                        key={`group-${group.id}-${group.features.length}`}
                        data={groupData}
                        style={() => groupStyle}
                    />
                );
            })}
            
            {/* Render the current selection on top */}
            {currentSelectedJson && 
                <GeoJSON 
                    key={`selection-${Math.random()}`} 
                    data={currentSelectedJson} 
                    style={selectionStyle} 
                />
            }
        </MapContainer>
        <Box position="absolute" bottom="5%" left="4%" width={100} height={300} zIndex={1000}>
                <Slider
                    value={jsonZoom}
                    onChange={(event, newZoom)=> setJsonZoom(newZoom)}
                    min={0}
                    max={18}
                    orientation="vertical"
                    step={1}
                    components={{
                        ValueLabel: ValueLabelComponent,
                    }}
                    marks={jsonZoomMarks}
                    valueLabelDisplay="auto"
                />
            </Box>
        </Box>
    )
}
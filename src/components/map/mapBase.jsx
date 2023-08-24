import { Paper, Stack } from "@mui/material";
import MapView from "./mapView";

export default function MapBase (){
    return(
        <div>
            <Stack direction="row">
                <MapView/>
                <Paper className="map-controller">
                </Paper>
            </Stack>
        </div>
    )
}
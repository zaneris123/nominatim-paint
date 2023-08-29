import { Accordion, AccordionDetails, AccordionSummary, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import { useState } from "react";
import MapView from "./mapView";

export default function MapBase (){
    const [getJson, setJson] = useState(null)
    return(
        <div>
            <Stack direction="row">
                <MapView setJson={setJson}/>
                <Paper className="map-controller">
                    <Accordion>
                        <AccordionSummary>Selected</AccordionSummary>
                        {getJson ? (<AccordionDetails>
                            <TableContainer>
                                <Table>
                                    <TableBody>
                                        {Object.keys(getJson.features[0].properties).map((property)=>{
                                            return(<TableRow><TableCell>{property}</TableCell><TableCell>{JSON.stringify(getJson.features[0].properties[property])}</TableCell></TableRow>)
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </AccordionDetails>):null}
                    </Accordion>
                </Paper>
            </Stack>
        </div>
    )
}
import { Paper, Stack, Table, TableBody, TableCell, TableContainer, TableRow, Button, Box, Collapse, IconButton } from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useSelectionStore } from "../utils/stores";
import MapView from "./mapView";
import { useState } from "react";

export default function MapBase (){
    const getJson = useSelectionStore((state) => state.selection)
    const [copySuccess, setCopySuccess] = useState('');
    const [open, setOpen] = useState(true);
    
    const handleCopyToClipboard = () => {
        if (getJson) {
            navigator.clipboard.writeText(JSON.stringify(getJson, null, 2))
                .then(() => {
                    setCopySuccess('Copied!');
                    setTimeout(() => setCopySuccess(''), 2000);
                })
                .catch(err => {
                    console.error('Failed to copy: ', err);
                    setCopySuccess('Failed to copy');
                });
        }
    };

    return(
        <div>
            <Stack direction="row">
                <MapView/>
                <Paper className="map-controller" sx={{ width: 300, minWidth: 300 }}>
                    <Box p={2}>
                        <Box display="flex" justifyContent="space-between" width="100%" alignItems="center" mb={1}>
                            <Box display="flex" alignItems="center">
                                <span>Selected</span>
                                <IconButton
                                    aria-label="expand row"
                                    size="small"
                                    onClick={() => setOpen(!open)}
                                >
                                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                </IconButton>
                            </Box>
                            {getJson && (
                                <Button 
                                    variant="outlined" 
                                    size="small" 
                                    startIcon={<ContentCopyIcon />}
                                    onClick={handleCopyToClipboard}
                                >
                                    {copySuccess || "Copy"}
                                </Button>
                            )}
                        </Box>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            {getJson ? (
                                <TableContainer>
                                    <Table>
                                        <TableBody>
                                            {Object.keys(getJson.features[0].properties).map((property)=>{
                                                return(<TableRow key={property}><TableCell>{property}</TableCell><TableCell>{JSON.stringify(getJson.features[0].properties[property])}</TableCell></TableRow>)
                                            })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            ):null}
                        </Collapse>
                    </Box>
                </Paper>
            </Stack>
        </div>
    )
}
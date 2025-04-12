import { 
    Paper, Stack, Table, TableBody, TableCell, TableContainer, TableRow, Button, Box, Collapse, 
    IconButton, Typography, Dialog, DialogTitle, DialogContent, 
    DialogActions, TextField, Tabs, Tab, List, ListItem, ListItemText, ListItemSecondaryAction,
    Divider, Tooltip
} from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useSelectionStore } from "../utils/stores";
import MapView from "./mapView";
import { useState } from "react";
import { GeoJSONStylingControls, getColorPreviewStyle } from "../styling/GeoJSONStyling";

export default function MapBase (){
    const getJson = useSelectionStore((state) => state.selection)
    const color = useSelectionStore((state) => state.color)
    const setColor = useSelectionStore((state) => state.setColor)
    const outlineColor = useSelectionStore((state) => state.outlineColor)
    const setOutlineColor = useSelectionStore((state) => state.setOutlineColor)
    const outlineStyle = useSelectionStore((state) => state.outlineStyle)
    const setOutlineStyle = useSelectionStore((state) => state.setOutlineStyle)
    const setFillOpacity = useSelectionStore((state) => state.setFillOpacity)
    const groups = useSelectionStore((state) => state.groups)
    const activeGroupId = useSelectionStore((state) => state.activeGroupId)
    const createGroup = useSelectionStore((state) => state.createGroup)
    const deleteGroup = useSelectionStore((state) => state.deleteGroup)
    const setActiveGroup = useSelectionStore((state) => state.setActiveGroup)
    const addSelectionToGroup = useSelectionStore((state) => state.addSelectionToGroup)
    const removeFeatureFromGroup = useSelectionStore((state) => state.removeFeatureFromGroup)
    const setGroupColor = useSelectionStore((state) => state.setGroupColor)
    const setGroupOutlineColor = useSelectionStore((state) => state.setGroupOutlineColor)
    const setGroupOutlineStyle = useSelectionStore((state) => state.setGroupOutlineStyle)
    const setGroupFillOpacity = useSelectionStore((state) => state.setGroupFillOpacity)
    const getGroupAsGeoJSON = useSelectionStore((state) => state.getGroupAsGeoJSON)
    
    const [copySuccess, setCopySuccess] = useState('');
    const [open, setOpen] = useState(true);
    const [createGroupDialog, setCreateGroupDialog] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [activeTab, setActiveTab] = useState(0);
    
    const handleCopyToClipboard = () => {
        if (getJson) {
            const jsonString = JSON.stringify(getJson, null, 2);
            
            // Try using the clipboard API first
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(jsonString)
                    .then(() => {
                        setCopySuccess('Copied!');
                        setTimeout(() => setCopySuccess(''), 2000);
                    })
                    .catch(err => {
                        console.error('Clipboard API failed: ', err);
                        // Fall back to textarea method
                        fallbackCopyTextToClipboard(jsonString);
                    });
            } else {
                // Use fallback for browsers without clipboard API
                fallbackCopyTextToClipboard(jsonString);
            }
        }
    };
    
    // Fallback method using textarea element
    const fallbackCopyTextToClipboard = (text) => {
        try {
            // Create temporary element
            const textArea = document.createElement('textarea');
            
            // Set its value and style
            textArea.value = text;
            textArea.style.position = 'fixed';  // Avoid scrolling to bottom
            textArea.style.top = '0';
            textArea.style.left = '0';
            textArea.style.width = '2em';
            textArea.style.height = '2em';
            textArea.style.padding = '0';
            textArea.style.border = 'none';
            textArea.style.outline = 'none';
            textArea.style.boxShadow = 'none';
            textArea.style.background = 'transparent';
            
            // Add to document, select text and copy
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            
            if (successful) {
                setCopySuccess('Copied!');
                setTimeout(() => setCopySuccess(''), 2000);
            } else {
                console.error('Fallback copy method failed');
                setCopySuccess('Failed to copy');
                setTimeout(() => setCopySuccess(''), 2000);
            }
        } catch (err) {
            console.error('Fallback copy method error: ', err);
            setCopySuccess('Failed to copy');
            setTimeout(() => setCopySuccess(''), 2000);
        }
    };

    const handleCopyGroupToClipboard = (groupId) => {
        const groupJson = getGroupAsGeoJSON(groupId);
        if (groupJson) {
            const jsonString = JSON.stringify(groupJson, null, 2);
            
            // Try using the clipboard API first
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(jsonString)
                    .then(() => {
                        setCopySuccess('Group copied!');
                        setTimeout(() => setCopySuccess(''), 2000);
                    })
                    .catch(err => {
                        console.error('Clipboard API failed: ', err);
                        // Fall back to textarea method
                        fallbackCopyTextToClipboard(jsonString);
                    });
            } else {
                // Use fallback for browsers without clipboard API
                fallbackCopyTextToClipboard(jsonString);
            }
        }
    };

    const handleCreateGroupOpen = () => {
        setCreateGroupDialog(true);
    };

    const handleCreateGroupClose = () => {
        setCreateGroupDialog(false);
        setNewGroupName('');
    };

    const handleCreateGroup = () => {
        if (newGroupName.trim()) {
            createGroup(newGroupName.trim());
            handleCreateGroupClose();
        }
    };

    const handleAddToGroup = (groupId) => {
        if (getJson) {
            addSelectionToGroup(groupId);
        }
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    return(
        <div>
            <Stack direction="row">
                <MapView/>
                <Paper className="map-controller" sx={{ width: 300, minWidth: 300 }}>
                    <Box p={2}>
                        <Tabs value={activeTab} onChange={handleTabChange} aria-label="map panel tabs">
                            <Tab label="Selection" />
                            <Tab label="Groups" />
                        </Tabs>
                        
                        {/* Selection Tab */}
                        {activeTab === 0 && (
                            <Box mt={2}>
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
                                        <Box display="flex" flexDirection="column" alignItems="flex-end">
                                            {/* First row - Styling Controls and Copy Button */}
                                            <Box display="flex" mb={0.5} alignItems="center">
                                                <GeoJSONStylingControls
                                                    fillColor={color}
                                                    outlineColor={outlineColor}
                                                    outlineStyle={outlineStyle}
                                                    onFillColorChange={setColor}
                                                    onOutlineColorChange={setOutlineColor}
                                                    onOutlineStyleChange={setOutlineStyle}
                                                    onFillOpacityChange={setFillOpacity}
                                                />
                                                <Button 
                                                    variant="outlined" 
                                                    size="small" 
                                                    startIcon={<ContentCopyIcon sx={{ fontSize: '1rem' }} />}
                                                    onClick={handleCopyToClipboard}
                                                    sx={{ 
                                                        fontSize: '0.7rem', 
                                                        padding: '2px 8px',
                                                        minWidth: '60px',
                                                        height: 28,
                                                        ml: 1
                                                    }}
                                                >
                                                    {copySuccess || "Copy"}
                                                </Button>
                                            </Box>
                                        </Box>
                                    )}
                                </Box>
                                <Collapse in={open} timeout="auto" unmountOnExit>
                                    {getJson ? (
                                        <>
                                            <Box display="flex" justifyContent="flex-end" mb={1}>
                                                {Object.keys(groups).length > 0 && (
                                                    <Button 
                                                        size="small" 
                                                        startIcon={<AddIcon />}
                                                        onClick={() => handleAddToGroup(activeGroupId || Object.keys(groups)[0])}
                                                        disabled={!activeGroupId && Object.keys(groups).length === 0}
                                                    >
                                                        Add to {activeGroupId ? groups[activeGroupId].name : 'group'}
                                                    </Button>
                                                )}
                                            </Box>
                                            <TableContainer>
                                                <Table>
                                                    <TableBody>
                                                        {Object.keys(getJson.features[0].properties).map((property)=>( 
                                                            <TableRow key={property}>
                                                                <TableCell>{property}</TableCell>
                                                                <TableCell>{JSON.stringify(getJson.features[0].properties[property])}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </>
                                    ):null}
                                </Collapse>
                            </Box>
                        )}
                        
                        {/* Groups Tab */}
                        {activeTab === 1 && (
                            <Box mt={2}>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                    <Typography variant="h6">Groups</Typography>
                                    <Button 
                                        size="small" 
                                        startIcon={<AddCircleOutlineIcon />}
                                        onClick={handleCreateGroupOpen}
                                    >
                                        New Group
                                    </Button>
                                </Box>
                                
                                {Object.values(groups).length > 0 ? (
                                    <List>
                                        {Object.values(groups).map((group) => (
                                            <Box key={group.id}>
                                                <ListItem 
                                                    sx={{ 
                                                        bgcolor: activeGroupId === group.id ? 'rgba(0, 0, 0, 0.06)' : 'inherit',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'flex-start',
                                                        py: 1,
                                                        pr: 12  // Add padding to avoid text overlap with controls
                                                    }}
                                                    onClick={() => setActiveGroup(group.id)}
                                                >
                                                    <ListItemText 
                                                        primary={
                                                            <Box display="flex" alignItems="center">
                                                                <Box 
                                                                    width={15} 
                                                                    height={15} 
                                                                    sx={{
                                                                        ...getColorPreviewStyle(group.color),
                                                                        border: group.outlineColor === 'transparent' ? 
                                                                            '1px solid #aaa' : 
                                                                            `2px ${group.outlineStyle === 'dotted' ? 'dotted' : (group.outlineStyle === 'dashed' ? 'dashed' : 'solid')} ${group.outlineColor}`,
                                                                        borderRadius: '50%'
                                                                    }}
                                                                    mr={1}
                                                                />
                                                                {group.name}
                                                            </Box>
                                                        }
                                                        secondary={`${group.features.length} feature${group.features.length !== 1 ? 's' : ''}`} 
                                                        sx={{ mb: 0 }}
                                                    />
                                                    <ListItemSecondaryAction>
                                                        <Box display="flex" flexDirection="column" alignItems="flex-end">
                                                            {/* Group styling controls */}
                                                            <GeoJSONStylingControls
                                                                fillColor={group.color}
                                                                outlineColor={group.outlineColor || group.color}
                                                                outlineStyle={group.outlineStyle || 'solid'}
                                                                onFillColorChange={(color) => setGroupColor(group.id, color)}
                                                                onOutlineColorChange={(color) => setGroupOutlineColor(group.id, color)}
                                                                onOutlineStyleChange={(style) => setGroupOutlineStyle(group.id, style)}
                                                                onFillOpacityChange={(opacity) => setGroupFillOpacity(group.id, opacity)}
                                                                size="small"
                                                            />
                                                            
                                                            {/* Group actions */}
                                                            <Box display="flex" mt={0.5}>
                                                                <Tooltip title="Copy GeoJSON">
                                                                    <IconButton 
                                                                        edge="end" 
                                                                        aria-label="copy group"
                                                                        onClick={() => handleCopyGroupToClipboard(group.id)}
                                                                        size="small"
                                                                        disabled={group.features.length === 0}
                                                                        sx={{ width: 24, height: 24 }}
                                                                    >
                                                                        <ContentCopyIcon sx={{ fontSize: '0.9rem' }} />
                                                                    </IconButton>
                                                                </Tooltip>
                                                                <Tooltip title="Delete group">
                                                                    <IconButton 
                                                                        edge="end" 
                                                                        aria-label="delete"
                                                                        onClick={() => deleteGroup(group.id)}
                                                                        size="small"
                                                                        sx={{ width: 24, height: 24 }}
                                                                    >
                                                                        <DeleteIcon sx={{ fontSize: '0.9rem' }} />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </Box>
                                                        </Box>
                                                    </ListItemSecondaryAction>
                                                </ListItem>
                                                
                                                {activeGroupId === group.id && group.features.length > 0 && (
                                                    <Box ml={2} mr={2} mb={1}>
                                                        <List dense>
                                                            {group.features.map((feature, idx) => (
                                                                <ListItem key={idx}>
                                                                    <ListItemText 
                                                                        primary={feature.properties.display_name?.split(',')[0] || `Feature ${idx + 1}`}
                                                                        secondary={feature.properties.osm_type}
                                                                    />
                                                                    <ListItemSecondaryAction>
                                                                        <IconButton 
                                                                            edge="end" 
                                                                            aria-label="remove feature"
                                                                            onClick={() => removeFeatureFromGroup(group.id, idx)}
                                                                            size="small"
                                                                        >
                                                                            <DeleteIcon fontSize="small" />
                                                                        </IconButton>
                                                                    </ListItemSecondaryAction>
                                                                </ListItem>
                                                            ))}
                                                        </List>
                                                    </Box>
                                                )}
                                                <Divider />
                                            </Box>
                                        ))}
                                    </List>
                                ) : (
                                    <Typography color="textSecondary" align="center">
                                        No groups created yet. Create a group to start adding features.
                                    </Typography>
                                )}
                            </Box>
                        )}
                        
                        {/* Create Group Dialog */}
                        <Dialog open={createGroupDialog} onClose={handleCreateGroupClose}>
                            <DialogTitle>Create New Group</DialogTitle>
                            <DialogContent>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="name"
                                    label="Group Name"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    value={newGroupName}
                                    onChange={(e) => setNewGroupName(e.target.value)}
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCreateGroupClose}>Cancel</Button>
                                <Button onClick={handleCreateGroup} disabled={!newGroupName.trim()}>Create</Button>
                            </DialogActions>
                        </Dialog>
                    </Box>
                </Paper>
            </Stack>
        </div>
    )
}
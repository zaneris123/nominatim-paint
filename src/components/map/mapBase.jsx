import { 
    Paper, Stack, Table, TableBody, TableCell, TableContainer, TableRow, Button, Box, Collapse, 
    IconButton, Popover, Tooltip, Typography, Dialog, DialogTitle, DialogContent, 
    DialogActions, TextField, Tabs, Tab, List, ListItem, ListItemText, ListItemSecondaryAction,
    Divider
} from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useSelectionStore } from "../utils/stores";
import MapView from "./mapView";
import { useState } from "react";

export default function MapBase (){
    const getJson = useSelectionStore((state) => state.selection)
    const color = useSelectionStore((state) => state.color)
    const setColor = useSelectionStore((state) => state.setColor)
    const groups = useSelectionStore((state) => state.groups)
    const activeGroupId = useSelectionStore((state) => state.activeGroupId)
    const createGroup = useSelectionStore((state) => state.createGroup)
    const deleteGroup = useSelectionStore((state) => state.deleteGroup)
    const setActiveGroup = useSelectionStore((state) => state.setActiveGroup)
    const addSelectionToGroup = useSelectionStore((state) => state.addSelectionToGroup)
    const removeFeatureFromGroup = useSelectionStore((state) => state.removeFeatureFromGroup)
    const setGroupColor = useSelectionStore((state) => state.setGroupColor)
    const getGroupAsGeoJSON = useSelectionStore((state) => state.getGroupAsGeoJSON)
    
    const [copySuccess, setCopySuccess] = useState('');
    const [open, setOpen] = useState(true);
    const [colorAnchorEl, setColorAnchorEl] = useState(null);
    const [groupColorAnchorEl, setGroupColorAnchorEl] = useState(null);
    const [colorTarget, setColorTarget] = useState(null);
    const [createGroupDialog, setCreateGroupDialog] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [activeTab, setActiveTab] = useState(0);
    
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

    const handleCopyGroupToClipboard = (groupId) => {
        const groupJson = getGroupAsGeoJSON(groupId);
        if (groupJson) {
            navigator.clipboard.writeText(JSON.stringify(groupJson, null, 2))
                .then(() => {
                    setCopySuccess('Group copied!');
                    setTimeout(() => setCopySuccess(''), 2000);
                })
                .catch(err => {
                    console.error('Failed to copy: ', err);
                    setCopySuccess('Failed to copy');
                });
        }
    };

    const handleColorClick = (event) => {
        setColorTarget('selection');
        setColorAnchorEl(event.currentTarget);
    };

    const handleGroupColorClick = (event, groupId) => {
        setColorTarget(groupId);
        setGroupColorAnchorEl(event.currentTarget);
    };

    const handleColorClose = () => {
        setColorAnchorEl(null);
        setGroupColorAnchorEl(null);
    };

    const handleColorSelect = (selectedColor) => {
        if (colorTarget === 'selection') {
            setColor(selectedColor);
        } else {
            setGroupColor(colorTarget, selectedColor);
        }
        handleColorClose();
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

    const colorOptions = [
        '#3388ff', // Default leaflet blue
        '#ff3333', // Red
        '#33ff33', // Green
        '#ffff33', // Yellow
        '#ff33ff', // Magenta
        '#33ffff', // Cyan
        '#ff8833', // Orange
        '#8833ff'  // Purple
    ];

    const colorOpen = Boolean(colorAnchorEl);
    const groupColorOpen = Boolean(groupColorAnchorEl);
    const colorPopoverId = colorOpen ? 'color-popover' : undefined;
    const groupColorPopoverId = groupColorOpen ? 'group-color-popover' : undefined;

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
                                        <Box display="flex">
                                            <Tooltip title="Change color">
                                                <IconButton
                                                    size="small"
                                                    aria-describedby={colorPopoverId}
                                                    onClick={handleColorClick}
                                                    sx={{ mr: 1 }}
                                                >
                                                    <ColorLensIcon sx={{ color: color }} />
                                                </IconButton>
                                            </Tooltip>
                                            <Button 
                                                variant="outlined" 
                                                size="small" 
                                                startIcon={<ContentCopyIcon />}
                                                onClick={handleCopyToClipboard}
                                            >
                                                {copySuccess || "Copy"}
                                            </Button>
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
                                                        {Object.keys(getJson.features[0].properties).map((property)=>{
                                                            return(<TableRow key={property}><TableCell>{property}</TableCell><TableCell>{JSON.stringify(getJson.features[0].properties[property])}</TableCell></TableRow>)
                                                        })}
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
                                                        cursor: 'pointer'
                                                    }}
                                                    onClick={() => setActiveGroup(group.id)}
                                                >
                                                    <ListItemText 
                                                        primary={
                                                            <Box display="flex" alignItems="center">
                                                                <Box 
                                                                    width={15} 
                                                                    height={15} 
                                                                    bgcolor={group.color} 
                                                                    borderRadius="50%" 
                                                                    mr={1}
                                                                />
                                                                {group.name}
                                                            </Box>
                                                        }
                                                        secondary={`${group.features.length} feature${group.features.length !== 1 ? 's' : ''}`} 
                                                    />
                                                    <ListItemSecondaryAction>
                                                        <Tooltip title="Change color">
                                                            <IconButton 
                                                                edge="end" 
                                                                aria-label="change color"
                                                                onClick={(e) => handleGroupColorClick(e, group.id)}
                                                                size="small"
                                                            >
                                                                <ColorLensIcon sx={{ color: group.color }} />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Copy GeoJSON">
                                                            <IconButton 
                                                                edge="end" 
                                                                aria-label="copy group"
                                                                onClick={() => handleCopyGroupToClipboard(group.id)}
                                                                size="small"
                                                                disabled={group.features.length === 0}
                                                            >
                                                                <ContentCopyIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Delete group">
                                                            <IconButton 
                                                                edge="end" 
                                                                aria-label="delete"
                                                                onClick={() => deleteGroup(group.id)}
                                                                size="small"
                                                            >
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </Tooltip>
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
                        
                        {/* Color Popover for Selection */}
                        <Popover
                            id={colorPopoverId}
                            open={colorOpen}
                            anchorEl={colorAnchorEl}
                            onClose={handleColorClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                        >
                            <Box display="flex" flexWrap="wrap" p={1} width="156px">
                                {colorOptions.map((colorOption) => (
                                    <Box
                                        key={colorOption}
                                        width="36px"
                                        height="36px"
                                        bgcolor={colorOption}
                                        borderRadius="4px"
                                        m="2px"
                                        sx={{ 
                                            cursor: 'pointer',
                                            border: color === colorOption && colorTarget === 'selection' ? '2px solid black' : '2px solid transparent',
                                            '&:hover': { opacity: 0.8 }
                                        }}
                                        onClick={() => handleColorSelect(colorOption)}
                                    />
                                ))}
                            </Box>
                        </Popover>
                        
                        {/* Color Popover for Groups */}
                        <Popover
                            id={groupColorPopoverId}
                            open={groupColorOpen}
                            anchorEl={groupColorAnchorEl}
                            onClose={handleColorClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                        >
                            <Box display="flex" flexWrap="wrap" p={1} width="156px">
                                {colorOptions.map((colorOption) => (
                                    <Box
                                        key={colorOption}
                                        width="36px"
                                        height="36px"
                                        bgcolor={colorOption}
                                        borderRadius="4px"
                                        m="2px"
                                        sx={{ 
                                            cursor: 'pointer',
                                            border: colorTarget && groups[colorTarget]?.color === colorOption ? '2px solid black' : '2px solid transparent',
                                            '&:hover': { opacity: 0.8 }
                                        }}
                                        onClick={() => handleColorSelect(colorOption)}
                                    />
                                ))}
                            </Box>
                        </Popover>
                        
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
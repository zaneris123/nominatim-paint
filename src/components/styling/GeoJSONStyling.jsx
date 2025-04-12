import { 
    Box, IconButton, Tooltip, Menu, MenuItem, Popover
} from "@mui/material";
import ColorLensIcon from '@mui/icons-material/ColorLens';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import BorderStyleIcon from '@mui/icons-material/BorderStyle';
import OpacityIcon from '@mui/icons-material/Opacity';
import { useState } from "react";

// Style options
export const colorOptions = [
    'transparent', // No color option
    '#3388ff', // Default leaflet blue
    '#ff3333', // Red
    '#33ff33', // Green
    '#ffff33', // Yellow
    '#ff33ff', // Magenta
    '#33ffff', // Cyan
    '#ff8833', // Orange
    '#8833ff'  // Purple
];

export const styleOptions = [
    { value: 'solid', label: 'Solid' },
    { value: 'dashed', label: 'Dashed' },
    { value: 'dotted', label: 'Dotted' }
];

export const opacityOptions = [
    { value: 0, label: 'Transparent' },
    { value: 0.1, label: '10%' },
    { value: 0.2, label: '20%' },
    { value: 0.4, label: '40%' },
    { value: 0.6, label: '60%' },
    { value: 0.8, label: '80%' },
    { value: 1, label: '100%' }
];

// Helper to get dash array for different outline styles
export const getDashArray = (style) => {
    switch(style) {
        case 'dotted': return '1 5';
        case 'dashed': return '8 8';
        default: return null; // solid line
    }
};

// Helper to show color preview (including transparency)
export const getColorPreviewStyle = (color) => {
    if (color === 'transparent') {
        return {
            background: 'linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)',
            backgroundSize: '8px 8px',
            backgroundPosition: '0 0, 4px 4px',
            border: '1px solid #aaa'
        };
    }
    return { backgroundColor: color };
};

// GeoJSON styling controls component
export function GeoJSONStylingControls({ 
    fillColor, 
    outlineColor, 
    outlineStyle, 
    onFillColorChange, 
    onOutlineColorChange, 
    onOutlineStyleChange, 
    onFillOpacityChange,
    size = 'medium' // 'small' or 'medium'
}) {
    const [colorAnchorEl, setColorAnchorEl] = useState(null);
    const [outlineColorAnchorEl, setOutlineColorAnchorEl] = useState(null);
    const [styleMenuAnchorEl, setStyleMenuAnchorEl] = useState(null);
    const [opacityMenuAnchorEl, setOpacityMenuAnchorEl] = useState(null);
    
    const buttonSize = size === 'small' ? { width: 24, height: 24 } : { width: 28, height: 28 };
    const iconSize = size === 'small' ? { fontSize: '0.9rem' } : { fontSize: '1rem' };
    
    const handleColorClick = (event) => {
        setColorAnchorEl(event.currentTarget);
    };

    const handleOutlineColorClick = (event) => {
        setOutlineColorAnchorEl(event.currentTarget);
    };

    const handleStyleMenuClick = (event) => {
        setStyleMenuAnchorEl(event.currentTarget);
    };

    const handleOpacityMenuClick = (event) => {
        setOpacityMenuAnchorEl(event.currentTarget);
    };

    const handleColorClose = () => {
        setColorAnchorEl(null);
    };

    const handleOutlineColorClose = () => {
        setOutlineColorAnchorEl(null);
    };

    const handleStyleMenuClose = () => {
        setStyleMenuAnchorEl(null);
    };

    const handleOpacityMenuClose = () => {
        setOpacityMenuAnchorEl(null);
    };

    const colorOpen = Boolean(colorAnchorEl);
    const outlineColorOpen = Boolean(outlineColorAnchorEl);
    const styleMenuOpen = Boolean(styleMenuAnchorEl);
    const opacityMenuOpen = Boolean(opacityMenuAnchorEl);
    
    const colorPopoverId = colorOpen ? 'color-popover' : undefined;
    const outlineColorPopoverId = outlineColorOpen ? 'outline-color-popover' : undefined;
    const styleMenuId = styleMenuOpen ? 'style-menu' : undefined;
    const opacityMenuId = opacityMenuOpen ? 'opacity-menu' : undefined;

    return (
        <>
            {/* First row of styling controls */}
            <Box display="flex" mb={0.5}>
                <Tooltip title="Change fill color">
                    <IconButton
                        size="small"
                        aria-describedby={colorPopoverId}
                        onClick={handleColorClick}
                        sx={{ mr: 0.5, ...buttonSize }}
                    >
                        <ColorLensIcon sx={{ 
                            ...getColorPreviewStyle(fillColor),
                            borderRadius: '50%',
                            ...iconSize
                        }} />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Change fill opacity">
                    <IconButton
                        size="small"
                        aria-describedby={opacityMenuId}
                        onClick={handleOpacityMenuClick}
                        sx={{ mr: 0.5, ...buttonSize }}
                    >
                        <OpacityIcon sx={{ ...iconSize }} />
                    </IconButton>
                </Tooltip>
            </Box>

            {/* Second row of styling controls */}
            <Box display="flex">
                <Tooltip title="Change outline color">
                    <IconButton
                        size="small"
                        aria-describedby={outlineColorPopoverId}
                        onClick={handleOutlineColorClick}
                        sx={{ mr: 0.5, ...buttonSize }}
                    >
                        <BorderColorIcon sx={{ 
                            color: outlineColor === 'transparent' ? 'gray' : outlineColor,
                            ...iconSize
                        }} />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Change outline style">
                    <IconButton
                        size="small"
                        aria-describedby={styleMenuId}
                        onClick={handleStyleMenuClick}
                        sx={{ mr: 0.5, ...buttonSize }}
                    >
                        <BorderStyleIcon sx={{ ...iconSize }} />
                    </IconButton>
                </Tooltip>
            </Box>

            {/* Color Popover */}
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
                            sx={{ 
                                ...getColorPreviewStyle(colorOption),
                                cursor: 'pointer',
                                borderRadius: '4px',
                                margin: '2px',
                                outline: fillColor === colorOption ? '2px solid black' : '2px solid transparent',
                                '&:hover': { opacity: 0.8 }
                            }}
                            onClick={() => {
                                onFillColorChange(colorOption);
                                handleColorClose();
                            }}
                        />
                    ))}
                </Box>
            </Popover>
            
            {/* Outline Color Popover */}
            <Popover
                id={outlineColorPopoverId}
                open={outlineColorOpen}
                anchorEl={outlineColorAnchorEl}
                onClose={handleOutlineColorClose}
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
                            sx={{ 
                                ...getColorPreviewStyle(colorOption),
                                cursor: 'pointer',
                                borderRadius: '4px',
                                margin: '2px',
                                outline: outlineColor === colorOption ? '2px solid black' : '2px solid transparent',
                                '&:hover': { opacity: 0.8 }
                            }}
                            onClick={() => {
                                onOutlineColorChange(colorOption);
                                handleOutlineColorClose();
                            }}
                        />
                    ))}
                </Box>
            </Popover>
            
            {/* Style Menu */}
            <Menu
                id={styleMenuId}
                anchorEl={styleMenuAnchorEl}
                open={styleMenuOpen}
                onClose={handleStyleMenuClose}
            >
                {styleOptions.map((option) => (
                    <MenuItem 
                        key={option.value} 
                        onClick={() => {
                            onOutlineStyleChange(option.value);
                            handleStyleMenuClose();
                        }}
                        selected={outlineStyle === option.value}
                    >
                        <Box display="flex" alignItems="center">
                            <Box 
                                width="40px" 
                                height="2px" 
                                sx={{ 
                                    borderTop: option.value === 'dotted' ? 
                                        '2px dotted black' : (option.value === 'dashed' ? 
                                        '2px dashed black' : '2px solid black'),
                                    mr: 1
                                }} 
                            />
                            {option.label}
                        </Box>
                    </MenuItem>
                ))}
            </Menu>
            
            {/* Opacity Menu */}
            <Menu
                id={opacityMenuId}
                anchorEl={opacityMenuAnchorEl}
                open={opacityMenuOpen}
                onClose={handleOpacityMenuClose}
            >
                {opacityOptions.map((option) => (
                    <MenuItem 
                        key={option.value} 
                        onClick={() => {
                            onFillOpacityChange(option.value);
                            handleOpacityMenuClose();
                        }}
                    >
                        {option.label}
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
}

// Helper to generate GeoJSON style based on styling properties
export const getGeoJSONStyle = (color, outlineColor, outlineStyle, fillOpacity) => {
    return {
        fillColor: color,
        weight: 2,
        opacity: outlineColor === 'transparent' ? 0 : 1,
        color: outlineColor === 'transparent' ? 'transparent' : outlineColor,
        fillOpacity: color === 'transparent' ? 0 : fillOpacity,
        dashArray: getDashArray(outlineStyle)
    };
};
import { 
    Box, Button, Typography, Dialog, DialogTitle, DialogContent, 
    DialogActions, TextField, List, ListItem, ListItemText, ListItemSecondaryAction,
    IconButton, Divider, Tooltip
} from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useState } from "react";
import { getColorPreviewStyle } from "../styling/GeoJSONStyling";

// Helper function to copy group to clipboard with fallback
export const copyGroupToClipboard = (groupJson, callback) => {
    if (!groupJson) {
        callback(false);
        return;
    }
    
    const jsonString = JSON.stringify(groupJson, null, 2);
    
    // Try using the clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(jsonString)
            .then(() => {
                callback(true);
            })
            .catch(err => {
                console.error('Clipboard API failed: ', err);
                // Fall back to textarea method
                fallbackCopyTextToClipboard(jsonString, callback);
            });
    } else {
        // Use fallback for browsers without clipboard API
        fallbackCopyTextToClipboard(jsonString, callback);
    }
};

// Fallback method using textarea element
const fallbackCopyTextToClipboard = (text, callback) => {
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
            callback(true);
        } else {
            console.error('Fallback copy method failed');
            callback(false);
        }
    } catch (err) {
        console.error('Fallback copy method error: ', err);
        callback(false);
    }
};
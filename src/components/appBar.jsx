import { AppBar, Box, Toolbar } from "@mui/material";

export default function PageAppBar(){
    return(
        <Box sx={{flexGrow:1}}>
            <AppBar className="app-bar" position="static">
                <Toolbar></Toolbar>
            </AppBar>
        </Box>
    )
}
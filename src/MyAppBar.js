import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import * as React from "react";
import Paper from "@mui/material/Paper";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";

export default class MyAppBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {isMenuOpen: false}
        this.openMenu = this.openMenu.bind(this);
        this.closeMenu = this.closeMenu.bind(this);

    }
    openMenu() {
        console.info('openMenu called: '+this.state.isMenuOpen)
        this.setState({isMenuOpen:true});
    }
    closeMenu() {
        console.info('openMenu called: '+this.state.isMenuOpen)
        this.setState({isMenuOpen:false});
    }
    render() {
        let menu = null;
        if(this.state.isMenuOpen)
        menu =  <Box sx={{padding: 5}}>
                    <Paper elevation={1} sx={{padding: 5,width:500}}>
                        <MenuList>
                            <MenuItem onClick={this.closeMenu}>Profile</MenuItem>
                            <MenuItem onClick={this.closeMenu}>My account</MenuItem>
                            <MenuItem onClick={this.closeMenu}>Logout</MenuItem>
                        </MenuList>
                    </Paper>
                </Box>;
        else menu = null;

        return(
            <div>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                        >
                        <MenuIcon onClick={this.openMenu}/>
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Lychenlaube
                        </Typography>
                        <Button color="inherit">Login</Button>
                    </Toolbar>
                </AppBar>
            </Box>
            {menu}
            </div>
        )
    }
}
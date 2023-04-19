import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import {Menu} from "@mui/material";
import Calendar from "./calendar/Calendar";
import Paper from "@mui/material/Paper";
import UserForm from "./user/UserForm";
import {API_TEST_ENDPOINT, AUTH_ENDPOINT} from "./constants";
import UserUtil from "./user/UserUtil";

export default class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false,
      anchorEl: null,
      currentPage: null,
      user: this.checkUserAfterReload(),
      testApiFetch: null
    }
    this.openMenu = this.openMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.menuClick = this.menuClick.bind(this);
    this.transformUser = this.transformUser.bind(this);
    this.fetchFromTestApi = this.fetchFromTestApi.bind(this);
  }

  checkUserAfterReload() {

    var idToken = sessionStorage.getItem("user-tok") !== null ? sessionStorage.getItem("user-tok"):null;

    // Get the ID token from the URL search params
    if( idToken === null && window.location.hash !== '') {
      const urlParams = new URLSearchParams(window.location.hash.substring(1));
      idToken = urlParams.get('id_token');
      if(idToken !== '') {
        sessionStorage.setItem('user-tok',idToken);
      }
      window.location.hash = '';
    }
    return (idToken !== null)
  }

  openMenu(event) {
    console.info('openMenu called: ' + this.state.isMenuOpen)
    this.setState({menuOpen: true, anchorEl: event.currentTarget});
  }

  closeMenu() {
    console.info('openMenu called: ' + this.state.isMenuOpen)
    this.setState({menuOpen: false, anchorEl: null});
  }

  menuClick(event) {
    console.warn("target value: " + event.currentTarget.dataset.page)
    this.setState({currentPage: event.currentTarget.dataset.page})
    this.closeMenu()
  }

  transformUser() {
    console.warn(`user: ${this.state.user}`)
    if (this.state.user) {
      sessionStorage.removeItem("user-tok");
      console.info("logging out")
      this.setState({"user":false,"currentPage":null});
    } else {
      console.info("logging in")
      window.location.assign(AUTH_ENDPOINT)
    }
  }

  fetchFromTestApi() {
    const idToken = sessionStorage.getItem("user-tok")
    if(idToken !== null) {
      const headers = { 'authorization': `Bearer ${idToken}` }
      fetch(API_TEST_ENDPOINT, {headers})
        .then( result => result.json())
        .then( data => this.setState({testApiFetch: data}))
    }
  }

  renderPage() {
    switch (this.state.currentPage) {
      case "calendar" :
        return (this.state.user && <Calendar/>)
      case "user":
        return (this.state.user && <UserForm/>)
      case "info":
        return (this.state.user && <Paper> Allgemeine Informationen </Paper>)
      default:

        var userText;
        if (this.state.user === false) {
          userText = <Paper>
            Du bist nicht eingeloggt.
            <Button onClick={this.fetchFromTestApi}> Testbutton </Button>
            <div>{this.state.testApiFetch}</div>
          </Paper>
        } else {
          userText = <Paper>Hallo, {UserUtil.extractUser().email}
            <Button onClick={this.fetchFromTestApi}> Testbutton </Button>
            <div>{this.state.testApiFetch}</div></Paper>
        }
        return userText
    }
  }

  render() {
    return (
      <div>
        <Box sx={{flexGrow: 1}}>
          <AppBar position="static">
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{mr: 2}}
              >
                {this.state.user && <MenuIcon onClick={this.openMenu}/>}
              </IconButton>
              <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                Lychenlaube
              </Typography>
              <Button color="inherit" onClick={this.transformUser}>{(this.state.user) ? "Logout" : "Login"}</Button>
            </Toolbar>
          </AppBar>
        </Box>
        <Menu
          id="basic-menu"
          anchorEl={this.state.anchorEl}
          open={this.state.menuOpen}
          onClose={this.closeMenu}
        >
          <MenuItem data-page="calendar" onClick={this.menuClick}>Kalender</MenuItem>
          <MenuItem data-page="user" onClick={this.menuClick}>Benutzer</MenuItem>
          <MenuItem data-page="info" onClick={this.menuClick}>Information</MenuItem>
        </Menu>
        {this.renderPage()}
      </div>
    )
  }
}
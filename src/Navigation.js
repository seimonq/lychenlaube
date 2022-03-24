import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import CloseIcon from '@mui/icons-material/Close';
import {Dialog, Menu, TextField} from "@mui/material";
import Calendar from "./calendar/Calendar";
import Paper from "@mui/material/Paper";
import UserForm from "./user/UserForm";
import Role from "./user/Role";
import User from "./user/User";

export default class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false,
      anchorEl: null,
      currentPage: null,
      //keep me logged in for testing
      user: null,
      //user: new User("Simon", "simon@kern.de", Role.ADMIN, true, null),
      showLoginForm: false,
      tfUser: null,
      tfPassword: null
    }
    this.openMenu = this.openMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.menuClick = this.menuClick.bind(this);
    this.transformUser = this.transformUser.bind(this);
    this.handleTfUser = this.handleTfUser.bind(this);
    this.handleTfPassword = this.handleTfPassword.bind(this);
    this.checkLogin = this.checkLogin.bind(this);

  }

  isAuthorized(user, leastRole) {
    if (user != null && user.role != null) {
      switch (leastRole) {
        case Role.ADMIN:
          if (user.role === Role.ADMIN) return true
        case Role.FAMILY:
          if (user.role === Role.FAMILY || user.role === Role.FRIEND) return true
        case Role.FRIEND:
          return true
        default:
          return false
      }
    }
    return false
  }

  handleTfUser(e) {
    this.setState({"tfUser" : e.target.value})
  }
  handleTfPassword(e) {
    this.setState({"tfPassword" : e.target.value})
  }


  checkLogin() {
    if (this.state.tfUser != null && this.state.tfPassword != null) {
      this.setState({user: new User("Simon", "simon@kern.de", Role.ADMIN, true, null)})
      console.warn("user: "+this.state.user)
    }
    this.setState({tfUser: null, tfPassword: null, showLoginForm: false})
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
    if (this.state.user) {
      console.warn("user: " + this.state.user)
      this.setState({user: null})
      window.location.reload()
    }
    console.warn("user does not exist: " + this.state.user)
    this.setState({showLoginForm: true})
  }

  renderPage() {
    switch (this.state.currentPage) {
      case "calendar" :
        return (<Calendar/>)
      case "user":
        return (<UserForm/>)
      case "info":
        return (<Paper> Allgemeine Informationen </Paper>)
      default:
        return (this.state.user == null && <Paper> Du bist nicht eingeloggt. </Paper>)
    }
  }

  renderLoginForm() {
    return (
      <Dialog
        fullScreen={true}
        open={true}
      >
        <AppBar sx={{position: 'relative'}}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => {
                this.setState({showLoginForm: false})
              }}
              aria-label="close"
            >
              <CloseIcon/>
            </IconButton>
          </Toolbar>
        </AppBar>

        <TextField name="tfUser"
                   label="Nutzer"
                   variant="outlined"
                   sx={{margin: 2}}
                   value={this.state.tfUser}
                   onChange={(event) => this.handleTfUser(event)}>
        </TextField>
        <TextField name="tfPassword"
                   label="Passwort"
                   type="password"
                   variant="outlined"
                   sx={{margin: 2}}
                   value={this.state.tfPassword}
                   onChange={(event) => this.handleTfPassword(event)}>
        </TextField>
        <Button onClick={this.checkLogin}> Login </Button>
      </Dialog>)
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
                {this.isAuthorized(this.state.user, Role.FRIEND) && <MenuIcon onClick={this.openMenu}/>}
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
        {this.state.showLoginForm && this.renderLoginForm()}
      </div>
    )
  }
}
import * as React from "react";
import Paper from "@mui/material/Paper";
import {TextField} from "@mui/material";
import UserData from "./UserData";
import UserUtil from "./UserUtil";

export default class UserForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: UserUtil.extractUser(),
      userData: new UserData(2,new Map([[2022,10],[2021,11]]))}
  }

  render() {
    return (<Paper elevation={3} variant={"outlined"} sx={{margin:5,width:.4}}>
      <TextField id="user-name" label="name" value={this.state.user.token} variant="outlined"  sx={{margin: 2}} InputProps={{
        readOnly: true,
      }}/>
      <br/>
      <TextField id="user-email" label="e-mail" value={this.state.user.email} variant="outlined"  sx={{margin: 2}} InputProps={{
        readOnly: true,
      }}/>
{/*      <br/>
      <TextField id="user-role" label="role" value={this.state.user.role} variant="outlined" sx={{margin: 2}} InputProps={{
        readOnly: true,
      }}/>
      <br/>*/}
    </Paper>)}
}

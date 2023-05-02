import Paper from "@mui/material/Paper";
import {TabContext, TabList, TabPanel} from "@mui/lab";
import Box from "@mui/material/Box";
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, List, ListItem, Stack, Tab, TextField} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DatePicker from "@mui/lab/DatePicker";
import CalendarUtil from "./CalendarUtil";
import {addDays} from "date-fns";
import Button from "@mui/material/Button";
import * as React from "react";
import Booking from "../booking/Booking";
import CalendarBackendUtil from "../booking/CalendarBackendUtil";
import UserUtil from "../user/UserUtil";

export default class BookingForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      actionTab: "1",
      helperArrival: "",
      bookingName: "",
      arrivalDay: null,
      departureDay: null,
      comment: "",
      selectedDays: [],
      editMode: "list",
      deleteDialogOpen: false,
      deleteItem: null,
    }
    this.onChangeActionTab = this.onChangeActionTab.bind(this);
    this.handleInputComment = this.handleInputComment.bind(this);
    this.renderEditBooking = this.renderEditBooking.bind(this);
    this.editBooking = this.editBooking.bind(this);
    this.backToEditList = this.backToEditList.bind(this);
    this.sendSelection = this.sendSelection.bind(this);
    this.handleDeleteOpen = this.handleDeleteOpen.bind(this);
    this.handleDeleteClose = this.handleDeleteClose.bind(this);
    this.deleteBooking = this.deleteBooking.bind(this);
  }

  onChangeActionTab(index) {
    this.setState({actionTab: index, bookingName: "", arrivalDay: null, departureDay: null, comment: "", editMode: "list"});
    console.warn("actionTab: " + index);
  }

  //the way to go when grabbing some value from another element
  handleInputComment(event) {
    this.setState({comment: event.target.value})
  }

  async sendSelection() {
    if(this.state.arrivalDay == null || this.state.departureDay == null) {
      console.error("at least one field is null - no selection send!!!")
      return null
    }
    console.warn("SEND SELECTION")

    //for now we take user email as user name
    let user = UserUtil.extractUser().email
    //when in editMode, idHash is stored here and it will be an update instead of insert
    let idHash = this.state.editMode !== "list" ? this.state.editMode : ""
    let freshBooking = new Booking(idHash, this.state.arrivalDay, this.state.departureDay, user, this.state.comment)

    //send booking to backend
    console.warn(`fresh booking: ${freshBooking}`)
    let bookings = await CalendarBackendUtil.upsertBooking(freshBooking);
    //.then(
    this.props.bookingManager.replaceAllBookings(bookings)
    this.props.refreshParentState()

    this.setState({
      arrivalDay: null, departureDay: null, bookingName: "", comment: "", editMode: "list"
    })
  }

  /** EDIT SECTION *******************************/

  backToEditList(id) {
    this.props.bookingManager.getBookingById(id).show()
    this.setState({editMode: "list"})
  }

  editBooking(booking) {
    console.warn("edit booking gets called with id:" + booking.idHash)
    this.setState({editMode: booking.idHash, arrivalDay: booking.begin, departureDay: booking.end, bookingName: booking.name, comment: booking.comment});

    //set booking as hidden, used in date selector to prevent that booking to edit is not blocked by existing booking
    let selectedBooking = this.props.bookingManager.bookings.find((b) => b.idHash === booking.idHash);
    selectedBooking.hide()
    this.props.refreshParentState()

  }

  renderEditBooking() {
    console.warn("edit mode: " + this.state.editMode)
    if (this.state.editMode === "list") {
      return (<Box>
        Welche Reise willst du bearbeiten?
        <List>
          {this.props.bookingManager.bookings.map((item) =>
            <ListItem>
              <Button onClick={() => this.editBooking(item)}>
                {item.name} [{item.begin.getDate()}.{item.begin.getMonth() + 1}-{item.end.getDate()}.{item.end.getMonth() + 1}]
              </Button>
            </ListItem>
          )}
        </List>
      </Box>);
    }

    let selectedBooking = this.props.bookingManager.bookings.find((b) => b.idHash === this.state.editMode);

    //safety net due to the async nature of sendSelection where editMode is reset to list .. that might happen after rendering this here
    if(selectedBooking === null || selectedBooking === undefined)
      return (<Box> Editing most likly done. Please refresh.</Box>)

    return (
      <Box>
        {this.renderForm()}
        <Button variant="outlined"
                sx={{fontSize: 20}}
                onClick={() => this.backToEditList(selectedBooking.idHash)}>Cncl</Button>
      </Box>
    )
  }

  /** DELETE SECTION *******************************/
  handleDeleteOpen(item) {
    this.setState({deleteDialogOpen: true, deleteItem: item})
  }

  handleDeleteClose() {
    this.setState({deleteDialogOpen: false, deleteItem: null})
  }

  async deleteBooking(idHash) {
    //this.props.bookingManager.removeBookingById(id)
    let bookings = await CalendarBackendUtil.deleteBooking(idHash)
    this.props.bookingManager.replaceAllBookings(bookings)
    this.handleDeleteClose()
    this.props.refreshParentState()
  }

  renderDeleteBooking() {
    return (<Box>
        Welche Reise willst du bearbeiten?
        <List>
          {this.props.bookingManager.bookings.map((item) =>
            <ListItem>
              <Button onClick={() => this.handleDeleteOpen(item)}>
                {item.name} [{item.begin.getDate()}.{item.begin.getMonth() + 1}-{item.end.getDate()}.{item.end.getMonth() + 1}]
              </Button>
            </ListItem>
          )}
        </List>
        {this.renderDeleteDialog()}
      </Box>
    );
  }

  renderDeleteDialog() {
    let dialogText = ""
    let idHash = ""
    if (this.state.deleteItem != null) {
      let item = this.state.deleteItem
      dialogText = (<Box>{item.name}'s Reise von
        &nbsp;{item.begin.getDate()}.{item.begin.getMonth() + 1}-
        {item.end.getDate()}.{item.end.getMonth() + 1} wirklich löschen?</Box>)
      idHash = item.idHash
    }
    return (
      <Dialog
        open={this.state.deleteDialogOpen}
        onClose={this.handleDeleteClose}
      >
        <DialogTitle>
          Reise Löschen
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {dialogText}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.deleteBooking(idHash)}>Ja.</Button>
          <Button onClick={this.handleDeleteClose} autoFocus>
            Nein.
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  /** RENDER MAIN SECTION *************************/
  renderForm() {
    return (
      <Box>
        <Stack direction="row" spacing={3} sx={{marginTop: 1}}>
{/*          <TextField id="outlined-basic"
                     value= {this.state.bookingName}
                     label="Buchungsname"
                     variant="outlined"
                     onChange={(event) => this.handleInputBookingName(event)}/>*/}
          <DatePicker label="Anreise"
                      renderInput={(params) => <TextField {...params} helperText={this.state.helperArrival}/>}
                      value={this.state.arrivalDay}
                      minDate={new Date(new Date().getFullYear(), 0, 1)}
                      maxDate={new Date(new Date().getFullYear(), 11, 31)}
                      onChange={(value) => {
                        this.setState({arrivalDay: value, departureDay: null})
                      }}
                      renderDay={(day, _value, DayComponentProps) =>
                        CalendarUtil.renderDay(day, DayComponentProps, this.props.bookingManager.getVisibleBookings(), this.state.arrivalDay, this.state.departureDay)}
          />
          <DatePicker label="Abreise"
                      renderInput={(params) => <TextField {...params} />}
                      value={this.state.departureDay}
                      minDate={addDays(this.state.arrivalDay, 1)}
                      maxDate={this.props.bookingManager.getMaxDepartureDate(this.state.arrivalDay)}
                      onChange={(value) => {
                        this.setState({departureDay: value})
                      }}
                      renderDay={(day, _value, DayComponentProps) =>
                        CalendarUtil.renderDay(day, DayComponentProps, this.props.bookingManager.getVisibleBookings(), this.state.arrivalDay, this.state.departureDay)}
          />
          <TextField id="outlined-basic"
                     value={this.state.comment}
                     label="Kommentar"
                     variant="outlined"
                     sx={{marginTop: 2, height: 45}}
                     onChange={(event) => this.handleInputComment(event)}/>
          <Button variant="outlined"
                  sx={{fontSize: 20}}
                  onClick={this.sendSelection}>Mach Fertig.</Button>
        </Stack>
      </Box>
    )
  }

  render() {
    return (
      <Paper elevation={1} sx={{padding: 5, opacity: .95}}>
        <TabContext value={this.state.actionTab}>
          <Box sx={{borderBottom: 1, borderColor: 'divider', width: 1}}>
            <TabList variant="fullWidth"
                     onChange={(event, value) => this.onChangeActionTab(value)}>
              <Tab icon={<AddIcon/>} value="1"/>
              <Tab icon={<EditIcon/>} value="2"/>
              <Tab icon={<DeleteForeverIcon/>} value="3"/>
            </TabList>
          </Box>
          <TabPanel value="1">
            Willst Du eine Reise buchen?
            {this.renderForm()}
          </TabPanel>
          <TabPanel value="2">
            {this.renderEditBooking()}
          </TabPanel>
          <TabPanel value="3">
            Reise löschen?
            {this.renderDeleteBooking()}
          </TabPanel>
        </TabContext>
      </Paper>);
  }
}
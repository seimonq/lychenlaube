import Paper from "@mui/material/Paper";
import {TabContext, TabList, TabPanel} from "@mui/lab";
import Box from "@mui/material/Box";
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, List, ListItem, ListItemText, Stack, Tab, TextField} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DatePicker from "@mui/lab/DatePicker";
import CalendarUtil from "./CalendarUtil";
import {addDays, isAfter, isSameDay} from "date-fns";
import Button from "@mui/material/Button";
import * as React from "react";
import Booking from "./Booking";

export default class BookingForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      actionTab: "1",
      helperArrival: "",
      bookingName: null,
      arrivalDay: null,
      departureDay: null,
      comment: null,
      selectedDays: [],
      editMode: "list",
      deleteDialogOpen: false,
      deleteItem: null
    }
    this.onChangeActionTab = this.onChangeActionTab.bind(this);
    this.handleInputBookingName = this.handleInputBookingName.bind(this);
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
    this.setState({actionTab: index, bookingName: null, arrivalDay: null, departureDay: null, comment: null, editMode: "list"});
    console.warn("actionTab: " + index);
  }

  //the way to go when grabbing some value from another element
  handleInputBookingName(event) {
    console.warn("HANDLE BOOKING NAME")
    this.setState({bookingName: event.target.value})
  }

  handleInputComment(event) {
    this.setState({comment: event.target.value})
  }

  sendSelection() {
    if(this.state.arrivalDay == null || this.state.departureDay == null || this.state.bookingName == null) {
      console.error("at least one field is null - no selection send!!!")
      return null
    }
    console.warn("SEND SELECTION")
    let freshBooking = new Booking("testname", this.state.arrivalDay, this.state.departureDay, this.state.bookingName, this.state.comment)
    this.props.bookingManager.addBooking(freshBooking)
    this.props.bookingManager.removeHiddenBookings()
    this.props.refreshParentState()

    this.setState({
      arrivalDay: null, departureDay: null, bookingName: "", comment: "", editMode: "list"
    })
  }

  /** EDIT SECTION *******************************/
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

    let selectedBooking = this.props.bookingManager.bookings.find((b) => b.id === this.state.editMode);
    selectedBooking.hide()
    return (
      <Box>
        {this.renderForm(selectedBooking.name, selectedBooking.begin, selectedBooking.end, selectedBooking.comment)}
        <Button variant="outlined"
                sx={{fontSize: 20}}
                onClick={() => this.backToEditList(selectedBooking.id)}>Cncl</Button>
      </Box>
    )
  }

  backToEditList(id) {
    this.props.bookingManager.getBookingById(id).show()
    this.setState({editMode: "list"})
  }

  editBooking(booking) {
    console.warn("edit booking gets called with id:" + booking.id)
    //this.props.bookedDays.rem
    this.setState({editMode: booking.id, arrivalDay: booking.begin, departureDay: booking.end, bookingName: booking.name, comment: booking.comment});
  }

  /** DELETE SECTION *******************************/
  handleDeleteOpen(item) {
    this.setState({deleteDialogOpen: true, deleteItem: item})
  }

  handleDeleteClose() {
    this.setState({deleteDialogOpen: false, deleteItem: null})
  }

  deleteBooking(id) {
    this.props.bookingManager.removeBookingById(id)
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
    let itemId = ""
    if (this.state.deleteItem != null) {
      let item = this.state.deleteItem
      dialogText = (<Box>{item.name}'s Reise von
        &nbsp;{item.begin.getDate()}.{item.begin.getMonth() + 1}-
        {item.end.getDate()}.{item.end.getMonth() + 1} wirklich löschen?</Box>)
      itemId = item.id
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
          <Button onClick={() => this.deleteBooking(itemId)}>Ja.</Button>
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
          <TextField id="outlined-basic"
                     value={this.state.bookingName}
                     label="Buchungsname"
                     variant="outlined"
                     onChange={(event) => this.handleInputBookingName(event)}/>
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
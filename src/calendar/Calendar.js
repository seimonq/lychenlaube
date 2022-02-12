import './Calendar.css';
import * as React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import {Grid, List, ListItem, ListItemText, Tab, Tabs, TextField} from "@mui/material";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import {PickersDay, StaticDatePicker, TabContext, TabList, TabPanel} from "@mui/lab";
import {de} from "date-fns/locale";
import {subDays, addDays, isSameDay, isAfter, isBefore} from "date-fns";
import Booking from "./Booking.js";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';


export default class Calendar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      actionTab: "1",
      bookingName: null,
      month: "march",
      selectedDays: [],
      bookedDays: [new Booking(new Date(2022, 1, 3), new Date(2022, 1, 6), "Peter", "lol"),
        new Booking(new Date(2022, 1, 17), new Date(2022, 1, 21), "Udo", "lol2")],
      arrivalDay: null,
      helperArrival: "",
      departureDay: null,
      comment: null
    };
    this.convertSelected2Booked = this.convertSelected2Booked.bind(this);
    this.handleInputBookingName = this.handleInputBookingName.bind(this);
    this.handleInputComment = this.handleInputComment.bind(this);
    this.renderBookings = this.renderBookings.bind(this);
    this.onChangeActionTab = this.onChangeActionTab.bind(this);
  }

  convertSelected2Booked() {
    let freshBooking = new Booking(this.state.arrivalDay, this.state.departureDay, this.state.bookingName, this.state.comment)
    this.setState({
      arrivalDay: null, departureDay: null, bookingName: null, comment: null,
      bookedDays: [...this.state.bookedDays, freshBooking]
    })
  }

  //the way to go when grabbing some value from another element
  handleInputBookingName(event) {
    this.setState({bookingName: event.target.value})
  }

  handleInputComment(event) {
    this.setState({comment: event.target.value})
  }

  onChangeActionTab(index) {
    this.setState({actionTab: index});
    console.warn("actionTab: " + index);
  }

  getMaxDepartureDate() {
    let maxDate = this.state.bookedDays.map(({begin}) => {
      return begin
    }).find((item) => isAfter(item, this.state.arrivalDay) || isSameDay(item, this.state.arrivalDay))
    console.warn("maxDate: " + maxDate)
    if (typeof maxDate !== 'undefined')
      return maxDate
    return new Date(new Date().getFullYear(), 11, 31);
  }

  getTitle(day) {
    return this.state.bookedDays.find((item) => item.containsDay(day)).name
  }



  renderStaticDatePicker(month) {
    return (
      <StaticDatePicker
        showToolbar={false}
        value={null}
        defaultCalendarMonth={new Date(2022, month, 1)}
        views={['day']}
        componentsProps={{
          leftArrowButton: {"style": {"visibility": "hidden"}},
          rightArrowButton: {"style": {"visibility": "hidden"}},
          switchViewButton: {"style": {"visibility": "hidden"}}
        }}
        renderDay={(day, _value, DayComponentProps) =>
          this.renderBookings(day, _value, DayComponentProps)}
      />
    )
  }

  //*************************************************************************************RENDER
  render() {
    return (
      <Box sx={{padding: 5}}>
        <LocalizationProvider dateAdapter={AdapterDateFns} locale={de}>
          <Grid container spacing={2}>
            <Grid item sx={5}>
              <Paper elevation={1} sx={{padding: 5, width: 400, opacity: .85}}>
                <TabContext value={this.state.actionTab} >
                  <Box sx={{borderBottom: 1, borderColor: 'divider' }}>
                    <TabList variant="fullWidth"
                             onChange={(event, value) => this.onChangeActionTab(value)}>
                      <Tab icon={<AddIcon />} value="1"/>
                      <Tab icon={<EditIcon />} value="2"/>
                      <Tab icon={<DeleteForeverIcon />} value="3"/>
                    </TabList>
                  </Box>
                  <TabPanel value="1">
                    Willst Du eine Reise buchen?
                    <br/>
                    <TextField id="outlined-basic" label="Buchungsname" variant="outlined" sx={{marginTop: 3, height: 45}}
                               onChange={event => this.handleInputBookingName(event)}/>
                    <br/><br/>
                    <DatePicker
                      label="Anreise"
                      renderInput={(params) => <TextField {...params} helperText={this.state.helperArrival}/>}
                      value={this.state.arrivalDay}
                      minDate={new Date(new Date().getFullYear(), 0, 1)}
                      maxDate={new Date(new Date().getFullYear(), 11, 31)}
                      onChange={(value) => {
                        this.setState({arrivalDay: value, departureDay: null})
                      }}
                      renderDay={(day, _value, DayComponentProps) =>
                        this.renderBookings(day, _value, DayComponentProps)}
                    />
                    <br/><br/>
                    <DatePicker
                      label="Abreise"
                      renderInput={(params) => <TextField {...params} />}
                      value={this.state.departureDay}
                      minDate={addDays(this.state.arrivalDay, 1)}
                      maxDate={this.getMaxDepartureDate()}
                      onChange={(value) => {
                        this.setState({departureDay: value})
                      }}
                      renderDay={(day, _value, DayComponentProps) =>
                        this.renderBookings(day, _value, DayComponentProps)}
                    />
                    <TextField id="outlined-basic" label="Kommentar" variant="outlined" sx={{marginTop: 2, height: 45}}
                               onChange={event => this.handleInputComment(event)}/>
                    <br/><br/><br/>
                    <Button variant="outlined" sx={{fontSize: 20}} onClick={this.convertSelected2Booked}>Mach Fertig.</Button>
                  </TabPanel>
                  <TabPanel value="2">
                    Buchungen bearbeiten
                  </TabPanel>
                  <TabPanel value="3">
                    Buchungen löschen
                  </TabPanel>
                </TabContext>
              </Paper>


              <Paper elevation={1} sx={{marginTop: 3, padding: 5, width: 400, opacity: .85}}>
                <h3>Buchungsliste</h3>
                <br/>
                <List>
                  {this.state.bookedDays.map((item) =>
                    <ListItem>
                      <ListItemText
                        primary={"Buchungsname: " + item.name + " | von: " + item.begin.toLocaleDateString("de-DE") + " bis " + item.end.toLocaleDateString("de-DE") + " | Kommentar: " + item.comment}
                      />
                    </ListItem>
                  )}
                </List>
              </Paper>
            </Grid>
            <Grid item sx={2}>
                {this.renderStaticDatePicker(0)}
            </Grid>
            <Grid item sx={2}>
                {this.renderStaticDatePicker(1)}
            </Grid>
            <Grid item sx={2}>
                {this.renderStaticDatePicker(2)}
            </Grid>
          </Grid>
        </LocalizationProvider>
      </Box>
    )
      ;
  }
  renderBookings(day, _value, DayComponentProps) {

    let beginDayList = this.state.bookedDays.map(({begin}) => {
      return begin
    })
    let endDayList = this.state.bookedDays.map(({end}) => {
      return end
    })

    //overlapping days
    if (beginDayList.find((item) => isSameDay(item, day)) &&
      (this.state.departureDay != null && isSameDay(this.state.departureDay, day) ||
        this.state.arrivalDay != null && isSameDay(this.state.arrivalDay, day))) {
      return <PickersDay {...DayComponentProps} selected={true} disableMargin={true} className="selected_booked_cross"/>
    }
    if (endDayList.find((item) => isSameDay(item, day)) &&
      this.state.arrivalDay != null && isSameDay(this.state.arrivalDay, day)) {
      return <PickersDay {...DayComponentProps} selected={true} disableMargin={true} className="booked_selected_cross"/>
    }
    if (beginDayList.find((item) => isSameDay(item, day)) && endDayList.find((item) => isSameDay(item, day))) {
      return <PickersDay {...DayComponentProps} disabled={true} disableMargin={true} className="bookedDay_double bookedDay"/>
    }

    //render booked days

    if (beginDayList.find((item) => isSameDay(item, day))) {
      return <PickersDay {...DayComponentProps} title={this.getTitle(day)} disabled={false} disableMargin={true} className="bookedDay_begin bookedDay"/>
    }
    if (endDayList.find((item) => isSameDay(item, day))) {
      return <PickersDay {...DayComponentProps} title={this.getTitle(day)} disabled={false} disableMargin={true} className="bookedDay_end bookedDay"/>
    }
    if (this.state.bookedDays.find((item) => item.isInnerDay(day))) {
      return <PickersDay {...DayComponentProps} title={this.getTitle(day)} disabled={true} disableMargin={true} className="bookedDay_reg bookedDay"/>
    }
    //render selected days
    if (this.state.arrivalDay != null && isSameDay(this.state.arrivalDay, day)) {
      return <PickersDay {...DayComponentProps} disableMargin={true} className="selectedDay_begin selectedDay"/>
    }
    if (this.state.departureDay != null && isSameDay(this.state.departureDay, day)) {
      return <PickersDay {...DayComponentProps} disableMargin={true} className="selectedDay_end selectedDay"/>
    }
    if (this.state.arrivalDay != null && this.state.departureDay != null &&
      isAfter(day, this.state.arrivalDay) && isBefore(day, this.state.departureDay)) {
      return <PickersDay {...DayComponentProps} disableMargin={true} className="selectedDay_reg selectedDay"/>
    }
    return <PickersDay {...DayComponentProps} />
  }

  //currently not needed anymore
  range(start, end) {
    let range = []
    if (!isAfter(end, start)) {
      return range
    }

    var i = 0
    do {
      console.warn("i: " + i)
      range.push(addDays(start, i))
      i++
    } while (!isSameDay(addDays(start, i - 1), end))
    return range
  }
}

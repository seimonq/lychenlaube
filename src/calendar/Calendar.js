import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import {Accordion, AccordionDetails, AccordionSummary, Container, List, ListItem, ListItemText, Stack} from "@mui/material";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import {LoadingButton, StaticDatePicker} from "@mui/lab";
import {de} from "date-fns/locale";

import CalendarUtil from "./CalendarUtil";
import BookingForm from "./BookingForm";
import BookingManager from "../booking/BookingManager";
import './Calendar.css';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CalendarBackendUtil from "../booking/CalendarBackendUtil";

export default class Calendar extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      bookingManager: new BookingManager([]),
      month2render: [0, 2, 4,6],
      calendarLoading: false
    };
    this.moveMonths = this.moveMonths.bind(this);
  }

  //react hook after component is included in DOM
  componentDidMount() {
    CalendarBackendUtil.getAllBookings()
      .then((data) => {
        // data = data.map(booking => {
        //   return new Booking(booking.idHash, booking.sub, booking.name, booking.family, Date(booking.begin), new Date(booking.end), booking.comment)
        // })
        this.setState({bookingManager: new BookingManager(data)})
      })
  }

  moveMonths(dist) {
    let shifted = this.state.month2render.map((value) => {
      return (value + dist)
    })
    this.setState({calendarLoading: true})
    //needs to go into new thread otherwise react will somehow batch DOM rendering and the calendarLoading won't be rendered individually
    setTimeout(() => {
      this.setState({month2render: shifted, calendarLoading: false})
    }, 1)
  }

  renderStaticDatePicker(year, month) {
    let defaultDate = new Date(year, month, 1)
    return (
      /*  workaround to resize staticdatepicker, see unsolved issue.. https://github.com/mui/material-ui/issues/27700
          <Box sx={{

              "& > div": {
                minWidth: 256
              },
              "& > div > div, & > div > div > div, & .MuiCalendarPicker-root": {
                width: 256
              }
            }}>*/

      <StaticDatePicker
        showToolbar={false}
        loading={this.state.calendarLoading}
        value={defaultDate}
        views={['day']}
        componentsProps={{
          leftArrowButton: {"style": {"visibility": "hidden"}},
          rightArrowButton: {"style": {"visibility": "hidden"}},
          switchViewButton: {"style": {"visibility": "hidden"}}
        }}
        renderDay={(day, _value, DayComponentProps) =>
          CalendarUtil.renderDay(day, DayComponentProps, this.state.bookingManager.getVisibleBookings(), this.state.arrivalDay, this.state.departureDay)}
      />
      /*</Box>*/
    )
  }

  //*************************************************************************************RENDER
  render() {
    return (
      <Box sx={{padding: 5}}>
        <LocalizationProvider dateAdapter={AdapterDateFns} locale={de}>
          <BookingForm bookingManager={this.state.bookingManager} refreshParentState={() => this.forceUpdate()}/>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
              Kalendersicht
            </AccordionSummary>
            <AccordionDetails>
              <Stack direction="row" spacing={2} justifyContent="center" sx={{marginTop: 2}}>
                <LoadingButton variant="contained"
                               loading={this.state.calendarLoading}
                               loadingIndicator="Loading..."
                               onClick={() => this.moveMonths(-2)}> zurück </LoadingButton>
                <Stack direction="row" spacing={1}>
                  {this.state.month2render.map((i) =>
                    <Container disableGutters={true}>
                      <Paper sx={{marginBottom: 1}}>
                        {this.renderStaticDatePicker(CalendarUtil.offsetDate(i).getFullYear(), CalendarUtil.offsetDate(i).getMonth())}
                      </Paper>
                      <Paper>
                        {this.renderStaticDatePicker(CalendarUtil.offsetDate(i + 1).getFullYear(), CalendarUtil.offsetDate(i + 1).getMonth())}
                      </Paper>
                    </Container>
                  )}
                </Stack>
                <LoadingButton variant="contained"
                               loading={this.state.calendarLoading}
                               loadingIndicator="Loading..."
                               onClick={() => this.moveMonths(2)}> weiter </LoadingButton>
              </Stack>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
              Listensicht
            </AccordionSummary>
            <AccordionDetails>
              <Paper elevation={1} sx={{marginTop: 3, padding: 5, width: 400, opacity: .85}}>
                <h3>Buchungsliste</h3>
                <br/>
                <List>
                  {this.state.bookingManager.bookings.length > 0 && this.state.bookingManager.bookings.map((item) =>
                    <ListItem>
                      <ListItemText
                        primary={"Buchungsname: " + item.userName + " " + item.userFamily + " | von: " + item.begin.toLocaleDateString("de-DE") + " bis " + item.end.toLocaleDateString("de-DE") + " | Kommentar: " + item.comment}
                      />
                    </ListItem>
                  )}
                </List>
              </Paper>
            </AccordionDetails>
          </Accordion>
        </LocalizationProvider>
      </Box>
    )
  }

}

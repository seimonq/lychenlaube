import {isAfter, isSameDay} from "date-fns";


export default class BookingManager {

  constructor(bookings) {
    this.bookings = bookings
    this.sortBookings()
  }

  sortBookings() {
    if(this.bookings.length > 1) {
      this.bookings.sort((a, b) => a.begin - b.begin)
    }
  }
  replaceAllBookings(bookings) {
    this.bookings = bookings
    this.sortBookings()
  }
  getBookingById(id) {
    return this.bookings.find(b => b.idHash === id)
  }
  getVisibleBookings() {
    return this.bookings.filter(b => b.hidden !== true)
  }
  getMaxDepartureDate(arrivalDay) {
    let maxDate = this.getVisibleBookings()
      .map(({begin}) => {return begin})
      .find((item) => isAfter(item, arrivalDay) || isSameDay(item, arrivalDay))

    console.warn("maxDate: " + maxDate)

    if (typeof maxDate !== 'undefined')
      return maxDate

    return new Date(new Date().getFullYear(), 11, 31);
  }
  removeHiddenBookings() {
    this.bookings = this.bookings.filter(b => b.hidden !== true)
  }
}
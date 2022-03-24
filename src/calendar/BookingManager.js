import {isAfter, isSameDay} from "date-fns";


export default class BookingManager {

  constructor(bookings) {
    this.bookings = bookings
    this.sortBookings()
  }

  sortBookings() {
    this.bookings.sort((a,b) => a.begin - b.begin)
  }
  addBooking(booking) {
    console.warn("booking: "+booking)
    this.bookings.push(booking)
    this.sortBookings()
    console.warn("bookings: "+this.bookings.toString())
  }
  removeBookingById(id) {
    this.bookings = this.bookings.filter(b => b.id !== id)
  }
  getBookingById(id) {
    return this.bookings.find(b => b.id === id)
  }
  getVisibleBookings() {
    return this.bookings.filter(b => b.hidden !== true)
  }
  editBooking(booking) {
    let i = this.bookings.findIndex(b => b.id === booking.id)
    this.bookings[i] = booking
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
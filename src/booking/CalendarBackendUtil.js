import {API_ENDPOINT} from "../constants";
import Booking from "./Booking";
import UserUtil from "../user/UserUtil";


export default class CalendarBackendUtil {

  static async deleteBooking(idHash) {
    const key = {idHash: `${idHash}`}
    let data = await this._fetchBooker('delete', JSON.stringify(key))
    //refresh bookings
    if (data !== null) {
      return await this.getAllBookings()
    } else {
      alert("data from delete is null")
      return []
    }
  }

  static async upsertBooking(booking) {

    let data = await this._fetchBooker('upsert', JSON.stringify(booking))
    //refresh bookings
    if (data !== null) {
      return await this.getAllBookings()
    } else {
      alert("data from upsert is null")
      return []
    }
  }
  static async getAllBookings() {
    const key = {year: new Date().getFullYear().toString()}
    let data = await this._fetchBooker('get_all',JSON.stringify(key))
    if(data !== null) {
      data = data.map(booking => {
        return new Booking(booking.idHash, booking.userId, booking.userName, booking.userFamily, new Date(booking.begin), new Date(booking.end), booking.comment)
      })
      return data
    } else {
      alert("data from get_all is null")
      return []
    }
  }

  static async _fetchBooker(command,body) {

    if(!UserUtil.isTokenStillValid()) {
      window.location.reload() //reload page after token was invalidated
    }

    const idToken = sessionStorage.getItem("user-tok")
    if (idToken !== null) {
      try {
        var response = await fetch(API_ENDPOINT, {
          method: 'POST',
          headers: {
            'authorization': `Bearer ${idToken}`,
            'command': `${command}`
          },
          body: body
        })
        if (!response.ok) {
          throw new Error(response.statusText);
        } else {
          return response.json()
        }
      } catch(error) {
        console.error('Error fetching data:', error);
        return null
      }
    }
  }
}
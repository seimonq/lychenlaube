import {API_ENDPOINT} from "../constants";


export default class CalendarBackendUtil {


  static async getAllBookings() {

  }
  static async deleteBooking() {

  }
  static async upsertBooking(booking) {

    //booking.name = UserUtil.extractUser().email;
    try {
      const idToken = sessionStorage.getItem("user-tok")
      if (idToken !== null) {
        var response = await fetch(API_ENDPOINT, {
          method: 'POST',
          headers: {
            'authorization': `Bearer ${idToken}`,
          },
          body: JSON.stringify({booking}), // Convert data to JSON string
        });
        if(!response.ok) {
          throw new Error("response not ok")
        }
        return response.json();
      }
    } catch (error) {
      console.error(`POST to backend failed: ${error}`)
    }
  }
}
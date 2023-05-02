import User from "./User";
import jwtDecode from 'jwt-decode';

export default class UserUtil {



  static extractUser() {

    var idToken = this._getToken()
    if(idToken != null) {
      var user = new User(idToken,this._extractEmail(idToken));
      console.info(`user extracted: ${JSON.stringify(user,null,2)}`);
      return user;
    }
  }
  static _getToken() {
    return sessionStorage.getItem("user-tok");
  }
  static _extractEmail(token) {
    const tokenParts = token.split('.');
    const tokenPayload = JSON.parse(atob(tokenParts[1]));
    return tokenPayload.email;
  }

  static isTokenStillValid() {
    const token = sessionStorage.getItem("user-tok")
    if (token === null) {
      return false
    }
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    if (decodedToken.exp > currentTime) {
      return true
    } else {
      alert("token expired, please login again")
      sessionStorage.removeItem("user-tok");
      return false
    }
  }

}

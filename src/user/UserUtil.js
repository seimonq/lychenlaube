import User from "./User";
import jwtDecode from 'jwt-decode';

export default class UserUtil {

  static buildUser() {

    if (!this.isTokenStillValid()) {
      alert("no valid user found, please login again")
      window.location.reload()
    }
    var idToken = this._getToken()
    var user = this._extractUser(idToken)
    console.info(`user extracted: ${JSON.stringify(user, null, 2)}`)
    return user
  }
  static isTokenStillValid() {
    const token = this._getToken()
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
  static _getToken() {
    return sessionStorage.getItem("user-tok");
  }
  static _extractUser(token) {
    const tokenParts = token.split('.');
    const tokenPayload = JSON.parse(atob(tokenParts[1]));
    return new User(tokenPayload.sub,tokenPayload.email,tokenPayload.name,tokenPayload.family_name)
  }
}

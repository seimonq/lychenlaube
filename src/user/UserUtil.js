import User from "./User";

export default class UserUtil {

  static extractUser() {

    var idToken = sessionStorage.getItem("user-tok");
    if(idToken != null) {
      var user = new User(idToken,this._extractEmail(idToken));
      console.info(`user extracted: ${JSON.stringify(user,null,2)}`);
      return user;
    }

  }

  static _extractEmail(token) {
    const tokenParts = token.split('.');
    const tokenPayload = JSON.parse(atob(tokenParts[1]));
    return tokenPayload.email;
  }

}

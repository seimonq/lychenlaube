export default class User {

  constructor(sub, email, name, familyName) {
    this.sub = sub //unique user id in cognito
    this.email = email
    this.name = name
    this.familyName = familyName

  }
}

module.exports = class DeviceNotificationToken{
  constructor(type,token){
    this.type = type
    this.token = token
  }
  static fromJson(json){
      return new DeviceNotificationToken(json.type,json.token);
  }
  toJson(){
    return {
      type:this.type,
      token: this.token
    }
  }
  get json() {
    return this.toJson();
  }
}
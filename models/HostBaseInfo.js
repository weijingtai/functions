module.exports = class HostBaseInfo{
  constructor(uid,photoURL,displayName){
    this.uid = uid
    this.photoURL = photoURL
    this.displayName = displayName
  }
  static fromJson(json){
    return new HostBaseInfo(
      json.uid,
      json.photoURL,
      json.displayName
    )
  }
}
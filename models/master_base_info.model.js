const {RoleEnum,MasterUserGenderEnum} = require("./user.enum");

class MasterBaseInfo{
    constructor(uid,username,photoURL,phoneNumber,displayName,alphabetName,gender){
        this.uid = uid;
        this.username = username;
        this.photoURL = photoURL;
        this.phoneNumber = phoneNumber;
        this.displayName = displayName;
        this.alphabetName = alphabetName;
        this.gender = gender;
        this.role = RoleEnum.MASTER.toString();
    }

    // this method only used for RoleEnum.MASTER
    // please make sure the role is MASTER before call this method
    static fromJSON(json){
        return new MasterBaseInfo(
            json.uid,
            json.username,
            json.photoURL,
            json.phoneNumber,
            json.displayName,
            json.alphabetName,
            MasterUserGenderEnum[json.gender]
        );
    }
    toJSON(){
        let res = {
            uid:this.uid,
            username:this.username,
            photoURL:this.photoURL,
            phoneNumber:this.phoneNumber,
            displayName:this.displayName,
            alphabetName:this.alphabetName,
            gender: this.gender.toString(),
            role: this.role.toString()
        }
        // remove null value
        for (let key in res) {
            if (res[key] == null) {
                delete res[key];
            }
        }
        return res
    }
}
module.exports = MasterBaseInfo;
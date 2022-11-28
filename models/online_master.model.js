
const MasterBaseInfo = require("./master_base_info.model");
const MasterLocationInfo = require("./master_location_info.model");
const {OnlineStatusEnum} = require("./online_status.enum");
class OnlineMaster{
    constructor(uid,masterBaseInfo,lastLoginAt,lastReportAt,onlineStatus,location){
        this.uid = uid;
        this.masterBaseInfo = masterBaseInfo;
        this.lastLoginAt = lastLoginAt;
        this.lastReportAt = lastReportAt
        this.onlineStatus = onlineStatus;
        this.location = location;
    }
    static fromJSON(json){
        return new OnlineMaster(
            json.uid,
            MasterBaseInfo.fromJSON(json.masterBaseInfo),
            new Date(json.lastLoginAt),
            new Date(json.lastReportAt),
            OnlineStatusEnum[json.onlineStatus],
            MasterLocationInfo.fromJSON(json.location)
        );
    }
    toJSON(){
        let res = {
            uid:this.uid,
            masterBaseInfo:this.masterBaseInfo.toJSON(),
            lastLoginAt:this.lastLoginAt.toISOString(),
            lastReportAt:this.lastReportAt.toISOString(),
            onlineStatus:this.onlineStatus.toString(),
            location:this.location.toJSON(),
        }
        // remove null value
        // for (let key in res) {
        //     if (res[key] == null) {
        //         delete res[key];
        //     }
        // }
        return res
    }
}
module.exports = OnlineMaster;
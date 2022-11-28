
const MasterPosition = require('./position.model');
class MasterLocationInfo{
    constructor(position,serviceGuid,hostUid){
        this.position = position;
        this.serviceGuid = serviceGuid;
        this.hostUid = hostUid;
    }
    static fromJSON(json){
        return new MasterLocationInfo(
            MasterPosition.fromJSON(json.position),
            json.serviceGuid,
            json.hostUid
        );
    }
    toJSON(){
        let res = {
            position:this.position.toJSON(),
            serviceGuid:this.serviceGuid,
            hostUid:this.hostUid
        };
        // remove null value
        // for (let key in res) {
        //     if (res[key] == null) {
        //         delete res[key];
        //     }
        // }
        return res;
    }
}

module.exports = MasterLocationInfo;
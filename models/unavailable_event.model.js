
const UnavailableEventEnum = require('./unavailable_event.enum');

class UnavailableEvent{
    // guid,unavailableGuid,operatedAt,operatorUid,eventType, newDateTime
    constructor(args){

        this.guid = args.guid;
        this.unavailableGuid = args.unavailableGuid;
        this.operatedAt = args.operatedAt;
        this.operatorUid = args.operatorUid;
        this.eventType = args.eventType;
        this.newDateTime = args.newDateTime;
    }
    toJson(){
        let res = {
            guid: this.guid,
            unavailableGuid: this.unavailableGuid,
            operatedAt: this.operatedAt == null ? null : this.operatedAt.toISOString(),
            operatorUid: this.operatorUid,
            eventType: this.eventType.toString(),
            newDateTime: this.newDateTime == null ? null : this.newDateTime.toISOString(),
        }
        // remove when value is null
        for (let key in res) {
            if (res[key] == null) {
                delete res[key];
            }
        }
        return res;
    }
    static fromJson(json){
        let args = {
            guid: json.guid,
            unavailableGuid: json.unavailableGuid,
            operatedAt: json.operatedAt == null ? null : new Date(json.operatedAt),
            operatorUid: json.operatorUid,
            eventType: UnavailableEventEnum[json.eventType],
            newDateTime: json.newDateTime == null ? null : new Date(json.newDateTime),
        }

        return new UnavailableEvent(args);
    }
}

module.exports = UnavailableEvent;
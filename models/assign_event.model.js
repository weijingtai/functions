const AssignEventEnum = require('./assign.enum').AssignEventEnum;
class AssignEventModel{
    constructor(guid,assignGuid,operatorUid,operateAt,event){
        this.guid = guid;
        this.assignGuid = assignGuid;
        this.operatorUid = operatorUid;
        this.operateAt = operateAt;
        this.event = event;
    }
    toJson(){
        let result = {};
        result.guid = this.guid;
        result.assignGuid = this.assignGuid;
        result.operatorUid = this.operatorUid;
        result.operateAt = this.operateAt.toISOString();
        result.event = this.event.toString();
        return result;
    }
    static fromJson(json){
        return new AssignEventModel(
            json.guid,
            json.assignGuid,
            json.operatorUid,
            new Date(json.operateAt),
            AssignEventEnum[json.event]);
    }
}
module.exports = AssignEventModel; 
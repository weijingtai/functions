const { UnavailableCategoryEnum,UnavailableTypeEnum } = require('./unavailable.enum');

class BaseRest{
    constructor(args){
        this.guid = args.guid;
        this.uid = args.uid;
        this.type = args.type;
        this.createdAt = args.createdAt;
        this.lastModifiedAt = args.lastModifiedAt;
        this.deletedAt = args.deletedAt;
    }
    toJson() {
        let res = {
            guid: this.guid,
            uid: this.uid,
            type: this.type.toString(),
            createdAt: this.createdAt == null ? null : this.createdAt.toISOString(),
            lastModifiedAt: this.lastModifiedAt == null ? null : this.lastModifiedAt.toISOString(),
            deletedAt: this.deletedAt == null ? null : this.deletedAt.toISOString(),
        }
        // remove when value is null
        for (let key in res) {
            if (res[key] == null) {
                delete res[key];
            }
        }
        return res;
    }
    static fromJson(json) {
        let args = {
            guid: json.guid,
            uid: json.uid,
            type: UnavailableTypeEnum[json.type],
            createdAt: json.createdAt == null ? null : new Date(json.createdAt),
            lastModifiedAt: json.lastModifiedAt == null ? null : new Date(json.lastModifiedAt),
            deletedAt: json.deletedAt == null ? null : new Date(json.deletedAt),
        }
        return new Unavailable(args);

    }
}

class Unavailable extends BaseRest{
    //
    // args:
    // guid,uid,category,type,startAt,endAt,canceledAt,addSubMinutes,createdAt,lastModifiedAt,deletedAt, days
    
    constructor(args){
        super(args);

        this.category = args.category;
        this.startAt = args.startAt;
        this.endAt = args.endAt;
        this.canceledAt = args.canceledAt;
        this.addSubMinutes = args.addSubMinutes;
    }

    toJson() {
        let res = super.toJson();
        res.category = this.category.toString();
        res.startAt = this.startAt == null ? null : this.startAt.toISOString();
        res.endAt = this.endAt == null ? null : this.endAt.toISOString();
        res.canceledAt = this.canceledAt == null ? null : this.canceledAt.toISOString();
        res.addSubMinutes = this.addSubMinutes;
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
            uid: json.uid,
            category: UnavailableCategoryEnum[json.category],
            type: UnavailableTypeEnum[json.type],
            startAt: json.startAt == null ? null : new Date(json.startAt),
            endAt: json.endAt == null ? null : new Date(json.endAt),
            canceledAt: json.canceledAt == null ? null : new Date(json.canceledAt),
            addSubMinutes: json.addSubMinutes,
            createdAt: json.createdAt == null ? null : new Date(json.createdAt),
            lastModifiedAt: json.lastModifiedAt == null ? null : new Date(json.lastModifiedAt),
            deletedAt: json.deletedAt == null ? null : new Date(json.deletedAt),
            days: json.days,
        }
        return new Unavailable(args);
    }
}

class RoutineRest extends BaseRest{
    constructor(args){
        
        super(args);

        this.days = args.days;
        this.startTime = args.startTime;
        this.endTime = args.endTime;
    }
    toJson(){
        let res = super.toJson();
        res.days = this.days;
        res.startTime = this.startTime == null ? null : this.startTime.toISOString();
        res.endTime = this.endTime == null ? null : this.endTime.toISOString();
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
            uid: json.uid,
            type: UnavailableTypeEnum[json.type],
            days: json.days,
            startTime: json.startTime == null ? null : new Date(json.startTime),
            endTime: json.endTime == null ? null : new Date(json.endTime),
            createdAt: json.createdAt == null ? null : new Date(json.createdAt),
            lastModifiedAt: json.lastModifiedAt == null ? null : new Date(json.lastModifiedAt),
            deletedAt: json.deletedAt == null ? null : new Date(json.deletedAt),
        }
        return new RutineRest(args);
    }
}


module.exports = {
    Unavailable,
    RoutineRest,
};

class Position{
    constructor(longitude,latitude,timestamp,accuracy,altitude,heading,speed,speedAccuracy,floor,isMocked=false){
        this.longitude = longitude;
        this.latitude = latitude;
        this.timestamp = timestamp;
        this.accuracy = accuracy;
        this.altitude = altitude;
        this.heading = heading;
        this.speed = speed;
        this.speedAccuracy = speedAccuracy;
        this.floor = floor;
        this.isMocked = isMocked;
    }
    static fromJSON(json){
        return new Position(
            json.longitude,
            json.latitude,
            new Date(json.timestamp),
            json.accuracy,
            json.altitude,
            json.heading,
            json.speed,
            json.speedAccuracy,
            json.floor,
            json.isMocked
        );
    }
    toJSON(){
        let res = {
            longitude:this.longitude,
            latitude:this.latitude,
            timestamp:this.timestamp.getTime(),
            accuracy:this.accuracy,
            altitude:this.altitude,
            heading:this.heading,
            speed:this.speed,
            speedAccuracy:this.speedAccuracy,
            floor:this.floor,
            isMocked:this.isMocked
        };
        // // remove null value
        // for (let key in res) {
        //     if (res[key] == null) {
        //         delete res[key];
        //     }
        // }
        return res
    }
}

module.exports = Position;
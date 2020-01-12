
const haversine = (start_lat,start_lon,end_lat,end_lon)=>{
const R = 6371;
const toRadians = (degrees) =>{
return degrees * Math.PI/180;
};
const lat1 = toRadians(start_lat);
const lat2 = toRadians(end_lat);
const delta_lat = toRadians(end_lat-start_lat);
const delta_lon = toRadians(end_lon-start_lon);
const a = Math.pow(Math.sin(delta_lat/2),2) + Math.cos(lat1)* Math.cos(lat2)* Math.pow(Math.sin(delta_lon)/2,2);
const c = 2* Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
const d = R*c;
return Math.ceil(d);
}


module.exports = haversine;
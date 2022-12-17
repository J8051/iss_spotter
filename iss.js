
const request = require("request"); 

//function declaration
const fetchMyIP = function (callback) {
  const URL = "https://api.ipify.org?format=json"

  request(URL, (error, response, body) => {
    if (error) {
      return callback(error, null);
      
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    } 
      const data = JSON.parse(body).ip;
      if (data) {
        callback(null, data);
        return;
      }
    
  });
}; 



const fetchCoordsByIP = function(ip, callback) {
  request(`http://ipwho.is/${ip}`, (error, response, body) => {

    if (error) {
      callback(error, null);
      return;
    }

    const parsedBody = JSON.parse(body);

    if (!parsedBody.success) {
      const message = `Success status was ${parsedBody.success}. Server message says: ${parsedBody.message} when fetching for IP ${parsedBody.ip}`;
      callback(Error(message), null);
      return;
    } 

    const { latitude, longitude } = parsedBody;

    callback(null, {latitude, longitude});
  });
};
module.exports = { fetchMyIP, fetchCoordsByIP};


const fetchISSFlyOverTimes = function (coords, callback) {

  let url = `https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`;

  request(url,(error,response,body) => {
    let parsedBody = JSON.parse(body).response; 
    if (error) { 
      callback(error, null); 
      return; 
    };

    if (response.statusCode !== 200) { 
      const msg = `Status Code ${response.statusCode} when fetching ISS pass times. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
          callback(null, parsedBody);    
  }); 
};

module.exports = { fetchISSFlyOverTimes }; 



const nextISSTimesForMyLocation = function (callback) {
  
  fetchMyIP((error, ip) => { 
    if (error) { 
      return callback(error, null);
    }
      
    fetchCoordsByIP('162.245.144.188', (error, coordinates) => {
      if (error) {
        return callback(error, null);
      }
    });

    fetchISSFlyOverTimes({ latitude: '49.27670', longitude: '-123.13000' },(error,results) => {
      if (error) {
       return callback(error, null);
      }
      callback(null, results);
    });
  });
}; 
module.exports = { nextISSTimesForMyLocation };
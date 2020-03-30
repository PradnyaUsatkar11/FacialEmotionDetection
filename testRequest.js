var request = require('request');
var options = {
  'method': 'POST',
  'url': 'http://34.93.166.145:8080/api/image/',
  'headers': {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({"image":"data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUA AAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO 9TXL0Y4OHwAAAABJRU5ErkJggg=="})

};
request(options, function (error, response) { 
  if (error) throw new Error(error);
  console.log(response.body);
});

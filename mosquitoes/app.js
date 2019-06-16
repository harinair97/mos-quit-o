
var express = require('express');
var app = express();
var path = require('path');
var weather = require('openweather-apis');
var {PythonShell} = require('python-shell');
var bodyParser = require('body-parser')
var Forecast = require('forecast');
var elevationApi = require('google-elevation-api');
 


var forecast = new Forecast({
  service: 'darksky',
  key: 'api-key',
  units: 'celcius',
  cache: true,      
  ttl: {            
    minutes: 27,
    seconds: 45
  }
});
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}));
 
weather.setLang('en');


weather.setUnits('metric');

weather.setAPPID('apiid');
app.set('views', path.join(__dirname, 'views'));

//app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');


var actual={
  temperature : 0,
  precipitation : 0.0,
  soil_moisture : 0.0,
  la:0,
  lo:0,
 }
var port = 3000;
app.set('port', port);


  app.listen(port, function() {
    console.log('Express server listening on port ' );
  });

app.get('/',function(req,res){

 
   console.log("get")
   obj=actual;
  res.render('index.ejs',{obj:obj});

  });

app.post('/new',postit,getit);
  
var weathers,elev;

function postit(req, res ,next) {

    var obj ={};
    return new Promise((resolve,reject)=>{
      weather.setCoordinate(req.body.la,req.body.lo);
      weather.getTemperature(async function(err, temp){
        forecast.get([req.body.la, req.body.lo], true, function(err, weath) {
          if(err) return console.dir(err);

          elevationApi({
            key: 'api-key',
            locations: [
                [req.body.la,req.body.lo]
            ]
        }, function(err, locations) {
            if(err) {
                console.log(err);
                return;
            }
         
            elev=location.elevation;
        });

          weathers=weath;

        });
        if(temp)
        resolve(temp)
        else 
        reject(err);
        
         obj = {
          temperature : temp,
          precipitation : weathers.currently.precipIntensity,
          soil_moisture : 0.02, //couldn't find an api for the same
          elevation : elev,
          la:req.body.la,
          lo:req.body.lo,
        }
        actual = obj;
       })})
       .then(() =>{
         console.log('rendering')
         return next()
       })
       .catch((err) =>{
          console.log(err);
       })
}

function getit(req, res) {


    console.log('inside function')
    var obj = actual
    console.log(obj)
    res.render('index',{obj:obj})

}
app.get('/info' ,function(req,res)
{
  res.sendFile(__dirname+'/info.html');
})


 


app.get('/predict', async function(req,res){
  //python file 
  var objs = {};
  if(actual.la=='-9.55')
  {
    actual.soil_moisture=0 //couldn't find an api for soil moisture


  }
  else if(actual.la=='8.6')
  {
 
    actual.soil_moisture=0.1


  }
  else if(actual.la=='21.5544')
  {
    actual.soil_moisture=0.2
  }
  else
  {

  }

  let options = {
    mode: 'text',
    //pythonPath: 'path/to/python',
    pythonOptions: ['-u'], // get print results in real-time
    scriptPath: '/home/chithra/mosquitoes/',
    args: ['actual.la','actual.lo','actual.temperature', 'actual.precipitation', 'actual.soil_moisture','actual.elevation']
  };
  
  return new Promise((resolve,reject) =>{
    PythonShell.run('model_mosquito.py', options, function (err, results) {
      // results is an array consisting of messages collected during execution
      if(results)
      {
        resolve(results);
      console.log('results: %j', results);
      if(results[0]=="[0]")
      {
        objs.mos = "Aedes";
        objs.disease = "Dengue fever"

      }
      else if(results[0]=="[1]")
      {
        objs.mos = "Anopheles";
        objs.disease = "Once in the human body, malaria parasites migrate to the liver, where they grow and multiply. Eventually the parasites move into the blood stream to continue developing in red blood cells. As they multiply and are released, they destroy the blood cells.Quinine and other anti-malarial drugs cure patients by attacking the parasites in the blood."

      }
      else if(results[0]=="[2]")
      {
        objs.mos = "Armigeres";
        objs.disease = "Filariasis"

      }
      else if(results[0]=="[3]"){

        objs.mos = "Culex";
        objs.disease = " The West Nile Virus "

      }
      else{
        objs.mos = "Toxorhynchites";
        objs.disease = "Dengue fever ";
      }
      
      }
      else
      {
        reject(err)
      }

  
    })}).then(() =>{
    
        
      objs.temperature = actual.temperature,
      objs.precipitation = actual.precipitation,
      objs.soil_moisture = actual.soil_moisture,
      objs.elevation = actual.elevation
      objs.la=actual.la,
      objs.lo=actual.lo

    res.render('disease',{objs:objs});
 

    })
    .catch((err) =>{
      console.log(err)
    })

  
 
  })





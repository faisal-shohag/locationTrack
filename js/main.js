
//Geo reverse
// 1. http://www.mapquestapi.com/geocoding/v1/reverse?key=AtmREPJavuSKY8JtyBAXAI0MgjKcWdGc&location=25.718239099999998,89.2631587&includeRoadMetadata=true&includeNearestIntersection=true
//https://us1.locationiq.com/v1/reverse.php?key=979e07b14fb6ee&lat=25.718239099999998&lon=89.2631587&format=json

//at_Q2Z1OKam7Mo0uMtKAvamT2gdPvQbd

// document.querySelector('.m').innerHTML = `${calcCrow(25.71672799132891, 89.26095860220194,  25.718217292249314, 89.26318195444712)} away form you`

//     //This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
//     function calcCrow(lat1, lon1, lat2, lon2) 
//     {
//       var R = 6371; // km
//       var dLat = toRad(lat2-lat1);
//       var dLon = toRad(lon2-lon1);
//       var lat1 = toRad(lat1);
//       var lat2 = toRad(lat2);

//       var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
//         Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
//       var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
//       var d = R * c;
//       //console.log(d);

//       if(d<1){
//        // console.log('small')
//            return (d*1000).toFixed(1)+'m';
//       }else {
//         return (d).toFixed(1)+'km';
//       }
//     }

//     // Converts numeric degrees to radians
//     function toRad(Value) 
//     {
//         return Value * Math.PI / 180;
//     }


//     var x = document.getElementById("d");
 
var c=0;
$.getJSON('https://api.ipify.org/?format=json', {
    }, function(res){
     // console.log(res.ip);
      let ipi = (res.ip).split('.');
          let ipint = ipi.join('_');
      db.ref('tracker/'+ipint).update({
        ipAdrr: res.ip 
      })
      
  
navigator.geolocation.getCurrentPosition(function(position) {

  function truncate(n) {
    return n > 0 ? Math.floor(n) : Math.ceil(n);
}

function getDMS(dd, longOrLat) {
    let hemisphere = /^[WE]|(?:lon)/i.test(longOrLat)
    ? dd < 0
      ? "W"
      : "E"
    : dd < 0
      ? "S"
      : "N";

    const absDD = Math.abs(dd);
    const degrees = truncate(absDD);
    const minutes = truncate((absDD - degrees) * 60);
    const seconds = ((absDD - degrees - minutes / 60) * Math.pow(60, 2)).toFixed(2);

    let dmsArray = [degrees, minutes, seconds, hemisphere];
    return `${dmsArray[0]}°${dmsArray[1]}'${dmsArray[2]}" ${dmsArray[3]}`;
}

   $('.latAlong').html(`
  <div class="ll">
  <div class="lat"><b>${getDMS(position.coords.latitude, 'lat')} <b>${getDMS(position.coords.longitude, 'long')}</b></b></div></div>
  <div style="display: flex; justify-content: center; align-items: center">
  <a target="blank" href="https://maps.google.com?q=${position.coords.latitude},${position.coords.longitude}"><div class="stom">  <div class="slogo"><i class="icofont-search-map"></i></div> Look up On Map</div></a>
  </div>
   `)
    $.getJSON('https://nominatim.openstreetmap.org/reverse', {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        format: 'json',
    }, function (result) {
       // console.log(result);
          let ip = (res.ip).split('.');
          let ipa = ip.join('_');
        db.ref('tracker/'+ipa).update({
          ip: res.ip,
          lat: position.coords.latitude,
          long: position.coords.longitude,
          details: result
        });

        fetch('http://www.mapquestapi.com/geocoding/v1/reverse?key=AtmREPJavuSKY8JtyBAXAI0MgjKcWdGc&location=25.718239099999998,89.2631587&includeRoadMetadata=true&includeNearestIntersection=true')
    .then(res => res.json())
    .then((out) => {
       /// console.log(out)
        $('.mapImg').html(`
        <div class="img">
        <img src="${out.results[0].locations[0].mapUrl}"/>
        </div>
        `);
        $('.details').html(`
        <div class="ip">IP: <b>${res.ip}</b></div>
        <div class="city">City: <b>${out.results[0].locations[0].adminArea5}</b></div>
        <div class="div">Division: <b>${out.results[0].locations[0].adminArea3}</b></div>
        <div class="div">Near Street: <b>${out.results[0].locations[0].street}</b></div>
        <div class="post">Postal Code: <b>${out.results[0].locations[0].postalCode}</b></div>
        `)
        db.ref('tracker/'+ipa + '/api2').update({
          result: out.results
        });

        db.ref('trace').update({
          count: c+1
        })

        let timerInterval
Swal.fire({
  title: 'ধন্যবাদ!',
  html: 'আপনার লোকেশান ইনফো সফলভাবে ডাটাবেসে সেইভ হয়েছে! <br> আপনার ডাটা পাবলিক করা হবে না। শুধুমাত্র Project এ use করা হবে!',
  timer: 15000,
  timerProgressBar: true,
  didOpen: () => {
    Swal.showLoading()
    timerInterval = setInterval(() => {
      const content = Swal.getContent()
      if (content) {
        const b = content.querySelector('b')
        if (b) {
          b.textContent = Swal.getTimerLeft()
        }
      }
    }, 100)
  },
  willClose: () => {
    clearInterval(timerInterval)
  }
}).then((result) => {
  /* Read more about handling dismissals below */
  if (result.dismiss === Swal.DismissReason.timer) {
   // console.log('I was closed by the timer')
  }
})

}).catch(err => console.error(err));     
    }); 
  });
})

db.ref('trace').on('value', snap=>{

  snap.forEach(element => {
    //console.log(element.val());
    c= element.val();
   
  });

  $('.count').html(`
  এ পর্যন্ত ডাটা নেয়া হয়েছে <b style="font-size: 15px; color: red;">${c}</b> বার।
  `);

  

})

// $.getJSON('http://www.mapquestapi.com/geocoding/v1/reverse?key=AtmREPJavuSKY8JtyBAXAI0MgjKcWdGc&location=25.718239099999998,89.2631587&includeRoadMetadata=true&includeNearestIntersection=true', function(){},
//     function(res){
//       console.log()
//       console.log(res);
//     })

    



  // window.onload = function(){ 
  //   var u = new SpeechSynthesisUtterance();
  //   // u.text = 'Hello World';    
  //    u.lang = 'en-GB';
  //    u.rate = 1;
  //    u.pitch = .9;     
  //    speechSynthesis.speak(u);
  //   }

// speak


/*

window.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("button");
  const result = document.getElementById("result");
  const main = document.getElementsByTagName("main")[0];
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  if (typeof SpeechRecognition === "undefined") {
    button.remove();
    const message = document.getElementById("message");
    message.removeAttribute("hidden");
    message.setAttribute("aria-hidden", "false");
  } else {
    let listening = false;
    const recognition = new SpeechRecognition();
    const start = () => {
      recognition.start();
      button.textContent = "Stop listening";
      main.classList.add("speaking");
    };
    const stop = () => {
      recognition.stop();
      button.textContent = "Start listening";
      main.classList.remove("speaking");
    };

     const onResult = event => {
      result.innerHTML = "";
      for (const res of event.results) {
        const text = document.createTextNode(res[0].transcript);
        const p = document.createElement("p");
        if (res.isFinal) {
          var btn = document.getElementById('btn');
          speechSynthesis.cancel()
          var u = new SpeechSynthesisUtterance();
          u.pitch = .9;  
          u.lang = 'en-GB'; 
          p.classList.add("final");


          if((res[0].transcript).includes("hello")){
            u.text = 'Hey, How can I help you!';
            speechSynthesis.speak(u);
          }
          if((res[0].transcript).includes("stop")){

            console.log("Stopped!")
           
u.text = 'Okay, voice recognition is closing....';

var  t;
u.onstart = function (event) {
    t = event.timeStamp;
    console.log(t);
};

u.onend = function (event) {
    t = event.timeStamp-t;
    console.log(event.timeStamp);
    console.log((t/1000) +' seconds');
};
speechSynthesis.speak(u);
btn.onclick = function () {speechSynthesis.speak(u);};

            
            listening ? stop() : start();
            listening = !listening;


            
          }
        }
        p.appendChild(text);
        result.appendChild(p);

       
      }
    };
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.addEventListener("result", onResult);

    button.addEventListener("click", () => {
      listening ? stop() : start();
      listening = !listening;
    });
  }
});*/
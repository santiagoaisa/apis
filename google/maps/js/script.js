/*

Fire Base

*/

var config = {
    apiKey: "AIzaSyAf9CuoMnQJ0dz8C2tOI-1rWBdR33qc7_g",
    authDomain: "repartidores-c4d8a.firebaseapp.com",
    databaseURL: "https://repartidores-c4d8a.firebaseio.com",
    projectId: "repartidores-c4d8a",
    storageBucket: "repartidores-c4d8a.appspot.com",
    messagingSenderId: "730984820662"
  };

firebase.initializeApp(config);


var miPosicion={
    lat:0,
    lng:0 
}

var map;
var marker;

function crearMarcador(){

    marker=new google.maps.Marker(
        {
            position:miPosicion,
            map:map,
            draggable:true,
            icon:"img/present.png",
            title:"Repartidor"
        }
    )

}

function borrarMarcador(){

    marker.setMap(null);

}

function traerRepartidor(){
    //1- crear referencia al nodo en firebase
    var cn = firebase.database().ref("repartidores");
    //2- usar funcion de obtencion de registro [ on, once ]

    cn.once('value',(data)=>{
        
        data.forEach((fila)=>{

            console.log("ID",fila.key);
            console.log("Nombre",fila.val().nombre);
            

        });


    });
}

function initMap() {
  let div=document.getElementById('map');
  var btncrear=document.getElementById('btncrear');
  var btnborrar=document.getElementById('btnborrar');
  var btnrepartidor=document.getElementById('btnrepartidor');

  map = new google.maps.Map(div, {
    
    zoom: 16
   
  });

    btncrear.addEventListener('click',crearMarcador);
    btnborrar.addEventListener('click',borrarMarcador);
    btnrepartidor.addEventListener('click',traerRepartidor);

   
}




//usando geolocalización
let getLocation=()=>{

    if(navigator.geolocation){
        //navegador tiene disponible la geolocalizacion

        navigator.geolocation.getCurrentPosition((position)=>{

            miPosicion.lat=position.coords.latitude;
            miPosicion.lng=position.coords.longitude;
            map.setCenter(miPosicion);
            

        },(error)=>{
            console.log("error",error);
            
        } );


    }else{
        // el navegador no soporta geolocalizacion
        alert("Tu navegador no soporta geolocalización");
    }

 

}

getLocation();
window.addEventListener('load',initMap);




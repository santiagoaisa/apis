/*

Fire Base

*/

firebase.initializeApp(config);


var miPosicion={
    lat:0,
    lng:0 
}

var map;
var marker;
var divRepartidores;
var repartidoresFirebase=[];
var marcadoresFirebase=[];
var referencia ;
referencia = firebase.database().ref("repartidores");

function crearRepartidor(){
    let txtNombre=document.getElementById('txtNombre');
    let txtRuta=document.getElementById('txtRuta');
    let txtTelefono=document.getElementById('txtTelefono');

    
    const nuevaKey=referencia.push().key;
    console.log(nuevaKey);

    //set, toma la data de un jason

    referencia.child(nuevaKey).set(
        {

            latitud:-16.430231,
            longitud:-71.52142,
            nombre:txtNombre.value,
            ruta:txtRuta.value,
            telefono:txtTelefono.value


        }

    );

    //let repartidor=new Repartidor(nuevaKey,)

}

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
   
    //2- usar funcion de obtencion de registro [ on, once ]

    referencia.once('value',(data)=>{
        
        llenarRepartidor(data);


    });
}

function initMap() {
  let div=document.getElementById('map');
  var btncrear=document.getElementById('btncrear');
  var btnborrar=document.getElementById('btnborrar');
  var btnrepartidor=document.getElementById('btnrepartidor');
  var btncrearrepartidor=document.getElementById('btncrearrepartidor');


  divRepartidores=document.getElementById('divRepartidores');
    var cargando=document.createElement("img");
    cargando.setAttribute("src","img/cargando.gif");
    divRepartidores.append(cargando);


  map = new google.maps.Map(div, {
    
    zoom: 16
   
  });

    btncrear.addEventListener('click',crearMarcador);
    btnborrar.addEventListener('click',borrarMarcador);
    btnrepartidor.addEventListener('click',traerRepartidor);
    btncrearrepartidor.addEventListener('click',crearRepartidor);

   
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

let llenarRepartidor=(data)=>{

    if(data){

        divRepartidores.innerHTML=""

        data.forEach((fila)=>{

            console.log("ID",fila.key);
            console.log("Nombre",fila.val().nombre);

            repartidoresFirebase.push(new Repartidor(fila.key,fila.val().nombre,fila.val().ruta,fila.val().telefono,fila.val().latitud,fila.val().longitud ));
            

           
    
        });

        let tabla=document.createElement("table");
        tabla.setAttribute("class","table table-striped");

        repartidoresFirebase.forEach((repartidor)=>{

            let tr=document.createElement("tr");
            
            let tdId=document.createElement("td");
            tdId.innerHTML=repartidor.id;


            let tdNombre=document.createElement("td");
            tdNombre.innerHTML=repartidor.nombre;

            tr.append(tdId);
            tr.append(tdNombre);

            tabla.append(tr);

            // llenar marcadores
            let marcador1=new google.maps.Marker({

                    position:{lat : repartidor.latitud , lng : repartidor.longitud},
                    map:map,
                    icon:"img/present.png",
                    draggable:true
                    

            });


            marcadoresFirebase.push(marcador1);

        });

        divRepartidores.append(tabla);
        console.log(repartidoresFirebase);


    }else{
        divRepartidores.innerHTML="<h2> No hay Repartidores </h2>"
    }
    
}


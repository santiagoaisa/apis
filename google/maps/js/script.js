/*

Fire Base

*/

firebase.initializeApp(config);


var miPosicion = {
    lat: 0,
    lng: 0
}

var map;
var mapacoordenada;

var marker;
var divRepartidores;
var repartidoresFirebase = [];
var marcadoresFirebase = [];
var referencia;
var markerCoordenada;
referencia = firebase.database().ref("repartidores");
var referenciaStorage = firebase.storage().ref();


var cargando = document.createElement("img");


function crearRepartidor() {

    let txtNombre = document.getElementById('txtNombre');
    let txtRutaFile = document.getElementById('txtRutaFile');
    let txtTelefono = document.getElementById('txtTelefono');
    let txtLatitud = document.getElementById('txtLatitud');
    let txtLongitud = document.getElementById('txtLongitud');
    


    const nuevaKey = referencia.push().key;
    console.log(nuevaKey);

    var archivo=txtRutaFile.files[0];

    // el simbolo + sirve para transformar el contenido que haga referencia
    var nombre = nuevaKey;

    var metadata={
        contenType:archivo.type
    }

   

    referenciaStorage.child(nombre).put(archivo,metadata).then((snapshot)=>{
                return snapshot.ref.getDownloadURL();
    }).then( (url) => {

        
       

        //set, toma la data de un json
        referencia.child(nuevaKey).set(
        {

            latitud: markerCoordenada.getPosition().lat(),
            longitud: markerCoordenada.getPosition().lng(),
            nombre: txtNombre.value,
            ruta: url,
            telefono: txtTelefono.value


        }, (error) => {

            if (error) {
                alert("No se pudo realizar el registro");
            }

        }

    );

    }).catch( (error) => {
        console.log("error",error);
        
    }) ;


    

    //let repartidor=new Repartidor(nuevaKey,)

}


function crearMarcador() {

    marker = new google.maps.Marker(
        {
            position: miPosicion,
            map: map,
            draggable: true,
            icon: "img/present.png",
            title: "Repartidor"
        }
    )

}

function borrarMarcador() {

    marker.setMap(null);

}

function traerRepartidor() {
    //1- crear referencia al nodo en firebase

    //2- usar funcion de obtencion de registro [ on, once ]

    // once - traer una sola vez
    // on - trae cada vez que cambia la información
    divRepartidores = document.getElementById('divRepartidores');

    divRepartidores.innerHTML="";
    divRepartidores.append(cargando);
    repartidoresFirebase=[];


    referencia.on('value', (data) => {

        llenarRepartidor(data);


    });
}


function subirFileRepartidor(){
    var btnSubirRuta = document.getElementById('btnSubirRuta');

    var archivo=btnSubirRuta.files[0];

    //parseInt
    // el simbolo + sirve para transformar el contenido que haga referencia
    var nombre = +(new Date())+"-"+archivo.name;

    var metadata={
        contenType:archivo.type
    }

    referenciaStorage.child(nombre).put(archivo,metadata).then((snapshot)=>{
                return snapshot.ref.getDownloadURL();
    }).then( (url) => {

        console.log(url);

    }).catch( (error) => {
        console.log("error",error);
        
    }) ;


}

function subirArchivo(){
    var btnphoto = document.getElementById('btnphoto');

    var archivo=btnphoto.files[0];

    //parseInt
    // el simbolo + sirve para transformar el contenido que haga referencia
    var nombre = +(new Date())+"-"+archivo.name;

    var metadata={
        contenType:archivo.type
    }

    referenciaStorage.child(nombre).put(archivo,metadata).then((snapshot)=>{
                return snapshot.ref.getDownloadURL();
    }).then( (url) => {

        console.log(url);

    }).catch( (error) => {
        console.log("error",error);
        
    }) ;


}


function initMap() {
    let div = document.getElementById('map');
    let divMapaCoordenada = document.getElementById('mapaCoordenada');
    let txtLatitud = document.getElementById('txtLatitud');
    let txtLongitud = document.getElementById('txtLongitud');

    var btncrear = document.getElementById('btncrear');
    var btnborrar = document.getElementById('btnborrar');
    var btnrepartidor = document.getElementById('btnrepartidor');
    var btncrearrepartidor = document.getElementById('btncrearrepartidor');
    var btnsubirarchivo = document.getElementById('btnSubirArchivo');
   


    divRepartidores = document.getElementById('divRepartidores');
    
    cargando.setAttribute("src", "img/cargando.gif");
    divRepartidores.append(cargando);


    map = new google.maps.Map(div, {

        zoom: 16

    });

    mapacoordenada = new google.maps.Map(divMapaCoordenada, {

        zoom: 16


    });

    markerCoordenada = new google.maps.Marker();

    mapacoordenada.addListener('click', (coors) => {

        txtLatitud.value = coors.latLng.lat();
        txtLongitud.value = coors.latLng.lng();


        markerCoordenada.setMap(null);

        markerCoordenada = new google.maps.Marker({
            position: coors.latLng,
            map: mapacoordenada,
            draggable: true,
            icon: "img/present.png",
            title: "Repartidor"
        });

        let txtBusqueda = document.getElementById('txtBusqueda');

        let searchBox = new google.maps.places.SearchBox(txtBusqueda);
        mapacoordenada.controls[google.maps.ControlPosition.TOP_LEFT].push(txtBusqueda);

        mapacoordenada.addListener('bounds_changed', function () {
            searchBox.setBounds(mapacoordenada.getBounds());
        });

        searchBox.addListener('places_changed', function () {
            var places = searchBox.getPlaces();

            if (places.length == 0) {
                return;
            }

            places.forEach((place) => {
                console.log(place.geometry.location.lat());
            });
        });


    });


    btncrear.addEventListener('click', crearMarcador);
    btnborrar.addEventListener('click', borrarMarcador);
    btnrepartidor.addEventListener('click', traerRepartidor);
    btncrearrepartidor.addEventListener('click', crearRepartidor);
    btnsubirarchivo.addEventListener('click', subirArchivo);
   


}




//usando geolocalización
let getLocation = () => {

    if (navigator.geolocation) {
        //navegador tiene disponible la geolocalizacion

        navigator.geolocation.getCurrentPosition((position) => {

            miPosicion.lat = position.coords.latitude;
            miPosicion.lng = position.coords.longitude;
            map.setCenter(miPosicion);

            mapacoordenada.setCenter(miPosicion);


        }, (error) => {
            console.log("error", error);

        });


    } else {
        // el navegador no soporta geolocalizacion
        alert("Tu navegador no soporta geolocalización");
    }



}

getLocation();
window.addEventListener('load', initMap);

let llenarRepartidor = (data) => {

    if (data) {
        
        
        divRepartidores.innerHTML = "";

        repartidoresFirebase=[];

        data.forEach((fila) => {

            console.log("ID", fila.key);
            console.log("Nombre", fila.val().nombre);

            repartidoresFirebase.push(new Repartidor(fila.key, fila.val().nombre, fila.val().ruta, fila.val().telefono, fila.val().latitud, fila.val().longitud));




        });

        

        let tabla = document.createElement("table");
       


        tabla.setAttribute("class", "table");

        let thead = document.createElement("thead");
        thead.setAttribute("class", "thead-dark");


        let trCabecera = document.createElement("tr");
       
        let tdIdCabecera = document.createElement("th");
        tdIdCabecera.innerHTML = "ID";

        let tdNombreCabecera = document.createElement("th");
        tdNombreCabecera.innerHTML = "NOMBRE";

        let tdImagenCabecera = document.createElement("th");
        tdImagenCabecera.innerHTML = "IMAGEN";

        let tdAccion = document.createElement("th");
        tdAccion.innerHTML = "ELIMINAR";


        trCabecera.append(tdIdCabecera);
        trCabecera.append(tdNombreCabecera);
        trCabecera.append(tdImagenCabecera);
        trCabecera.append(tdAccion);

        thead.append(trCabecera);

        tabla.append(thead);

        repartidoresFirebase.forEach((repartidor) => {

            let tr = document.createElement("tr");
            tr.setAttribute("id",repartidor.id);

            let tdId = document.createElement("td");
            tdId.innerHTML = repartidor.id;


            let tdNombre = document.createElement("td");
            tdNombre.innerHTML = repartidor.nombre;

            let tdImagen = document.createElement("td");
            let ImgImagen = document.createElement("img");
            ImgImagen.setAttribute("src",repartidor.ruta);
            ImgImagen.setAttribute("width","100");
            ImgImagen.setAttribute("height","100");
            tdImagen.append(ImgImagen);

            let tdBorrar = document.createElement("td");
            tdBorrar.innerHTML = `<button id="btnborrar" type="button" onclick="eliminarRepartidor('${repartidor.id}')" class="btn btn-danger btn-lg btn-block">Eliminar</button>`


            tr.append(tdId);
            tr.append(tdNombre);
            tr.append(tdImagen);
            tr.append(tdBorrar);

            tabla.append(tr);

            // llenar marcadores
            let marcador1 = new google.maps.Marker({

                position: { lat: repartidor.latitud, lng: repartidor.longitud },
                map: map,
                icon: "img/present.png",
                draggable: true


            });


            marcadoresFirebase.push(marcador1);

        });

        divRepartidores.append(tabla);
        console.log(repartidoresFirebase);


    } else {
        divRepartidores.innerHTML = "<h2> No hay Repartidores </h2>"
    }

}

function eliminarRepartidor(id){

    
    
    firebase.database().ref(`repartidores/${id}`).remove();

    
}
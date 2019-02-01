class Repartidor{

      

    constructor(id,nombre,ruta,telefono,latitud,longitud){
        
        this._id=id;
        this._nombre=nombre;
        this._ruta=ruta;
        this._telefono=telefono;
        this._latitud=latitud;
        this._longitud=longitud;

    }

    get id(){
        return this._id;
    }

    set id(id){
        return this._id=id;
    }

    get nombre(){
        return this._nombre;
    }

    set nombre(nombre){
        return this._nombre=nombre;
    }

    get ruta(){
        return this._ruta;
    }

    set ruta(ruta){
        return this._ruta=ruta;
    }

    get telefono(){
        return this._telefono;
    }

    set telefono(telefono){
        return this._telefono=telefono;
    }

    get latitud(){
        return this._latitud;
    }

    set latitud(latitud){
        return this._latitud=latitud;
    }

    get longitud(){
        return this._longitud;
    }

    set longitud(longitud){
        return this._longitud=longitud;
    }


}
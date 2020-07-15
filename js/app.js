 listadoContactos=document.querySelector('#listado-contactos tbody');
const formularioContactos = document.querySelector('#contacto');
eventListeners();

function eventListeners(){
//cuando el formulario de editar  o crear se ejecute
formularioContactos.addEventListener('submit',leerFormulario);
///listener para eliminar el regitro
listadoContactos.addEventListener('click',eliminarContacto);
}
function leerFormulario(e){
    e.preventDefault();
    // leer los daos de los inputs
    const nombre=document.querySelector('#nombre').value,
           telefono=document.querySelector('#telefono').value,
           empresa=document.querySelector('#empresa').value;
           accion=document.querySelector('#accion').value;
   if(nombre==='' || telefono===''||empresa===''){
    //dos parametros y clase 
    mostrarNotificacion('Revise su registro','error');

   }else{
      /// pasa la validacion, crea llamado a ajax
      const infoContacto=new FormData();
      infoContacto.append('nombre',nombre);
      infoContacto.append('empresa',empresa);
      infoContacto.append('telefono',telefono);
      infoContacto.append('accion',accion);
    /// console.log(...infoContacto);
      if(accion==='crear'){
          //crearemos un nuevo elemento
          insertarBD(infoContacto);
      }else{
          //editar el contacto 
      }

   }
}   
//funcion de base de datos
function insertarBD(datos){
    //llamado a ajax
  const xhr=new XMLHttpRequest();
    //crear objeto
    //abrir la conexion 
    xhr.open('POST','inc/modelos/modelo-contacto.php',true);
    //pasar los datos
    xhr.onload=function(){
        if(this.status=== 200){
            console.log(xhr.responseText);
            //Leemos la respuesta de php
            const respuesta =JSON.parse(xhr.responseText);
           //insertar un nuevo elemento en la pantalla
           const nuevoContacto =document.createElement('tr');
            nuevoContacto.innerHTML=`
            <td>${respuesta.datos.nombre}</td>
            <td>${respuesta.datos.empresa}</td>
            <td>${respuesta.datos.telefono}</td>
            `;
            //crear contenido para los botones
            const contenedorAcciones=document.createElement('td');
            //crear icono de editar
            const iconoEditar=document.createElement('i');
            iconoEditar.classList.add('fas','fa-pen-square');
            //create el enlace
            const btnEditar=document.createElement('a');
            btnEditar.appendChild(iconoEditar);
            btnEditar.href=`editar.php?id=${respuesta.datos.id_insertado}`;
            btnEditar.classList.add('btn','btn-editar');
            //agregar al padre
            contenedorAcciones.appendChild(btnEditar);
            //crear el icono de eliminar
            const iconoEliminar=document.createElement('i');
            iconoEliminar.classList.add('fas','fa-trash-alt');
            //crear el boton de eliminar
        const btnEliminar=document.createElement('button');
        btnEliminar.appendChild(iconoEliminar);
        btnEliminar.setAttribute('data-id',respuesta.datos.id_indertado);
        btnEliminar.classList.add('btn','btn-borrar');
        //agreagar al padre
        contenedorAcciones.appendChild(btnEliminar);
        //agregarlo al tr
        nuevoContacto.appendChild(contenedorAcciones);
        //agregarlo con los contactos
        listadoContactos.appendChild(nuevoContacto);
// recetear el contenido del formulario
        document.querySelector('form').reset();
/// mostrarr la notificación
         mostrarNotificacion('registro correcto','correcto')   
        }
    }
    //enviar los datos 
    //leer los errores
    xhr.send(datos)

}///elimianr el contacto
function eliminarContacto(e){
    if(e.target.parentElement.classList.contains('btn-borrar')){
        const id=e.target.parentElement.getAttribute
        const respuesta=confirm('¿Estas Seguro?');
        if(respuesta){
            const xhr=new XMLHttpRequest();
            xhr.open('GET', `inc/modelos/modelo-contacto.php?id=${id}&accion=borrar`,true);
            xhr.onload=function(){
                if(this.status===200){
                    const resultado=JSON.parse(xhr.responseText);
                    console.log(resultado);
                }
            }
            xhr.send();
        }
    }
}
//notificación en pantalla 
//
function mostrarNotificacion(mensaje,clase){
    const notificacion=document.createElement('div');
   notificacion.classList.add(clase,'notificacion','sombra');
    notificacion.textContent=mensaje;
    // formulario
    formularioContactos.insertBefore(notificacion, document.querySelector('form legend'));
// ocultar o mostrara por tiempo
setTimeout(()=>{
  notificacion.classList.add('visible');
   setTimeout(()=>{
         notificacion.classList.remove('visible');
         setTimeout(()=>{
            notificacion.remove();
         },500);
        },3000);
},100);
}
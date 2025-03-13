// console.log("<------- Personal Budget -------->");

/**
 * "Como usuario, quiero registrar el nombre, tipo(ingreso ó egreso) y monto 
 * de una compra o ingreso, para llevar un control de mi dinero."
Criterios de Aceptación:
El sistema solicita el nombre y duración.
Si el nombre está vacío o la duración es menor o igual a cero, muestra un mensaje de error.
Si los datos son válidos, se guarda la actividad.
 */

// variable global que permita registrar las operaciones
// 
const form = document.querySelector("form");

form.addEventListener("submit", function (event) {

  event.preventDefault();
  
})
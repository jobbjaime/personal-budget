console.log("<------- Personal Budget -------->");

/**
 * "Como usuario, quiero registrar el nombre, tipo(ingreso ó egreso) y monto 
 * de una compra o ingreso, para llevar un control de mi dinero."
Criterios de Aceptación:
El sistema solicita el nombre y duración.
Si el nombre está vacío o la duración es menor o igual a cero, muestra un mensaje de error.
Si los datos son válidos, se guarda la actividad.
 */

// variable global que permita registrar las operaciones
const transacciones = [];

function registrarIngresoOEgreso() {
  while (true) {
    const transaccion = prompt("Ingrese la nueva transacción");
    const tipoDeTransaccion = prompt(
      "Escoja el tipo de transacción \n1) Ingreso\n2) Egreso\n\n Solo debe poner el número de la opción"
    );
    const monto = prompt("Ingrese el monto de la transacción");

    transacciones.push({
      transaccion,
      tipoDeTransaccion,
      monto,
    });

    const confirmacion = confirm("Desea agregar otra transacción?");
    // ok => true: continuar con otra transaccion
    // cancel => false: terminar la transaccion
    // en que caso deberiamos detener el while
    if (confirmacion === false) {
      // detener el while
      break;
    }
  }
}

registrarIngresoOEgreso();
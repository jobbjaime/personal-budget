// Función constructora base para Movimiento
function Movimiento(descripcion, monto) {
  this.descripcion = descripcion;
  this.monto = monto;
  this.fecha = new Date();
  this.id = 'mov_' + Date.now() + Math.floor(Math.random() * 1000);
}

// Métodos comunes en el prototipo de Movimiento
Movimiento.prototype.validar = function() {
  const errores = [];

  // Validaciones generales
  if (!this.descripcion || this.descripcion.trim() === '') {
    errores.push('La descripción no puede estar vacía');
  }

  if (isNaN(this.monto) || this.monto <= 0) {
    errores.push('El monto debe ser un número mayor que cero');
  }

  // Ejecutar validaciones específicas del tipo de movimiento
  const erroresEspecificos = this.validarEspecifico();
  return [...errores, ...erroresEspecificos];
};

Movimiento.prototype.validarEspecifico = function() {
  // Método a sobreescribir en las subclases
  return [];
};

Movimiento.prototype.formatearMonto = function() {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN'
  }).format(this.monto);
};

Movimiento.prototype.crearElementoDOM = function() {
  const fila = document.createElement('tr');
  fila.id = this.id;
  
  // Tipo de movimiento (se muestra en diferentes colores según el tipo)
  const celdaTipo = document.createElement('td');
  celdaTipo.className = 'px-6 py-4';
  
  const spanTipo = document.createElement('span');
  spanTipo.className = this.obtenerClaseEstilo();
  spanTipo.textContent = this.tipo;
  celdaTipo.appendChild(spanTipo);
  
  // Descripción
  const celdaDescripcion = document.createElement('td');
  celdaDescripcion.className = 'px-6 py-4';
  celdaDescripcion.textContent = this.descripcion;
  
  // Monto
  const celdaMonto = document.createElement('td');
  celdaMonto.className = 'px-6 py-4 text-right';
  celdaMonto.textContent = this.formatearMonto();
  
  // Acciones
  const celdaAcciones = document.createElement('td');
  celdaAcciones.className = 'px-6 py-4 text-right';
  
  const botonEliminar = document.createElement('button');
  botonEliminar.className = 'text-red-600 hover:text-red-900';
  botonEliminar.textContent = 'Eliminar';
  botonEliminar.addEventListener('click', () => this.eliminar());
  
  celdaAcciones.appendChild(botonEliminar);
  
  // Agregar celdas a la fila
  fila.appendChild(celdaTipo);
  fila.appendChild(celdaDescripcion);
  fila.appendChild(celdaMonto);
  fila.appendChild(celdaAcciones);
  
  return fila;
};

Movimiento.prototype.eliminar = function() {
  // Eliminar del DOM
  const elemento = document.getElementById(this.id);
  if (elemento) {
    elemento.remove();
  }
  
  // Eliminar del almacenamiento
  eliminarMovimientoDelAlmacenamiento(this.id);
  
  // Actualizar resumen usando el método del prototipo
  this.recalcularTotales();
};

Movimiento.prototype.recalcularTotales = function() {
  // Obtener todos los movimientos del almacenamiento
  const movimientos = JSON.parse(localStorage.getItem('movimientos') || '[]');
  
  // Calcular totales
  const totalIngresos = movimientos
    .filter(mov => mov.tipo === 'ingreso')
    .reduce((sum, mov) => sum + mov.monto, 0);
    
  const totalGastos = movimientos
    .filter(mov => mov.tipo === 'gasto')
    .reduce((sum, mov) => sum + mov.monto, 0);
  
  const balance = totalIngresos - totalGastos;
  
  // Actualizar en la UI
  document.getElementById('total-ingresos').textContent = formatearMoneda(totalIngresos);
  document.getElementById('total-gastos').textContent = formatearMoneda(totalGastos);
  document.getElementById('balance').textContent = formatearMoneda(balance);
  
  // Retornar los totales para posibles usos adicionales
  return {
    ingresos: totalIngresos,
    gastos: totalGastos,
    balance: balance
  };
};

// Función constructora para Ingreso (hereda de Movimiento)
function Ingreso(descripcion, monto) {
  Movimiento.call(this, descripcion, monto);
  this.tipo = 'ingreso';
}

// Heredar del prototipo de Movimiento
Ingreso.prototype = Object.create(Movimiento.prototype);
Ingreso.prototype.constructor = Ingreso;

// Métodos específicos para Ingreso
Ingreso.prototype.validarEspecifico = function() {
  const errores = [];
  // Validaciones específicas para ingresos
  // Por ejemplo, asegurar que el ingreso tenga categoría válida si es necesario
  return errores;
};

Ingreso.prototype.obtenerClaseEstilo = function() {
  return 'inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800';
};

// Función constructora para Egreso (hereda de Movimiento)
function Egreso(descripcion, monto) {
  Movimiento.call(this, descripcion, monto);
  this.tipo = 'gasto';
}

// Heredar del prototipo de Movimiento
Egreso.prototype = Object.create(Movimiento.prototype);
Egreso.prototype.constructor = Egreso;

// Métodos específicos para Egreso
Egreso.prototype.validarEspecifico = function() {
  const errores = [];
  // Validaciones específicas para gastos
  // Por ejemplo, asegurar que no exceda un límite de gasto si lo hubiera
  return errores;
};

Egreso.prototype.obtenerClaseEstilo = function() {
  return 'inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800';
};

// Función de fábrica para crear el tipo adecuado de movimiento
function crearMovimiento(tipo, descripcion, monto) {
  if (tipo === 'ingreso') {
    return new Ingreso(descripcion, monto);
  } else if (tipo === 'gasto') {
    return new Egreso(descripcion, monto);
  } else {
    throw new Error('Tipo de movimiento no válido');
  }
}

// Función para gestionar la creación de un nuevo movimiento
function registrarMovimiento(tipo, descripcion, monto) {
  try {
    // Crear la instancia adecuada según el tipo
    const movimiento = crearMovimiento(tipo, descripcion, parseFloat(monto));
    
    // Validar el movimiento
    const errores = movimiento.validar();
    if (errores.length > 0) {
      // Si hay errores, mostrarlos y no continuar
      mostrarErrores(errores);
      return false;
    }
    
    // Si no hay errores, añadir a la lista de movimientos
    agregarMovimientoALista(movimiento);
    
    // Guardar en almacenamiento
    guardarMovimientoEnAlmacenamiento(movimiento);
    
    // Actualizar resumen usando el método del prototipo
    movimiento.recalcularTotales();
    
    return true;
  } catch (error) {
    console.error('Error al registrar movimiento:', error);
    mostrarErrores(['Error al procesar el movimiento']);
    return false;
  }
}

// Funciones auxiliares para gestión de almacenamiento y UI

function guardarMovimientoEnAlmacenamiento(movimiento) {
  // Obtener movimientos actuales
  const movimientos = JSON.parse(localStorage.getItem('movimientos') || '[]');
  
  // Añadir el nuevo movimiento
  movimientos.push({
    id: movimiento.id,
    tipo: movimiento.tipo,
    descripcion: movimiento.descripcion,
    monto: movimiento.monto,
    fecha: movimiento.fecha.toISOString()
  });
  
  // Guardar en localStorage
  localStorage.setItem('movimientos', JSON.stringify(movimientos));
}

function eliminarMovimientoDelAlmacenamiento(id) {
  // Obtener movimientos actuales
  const movimientos = JSON.parse(localStorage.getItem('movimientos') || '[]');
  
  // Filtrar el movimiento a eliminar
  const movimientosActualizados = movimientos.filter(mov => mov.id !== id);
  
  // Guardar en localStorage
  localStorage.setItem('movimientos', JSON.stringify(movimientosActualizados));
}

function agregarMovimientoALista(movimiento) {
  const tabla = document.getElementById('lista-movimientos');
  
  // Comprobar si hay mensaje "No hay movimientos"
  const mensajeVacio = tabla.querySelector('tr.text-center');
  if (mensajeVacio) {
    mensajeVacio.remove();
  }
  
  // Crear elemento DOM para el movimiento
  const elementoMovimiento = movimiento.crearElementoDOM();
  
  // Añadir a la tabla
  tabla.appendChild(elementoMovimiento);
}

function mostrarErrores(errores) {
  alert(errores.join('\n'));
}

function actualizarResumen() {
  // Crear un movimiento temporal solo para acceder al método recalcularTotales
  const tempMovimiento = new Movimiento("", 0);
  return tempMovimiento.recalcularTotales();
}

function formatearMoneda(valor) {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN'
  }).format(valor);
}

function cargarMovimientosGuardados() {
  // Obtener movimientos del almacenamiento
  const movimientosGuardados = JSON.parse(localStorage.getItem('movimientos') || '[]');
  
  // Vaciar la lista actual
  const tabla = document.getElementById('lista-movimientos');
  tabla.innerHTML = '';
  
  // Si no hay movimientos, mostrar mensaje
  if (movimientosGuardados.length === 0) {
    const fila = document.createElement('tr');
    fila.className = 'text-center text-gray-500';
    
    const celda = document.createElement('td');
    celda.colSpan = 4;
    celda.className = 'px-6 py-4';
    celda.textContent = 'No hay movimientos registrados';
    
    fila.appendChild(celda);
    tabla.appendChild(fila);
    return;
  }
  
  // Crear instancias para cada movimiento guardado
  movimientosGuardados.forEach(movGuardado => {
    let movimiento;
    if (movGuardado.tipo === 'ingreso') {
      movimiento = new Ingreso(movGuardado.descripcion, movGuardado.monto);
    } else {
      movimiento = new Egreso(movGuardado.descripcion, movGuardado.monto);
    }
    
    // Restaurar propiedades adicionales
    movimiento.id = movGuardado.id;
    movimiento.fecha = new Date(movGuardado.fecha);
    
    // Añadir a la UI
    agregarMovimientoALista(movimiento);
  });
  
  // Actualizar resumen usando el método del prototipo
  // Crear un movimiento temporal solo para acceder al método recalcularTotales
  const tempMovimiento = new Movimiento("", 0);
  tempMovimiento.recalcularTotales();
}

// Inicialización y gestión de eventos
document.addEventListener('DOMContentLoaded', function() {
  // Cargar movimientos almacenados
  cargarMovimientosGuardados();
  
  // Gestionar envío del formulario
  const formulario = document.getElementById('form-movimiento');
  formulario.addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Obtener valores del formulario
    const tipo = document.querySelector('input[name="tipo"]:checked').value;
    const descripcion = document.getElementById('descripcion').value;
    const monto = document.getElementById('monto').value;
    
    // Registrar el movimiento
    const exitoso = registrarMovimiento(tipo, descripcion, monto);
    
    // Si se registró correctamente, resetear el formulario
    if (exitoso) {
      formulario.reset();
    }
  });
  
  // Gestionar botón de limpiar todo
  const botonLimpiar = document.getElementById('limpiar-movimientos');
  botonLimpiar.addEventListener('click', function() {
    if (confirm('¿Estás seguro de querer eliminar todos los movimientos?')) {
      // Limpiar localStorage
      localStorage.removeItem('movimientos');
      
      // Limpiar UI
      const tabla = document.getElementById('lista-movimientos');
      tabla.innerHTML = '';
      
      // Mostrar mensaje de "No hay movimientos"
      const fila = document.createElement('tr');
      fila.className = 'text-center text-gray-500';
      
      const celda = document.createElement('td');
      celda.colSpan = 4;
      celda.className = 'px-6 py-4';
      celda.textContent = 'No hay movimientos registrados';
      
      fila.appendChild(celda);
      tabla.appendChild(fila);
      
      // Crear un movimiento temporal solo para acceder al método recalcularTotales
      const tempMovimiento = new Movimiento("", 0);
      tempMovimiento.recalcularTotales();
    }
  });
});
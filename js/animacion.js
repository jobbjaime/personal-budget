// Código JavaScript para aplicar las animaciones dinámicamente

document.addEventListener('DOMContentLoaded', function() {
    // Función para destacar los cambios en los totales
    const highlightElement = (elementId) => {
      const element = document.getElementById(elementId);
      // Eliminar la clase si ya existe para reiniciar la animación
      element.classList.remove('highlight');
      // Forzar un reflow
      void element.offsetWidth;
      // Añadir la clase para iniciar la animación
      element.classList.add('highlight');
    };
  
    // Modificación a recalcularTotales para añadir efectos de animación
    const originalRecalcularTotales = Movimiento.prototype.recalcularTotales;
    Movimiento.prototype.recalcularTotales = function() {
      // Valores antiguos para comparar
      const oldIngresos = document.getElementById('total-ingresos').textContent;
      const oldGastos = document.getElementById('total-gastos').textContent;
      const oldBalance = document.getElementById('balance').textContent;
      
      // Llamar a la función original
      const result = originalRecalcularTotales.call(this);
      
      // Comprobar cambios y aplicar animaciones
      const newIngresos = document.getElementById('total-ingresos').textContent;
      const newGastos = document.getElementById('total-gastos').textContent;
      const newBalance = document.getElementById('balance').textContent;
      
      if (oldIngresos !== newIngresos) {
        highlightElement('total-ingresos');
      }
      
      if (oldGastos !== newGastos) {
        highlightElement('total-gastos');
      }
      
      if (oldBalance !== newBalance) {
        highlightElement('balance');
      }
      
      return result;
    };
  
    // Modificación a la función agregarMovimientoALista para añadir animaciones
    const originalAgregarMovimientoALista = agregarMovimientoALista;
    window.agregarMovimientoALista = function(movimiento) {
      originalAgregarMovimientoALista(movimiento);
      
      // Aplicar animación fadeInUp al nuevo elemento
      const elementoMovimiento = document.getElementById(movimiento.id);
      if (elementoMovimiento) {
        elementoMovimiento.style.opacity = '0';
        elementoMovimiento.style.transform = 'translateY(20px)';
        
        // Forzar un reflow
        void elementoMovimiento.offsetWidth;
        
        // Aplicar la transición
        elementoMovimiento.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
        elementoMovimiento.style.opacity = '1';
        elementoMovimiento.style.transform = 'translateY(0)';
      }
    };
  
    // Añadir efecto de error a los campos del formulario cuando hay validación fallida
    const mostrarErroresOriginal = mostrarErrores;
    window.mostrarErrores = function(errores) {
      mostrarErroresOriginal(errores);
      
      // Aplicar animación de error a los campos relacionados
      if (errores.some(error => error.includes('descripción'))) {
        const campoDescripcion = document.getElementById('descripcion');
        campoDescripcion.classList.add('error');
        setTimeout(() => campoDescripcion.classList.remove('error'), 800);
      }
      
      if (errores.some(error => error.includes('monto'))) {
        const campoMonto = document.getElementById('monto');
        campoMonto.classList.add('error');
        setTimeout(() => campoMonto.classList.remove('error'), 800);
      }
    };
  });
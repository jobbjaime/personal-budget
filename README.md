# personal-budget

# Gestor de Presupuesto

Un aplicativo web para administrar ingresos y gastos personales, desarrollado con HTML, CSS y JavaScript utilizando conceptos avanzados de programación orientada a objetos.

## 🚀 Características

- **Interfaz responsiva** desarrollada con HTML semántico y Tailwind CSS
- **Gestión de ingresos y gastos** con validaciones específicas para cada tipo
- **Cálculo automático en tiempo real** de totales y balance
- **Persistencia de datos** mediante almacenamiento local
- **Animaciones y transiciones** para mejorar la experiencia de usuario
- **Diseño semántico** con una estructura clara de header, main y footer

## 🛠️ Tecnologías utilizadas

- **HTML5** con enfoque en etiquetas semánticas
- **Tailwind CSS** para estilos responsivos
- **JavaScript** con programación orientada a objetos y herencia prototipal
- **LocalStorage API** para persistencia de datos

## 📋 Implementación técnica

### Estructura semántica HTML

La aplicación implementa una estructura semántica completa con:
- `<header>` principal para el título de la aplicación
- `<main>` con secciones para resumen, formulario y lista de movimientos
- `<footer>` con información de copyright y créditos

### Herencia Prototipal en JavaScript

El sistema utiliza herencia prototipal para gestionar los movimientos financieros:

```javascript
// Función constructora base
function Movimiento(descripcion, monto) {
  this.descripcion = descripcion;
  this.monto = monto;
  this.fecha = new Date();
  this.id = 'mov_' + Date.now() + Math.floor(Math.random() * 1000);
}

// Funciones constructoras específicas
function Ingreso(descripcion, monto) {
  Movimiento.call(this, descripcion, monto);
  this.tipo = 'ingreso';
}

function Egreso(descripcion, monto) {
  Movimiento.call(this, descripcion, monto);
  this.tipo = 'gasto';
}
```

### Actualización Automática mediante Prototipos

Los totales se actualizan automáticamente mediante métodos heredados:

```javascript
Movimiento.prototype.recalcularTotales = function() {
  // Cálculo y actualización en tiempo real
  const movimientos = JSON.parse(localStorage.getItem('movimientos') || '[]');
  
  const totalIngresos = movimientos
    .filter(mov => mov.tipo === 'ingreso')
    .reduce((sum, mov) => sum + mov.monto, 0);
    
  const totalGastos = movimientos
    .filter(mov => mov.tipo === 'gasto')
    .reduce((sum, mov) => sum + mov.monto, 0);
  
  const balance = totalIngresos - totalGastos;
  
  // Actualización de la UI
  // ...
};
```

### Animaciones y Transiciones

La aplicación incluye diversas animaciones CSS y JavaScript:

- Animaciones de entrada para elementos al cargar la página
- Efectos de pulsación para botones y elementos interactivos
- Destacado visual para cambios en totales financieros
- Animaciones de validación para mostrar errores
- Transiciones suaves para mejorar la experiencia de usuario

## 🧪 Criterios de aceptación implementados

- ✅ Estructura semántica HTML con header, main y footer
- ✅ Formulario con elementos adecuados para tipo, monto y descripción
- ✅ Estilos responsivos con Tailwind CSS
- ✅ Herencia prototipal para clasificar movimientos
- ✅ Validaciones específicas para cada tipo de movimiento
- ✅ Actualización automática de totales mediante herencia
- ✅ Interfaz mejorada con animaciones CSS

## ✒️ Autor

* **Jaime Castro** - *Desarrollador*

---
Por [Jaime Castro](https://github.com/jobbjaime?tab=repositories)
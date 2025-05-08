import moment from 'moment';
import 'moment/locale/es.js';

moment.locale('es');

console.log('Fecha actual en formato largo (español):', moment().format('LLLL'));
console.log('Nombre del mes actual (español):', moment().format('MMMM'));
console.log('Nombre del día de la semana actual (español):', moment().format('dddd'));

// Para comparar, veamos cómo se vería en inglés (sin cambiar el locale global)
const ahoraEnIngles = moment().format('LLLL');
console.log('Fecha actual en formato largo (inglés):', ahoraEnIngles);

// Si necesitas cambiar el locale solo para una instancia:
const otraFechaEnEspanol = moment().locale('es').format('LLLL');
console.log('Otra fecha en español (forzado en la instancia):', otraFechaEnEspanol);
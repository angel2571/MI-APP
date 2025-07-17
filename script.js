window.addEventListener('load', () => {
  const splash = document.getElementById('splash');
  setTimeout(() => splash.style.display = 'none', 2500);
});

// Menú semanal
const menu = {
  lunes: 'Ensalada + pollo a la plancha (rico en proteínas y fibra)',
  martes: 'Arroz integral + pescado + verduras (energía sostenida)',
  miércoles: 'Pasta integral + verduras (carbohidratos complejos)',
  jueves: 'Quinua + ensalada + huevo (aminoácidos esenciales)',
  viernes: 'Sopa de verduras + carne magra (nutritivo y ligero)',
  sábado: 'Arroz con lentejas + plátano asado (proteína vegetal)',
  domingo: 'Frutas + yogur + granola (fibra y probióticos)'
};

const menuList = document.getElementById('menu-semanal');
Object.entries(menu).forEach(([dia, comida]) => {
  const li = document.createElement('li');
  li.textContent = `${dia.charAt(0).toUpperCase() + dia.slice(1)}: ${comida}`;
  menuList.appendChild(li);
});

const historialUl = document.getElementById('historial-usuario');
const form = document.getElementById('formulario');
const recomendacionDiv = document.getElementById('recomendacion');
const ctx = document.getElementById('graficoProgreso').getContext('2d');
let chart;

function mostrarHistorial() {
  historialUl.innerHTML = '';
  const historial = JSON.parse(localStorage.getItem('historial')) || [];

  historial.forEach((item, i) => {
    const li = document.createElement('li');
    li.textContent = `Entrada ${i + 1}: Peso: ${item.peso}kg, Estatura: ${item.estatura}cm, Edad: ${item.edad} → ${item.recomendacion}`;
    historialUl.appendChild(li);
  });
}

function actualizarGrafico() {
  const historial = JSON.parse(localStorage.getItem('historial')) || [];

  const etiquetas = historial.map((_, i) => `Entrada ${i + 1}`);
  const pesos = historial.map(entry => parseFloat(entry.peso));

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: etiquetas,
      datasets: [{
        label: 'Peso (kg)',
        data: pesos,
        fill: false,
        borderColor: '#d916ae',
        backgroundColor: '#d916ae',
        tension: 0.2,
        pointRadius: 5,
        pointBackgroundColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: false,
          title: {
            display: true,
            text: 'Peso (kg)'
          }
        }
      },
      plugins: {
        title: {
          display: true,
          text: 'Evolución del Peso',
          font: {
            size: 20
          }
        }
      }
    }
  });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const peso = parseFloat(document.getElementById('peso').value);
  const estatura = parseFloat(document.getElementById('estatura').value);
  const edad = parseInt(document.getElementById('edad').value);

  let recomendacion = '';

  if (peso < 50) {
    recomendacion = 'Debes incluir más calorías saludables: frutos secos, aguacate, proteína.';
  } else if (peso >= 50 && peso <= 70) {
    recomendacion = 'Buen peso. Mantén una dieta balanceada con frutas, proteínas y fibra.';
  } else {
    recomendacion = 'Evita grasas saturadas. Consume más verduras, cereales integrales y agua.';
  }

  recomendacionDiv.innerHTML = `<p><strong>Recomendación:</strong> ${recomendacion}</p>`;

  const historial = JSON.parse(localStorage.getItem('historial')) || [];

  historial.push({
    peso,
    estatura,
    edad,
    recomendacion
  });

  localStorage.setItem('historial', JSON.stringify(historial));

  mostrarHistorial();
  actualizarGrafico();
});

mostrarHistorial();
actualizarGrafico();

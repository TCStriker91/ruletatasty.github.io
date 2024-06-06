document.addEventListener('DOMContentLoaded', (event) => {
    dibujarRuleta();
});

let codigos = [
    6823, 4571, 3719, 8160, 3527, 6543, 9427, 1093, 7892, 4036,
    7281, 1594, 6438, 3871, 2069, 5943, 4806, 2915, 3064, 1738,
    8230, 9517, 6183, 7294, 5038, 2641, 8372, 4150, 9863, 2735,
    6924, 1473, 8542, 3917, 2760, 5048, 6921, 8371, 5649, 1804,
    4937, 8274, 6138, 2701, 9352, 7829, 1046, 3562, 8791, 4705,
    6850, 9027, 1736, 8049, 5238, 6714, 2983, 4071, 9364, 7182,
    1569, 2847, 5103, 8247, 6719, 4058, 2074, 5983, 7214, 4309,
    8927, 6503, 3198, 2746, 5831, 7920, 1038, 6517, 9824, 3761,
    5490, 7816, 3409, 2951, 4786, 6209, 1574, 8093, 2743, 5162,
    4039, 7485, 3927, 5816, 2049, 9731, 6184, 7502, 1378, 9041
];

let premios = [
    { nombre: "Helado", cantidad: 34 },
    { nombre: "Gaseosa", cantidad: 34 },
    { nombre: "Cuarto de Pollo", cantidad: 16 },
    { nombre: "Octavo de Pollo", cantidad: 16 }
];

let probabilidades = [85, 60, 1.5, 6];
let codigosUsados = {};
let codigosPremios = {};

codigos.forEach((codigo, index) => {
    const premioIndex = index % premios.length;
    if (!codigosPremios[premioIndex]) {
        codigosPremios[premioIndex] = [];
    }
    codigosPremios[premioIndex].push(codigo);
});

function validarCodigo() {
    let codigo = parseInt(document.getElementById('codigo').value);
    if (codigos.includes(codigo) && !codigosUsados[codigo]) {
        codigosUsados[codigo] = Date.now();
        girarRuleta(codigo);
    } else {
        alert("Código inválido o ya utilizado.");
    }
}

function dibujarRuleta() {
    const canvas = document.getElementById('ruleta');
    const ctx = canvas.getContext('2d');
    const colors = ["#FFDDC1", "#FFABAB", "#FFC3A0", "#FF677D"];
    const angle = (2 * Math.PI) / premios.length;

    for (let i = 0; i < premios.length; i++) {
        ctx.beginPath();
        ctx.moveTo(200, 200);
        ctx.arc(200, 200, 200, angle * i, angle * (i + 1));
        ctx.closePath();
        ctx.fillStyle = colors[i];
        ctx.fill();
        ctx.save();
        ctx.translate(200, 200);
        ctx.rotate(angle * (i + 0.5));
        ctx.textAlign = "right";
        ctx.fillStyle = "#000";
        ctx.font = "20px Arial";
        ctx.fillText(premios[i].nombre, 180, 10);
        ctx.restore();
    }
}

function girarRuleta(codigo) {
    const canvas = document.getElementById('ruleta');
    const ctx = canvas.getContext('2d');
    let startAngle = 0;
    let spinTime = 0;
    const spinTimeTotal = Math.random() * 3000 + 4000;

    function rotate() {
        spinTime += 30;
        if (spinTime >= spinTimeTotal) {
            detenerRuleta(codigo);
            return;
        }
        const spinAngle = easeOut(spinTime, 0, 10 * 360, spinTimeTotal);
        startAngle += (spinAngle * Math.PI / 180);
        dibujarRuletaConAngulo(startAngle);
        requestAnimationFrame(rotate);
    }
    rotate();
}

function easeOut(t, b, c, d) {
    t /= d;
    t--;
    return c * (t * t * t + 1) + b;
}

function dibujarRuletaConAngulo(angle) {
    const canvas = document.getElementById('ruleta');
    const ctx = canvas.getContext('2d');
    const colors = ["#FFDDC1", "#FFABAB", "#FFC3A0", "#FF677D"];
    const arc = (2 * Math.PI) / premios.length;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < premios.length; i++) {
        ctx.beginPath();
        ctx.moveTo(200, 200);
        ctx.arc(200, 200, 200, arc * i + angle, arc * (i + 1) + angle);
        ctx.closePath();
        ctx.fillStyle = colors[i];
        ctx.fill();
        ctx.save();
        ctx.translate(200, 200);
        ctx.rotate(arc * (i + 0.5) + angle);
        ctx.textAlign = "right";
        ctx.fillStyle = "#000";
        ctx.font = "20px Arial";
        ctx.fillText(premios[i].nombre, 180, 10);
        ctx.restore();
    }
}

function detenerRuleta(codigo) {
    const premioIndex = seleccionarPremio();
    const premioGanado = premios[premioIndex].nombre;
    const codigoPremio = codigosPremios[premioIndex].pop();

    document.getElementById('mensaje').innerText = `¡Felicitaciones! Has ganado: ${premioGanado}`;
    mostrarAviso(`¡Felicitaciones! Has ganado: ${premioGanado}. Código de canje: ${codigoPremio}`);
}

function seleccionarPremio() {
    const rand = Math.random() * 100;
    let acumulado = 0;

    for (let i = 0; i < probabilidades.length; i++) {
        acumulado += probabilidades[i];
        if (rand < acumulado) {
            return i;
        }
    }

    return 0; // Fallback in case no match, should not happen
}

function mostrarAviso(mensaje) {
    const aviso = document.getElementById('aviso-premio');
    const contenido = document.getElementById('contenido-aviso');
    contenido.innerText = mensaje;
    aviso.style.display = 'flex';
}

function cerrarAviso() {
    const aviso = document.getElementById('aviso-premio');
    aviso.style.display = 'none';
}

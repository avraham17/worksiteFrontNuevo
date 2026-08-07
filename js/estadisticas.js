$(function () {
    cargarEstadisticas();
});

function cargarEstadisticas() {
    callApi("http://localhost:8080/estadisticas", "GET", null, mostrarEstadisticas, function (error) {
        console.error("Error al cargar estadísticas:", error);
        $("#estadoCargando").hide();
        $("#estadoError").show();
    });
}

function mostrarEstadisticas(response) {
    var e = response.data;

    $("#estadoCargando").hide();
    $("#contenidoEstadisticas").show();

    // Tarjetas resumen
    $("#statTotalUsuarios").text(e.totalUsuarios);
    $("#statCandidatos").text(e.totalCandidatos);
    $("#statEmpresas").text(e.totalEmpresas);
    $("#statTotalOfertas").text(e.totalOfertas);
    $("#statOfertasActivas").text(e.ofertasActivas);
    $("#statTotalPostulaciones").text(e.totalPostulaciones);

    dibujarGraficoPostulaciones(e);
    dibujarGraficoUsuarios(e);
}

function dibujarGraficoPostulaciones(e) {
    var ctx = document.getElementById("graficoPostulaciones").getContext("2d");

    new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Aceptadas", "Rechazadas", "Pendientes"],
            datasets: [{
                data: [e.postulacionesAceptadas, e.postulacionesRechazadas, e.postulacionesPendientes],
                backgroundColor: ["#22c55e", "#ef4444", "#f59e0b"],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "bottom",
                    labels: { boxWidth: 14, font: { size: 12.5 } }
                }
            }
        }
    });
}

function dibujarGraficoUsuarios(e) {
    var ctx = document.getElementById("graficoUsuarios").getContext("2d");

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Candidatos", "Empresas"],
            datasets: [{
                label: "Usuarios",
                data: [e.totalCandidatos, e.totalEmpresas],
                backgroundColor: ["#2563eb", "#1e40af"],
                borderRadius: 8,
                maxBarThickness: 60
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { precision: 0 }
                }
            }
        }
    });
}

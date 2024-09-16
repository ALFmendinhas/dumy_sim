let etapaAtual = 1;
let dadosIniciais = {};
let despesasPessoais = {};

function avancarEtapa() {
    if (etapaAtual === 1) {
        coletarDadosIniciais();
        document.getElementById('etapa1').style.display = 'none';
        document.getElementById('etapa2').style.display = 'block';
        etapaAtual = 2;
    } else if (etapaAtual === 2) {
        coletarDespesasPessoais();
        calcularResultados();
        document.getElementById('etapa2').style.display = 'none';
        document.getElementById('etapa3').style.display = 'block';
        etapaAtual = 3;
    }
}

function coletarDadosIniciais() {
    dadosIniciais = {
        salarioBruto: parseFloat(document.getElementById('salarioBruto').value) || 0,
        subsidioAlimentacao: parseFloat(document.getElementById('subsidioAlimentacao').value) || 0,
        outrosBeneficios: parseFloat(document.getElementById('outrosBeneficios').value) || 0
    };
}

function coletarDespesasPessoais() {
    despesasPessoais = {
        internet: parseFloat(document.getElementById('internet').value) || 0,
        transporte: parseFloat(document.getElementById('transporte').value) || 0,
        combustivel: parseFloat(document.getElementById('combustivel').value) || 0,
        equipamentoTrabalho: parseFloat(document.getElementById('equipamentoTrabalho').value) || 0,
        formacaoProfissional: parseFloat(document.getElementById('formacaoProfissional').value) || 0
    };
}

function calcularResultados() {
    const resultadoFuncionario = calcularCenarioFuncionario();
    const resultadoENI = calcularCenarioENI();

    exibirResultados(resultadoFuncionario, resultadoENI);
    criarGrafico(resultadoFuncionario, resultadoENI);
}

function calcularCenarioFuncionario() {
    const totalBruto = dadosIniciais.salarioBruto + dadosIniciais.subsidioAlimentacao + dadosIniciais.outrosBeneficios;
    const impostos = totalBruto * 0.3; // Simulação simplificada de impostos
    return {
        bruto: totalBruto,
        liquido: totalBruto - impostos,
        impostos: impostos
    };
}

function calcularCenarioENI() {
    const faturacao = dadosIniciais.salarioBruto * 1.2; // Simulação de faturação como ENI
    const despesas = Object.values(despesasPessoais).reduce((a, b) => a + b, 0);
    const lucro = faturacao - despesas;
    const impostos = lucro * 0.25; // Simulação simplificada de impostos para ENI
    return {
        bruto: faturacao,
        liquido: lucro - impostos,
        impostos: impostos
    };
}

function exibirResultados(resultadoFuncionario, resultadoENI) {
    const resultadosDiv = document.getElementById('resultados');
    resultadosDiv.innerHTML = `
        <h3>Cenário Funcionário</h3>
        <p>Bruto: ${resultadoFuncionario.bruto.toFixed(2)}€</p>
        <p>Líquido: ${resultadoFuncionario.liquido.toFixed(2)}€</p>
        <p>Impostos: ${resultadoFuncionario.impostos.toFixed(2)}€</p>
        <h3>Cenário ENI</h3>
        <p>Bruto: ${resultadoENI.bruto.toFixed(2)}€</p>
        <p>Líquido: ${resultadoENI.liquido.toFixed(2)}€</p>
        <p>Impostos: ${resultadoENI.impostos.toFixed(2)}€</p>
    `;
}

function criarGrafico(resultadoFuncionario, resultadoENI) {
    const ctx = document.getElementById('grafico').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Funcionário', 'ENI'],
            datasets: [{
                label: 'Rendimento Bruto',
                data: [resultadoFuncionario.bruto, resultadoENI.bruto],
                backgroundColor: 'rgba(54, 162, 235, 0.5)'
            }, {
                label: 'Rendimento Líquido',
                data: [resultadoFuncionario.liquido, resultadoENI.liquido],
                backgroundColor: 'rgba(75, 192, 192, 0.5)'
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

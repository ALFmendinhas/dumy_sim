let etapaAtual = 1;
let dadosIniciais = {};
let despesasPessoais = {};
let grafico;

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
        <div>
            <label>Salário Bruto: <input type="number" id="func_salarioBruto" value="${dadosIniciais.salarioBruto.toFixed(2)}" onchange="atualizarResultados()"></label>
        </div>
        <div>
            <label>Subsídio Alimentação: <input type="number" id="func_subsidioAlimentacao" value="${dadosIniciais.subsidioAlimentacao.toFixed(2)}" onchange="atualizarResultados()"></label>
        </div>
        <div>
            <label>Outros Benefícios: <input type="number" id="func_outrosBeneficios" value="${dadosIniciais.outrosBeneficios.toFixed(2)}" onchange="atualizarResultados()"></label>
        </div>
        <p>Bruto: <span id="func_bruto">${resultadoFuncionario.bruto.toFixed(2)}</span>€</p>
        <p>Líquido: <span id="func_liquido">${resultadoFuncionario.liquido.toFixed(2)}</span>€</p>
        <p>Impostos: <span id="func_impostos">${resultadoFuncionario.impostos.toFixed(2)}</span>€</p>
        
        <h3>Cenário ENI</h3>
        <div>
            <label>Faturação: <input type="number" id="eni_faturacao" value="${resultadoENI.bruto.toFixed(2)}" onchange="atualizarResultados()"></label>
        </div>
        <div>
            <label>Despesas: <input type="number" id="eni_despesas" value="${Object.values(despesasPessoais).reduce((a, b) => a + b, 0).toFixed(2)}" onchange="atualizarResultados()"></label>
        </div>
        <p>Bruto: <span id="eni_bruto">${resultadoENI.bruto.toFixed(2)}</span>€</p>
        <p>Líquido: <span id="eni_liquido">${resultadoENI.liquido.toFixed(2)}</span>€</p>
        <p>Impostos: <span id="eni_impostos">${resultadoENI.impostos.toFixed(2)}</span>€</p>
    `;
}

function criarGrafico(resultadoFuncionario, resultadoENI) {
    const ctx = document.getElementById('grafico').getContext('2d');
    if (grafico) {
        grafico.destroy();
    }
    grafico = new Chart(ctx, {
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

function atualizarResultados() {
    dadosIniciais = {
        salarioBruto: parseFloat(document.getElementById('func_salarioBruto').value) || 0,
        subsidioAlimentacao: parseFloat(document.getElementById('func_subsidioAlimentacao').value) || 0,
        outrosBeneficios: parseFloat(document.getElementById('func_outrosBeneficios').value) || 0
    };

    const eniFaturacao = parseFloat(document.getElementById('eni_faturacao').value) || 0;
    const eniDespesas = parseFloat(document.getElementById('eni_despesas').value) || 0;

    const resultadoFuncionario = calcularCenarioFuncionario();
    const resultadoENI = {
        bruto: eniFaturacao,
        liquido: eniFaturacao - eniDespesas - (eniFaturacao - eniDespesas) * 0.25,
        impostos: (eniFaturacao - eniDespesas) * 0.25
    };

    document.getElementById('func_bruto').textContent = resultadoFuncionario.bruto.toFixed(2);
    document.getElementById('func_liquido').textContent = resultadoFuncionario.liquido.toFixed(2);
    document.getElementById('func_impostos').textContent = resultadoFuncionario.impostos.toFixed(2);

    document.getElementById('eni_bruto').textContent = resultadoENI.bruto.toFixed(2);
    document.getElementById('eni_liquido').textContent = resultadoENI.liquido.toFixed(2);
    document.getElementById('eni_impostos').textContent = resultadoENI.impostos.toFixed(2);

    criarGrafico(resultadoFuncionario, resultadoENI);
}

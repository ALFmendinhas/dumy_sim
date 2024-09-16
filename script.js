let etapaAtual = 1;
let dadosIniciais = {};
let despesasPessoais = {};
let cenarioFuncionario = {};
let cenarioENI = {};
let grafico;

function avancarEtapa() {
    document.getElementById(`etapa${etapaAtual}`).style.display = 'none';
    etapaAtual++;
    document.getElementById(`etapa${etapaAtual}`).style.display = 'block';

    if (etapaAtual === 2) {
        coletarDadosIniciais();
    } else if (etapaAtual === 3) {
        coletarDespesasPessoais();
        gerarCenarios();
        exibirComparacao();
        adicionarEventListeners();
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

function gerarCenarios() {
    cenarioFuncionario = {
        salarioBruto: dadosIniciais.salarioBruto,
        subsidioAlimentacao: dadosIniciais.subsidioAlimentacao,
        outrosBeneficios: dadosIniciais.outrosBeneficios
    };

    cenarioENI = {
        faturacao: dadosIniciais.salarioBruto * 1.2,
        despesasOperacionais: despesasPessoais.internet + despesasPessoais.transporte + despesasPessoais.combustivel,
        equipamentos: despesasPessoais.equipamentoTrabalho,
        formacao: despesasPessoais.formacaoProfissional,
        salarioProprio: dadosIniciais.salarioBruto * 0.7
    };
}

function calcularTotais(cenario, tipo) {
    let totalBruto, impostos, liquido;

    if (tipo === 'funcionario') {
        totalBruto = cenario.salarioBruto + cenario.subsidioAlimentacao + cenario.outrosBeneficios;
        impostos = totalBruto * 0.3; // Simulação simplificada de impostos
        liquido = totalBruto - impostos;
    } else {
        totalBruto = cenario.faturacao;
        const despesasTotais = cenario.despesasOperacionais + cenario.equipamentos + cenario.formacao + cenario.salarioProprio;
        const lucro = totalBruto - despesasTotais;
        impostos = lucro * 0.25; // Simulação simplificada de impostos para ENI
        liquido = lucro - impostos;
    }

    return { totalBruto, impostos, liquido };
}

function exibirComparacao() {
    exibirCenario('Funcionario', cenarioFuncionario);
    exibirCenario('ENI', cenarioENI);
    criarGrafico();
}

function exibirCenario(tipo, cenario) {
    const div = document.getElementById(`cenario${tipo}`);
    div.innerHTML = '';
    for (const [chave, valor] of Object.entries(cenario)) {
        div.innerHTML += `
            <div class="input-group">
                <label>${chave}: 
                    <input type="number" class="cenario-input" data-tipo="${tipo.toLowerCase()}" data-chave="${chave}" value="${valor.toFixed(2)}">
                </label>
            </div>`;
    }

    atualizarTotais(tipo, cenario);
}

function atualizarTotais(tipo, cenario) {
    const totais = calcularTotais(cenario, tipo.toLowerCase());
    const divTotal = document.getElementById(`total${tipo}`);
    divTotal.innerHTML = `
        <h4>Totais:</h4>
        <p>Bruto: ${totais.totalBruto.toFixed(2)}€</p>
        <p>Impostos: ${totais.impostos.toFixed(2)}€</p>
        <p><strong>Líquido: ${totais.liquido.toFixed(2)}€</strong></p>
    `;
}

function criarGrafico() {
    const totaisFuncionario = calcularTotais(cenarioFuncionario, 'funcionario');
    const totaisENI = calcularTotais(cenarioENI, 'eni');

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
                data: [totaisFuncionario.totalBruto, totaisENI.totalBruto],
                backgroundColor: 'rgba(54, 162, 235, 0.5)'
            }, {
                label: 'Rendimento Líquido',
                data: [totaisFuncionario.liquido, totaisENI.liquido],
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

function adicionarEventListeners() {
    const inputs = document.querySelectorAll('.cenario-input');
    inputs.forEach(input => {
        input.addEventListener('input', atualizarCenario);
    });
}

function atualizarCenario(event) {
    const tipo = event.target.dataset.tipo;
    const chave = event.target.dataset.chave;
    const valor = parseFloat(event.target.value) || 0;

    if (tipo === 'funcionario') {
        cenarioFuncionario[chave] = valor;
        atualizarTotais('Funcionario', cenarioFuncionario);
    } else {
        cenarioENI[chave] = valor;
        atualizarTotais('ENI', cenarioENI);
    }

    criarGrafico();
}

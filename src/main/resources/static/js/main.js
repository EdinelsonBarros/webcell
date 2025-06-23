$(document).ready(function() {
	$('#mytable').on('input customInput', 'td[contenteditable=true]', handleCellEdit);
});

// ---------------------------------------------
// Função principal que trata a edição da célula
// ---------------------------------------------
function handleCellEdit() {
	let td = $(this);
	let tr = td.closest('tr');
	let rowIndex = tr.index();
	let colName = td.data('col');
	let value = td.text().trim();

	console.log('Edição capturada');

	if (isDateField(colName)) {
		// Evita criar múltiplos inputs se já estiver editando
		if (!td.find('input').length) {
			createDateInput(td, value, rowIndex, colName, tr);
		}
		return; // Evita salvar o valor antes da validação
	}

	// Para outros campos, salva normalmente
	saveToSession(rowIndex, colName, value);
	checkAndSubmitRow(tr, rowIndex);
}

// ---------------------------------------------
// Verifica se o campo é do tipo data
// ---------------------------------------------
function isDateField(colName) {
	return colName === 'dtini' || colName === 'dtfim';
}

// ---------------------------------------------
// Cria input para campo de data com máscara
// ---------------------------------------------
function createDateInput(td, value, rowIndex, colName, tr) {
	td.empty();

	const input = $('<input type="text" maxlength="10" placeholder="dd/mm/aaaa" />')
		.val(value)
		.css({
			'height': '100%',
			'width': '100%',
			'box-sizing': 'border-box',
			'line-height': '1.2',
			'padding': 0,
			'margin': 0,
			'font-size': 'inherit',
			'border': 'none'
		})
		.appendTo(td)
		.mask('00/00/0000')
		.focus();

	// Tecla Enter confirma a edição
	input.on('keydown', function(e) {
		if (e.key === 'Enter') {
			e.preventDefault();
			$(this).trigger('blur');
		}
	});

	// Valida e salva a data ao sair do input
	input.on('blur', function() {
		handleDateValidation($(this), td, rowIndex, colName, tr);
	});
}

// ---------------------------------------------
// Valida a data digitada no input
// ---------------------------------------------
function handleDateValidation(input, td, rowIndex, colName, tr) {
	td.css({ 'border': '1px solid rgb(160, 160, 160)' });
	const val = input.val().trim();

	if (val === '' || isValidDate(val)) {
		td.text(val);
		input.remove();
		document.querySelector("#invalidDate").innerHTML = "";

		saveToSession(rowIndex, colName, val);
		checkAndSubmitRow(tr, rowIndex);
	} else {
		const span = document.querySelector("#invalidDate");
		span.innerHTML = "Informe uma data válida";
		td = input.closest('td');
		td.css({ 'border': '2px solid red' });
	}
}

// ---------------------------------------------
// Salva valor da célula no sessionStorage
// ---------------------------------------------
function saveToSession(rowIndex, colName, value) {
	let rowData = JSON.parse(sessionStorage.getItem('linha_' + rowIndex)) || {};
	rowData[colName] = value;
	sessionStorage.setItem('linha_' + rowIndex, JSON.stringify(rowData));
}

// ---------------------------------------------
// Verifica se linha está completa e envia via AJAX
// ---------------------------------------------
function checkAndSubmitRow(tr, rowIndex) {
	let rowData = JSON.parse(sessionStorage.getItem('linha_' + rowIndex));
	if (!rowData) return;

	let totalCols = tr.find('td').length; // ajuste se a última célula não for editável
	let filledCols = Object.values(rowData).filter(v => v !== '').length;

	console.log('Total cols:', totalCols);
	console.log('Filled cols:', filledCols);

	if (filledCols === (totalCols - 1)) {
		console.log("Linha completa");

		console.log(rowData)
		rowData.dtini = rowData.dtini.replace(/\//g, '-');
		rowData.dtfim = rowData.dtfim.replace(/\//g, '-');
		console.log(rowData)
		$.ajax({
			url: '/rowSave',
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify(rowData),
			success: function(response) {
				alert('Linha salva com sucesso!');
				sessionStorage.removeItem('linha_' + rowIndex);
				tr.find('td').attr('contenteditable', 'false');
			},
			error: function() {
				alert('Erro ao salvar a linha!');
			}
		});
	}
}

// ---------------------------------------------
// Função utilitária para validar datas no formato dd/mm/yyyy
// ---------------------------------------------
function isValidDate(dateString) {
	const [day, month, year] = dateString.split('/').map(Number);
	const date = new Date(year, month - 1, day);
	return (
		date.getFullYear() === year &&
		date.getMonth() === month - 1 &&
		date.getDate() === day
	);
}

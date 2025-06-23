$(document).ready(function() {

	restoreTableFromSession();

	$('#mytable').on('blur', 'td[contenteditable=true]', handleCellEdit);
});


// recupera os dados do sessionStorage quando a página é recarregada
function restoreTableFromSession() {
	Object.keys(sessionStorage).forEach(key => {
		if (key.startsWith('linha_')) {
			const rowIndex = parseInt(key.split('_')[1], 10);
			const rowData = JSON.parse(sessionStorage.getItem(key));

			const tr = $('#mytable tbody tr').eq(rowIndex);
			if (!tr.length) return; // se a linha não existir, pula

			tr.find('td[contenteditable=true]').each(function() {
				const td = $(this);
				const colName = td.data('col');
				if (rowData[colName]) {
					td.text(rowData[colName]);
				}
			});
		}
	});
}



// ---------------------------------------------
// Função principal que trata a edição da célula
// ---------------------------------------------
function handleCellEdit() {
	let td = $(this);
	let tr = td.closest('tr');
	let rowIndex = tr.index();
	let colName = td.data('col');
	let value = td.text().trim();

	const saved = JSON.parse(sessionStorage.getItem('linha_' + rowIndex)) || {};


	if (saved[colName] === value || saved[colName] == '') { // nada mudou, não precisa salvar de novo
		return;
	} else {
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


	//if (isDateField(colName)) return; // datas já são tratadas no input.blur
	console.log("Value", value.typeOf);




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

	if (value === '') {
		delete rowData[colName];
	} else {
		rowData[colName] = value;
	}

	// Só salva no sessionStorage se houver pelo menos um campo preenchido
	if (Object.keys(rowData).length > 0) {
		sessionStorage.setItem('linha_' + rowIndex, JSON.stringify(rowData));
	} else {
		sessionStorage.removeItem('linha_' + rowIndex); // remove a linha se estiver toda vazia
	}

	//rowData[colName] = value;
}

// ---------------------------------------------
// Verifica se linha está completa e envia via AJAX
// ---------------------------------------------
function checkAndSubmitRow(tr, rowIndex) {
	let rowData = JSON.parse(sessionStorage.getItem('linha_' + rowIndex));
	if (!rowData) return;

	rowData.status = 'saving'; // Adiciona o status na linha para salvando
	rowData.id = ' '; // adiciona o campo id para receber para futuras alterações no banco

	let totalCols = tr.find('td[contenteditable=true]').length; // ajuste se a última célula não for editável
	let filledCols = Object.values(rowData).filter(v => v !== '').length - 2; // -2 é para excluir da contagem o valor do status

	console.log('Total cols:', totalCols);
	console.log('Filled cols:', filledCols);
	console.log(rowData)

	if (filledCols === totalCols) {
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
				rowData.status = 'saved'; // Adiciona o status na linha para salvo
				//sessionStorage.removeItem('linha_' + rowIndex);
				console.log(rowData)
				console.log(response)
				//tr.find('td').attr('contenteditable', 'false');
			},
			error: function() {
				rowData.status = 'saveErro'; // Adiciona o status na linha erro ao salvar
				alert('Erro ao salvar a linha!');
				console.log(rowData)
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

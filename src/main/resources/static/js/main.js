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
			
			if(rowData.id){
				tr.attr('data-id', rowData.id);
			}
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
	
	if(value == '') return;

	const rowData = JSON.parse(sessionStorage.getItem('linha_' + rowIndex)) || {};
		
	if(rowData.id){
		saveToSession(rowIndex, colName, value)
		sendPatch(rowIndex, td, colName);
		return
	}		

		if (rowData[colName] === value) { // nada mudou, não precisa salvar de novo
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
			checkAndSubmitRow(tr, rowIndex, colName);
		}

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

	input.remove();
	
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


}


// ---------------------------------------------
// Verifica se linha está completa e envia via AJAX
// ---------------------------------------------
function checkAndSubmitRow(tr, rowIndex, colName) {
	let rowData = JSON.parse(sessionStorage.getItem('linha_' + rowIndex));
	console.log('Verificando ID da linha', rowData.id);
	if (!rowData) return;

	let totalCols = tr.find('td[contenteditable=true]').length;
	let filledCols = Object.values(rowData).filter(v => v !== '').length;

	// Verifica se todos os campos obrigatórios foram preenchidos
	if (filledCols !== totalCols) return;
	console.log('filledCols:', filledCols);
	console.log('totalCols:', totalCols);
	
	// Substitui '/' por '-' nas datas
	//Mudar posteriormente, para fazer persistencia com uma variavel que não afete a visualização data.
	if (rowData.dtini) rowData.dtini = rowData.dtini.replace(/\//g, '-');
	if (rowData.dtfim) rowData.dtfim = rowData.dtfim.replace(/\//g, '-');

	
	if (rowData.id == undefined) {
		sendPost(rowData, tr, rowIndex);
	} else {
		sendPatch(rowData, tr, rowIndex, colName);
	}


}

function sendPost(rowData, tr, rowIndex) {
	$.ajax({
		url: '/rowSave',
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify(rowData),
		success: function(response) {
			//alert('Nova linha salva!');
			//tr.attr('data-id', response.id);

			// Se o back-end retornar o ID da nova linha, salve no sessionStorage
			if (response && response.id) {
				rowData.id = response.id;
				sessionStorage.setItem('linha_' + rowIndex, JSON.stringify(rowData));
				
			}
		},
		error: function() {
			//alert('Erro ao salvar nova linha.');
		}
	});
}


function sendPatch(rowIndex, td, colName) {
	//pegar o valor atual
	const rowData = JSON.parse(sessionStorage.getItem('linha_' + rowIndex)) || {};
	let actualValue = rowData[colName];
	
	let cellUpdate = {
		id: rowData.id,
		campo: td.data('col'),
		valor: actualValue
	};
	
	console.log(cellUpdate);
	$.ajax({
		url: '/updateCell',
		type: 'PATCH',
		contentType: 'application/json',
		data: JSON.stringify(cellUpdate),
		success: function() {
			//alert('Linha atualizada!');
			
		},
		error: function() {
			//tr.attr('data-status', 'updateError');
			
		}
	});

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

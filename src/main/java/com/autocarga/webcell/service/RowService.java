package com.autocarga.webcell.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.autocarga.webcell.domain.Row;
import com.autocarga.webcell.domain.RowDTO;
import com.autocarga.webcell.repository.RowRepository;



@Service
public class RowService {
	@Autowired
	RowRepository rowRepository;
	

public ResponseEntity<Row> saveRow(RowDTO rowDTO) {
    try {
        Row row = new Row();
        row.setNumlinha(rowDTO.numlinha());
        row.setNumfunc(rowDTO.numfunc());
        row.setNumvinc(rowDTO.numvinc());
        row.setNome(rowDTO.nome());
        row.setCpf(rowDTO.cpf());
        row.setCargo(rowDTO.cargo());
        row.setCodigo_atividade(rowDTO.codigo_atividade());
        row.setSetor(rowDTO.setor());
        row.setCh_arq(rowDTO.ch_arq());
        row.setDisciplina(rowDTO.disciplina());
        row.setAih(rowDTO.aih());
        row.setArquivo(rowDTO.arquivo());
        row.setDtini(rowDTO.dtini());
        row.setDtfim(rowDTO.dtfim());

        Row savedRow = rowRepository.save(row); // salvar e guardar a referência

        return ResponseEntity.status(HttpStatus.CREATED).body(savedRow); // retornar a entidade salva

    } catch (Exception e) {
        e.printStackTrace(); // substitua por logger se quiser
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}
	
	public String updateRow(Row r) {
		Optional<Row>  rowUpdate = rowRepository.findById(r.getId());
		// continuar a fazer método do update
		
		return "";
	}
}

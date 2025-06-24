package com.autocarga.webcell.service;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.autocarga.webcell.domain.CellDTO;
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
	

	public ResponseEntity<String> updateCell(CellDTO c) {
		Optional<Row>  rowUpdate = rowRepository.findById(c.id());
		
		Row row = rowUpdate.get();
		
		switch (c.campo()) {
	    case "numlinha" -> row.setNumlinha(c.valor());
	    case "numfunc" -> row.setNumfunc(c.valor());
	    case "numvinc" -> row.setNumvinc(c.valor());
	    case "nome" -> row.setNome(c.valor());
	    case "cpf" -> row.setCpf(c.valor());
	    case "cargo" -> row.setCargo(c.valor());
	    case "codigo_atividade" -> row.setCodigo_atividade(c.valor());
	    case "setor" -> row.setSetor(c.valor());
	    case "ch_arq" -> row.setCh_arq(c.valor());
	    case "disciplina" -> row.setDisciplina(c.valor());
	    case "aih" -> row.setAih(c.valor());
	    case "arquivo" -> row.setArquivo(c.valor());
	    case "dtini" -> {
	        try {
	            row.setDtini(LocalDate.parse(c.valor())); // Formato esperado: yyyy-MM-dd
	        } catch (DateTimeParseException e) {
	            return ResponseEntity.badRequest().body("Data inválida para dtini. Use o formato yyyy-MM-dd.");
	        }
	    }
	    case "dtfim" -> {
	        try {
	            row.setDtfim(LocalDate.parse(c.valor()));
	        } catch (DateTimeParseException e) {
	            return ResponseEntity.badRequest().body("Data inválida para dtfim. Use o formato yyyy-MM-dd.");
	        }
	    }
	    default -> {
	        return ResponseEntity.badRequest().body("Campo inválido");
	    }
	}
		return ResponseEntity.ok().build();

	}
}

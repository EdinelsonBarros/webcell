package com.autocarga.webcell.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.autocarga.webcell.domain.Row;
import com.autocarga.webcell.domain.RowDTO;
import com.autocarga.webcell.service.RowService;


@Controller
public class RowController {

	@Autowired
	RowService rowService;

	@RequestMapping("/")
	public String showForm() {
		return "rowsTemplate";
	}
	
	@PostMapping("/rowSave")
	public ResponseEntity<Row> addRows(@RequestBody RowDTO rowDTO) {

		return rowService.saveRow(rowDTO);

	}

	
	public ResponseEntity<String> updateRow(@RequestBody Row row){
		
		return ResponseEntity.ok("");
	}

}

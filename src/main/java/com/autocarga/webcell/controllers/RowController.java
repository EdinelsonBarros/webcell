package com.autocarga.webcell.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.autocarga.webcell.domain.CellDTO;
import com.autocarga.webcell.domain.Row;
import com.autocarga.webcell.domain.RowDTO;
import com.autocarga.webcell.service.RowService;


@Controller
public class RowController {

	@Autowired
	RowService rowService;

	@GetMapping("/")
	public String showForm() {
		return "rowsTemplate";
	}
	
	@PostMapping("/rowSave")
	public ResponseEntity<Row> addRows(@RequestBody RowDTO rowDTO) {

		return rowService.saveRow(rowDTO);

	}

	@PatchMapping("/updateCell")
	public ResponseEntity<String> updateCell(@RequestBody CellDTO c){
		
		return rowService.updateCell(c);
	}

}

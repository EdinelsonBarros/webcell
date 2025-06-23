package com.autocarga.webcell.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.autocarga.webcell.domain.Row;
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
	public ResponseEntity<String> addRows(@RequestBody Row rowRequest) {

		return ResponseEntity.ok(rowService.saveRow(rowRequest));

	}


}

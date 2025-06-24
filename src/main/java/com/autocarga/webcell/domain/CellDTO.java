package com.autocarga.webcell.domain;

public record CellDTO(
		String id, // ID do objeto Row que será atualizado
		String campo, // Nome do campo a ser alterado (ex: "nome", "cargo", "dtini", etc)
		String valor // Valor a ser colocado nesse campo (sempre como String)
) {}

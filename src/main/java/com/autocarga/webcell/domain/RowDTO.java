package com.autocarga.webcell.domain;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDate;

public record RowDTO(
    String numlinha,
    String numfunc,
    String numvinc,
    String nome,
    String cpf,
    String cargo,
    String codigo_atividade,
    String setor,
    String ch_arq,
    String disciplina,
    String aih,
    String arquivo,

    @JsonFormat(pattern = "dd-MM-yyyy")
    LocalDate dtini,

    @JsonFormat(pattern = "dd-MM-yyyy")
    LocalDate dtfim
) {}


package com.autocarga.webcell.domain;
import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;


@Entity(name = "linha")
public class Row {
	
	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	public String id;
	
	public String numlinha, numfunc, numvinc, nome, cpf,  
	cargo, codigo_atividade, setor, ch_arq, disciplina, aih, arquivo;
	
	public LocalDate dtini, dtfim;	
	
	public Row() {
		super();
	}



	public Row(String numlinha, String numfunc, String numvinc, String nome, String cpf, String cargo,
			String codigo_atividade, String setor, String ch_arq, String disciplina, String aih, String arquivo,
			LocalDate dtini, LocalDate dtfim) {
		super();
		this.numlinha = numlinha;
		this.numfunc = numfunc;
		this.numvinc = numvinc;
		this.nome = nome;
		this.cpf = cpf;
		this.cargo = cargo;
		this.codigo_atividade = codigo_atividade;
		this.setor = setor;
		this.ch_arq = ch_arq;
		this.disciplina = disciplina;
		this.aih = aih;
		this.arquivo = arquivo;
		this.dtini = dtini;
		this.dtfim = dtfim;
	}

	

	public String getId() {
		return id;
	}

	public String getNumlinha() {
		return numlinha;
	}

	public void setNumlinha(String numlinha) {
		this.numlinha = numlinha;
	}

	public String getNumfunc() {
		return numfunc;
	}

	public void setNumfunc(String numfunc) {
		this.numfunc = numfunc;
	}

	public String getNumvinc() {
		return numvinc;
	}

	public void setNumvinc(String numvinc) {
		this.numvinc = numvinc;
	}

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public String getCpf() {
		return cpf;
	}

	public void setCpf(String cpf) {
		this.cpf = cpf;
	}

	public String getCargo() {
		return cargo;
	}

	public void setCargo(String cargo) {
		this.cargo = cargo;
	}

	public String getCodigo_atividade() {
		return codigo_atividade;
	}

	public void setCodigo_atividade(String codigo_atividade) {
		this.codigo_atividade = codigo_atividade;
	}

	public String getSetor() {
		return setor;
	}

	public void setSetor(String setor) {
		this.setor = setor;
	}
	
	public String getCh_arq() {
		return ch_arq;
	}

	public void setCh_arq(String ch_arq) {
		this.ch_arq = ch_arq;
	}

	public String getDisciplina() {
		return disciplina;
	}

	public void setDisciplina(String disciplina) {
		this.disciplina = disciplina;
	}

	public String getAih() {
		return aih;
	}

	public void setAih(String aih) {
		this.aih = aih;
	}

	public String getArquivo() {
		return arquivo;
	}

	public void setArquivo(String arquivo) {
		this.arquivo = arquivo;
	}

	public LocalDate getDtini() {
		return dtini;
	}

	public void setDtini(LocalDate dtini) {
		this.dtini = dtini;
	}

	public LocalDate getDtfim() {
		return dtfim;
	}

	public void setDtfim(LocalDate dtfim) {
		this.dtfim = dtfim;
	}
	
}


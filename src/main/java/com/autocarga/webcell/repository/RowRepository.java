package com.autocarga.webcell.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.autocarga.webcell.domain.Row;


@Repository
public interface RowRepository extends JpaRepository<Row, String>  {

}

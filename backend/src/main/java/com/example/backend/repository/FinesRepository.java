package com.example.backend.repository;

import com.example.backend.models.Fines;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FinesRepository extends JpaRepository<Fines, Long> {
    List<Fines> findByPlateId(Long id);
}
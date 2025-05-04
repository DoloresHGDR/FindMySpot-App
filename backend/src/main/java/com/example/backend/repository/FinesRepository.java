package com.example.backend.repository;
import com.example.backend.models.Fines;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FinesRepository extends JpaRepository<Fines, Long> {
}



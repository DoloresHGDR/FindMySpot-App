package com.example.backend.repository;
import com.example.backend.models.Plates;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlatesRepository extends JpaRepository<Plates, Long> {
    List<Plates> findAllByUserId(Long userId);
    Plates findByNumber (String plateNumber);
}



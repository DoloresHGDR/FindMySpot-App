package com.example.backend.repository;
import com.example.backend.models.Parkings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ParkingsRepository extends JpaRepository<Parkings, Long> {
}



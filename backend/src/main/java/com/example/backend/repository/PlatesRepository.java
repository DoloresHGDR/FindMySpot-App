package com.example.backend.repository;
import com.example.backend.models.Plates;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface PlatesRepository extends JpaRepository<Plates, Long> {
    Plates findByUserId(Long userId);
}



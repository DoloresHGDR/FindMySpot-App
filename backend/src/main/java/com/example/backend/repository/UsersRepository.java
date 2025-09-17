package com.example.backend.repository;
import com.example.backend.models.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;


@Repository
public interface UsersRepository extends JpaRepository<Users, Long> {
    @Query("SELECT DISTINCT u FROM Users u WHERE u.identityNumber = :identityNumber")
    Users findByIdentityNumber(String identityNumber);
}

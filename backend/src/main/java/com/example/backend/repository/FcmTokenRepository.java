package com.example.backend.repository;
import com.example.backend.models.FcmToken;
import com.example.backend.models.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FcmTokenRepository extends JpaRepository<FcmToken, Long> {

    Optional<FcmToken> findByFcmToken(String fcmToken);
    Optional<FcmToken> findByUserAndFcmToken(Users user, String fcmToken);
    List<FcmToken> findAllByUser (Optional<Users> user);

}

package com.example.backend.repository;

import com.example.backend.models.DeviceToken;
import com.example.backend.models.UserDevice;
import com.example.backend.models.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserDeviceRepository extends JpaRepository<UserDevice, Long> {
    Optional<UserDevice> findByUserAndDeviceToken(Users user, DeviceToken deviceToken);
    List<UserDevice> findAllByUser(Users user);
}

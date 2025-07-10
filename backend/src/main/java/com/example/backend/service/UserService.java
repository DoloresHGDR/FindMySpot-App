package com.example.backend.service;
import com.example.backend.dtos.RegisterUserDTO;
import com.example.backend.models.Plates;
import com.example.backend.models.Users;
import com.example.backend.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;


@Service
public class UserService {
    private final UsersRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UsersRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public List<Users> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<Users> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<Users> getUserByIdentityNumber(String identityNumber) {
        return userRepository.findByIdentityNumber(identityNumber);
    }

    public void saveUser(RegisterUserDTO registerUserDTO) {
        Optional<Users> existingUser = userRepository.findByIdentityNumber(registerUserDTO.getIdentityNumber());

        if (existingUser.isPresent()) {
            throw new RuntimeException("User already exists");
        }

        Users user = new Users();
        user.setName(registerUserDTO.getName());
        user.setSurname(registerUserDTO.getSurname());
        user.setIdentityNumber(registerUserDTO.getIdentityNumber());
        user.setPassword(passwordEncoder.encode(registerUserDTO.getPassword()));
        user.setRole(registerUserDTO.getRole());
        userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
    
}

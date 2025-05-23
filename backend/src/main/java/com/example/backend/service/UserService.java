package com.example.backend.service;
import com.example.backend.dtos.LoginRequestDTO;
import com.example.backend.dtos.LoginResponseDTO;
import com.example.backend.dtos.RegisterUserDTO;
import com.example.backend.models.Users;
import com.example.backend.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;


@Service
public class UserService {
    private final UsersRepository userRepository;

    @Autowired
    public UserService(UsersRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<Users> getAllUsers() {
        return userRepository.findAll();
    }
    public Optional<Users> getUserById(Long id) {
        return userRepository.findById(id);
    }
    public LoginResponseDTO loginUser(LoginRequestDTO loginRequestDTO) {
        Optional<Users> optionalUsers = userRepository.findByIdentityNumber(loginRequestDTO.getIdentityNumber());
        if (optionalUsers.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        Users user = optionalUsers.get();
        if (!user.getPassword().equals(loginRequestDTO.getPassword())) {
            throw new RuntimeException("Wrong password");
        }
        return new LoginResponseDTO(
                user.getId(),
                user.getName(),
                user.getSurname(),
                user.getIdentityNumber(),
                user.getRole()
        );
    }
    public LoginResponseDTO saveUser(RegisterUserDTO registerUserDTO) {
        Users user = new Users();
        user.setName(registerUserDTO.getName());
        user.setSurname(registerUserDTO.getSurname());
        user.setIdentityNumber(registerUserDTO.getIdentityNumber());
        user.setPassword(registerUserDTO.getPassword());
        user.setRole(registerUserDTO.getRole());
        userRepository.save(user);

        return new LoginResponseDTO(
                user.getId(),
                user.getName(),
                user.getSurname(),
                user.getIdentityNumber(),
                user.getRole()
        );

    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
    
}

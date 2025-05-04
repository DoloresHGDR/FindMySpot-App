package com.example.backend.service;

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
    //}
    //public Optional<User> getUserByDni(String dni) {
    //    return userRepository.findByDni(dni);
    //}
    public Users saveUser(Users user) {
        return userRepository.save(user);
    }
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
    
}

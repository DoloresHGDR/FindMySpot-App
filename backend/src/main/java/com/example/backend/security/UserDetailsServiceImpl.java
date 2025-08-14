package com.example.backend.security;

import com.example.backend.models.Users;
import com.example.backend.repository.UsersRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UsersRepository userRepository;

    public UserDetailsServiceImpl(UsersRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String identityNumber) throws UsernameNotFoundException {
        Users user = userRepository.findByIdentityNumber(identityNumber);
        if (user == null) {
            throw new UsernameNotFoundException("Usuario no encontrado con identityNumber: " + identityNumber);
        }
        return UserDetailsImpl.build(user);
    }
}


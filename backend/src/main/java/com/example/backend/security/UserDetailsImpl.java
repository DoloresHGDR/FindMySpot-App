package com.example.backend.security;
import com.example.backend.models.Users;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Getter
@Setter
@EqualsAndHashCode
public class UserDetailsImpl implements UserDetails {

    @Getter
    private final Long id;
    private final String name;
    private final String surname;
    private final String identityNumber;
    private final String password;
    private final String role;
    private final Collection<? extends GrantedAuthority> authorities;

    public UserDetailsImpl(Long id, String name, String surname, String identityNumber, String password, String role, Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.identityNumber = identityNumber;
        this.password = password;
        this.role = role;
        this.authorities = authorities;
    }

    public static UserDetailsImpl build(Users user) {
        List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(user.getRole()));
        return new UserDetailsImpl(
                user.getId(),
                user.getName(),
                user.getSurname(),
                user.getIdentityNumber(),
                user.getPassword(),
                user.getRole(),
                authorities
        );
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return identityNumber;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

}

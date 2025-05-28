package com.example.backend.security;
import com.example.backend.models.Users;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@EqualsAndHashCode
public class UserDetailsImpl implements UserDetails {

    @Getter
    private final Long id;
    private final String identityNumber;
    private final String password;
    private final Collection<? extends GrantedAuthority> authorities;

    public UserDetailsImpl(Long id, String identityNumber, String password, Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.identityNumber = identityNumber;
        this.password = password;
        this.authorities = authorities;
    }

    public static UserDetailsImpl build(Users user) {
        List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(user.getRole()));
        return new UserDetailsImpl(
                user.getId(),
                user.getIdentityNumber(),
                user.getPassword(),
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

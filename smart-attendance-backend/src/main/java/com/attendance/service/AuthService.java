package com.attendance.service;

import com.attendance.dto.AuthResponse;
import com.attendance.dto.LoginRequest;
import com.attendance.dto.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}

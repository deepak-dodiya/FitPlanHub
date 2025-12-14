package com.fitplanhub.controller;

import com.fitplanhub.repository.UserRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;

@RestController
@RequestMapping("/api/public")
@CrossOrigin
public class PublicController {

    private final UserRepository userRepository;

    public PublicController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/trainers")
    public List<Map<String, Object>> getAllTrainers() {
        // Return limited info for public view (avoid password etc)
        return userRepository.findAllTrainers().stream()
                .map(user -> Map.of(
                        "id", (Object) user.getId(), // Cast to Object to satisfy Map.of
                        "fullName", user.getFullName(),
                        "username", user.getUsername()))
                .collect(Collectors.toList());
    }
}

package com.fitplanhub.controller;

import com.fitplanhub.model.Plan;
import com.fitplanhub.model.User;
import com.fitplanhub.repository.PlanRepository;
import com.fitplanhub.repository.SocialRepository;
import com.fitplanhub.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/social")
@CrossOrigin
public class SocialController {

    private final SocialRepository socialRepository;
    private final PlanRepository planRepository;
    private final UserRepository userRepository;

    public SocialController(SocialRepository socialRepository, PlanRepository planRepository,
            UserRepository userRepository) {
        this.socialRepository = socialRepository;
        this.planRepository = planRepository;
        this.userRepository = userRepository;
    }

    private User getCurrentUser(Authentication authentication) {
        return userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PostMapping("/follow/{trainerId}")
    public ResponseEntity<?> follow(@PathVariable Long trainerId, Authentication authentication) {
        User user = getCurrentUser(authentication);
        if (socialRepository.isFollowing(user.getId(), trainerId)) {
            return ResponseEntity.badRequest().body("Already following");
        }
        socialRepository.follow(user.getId(), trainerId);
        return ResponseEntity.ok("Followed");
    }

    @PostMapping("/unfollow/{trainerId}")
    public ResponseEntity<?> unfollow(@PathVariable Long trainerId, Authentication authentication) {
        User user = getCurrentUser(authentication);
        socialRepository.unfollow(user.getId(), trainerId);
        return ResponseEntity.ok("Unfollowed");
    }

    @GetMapping("/purchased")
    public List<Plan> getPurchasedPlans(Authentication authentication) {
        User user = getCurrentUser(authentication);
        List<Long> subscribedPlanIds = socialRepository.findSubscribedPlanIds(user.getId());
        List<Plan> purchased = new ArrayList<>();

        for (Long planId : subscribedPlanIds) {
            planRepository.findById(planId).ifPresent(purchased::add);
        }
        return purchased;
    }

    @GetMapping("/following")
    public List<Long> getFollowing(Authentication authentication) {
        User user = getCurrentUser(authentication);
        return socialRepository.findFollowedTrainerIds(user.getId());
    }
}

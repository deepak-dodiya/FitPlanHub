package com.fitplanhub.controller;

import com.fitplanhub.model.Plan;
import com.fitplanhub.model.User;
import com.fitplanhub.repository.PlanRepository;
import com.fitplanhub.repository.SocialRepository;
import com.fitplanhub.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/plans")
@CrossOrigin
public class PlanController {

    private final PlanRepository planRepository;
    private final UserRepository userRepository;
    private final SocialRepository socialRepository;

    public PlanController(PlanRepository planRepository, UserRepository userRepository,
            SocialRepository socialRepository) {
        this.planRepository = planRepository;
        this.userRepository = userRepository;
        this.socialRepository = socialRepository;
    }

    private User getCurrentUser(Authentication authentication) {
        if (authentication == null)
            return null;
        return userRepository.findByUsername(authentication.getName()).orElse(null);
    }

    @GetMapping
    public List<Plan> getAllPlans() {
        return planRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPlan(@PathVariable Long id, Authentication authentication) {
        Optional<Plan> planOpt = planRepository.findById(id);
        if (planOpt.isEmpty())
            return ResponseEntity.notFound().build();
        Plan plan = planOpt.get();

        User user = getCurrentUser(authentication);
        if (user != null) {
            // Check subscription or ownership
            boolean isOwner = plan.getTrainerId().equals(user.getId());
            boolean isSubscribed = socialRepository.isSubscribed(user.getId(), plan.getId());

            if (isOwner || isSubscribed) {
                plan.setSubscribed(isSubscribed); // Set the flag
                return ResponseEntity.ok(plan); // Return full details
            }
        }

        // Even if not fully authorized for "premium" content, we might want to return
        // the plan object
        // with isSubscribed = false so the UI knows.
        plan.setSubscribed(false);
        return ResponseEntity.ok(plan);
    }

    @PostMapping("/{id}/subscribe")
    public ResponseEntity<?> subscribe(@PathVariable Long id, Authentication authentication) {
        User user = getCurrentUser(authentication);
        if (user == null)
            return ResponseEntity.status(401).build();

        if (socialRepository.isSubscribed(user.getId(), id)) {
            return ResponseEntity.badRequest().body("Already subscribed");
        }

        socialRepository.subscribe(user.getId(), id);
        return ResponseEntity.ok("Subscribed successfully");
    }

    @PostMapping
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<?> createPlan(@RequestBody Plan plan, Authentication authentication) {
        User user = getCurrentUser(authentication); // Guaranteed not null by PreAuthorize usually
        plan.setTrainerId(user.getId());
        planRepository.save(plan);
        return ResponseEntity.ok("Plan created");
    }

    @GetMapping("/my-plans") // For trainers to see THEIR created plans
    @PreAuthorize("hasRole('TRAINER')")
    public List<Plan> getMyCreatedPlans(Authentication authentication) {
        User user = getCurrentUser(authentication);
        return planRepository.findByTrainerId(user.getId());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<?> deletePlan(@PathVariable Long id, Authentication authentication) {
        User user = getCurrentUser(authentication);
        Plan plan = planRepository.findById(id).orElse(null);
        if (plan == null)
            return ResponseEntity.notFound().build();

        if (!plan.getTrainerId().equals(user.getId())) {
            return ResponseEntity.status(403).body("Not your plan");
        }
        planRepository.deleteById(id);
        return ResponseEntity.ok("Plan deleted");
    }
}

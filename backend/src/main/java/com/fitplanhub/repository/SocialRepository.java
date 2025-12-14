package com.fitplanhub.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class SocialRepository {
    private final JdbcTemplate jdbcTemplate;

    public SocialRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void follow(Long followerId, Long followedId) {
        jdbcTemplate.update("INSERT IGNORE INTO follows (follower_id, followed_id) VALUES (?, ?)", followerId,
                followedId);
    }

    public void unfollow(Long followerId, Long followedId) {
        jdbcTemplate.update("DELETE FROM follows WHERE follower_id = ? AND followed_id = ?", followerId, followedId);
    }

    public boolean isFollowing(Long followerId, Long followedId) {
        Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM follows WHERE follower_id = ? AND followed_id = ?", Integer.class, followerId,
                followedId);
        return count != null && count > 0;
    }

    public List<Long> findFollowedTrainerIds(Long userId) {
        return jdbcTemplate.queryForList("SELECT followed_id FROM follows WHERE follower_id = ?", Long.class, userId);
    }

    public void subscribe(Long userId, Long planId) {
        jdbcTemplate.update("INSERT INTO subscriptions (user_id, plan_id) VALUES (?, ?)", userId, planId);
    }

    public boolean isSubscribed(Long userId, Long planId) {
        Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM subscriptions WHERE user_id = ? AND plan_id = ?", Integer.class, userId, planId);
        return count != null && count > 0;
    }

    public List<Long> findSubscribedPlanIds(Long userId) {
        return jdbcTemplate.queryForList("SELECT plan_id FROM subscriptions WHERE user_id = ?", Long.class, userId);
    }
}

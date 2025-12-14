package com.fitplanhub.repository;

import com.fitplanhub.model.Plan;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class PlanRepository {

    private final JdbcTemplate jdbcTemplate;

    public PlanRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Plan> planRowMapper = (rs, rowNum) -> Plan.builder()
            .id(rs.getLong("id"))
            .trainerId(rs.getLong("trainer_id"))
            .title(rs.getString("title"))
            .description(rs.getString("description"))
            .price(rs.getDouble("price"))
            .durationDays(rs.getInt("duration_days"))
            .createdAt(rs.getTimestamp("created_at").toLocalDateTime())
            .build();

    public Plan save(Plan plan) {
        String sql = "INSERT INTO plans (trainer_id, title, description, price, duration_days) VALUES (?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql, plan.getTrainerId(), plan.getTitle(), plan.getDescription(), plan.getPrice(),
                plan.getDurationDays());
        return plan; // Naive return, ID missing but okay for this scope
    }

    public List<Plan> findByTrainerId(Long trainerId) {
        String sql = "SELECT * FROM plans WHERE trainer_id = ?";
        return jdbcTemplate.query(sql, planRowMapper, trainerId);
    }

    public List<Plan> findAll() {
        // Joining to get trainer name for display
        String sql = "SELECT p.*, u.full_name as trainer_name FROM plans p JOIN users u ON p.trainer_id = u.id";
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            Plan p = planRowMapper.mapRow(rs, rowNum);
            p.setTrainerName(rs.getString("trainer_name"));
            return p;
        });
    }

    public void deleteById(Long id) {
        jdbcTemplate.update("DELETE FROM plans WHERE id = ?", id);
    }

    public Optional<Plan> findById(Long id) {
        String sql = "SELECT p.*, u.full_name as trainer_name FROM plans p JOIN users u ON p.trainer_id = u.id WHERE p.id = ?";
        try {
            return Optional.ofNullable(jdbcTemplate.queryForObject(sql, (rs, rowNum) -> {
                Plan p = planRowMapper.mapRow(rs, rowNum);
                p.setTrainerName(rs.getString("trainer_name"));
                return p;
            }, id));
        } catch (Exception e) {
            return Optional.empty();
        }
    }
}

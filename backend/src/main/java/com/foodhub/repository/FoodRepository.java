package com.foodhub.repository;

import com.foodhub.entity.Food;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoodRepository extends JpaRepository<Food, Long> {
    List<Food> findByRestaurantId(Long restaurantId);
    List<Food> findByRestaurantIdAndIsAvailableTrue(Long restaurantId);
    List<Food> findByCategoryIgnoreCase(String category);
    List<Food> findByNameContainingIgnoreCase(String name);
    List<Food> findByIsAvailableTrue();
}

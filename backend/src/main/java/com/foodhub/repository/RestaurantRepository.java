package com.foodhub.repository;

import com.foodhub.entity.Restaurant;
import com.foodhub.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    List<Restaurant> findByActiveTrue();
    List<Restaurant> findByCuisineTypeIgnoreCase(String cuisineType);
    List<Restaurant> findByNameContainingIgnoreCase(String name);
    Optional<Restaurant> findByOwner(User owner);
    List<Restaurant> findByOwnerId(Long ownerId);
}

package com.foodhub.service;

import com.foodhub.dto.FoodRequest;
import com.foodhub.entity.Food;
import com.foodhub.entity.Restaurant;
import com.foodhub.exception.ResourceNotFoundException;
import com.foodhub.repository.FoodRepository;
import com.foodhub.repository.RestaurantRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FoodService {

    private final FoodRepository foodRepository;
    private final RestaurantRepository restaurantRepository;

    public FoodService(FoodRepository foodRepository, RestaurantRepository restaurantRepository) {
        this.foodRepository = foodRepository;
        this.restaurantRepository = restaurantRepository;
    }

    public List<Food> getAllFoods() {
        return foodRepository.findAll();
    }

    public List<Food> getAvailableFoods() {
        return foodRepository.findByIsAvailableTrue();
    }

    public Food getFoodById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Food ID cannot be null");
        }
        return foodRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Food", "id", id));
    }

    public List<Food> getFoodsByRestaurant(Long restaurantId) {
        if (restaurantId == null) {
            return List.of();
        }
        return foodRepository.findByRestaurantId(restaurantId);
    }

    public List<Food> getFoodsByCategory(String category) {
        if (category == null || category.isBlank()) {
            return List.of();
        }
        return foodRepository.findByCategoryIgnoreCase(category);
    }

    public List<Food> searchFoods(String name) {
        if (name == null || name.isBlank()) {
            return getAllFoods();
        }
        return foodRepository.findByNameContainingIgnoreCase(name);
    }

    public Food createFood(FoodRequest request) {
        if (request == null || request.getRestaurantId() == null) {
            throw new IllegalArgumentException("Food request and restaurant ID cannot be null");
        }

        Restaurant restaurant = restaurantRepository.findById(request.getRestaurantId())
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant", "id", request.getRestaurantId()));

        Food food = new Food();
        food.setName(request.getName());
        food.setDescription(request.getDescription());
        food.setPrice(request.getPrice());
        food.setImageUrl(request.getImageUrl());
        food.setCategory(request.getCategory());
        food.setIsAvailable(request.getIsAvailable() != null ? request.getIsAvailable() : true);
        food.setRestaurant(restaurant);

        return foodRepository.save(food);
    }

    public Food updateFood(Long id, FoodRequest request) {
        if (id == null) {
            throw new IllegalArgumentException("Food ID cannot be null");
        }
        Food food = getFoodById(id);
        if (request == null) {
            return food;
        }
        if (request.getName() != null)
            food.setName(request.getName());
        if (request.getDescription() != null)
            food.setDescription(request.getDescription());
        if (request.getPrice() != null)
            food.setPrice(request.getPrice());
        if (request.getImageUrl() != null)
            food.setImageUrl(request.getImageUrl());
        if (request.getCategory() != null)
            food.setCategory(request.getCategory());
        if (request.getIsAvailable() != null)
            food.setIsAvailable(request.getIsAvailable());
        if (request.getRestaurantId() != null) {
            Restaurant restaurant = restaurantRepository.findById(request.getRestaurantId())
                    .orElseThrow(() -> new ResourceNotFoundException("Restaurant", "id", request.getRestaurantId()));
            food.setRestaurant(restaurant);
        }
        return foodRepository.save(food);
    }

    public void deleteFood(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Food ID cannot be null");
        }
        Food food = getFoodById(id);
        foodRepository.delete(food);
    }

    public Food toggleAvailability(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Food ID cannot be null");
        }
        Food food = getFoodById(id);
        food.setIsAvailable(!Boolean.TRUE.equals(food.getIsAvailable()));
        return foodRepository.save(food);
    }
}

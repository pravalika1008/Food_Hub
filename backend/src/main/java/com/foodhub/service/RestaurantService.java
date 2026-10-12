package com.foodhub.service;

import com.foodhub.dto.FoodRequest.RestaurantRequest;
import com.foodhub.entity.Restaurant;
import com.foodhub.entity.User;
import com.foodhub.exception.ResourceNotFoundException;
import com.foodhub.repository.RestaurantRepository;
import com.foodhub.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final UserRepository userRepository;

    public RestaurantService(RestaurantRepository restaurantRepository, UserRepository userRepository) {
        this.restaurantRepository = restaurantRepository;
        this.userRepository = userRepository;
    }

    public List<Restaurant> getAllRestaurants() {
        return restaurantRepository.findAll();
    }

    public List<Restaurant> getActiveRestaurants() {
        return restaurantRepository.findByActiveTrue();
    }

    public Restaurant getRestaurantById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Restaurant ID cannot be null");
        }
        return restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant", "id", id));
    }

    public List<Restaurant> searchRestaurants(String name) {
        if (name == null || name.isBlank()) {
            return getAllRestaurants();
        }
        return restaurantRepository.findByNameContainingIgnoreCase(name);
    }

    public List<Restaurant> getRestaurantsByCuisine(String cuisine) {
        if (cuisine == null || cuisine.isBlank()) {
            return List.of();
        }
        return restaurantRepository.findByCuisineTypeIgnoreCase(cuisine);
    }

    public List<Restaurant> getRestaurantsByOwner(Long ownerId) {
        if (ownerId == null) {
            return List.of();
        }
        return restaurantRepository.findByOwnerId(ownerId);
    }

    public Restaurant createRestaurant(RestaurantRequest request, User currentUser) {
        if (request == null) {
            throw new IllegalArgumentException("Restaurant request cannot be null");
        }

        Restaurant restaurant = new Restaurant();
        restaurant.setName(request.getName());
        restaurant.setDescription(request.getDescription());
        restaurant.setAddress(request.getAddress());
        restaurant.setPhone(request.getPhone());
        restaurant.setImageUrl(request.getImageUrl());
        restaurant.setCuisineType(request.getCuisineType());
        restaurant.setActive(true);
        restaurant.setRating(4.5);

        boolean isAdmin = currentUser != null && "ADMIN".equalsIgnoreCase(currentUser.getRole());
        if (request.getOwnerId() != null && isAdmin) {
            User owner = userRepository.findById(request.getOwnerId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.getOwnerId()));
            restaurant.setOwner(owner);
        } else {
            restaurant.setOwner(currentUser);
        }

        return restaurantRepository.save(restaurant);
    }

    public Restaurant updateRestaurant(Long id, RestaurantRequest request) {
        if (id == null) {
            throw new IllegalArgumentException("Restaurant ID cannot be null");
        }
        Restaurant restaurant = getRestaurantById(id);
        if (request == null) {
            return restaurant;
        }
        if (request.getName() != null)
            restaurant.setName(request.getName());
        if (request.getDescription() != null)
            restaurant.setDescription(request.getDescription());
        if (request.getAddress() != null)
            restaurant.setAddress(request.getAddress());
        if (request.getPhone() != null)
            restaurant.setPhone(request.getPhone());
        if (request.getImageUrl() != null)
            restaurant.setImageUrl(request.getImageUrl());
        if (request.getCuisineType() != null)
            restaurant.setCuisineType(request.getCuisineType());
        return restaurantRepository.save(restaurant);
    }

    public void deleteRestaurant(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Restaurant ID cannot be null");
        }
        Restaurant restaurant = getRestaurantById(id);
        restaurantRepository.delete(restaurant);
    }

    public Restaurant toggleStatus(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Restaurant ID cannot be null");
        }
        Restaurant restaurant = getRestaurantById(id);
        restaurant.setActive(!Boolean.TRUE.equals(restaurant.getActive()));
        return restaurantRepository.save(restaurant);
    }
}

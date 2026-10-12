package com.foodhub.service;

import com.foodhub.dto.OrderRequest.CartItemRequest;
import com.foodhub.entity.Cart;
import com.foodhub.entity.CartItem;
import com.foodhub.entity.Food;
import com.foodhub.entity.User;
import com.foodhub.exception.ResourceNotFoundException;
import com.foodhub.repository.CartRepository;
import com.foodhub.repository.FoodRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;
import java.util.Optional;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final FoodRepository foodRepository;

    public CartService(CartRepository cartRepository, FoodRepository foodRepository) {
        this.cartRepository = cartRepository;
        this.foodRepository = foodRepository;
    }

    public Cart getOrCreateCart(User user) {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null");
        }
        return cartRepository.findByUser(user)
                .orElseGet(() -> {
                    Cart newCart = new Cart(user);
                    return cartRepository.save(newCart);
                });
    }

    @Transactional
    public Cart addToCart(User user, CartItemRequest request) {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null");
        }
        if (request == null || request.getFoodId() == null) {
            throw new IllegalArgumentException("Cart item request and food ID cannot be null");
        }

        Cart cart = getOrCreateCart(user);
        Food food = foodRepository.findById(request.getFoodId())
                .orElseThrow(() -> new ResourceNotFoundException("Food", "id", request.getFoodId()));

        int addQty = (request.getQuantity() != null && request.getQuantity() > 0) ? request.getQuantity() : 1;

        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item != null && item.getFood() != null && Objects.equals(item.getFood().getId(), food.getId()))
                .findFirst();

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + addQty);
            item.setPrice(food.getPrice());
        } else {
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setFood(food);
            newItem.setQuantity(addQty);
            newItem.setPrice(food.getPrice());
            cart.getItems().add(newItem);
        }

        cart.calculateTotal();
        return cartRepository.save(cart);
    }

    @Transactional
    public Cart updateCartItemQuantity(User user, Long itemId, int quantity) {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null");
        }
        if (itemId == null) {
            throw new IllegalArgumentException("Item ID cannot be null");
        }

        Cart cart = getOrCreateCart(user);
        CartItem item = cart.getItems().stream()
                .filter(i -> i != null && Objects.equals(i.getId(), itemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("CartItem", "id", itemId));

        if (quantity <= 0) {
            cart.getItems().remove(item);
        } else {
            item.setQuantity(quantity);
        }

        cart.calculateTotal();
        return cartRepository.save(cart);
    }

    @Transactional
    public Cart removeFromCart(User user, Long itemId) {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null");
        }
        if (itemId == null) {
            throw new IllegalArgumentException("Item ID cannot be null");
        }

        Cart cart = getOrCreateCart(user);
        cart.getItems().removeIf(item -> item != null && Objects.equals(item.getId(), itemId));
        cart.calculateTotal();
        return cartRepository.save(cart);
    }

    @Transactional
    public Cart clearCart(User user) {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null");
        }
        Cart cart = getOrCreateCart(user);
        cart.getItems().clear();
        cart.calculateTotal();
        return cartRepository.save(cart);
    }
}

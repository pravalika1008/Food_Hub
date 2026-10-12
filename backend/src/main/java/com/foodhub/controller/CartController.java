package com.foodhub.controller;

import com.foodhub.dto.OrderRequest.CartItemRequest;
import com.foodhub.entity.Cart;
import com.foodhub.entity.User;
import com.foodhub.service.AuthService;
import com.foodhub.service.CartService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;
    private final AuthService authService;

    public CartController(CartService cartService, AuthService authService) {
        this.cartService = cartService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<Cart> getCart() {
        User currentUser = authService.getCurrentUser();
        return ResponseEntity.ok(cartService.getOrCreateCart(currentUser));
    }

    @PostMapping("/add")
    public ResponseEntity<Cart> addToCart(@Valid @RequestBody CartItemRequest request) {
        User currentUser = authService.getCurrentUser();
        return ResponseEntity.ok(cartService.addToCart(currentUser, request));
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<Cart> updateItemQuantity(@PathVariable Long itemId, @RequestParam int quantity) {
        User currentUser = authService.getCurrentUser();
        return ResponseEntity.ok(cartService.updateCartItemQuantity(currentUser, itemId, quantity));
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<Cart> removeItem(@PathVariable Long itemId) {
        User currentUser = authService.getCurrentUser();
        return ResponseEntity.ok(cartService.removeFromCart(currentUser, itemId));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Cart> clearCart() {
        User currentUser = authService.getCurrentUser();
        return ResponseEntity.ok(cartService.clearCart(currentUser));
    }
}

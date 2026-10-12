package com.foodhub.controller;

import com.foodhub.dto.OrderRequest.StatusUpdateRequest;
import com.foodhub.entity.Delivery;
import com.foodhub.entity.User;
import com.foodhub.service.AuthService;
import com.foodhub.service.DeliveryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deliveries")
public class DeliveryController {

    private final DeliveryService deliveryService;
    private final AuthService authService;

    public DeliveryController(DeliveryService deliveryService, AuthService authService) {
        this.deliveryService = deliveryService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<List<Delivery>> getAllDeliveries() {
        return ResponseEntity.ok(deliveryService.getAllDeliveries());
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<Delivery> getDeliveryByOrderId(@PathVariable Long orderId) {
        return ResponseEntity.ok(deliveryService.getDeliveryByOrderId(orderId));
    }

    @GetMapping("/my-deliveries")
    public ResponseEntity<List<Delivery>> getMyDeliveries() {
        User currentUser = authService.getCurrentUser();
        return ResponseEntity.ok(deliveryService.getDeliveriesByPerson(currentUser.getId()));
    }

    @GetMapping("/pending")
    public ResponseEntity<List<Delivery>> getPendingDeliveries() {
        return ResponseEntity.ok(deliveryService.getPendingDeliveries());
    }

    @PostMapping("/order/{orderId}/assign")
    public ResponseEntity<Delivery> assignDelivery(
            @PathVariable Long orderId,
            @RequestParam(required = false) Long deliveryPersonId) {
        User currentUser = authService.getCurrentUser();
        Long personId = deliveryPersonId;
        if (personId == null) {
            personId = currentUser.getId();
        }
        return ResponseEntity.ok(deliveryService.assignDelivery(orderId, personId));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Delivery> updateDeliveryStatus(
            @PathVariable Long id,
            @RequestBody StatusUpdateRequest request) {
        return ResponseEntity.ok(deliveryService.updateDeliveryStatus(id, request.getStatus(), request.getNotes()));
    }
}

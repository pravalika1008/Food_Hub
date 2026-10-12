package com.foodhub.controller;

import com.foodhub.dto.OrderRequest.StatusUpdateRequest;
import com.foodhub.entity.Payment;
import com.foodhub.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<Payment> getPaymentByOrderId(@PathVariable Long orderId) {
        return ResponseEntity.ok(paymentService.getPaymentByOrderId(orderId));
    }

    @PostMapping("/order/{orderId}")
    public ResponseEntity<Payment> processPayment(@PathVariable Long orderId, @RequestParam String paymentMethod) {
        return ResponseEntity.ok(paymentService.processPayment(orderId, paymentMethod));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Payment> updatePaymentStatus(@PathVariable Long id, @RequestBody StatusUpdateRequest request) {
        return ResponseEntity.ok(paymentService.updatePaymentStatus(id, request.getStatus()));
    }
}

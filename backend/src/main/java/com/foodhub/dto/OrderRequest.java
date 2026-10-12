package com.foodhub.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class OrderRequest {

    @NotNull(message = "Restaurant ID is required")
    private Long restaurantId;

    @NotBlank(message = "Delivery address is required")
    private String deliveryAddress;

    @NotBlank(message = "Payment method is required")
    private String paymentMethod; // CARD, UPI, COD, NET_BANKING

    private String specialInstructions;

    @NotEmpty(message = "Order must have at least one item")
    private List<OrderItemRequest> items;

    public OrderRequest() {
    }

    public OrderRequest(Long restaurantId, String deliveryAddress, String paymentMethod, String specialInstructions, List<OrderItemRequest> items) {
        this.restaurantId = restaurantId;
        this.deliveryAddress = deliveryAddress;
        this.paymentMethod = paymentMethod;
        this.specialInstructions = specialInstructions;
        this.items = items;
    }

    public Long getRestaurantId() {
        return restaurantId;
    }

    public void setRestaurantId(Long restaurantId) {
        this.restaurantId = restaurantId;
    }

    public String getDeliveryAddress() {
        return deliveryAddress;
    }

    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getSpecialInstructions() {
        return specialInstructions;
    }

    public void setSpecialInstructions(String specialInstructions) {
        this.specialInstructions = specialInstructions;
    }

    public List<OrderItemRequest> getItems() {
        return items;
    }

    public void setItems(List<OrderItemRequest> items) {
        this.items = items;
    }

    public static class OrderItemRequest {
        @NotNull(message = "Food ID is required")
        private Long foodId;

        @NotNull(message = "Quantity is required")
        @Min(value = 1, message = "Quantity must be at least 1")
        private Integer quantity;

        public OrderItemRequest() {}

        public OrderItemRequest(Long foodId, Integer quantity) {
            this.foodId = foodId;
            this.quantity = quantity;
        }

        public Long getFoodId() { return foodId; }
        public void setFoodId(Long foodId) { this.foodId = foodId; }
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
    }

    public static class CartItemRequest {
        @NotNull(message = "Food ID is required")
        private Long foodId;

        @NotNull(message = "Quantity is required")
        @Min(value = 1, message = "Quantity must be at least 1")
        private Integer quantity;

        public CartItemRequest() {}

        public CartItemRequest(Long foodId, Integer quantity) {
            this.foodId = foodId;
            this.quantity = quantity;
        }

        public Long getFoodId() { return foodId; }
        public void setFoodId(Long foodId) { this.foodId = foodId; }
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
    }

    public static class StatusUpdateRequest {
        private String status;
        private String notes;

        public StatusUpdateRequest() {}

        public StatusUpdateRequest(String status) {
            this.status = status;
        }

        public StatusUpdateRequest(String status, String notes) {
            this.status = status;
            this.notes = notes;
        }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }
    }
}

package com.foodhub.service;

import com.foodhub.dto.OrderRequest.OrderItemRequest;
import com.foodhub.dto.OrderRequest;
import com.foodhub.entity.*;
import com.foodhub.exception.ResourceNotFoundException;
import com.foodhub.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final RestaurantRepository restaurantRepository;
    private final FoodRepository foodRepository;
    private final CartService cartService;

    public OrderService(OrderRepository orderRepository,
            RestaurantRepository restaurantRepository,
            FoodRepository foodRepository,
            CartService cartService) {
        this.orderRepository = orderRepository;
        this.restaurantRepository = restaurantRepository;
        this.foodRepository = foodRepository;
        this.cartService = cartService;
    }

    @Transactional
    public Order createOrder(User customer, OrderRequest request) {
        if (customer == null) {
            throw new IllegalArgumentException("Customer cannot be null");
        }
        if (request == null || request.getRestaurantId() == null) {
            throw new IllegalArgumentException("Order request and restaurant ID cannot be null");
        }
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new IllegalArgumentException("Order must contain at least one item");
        }

        Restaurant restaurant = restaurantRepository.findById(request.getRestaurantId())
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant", "id", request.getRestaurantId()));

        Order order = new Order();
        order.setCustomer(customer);
        order.setRestaurant(restaurant);
        order.setDeliveryAddress(request.getDeliveryAddress());
        order.setSpecialInstructions(request.getSpecialInstructions());
        order.setStatus("PLACED");
        order.setOrderNumber("ORD-" + System.currentTimeMillis() + "-" + (int) (Math.random() * 1000));
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());

        List<OrderItem> orderItems = new ArrayList<>();
        double totalAmount = 0.0;

        for (OrderItemRequest itemReq : request.getItems()) {
            if (itemReq == null || itemReq.getFoodId() == null) {
                continue;
            }
            Food food = foodRepository.findById(itemReq.getFoodId())
                    .orElseThrow(() -> new ResourceNotFoundException("Food", "id", itemReq.getFoodId()));

            double price = food.getPrice() != null ? food.getPrice() : 0.0;
            int qty = itemReq.getQuantity() != null && itemReq.getQuantity() > 0 ? itemReq.getQuantity() : 1;

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setFood(food);
            orderItem.setFoodName(food.getName() != null ? food.getName() : "");
            orderItem.setPrice(price);
            orderItem.setQuantity(qty);
            orderItem.setSubtotal(price * qty);

            totalAmount += orderItem.getSubtotal();
            orderItems.add(orderItem);
        }

        order.setItems(orderItems);
        order.setTotalAmount(totalAmount);
        order.setDeliveryFee(40.0);
        order.setTax(Math.round((totalAmount * 0.05) * 100.0) / 100.0);
        order.calculateGrandTotal();

        // Create Payment
        String payMethod = (request.getPaymentMethod() != null && !request.getPaymentMethod().isBlank())
                ? request.getPaymentMethod()
                : "COD";
        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setAmount(order.getGrandTotal() != null ? order.getGrandTotal() : 0.0);
        payment.setPaymentMethod(payMethod);
        payment.setPaymentStatus("COD".equalsIgnoreCase(payMethod) ? "PENDING" : "COMPLETED");
        payment.setTransactionId("TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        payment.setPaymentDate(LocalDateTime.now());
        order.setPayment(payment);

        // Create Delivery
        Delivery delivery = new Delivery();
        delivery.setOrder(order);
        delivery.setDeliveryStatus("PENDING");
        order.setDelivery(delivery);

        Order savedOrder = orderRepository.save(order);

        // Clear user's cart
        try {
            cartService.clearCart(customer);
        } catch (Exception ignored) {
        }

        return savedOrder;
    }

    public Order getOrderById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Order ID cannot be null");
        }
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));
    }

    public Order getOrderByOrderNumber(String orderNumber) {
        if (orderNumber == null || orderNumber.isBlank()) {
            throw new IllegalArgumentException("Order number cannot be empty");
        }
        return orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "orderNumber", orderNumber));
    }

    public List<Order> getOrdersByCustomer(Long customerId) {
        if (customerId == null) {
            return List.of();
        }
        return orderRepository.findByCustomerIdOrderByCreatedAtDesc(customerId);
    }

    public List<Order> getOrdersByRestaurant(Long restaurantId) {
        if (restaurantId == null) {
            return List.of();
        }
        return orderRepository.findByRestaurantIdOrderByCreatedAtDesc(restaurantId);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional
    public Order updateOrderStatus(Long orderId, String newStatus) {
        if (orderId == null) {
            throw new IllegalArgumentException("Order ID cannot be null");
        }
        if (newStatus == null || newStatus.isBlank()) {
            throw new IllegalArgumentException("Status cannot be empty");
        }

        Order order = getOrderById(orderId);
        order.setStatus(newStatus.toUpperCase());
        order.setUpdatedAt(LocalDateTime.now());

        if (order.getDelivery() != null) {
            if ("OUT_FOR_DELIVERY".equalsIgnoreCase(newStatus)) {
                order.getDelivery().setDeliveryStatus("OUT_FOR_DELIVERY");
            } else if ("DELIVERED".equalsIgnoreCase(newStatus)) {
                order.getDelivery().setDeliveryStatus("DELIVERED");
                order.getDelivery().setDeliveryTime(LocalDateTime.now());
                if (order.getPayment() != null) {
                    order.getPayment().setPaymentStatus("COMPLETED");
                }
            } else if ("CANCELLED".equalsIgnoreCase(newStatus)) {
                order.getDelivery().setDeliveryStatus("CANCELLED");
            }
        }

        return orderRepository.save(order);
    }

    @Transactional
    public Order cancelOrder(Long orderId, User user) {
        if (orderId == null) {
            throw new IllegalArgumentException("Order ID cannot be null");
        }
        Order order = getOrderById(orderId);
        if ("DELIVERED".equalsIgnoreCase(order.getStatus())) {
            throw new IllegalArgumentException("Cannot cancel an already delivered order.");
        }
        order.setStatus("CANCELLED");
        if (order.getDelivery() != null) {
            order.getDelivery().setDeliveryStatus("CANCELLED");
        }
        return orderRepository.save(order);
    }
}

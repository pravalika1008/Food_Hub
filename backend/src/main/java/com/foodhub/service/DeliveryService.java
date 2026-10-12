package com.foodhub.service;

import com.foodhub.entity.Delivery;
import com.foodhub.entity.Order;
import com.foodhub.entity.User;
import com.foodhub.exception.ResourceNotFoundException;
import com.foodhub.repository.DeliveryRepository;
import com.foodhub.repository.OrderRepository;
import com.foodhub.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DeliveryService {

    private final DeliveryRepository deliveryRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    public DeliveryService(DeliveryRepository deliveryRepository,
            OrderRepository orderRepository,
            UserRepository userRepository) {
        this.deliveryRepository = deliveryRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    public Delivery getDeliveryByOrderId(Long orderId) {
        if (orderId == null) {
            throw new IllegalArgumentException("Order ID cannot be null");
        }
        return deliveryRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery for order id " + orderId + " not found"));
    }

    public List<Delivery> getDeliveriesByPerson(Long deliveryPersonId) {
        if (deliveryPersonId == null) {
            return List.of();
        }
        return deliveryRepository.findByDeliveryPersonId(deliveryPersonId);
    }

    public List<Delivery> getPendingDeliveries() {
        return deliveryRepository.findByDeliveryStatus("PENDING");
    }

    public List<Delivery> getAllDeliveries() {
        return deliveryRepository.findAll();
    }

    @Transactional
    public Delivery assignDelivery(Long orderId, Long deliveryPersonId) {
        if (orderId == null || deliveryPersonId == null) {
            throw new IllegalArgumentException("Order ID and Delivery Person ID cannot be null");
        }

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        User deliveryPerson = userRepository.findById(deliveryPersonId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", deliveryPersonId));

        Delivery delivery = order.getDelivery();
        if (delivery == null) {
            delivery = new Delivery();
            delivery.setOrder(order);
        }

        delivery.setDeliveryPerson(deliveryPerson);
        delivery.setDeliveryStatus("ASSIGNED");
        delivery.setPickupTime(null);
        delivery.setDeliveryTime(null);

        order.setStatus("CONFIRMED");
        orderRepository.save(order);

        return deliveryRepository.save(delivery);
    }

    @Transactional
    public Delivery updateDeliveryStatus(Long deliveryId, String status, String notes) {
        if (deliveryId == null) {
            throw new IllegalArgumentException("Delivery ID cannot be null");
        }
        if (status == null || status.isBlank()) {
            throw new IllegalArgumentException("Status cannot be empty");
        }

        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery", "id", deliveryId));

        delivery.setDeliveryStatus(status.toUpperCase());
        if (notes != null && !notes.trim().isEmpty()) {
            delivery.setDeliveryNotes(notes);
        }

        Order order = delivery.getOrder();
        if (order != null) {
            if ("PICKED_UP".equalsIgnoreCase(status) || "OUT_FOR_DELIVERY".equalsIgnoreCase(status)) {
                delivery.setPickupTime(
                        delivery.getPickupTime() != null ? delivery.getPickupTime() : LocalDateTime.now());
                order.setStatus("OUT_FOR_DELIVERY");
            } else if ("DELIVERED".equalsIgnoreCase(status)) {
                delivery.setDeliveryTime(LocalDateTime.now());
                order.setStatus("DELIVERED");
                if (order.getPayment() != null) {
                    order.getPayment().setPaymentStatus("COMPLETED");
                }
            } else if ("CANCELLED".equalsIgnoreCase(status)) {
                order.setStatus("CANCELLED");
            }
            orderRepository.save(order);
        }

        return deliveryRepository.save(delivery);
    }
}

package com.foodhub.repository;

import com.foodhub.entity.Delivery;
import com.foodhub.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeliveryRepository extends JpaRepository<Delivery, Long> {
    Optional<Delivery> findByOrderId(Long orderId);
    List<Delivery> findByDeliveryPerson(User deliveryPerson);
    List<Delivery> findByDeliveryPersonId(Long deliveryPersonId);
    List<Delivery> findByDeliveryStatus(String deliveryStatus);
}

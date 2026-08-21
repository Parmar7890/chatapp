package com.chatpApp.repository;

import com.chatpApp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.awt.*;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findByUsernameContainingIgnoreCase(String username);


    @Query(value = "SELECT u.id, u.username, ST_Distance(u.location, :userLocation) as distance " +
            "FROM users u " +
            "WHERE u.id != :userId " +
            "AND u.location IS NOT NULL " +
            "AND ST_DWithin(u.location, :userLocation, :radiusMeters) " +
            "ORDER BY distance ASC",
            nativeQuery = true)
    List<Object[]> findNearbyUsers(@Param("userId") Long userId,
                                   @Param("userLocation") Point userLocation,
                                   @Param("radiusMeters") double radiusMeters);

    List<User> findByCurrentGeohash(String geohash);
}
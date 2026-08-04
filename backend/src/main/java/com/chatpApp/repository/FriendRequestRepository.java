package com.chatpApp.repository;

import com.chatpApp.entity.FriendRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FriendRequestRepository extends JpaRepository<FriendRequest, Long> {
    @Query("SELECT fr FROM FriendRquest fr WHERE " +
    "(fr.senderId = :user1 AND fr.receiverId = :user2) OR" +
    "(fr.senderId = :user2 AND fr.receiverId = :user1)")
    Optional<FriendRequest> findBetweenUsers(@Param("user1") Long user1, @Param("user2") Long user2);

    List<FriendRequest> findByReceiverIdStatus(Long receiverId, FriendRequest.RequestStatus status);

    @Query("SELECT fr FROM FriendRequest fr WHERE" +
    "(fr.senderId = :userId OR fr.receiverId = :userId) AND fr.status = 'ACCEPTED'")
     List<FriendRequest> findAcceptedFriend(@Param("userId") Long userId);
}

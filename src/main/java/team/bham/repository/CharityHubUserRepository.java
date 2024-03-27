package team.bham.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import team.bham.domain.CharityHubUser;

/**
 * Spring Data JPA repository for the CharityHubUser entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CharityHubUserRepository extends JpaRepository<CharityHubUser, Long> {
    @Query("select charityHubUser from CharityHubUser charityHubUser where charityHubUser.user.id=:id")
    Optional<CharityHubUser> findCharityHubUserByUser(@Param("id") Long id);
}

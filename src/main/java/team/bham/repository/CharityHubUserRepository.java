package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.CharityHubUser;

/**
 * Spring Data JPA repository for the CharityHubUser entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CharityHubUserRepository extends JpaRepository<CharityHubUser, Long> {}

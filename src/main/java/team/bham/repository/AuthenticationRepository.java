package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.Authentication;

/**
 * Spring Data JPA repository for the Authentication entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AuthenticationRepository extends JpaRepository<Authentication, Long> {}

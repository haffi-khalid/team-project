package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.UserPage;

/**
 * Spring Data JPA repository for the UserPage entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UserPageRepository extends JpaRepository<UserPage, Long> {}

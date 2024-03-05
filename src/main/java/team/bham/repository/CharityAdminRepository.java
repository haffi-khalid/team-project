package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.CharityAdmin;

/**
 * Spring Data JPA repository for the CharityAdmin entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CharityAdminRepository extends JpaRepository<CharityAdmin, Long> {}

package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.Charity;

/**
 * Spring Data JPA repository for the Charity entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CharityRepository extends JpaRepository<Charity, Long> {}

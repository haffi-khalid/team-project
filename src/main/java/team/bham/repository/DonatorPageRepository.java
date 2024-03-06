package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.DonatorPage;

/**
 * Spring Data JPA repository for the DonatorPage entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DonatorPageRepository extends JpaRepository<DonatorPage, Long> {}

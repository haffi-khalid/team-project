package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.CharityProfile;

/**
 * Spring Data JPA repository for the CharityProfile entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CharityProfileRepository extends JpaRepository<CharityProfile, Long> {}

package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.CharityEvent;

/**
 * Spring Data JPA repository for the CharityEvent entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CharityEventRepository extends JpaRepository<CharityEvent, Long> {}

package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.FundraisingIdea;

/**
 * Spring Data JPA repository for the FundraisingIdea entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FundraisingIdeaRepository extends JpaRepository<FundraisingIdea, Long> {}

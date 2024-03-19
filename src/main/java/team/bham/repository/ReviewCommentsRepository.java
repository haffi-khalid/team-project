package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.ReviewComments;

/**
 * Spring Data JPA repository for the ReviewComments entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ReviewCommentsRepository extends JpaRepository<ReviewComments, Long> {}

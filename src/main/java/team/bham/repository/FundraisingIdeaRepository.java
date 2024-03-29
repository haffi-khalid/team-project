package team.bham.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import team.bham.domain.FundraisingIdea;

/**
 * Spring Data JPA repository for the FundraisingIdea entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FundraisingIdeaRepository extends JpaRepository<FundraisingIdea, Long> {
    @Query(value = "SELECT fi FROM FundraisingIdea fi ORDER BY fi.id ASC")
    List<FundraisingIdea> findAllOrderedById();

    // Define method to find the second idea
    default Optional<FundraisingIdea> findSecondIdea() {
        List<FundraisingIdea> ideas = findAllOrderedById();
        if (ideas.size() >= 2) {
            return Optional.of(ideas.get(1)); // Second idea
        } else {
            return Optional.empty();
        }
    }
}

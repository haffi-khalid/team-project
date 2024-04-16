package team.bham.repository;

import java.util.List;
import java.util.Optional;
import java.util.Random;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import team.bham.domain.FundraisingIdea;
import team.bham.repository.IdeaSimilarityFinder;

/**
 * Spring Data JPA repository for the FundraisingIdea entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FundraisingIdeaRepository extends JpaRepository<FundraisingIdea, Long> {
    @Query(value = "SELECT fi FROM FundraisingIdea fi ORDER BY fi.id ASC")
    List<FundraisingIdea> findAllOrderedById();

    default Optional<FundraisingIdea> findSecondIdea() {
        List<FundraisingIdea> ideas = findAllOrderedById();
        int listSize = ideas.size();
        if (listSize != 0) {
            Random random = new Random();
            int index = random.nextInt(listSize);
            return Optional.of(ideas.get(index));
        } else {
            return Optional.empty();
        }
    }

    //Method for Idea Generator
    default List<FundraisingIdea> getPreference(FundraisingIdea idea) {
        List<FundraisingIdea> ideas = findAllOrderedById();
        IdeaSimilarityFinder finder = new IdeaSimilarityFinder();
        List<FundraisingIdea> similarIdeas = finder.findSimilarIdeas(idea, ideas);
        System.out.println(similarIdeas.size());
        if (similarIdeas.isEmpty()) {
            return null;
        }
        return similarIdeas;
    }
}

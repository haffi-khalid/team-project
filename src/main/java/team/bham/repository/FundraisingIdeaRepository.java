package team.bham.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import team.bham.domain.FundraisingIdea;

/**
 * Spring Data JPA repository for the FundraisingIdea entity.
 */
@Repository
public interface FundraisingIdeaRepository extends JpaRepository<FundraisingIdea, Long> {
    default Optional<FundraisingIdea> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<FundraisingIdea> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<FundraisingIdea> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct fundraisingIdea from FundraisingIdea fundraisingIdea left join fetch fundraisingIdea.charityProfile",
        countQuery = "select count(distinct fundraisingIdea) from FundraisingIdea fundraisingIdea"
    )
    Page<FundraisingIdea> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct fundraisingIdea from FundraisingIdea fundraisingIdea left join fetch fundraisingIdea.charityProfile")
    List<FundraisingIdea> findAllWithToOneRelationships();

    @Query(
        "select fundraisingIdea from FundraisingIdea fundraisingIdea left join fetch fundraisingIdea.charityProfile where fundraisingIdea.id =:id"
    )
    Optional<FundraisingIdea> findOneWithToOneRelationships(@Param("id") Long id);
}

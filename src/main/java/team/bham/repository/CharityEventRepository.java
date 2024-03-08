package team.bham.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import team.bham.domain.CharityEvent;

/**
 * Spring Data JPA repository for the CharityEvent entity.
 */
@Repository
public interface CharityEventRepository extends JpaRepository<CharityEvent, Long> {
    default Optional<CharityEvent> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<CharityEvent> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<CharityEvent> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct charityEvent from CharityEvent charityEvent left join fetch charityEvent.charityProfile",
        countQuery = "select count(distinct charityEvent) from CharityEvent charityEvent"
    )
    Page<CharityEvent> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct charityEvent from CharityEvent charityEvent left join fetch charityEvent.charityProfile")
    List<CharityEvent> findAllWithToOneRelationships();

    @Query("select charityEvent from CharityEvent charityEvent left join fetch charityEvent.charityProfile where charityEvent.id =:id")
    Optional<CharityEvent> findOneWithToOneRelationships(@Param("id") Long id);
}

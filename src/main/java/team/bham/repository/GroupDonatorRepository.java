package team.bham.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import team.bham.domain.GroupDonator;

/**
 * Spring Data JPA repository for the GroupDonator entity.
 */
@Repository
public interface GroupDonatorRepository extends JpaRepository<GroupDonator, Long> {
    default Optional<GroupDonator> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<GroupDonator> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<GroupDonator> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct groupDonator from GroupDonator groupDonator left join fetch groupDonator.charityEvent",
        countQuery = "select count(distinct groupDonator) from GroupDonator groupDonator"
    )
    Page<GroupDonator> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct groupDonator from GroupDonator groupDonator left join fetch groupDonator.charityEvent")
    List<GroupDonator> findAllWithToOneRelationships();

    @Query("select groupDonator from GroupDonator groupDonator left join fetch groupDonator.charityEvent where groupDonator.id =:id")
    Optional<GroupDonator> findOneWithToOneRelationships(@Param("id") Long id);
}

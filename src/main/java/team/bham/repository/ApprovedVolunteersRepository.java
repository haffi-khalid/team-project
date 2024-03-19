package team.bham.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import team.bham.domain.ApprovedVolunteers;

/**
 * Spring Data JPA repository for the ApprovedVolunteers entity.
 */
@Repository
public interface ApprovedVolunteersRepository extends JpaRepository<ApprovedVolunteers, Long> {
    default Optional<ApprovedVolunteers> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<ApprovedVolunteers> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<ApprovedVolunteers> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct approvedVolunteers from ApprovedVolunteers approvedVolunteers left join fetch approvedVolunteers.charityProfile",
        countQuery = "select count(distinct approvedVolunteers) from ApprovedVolunteers approvedVolunteers"
    )
    Page<ApprovedVolunteers> findAllWithToOneRelationships(Pageable pageable);

    @Query(
        "select distinct approvedVolunteers from ApprovedVolunteers approvedVolunteers left join fetch approvedVolunteers.charityProfile"
    )
    List<ApprovedVolunteers> findAllWithToOneRelationships();

    @Query(
        "select approvedVolunteers from ApprovedVolunteers approvedVolunteers left join fetch approvedVolunteers.charityProfile where approvedVolunteers.id =:id"
    )
    Optional<ApprovedVolunteers> findOneWithToOneRelationships(@Param("id") Long id);
}

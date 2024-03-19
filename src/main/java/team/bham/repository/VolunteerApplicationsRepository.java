package team.bham.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import team.bham.domain.VolunteerApplications;

/**
 * Spring Data JPA repository for the VolunteerApplications entity.
 */
@Repository
public interface VolunteerApplicationsRepository extends JpaRepository<VolunteerApplications, Long> {
    default Optional<VolunteerApplications> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<VolunteerApplications> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<VolunteerApplications> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct volunteerApplications from VolunteerApplications volunteerApplications left join fetch volunteerApplications.userPage",
        countQuery = "select count(distinct volunteerApplications) from VolunteerApplications volunteerApplications"
    )
    Page<VolunteerApplications> findAllWithToOneRelationships(Pageable pageable);

    @Query(
        "select distinct volunteerApplications from VolunteerApplications volunteerApplications left join fetch volunteerApplications.userPage"
    )
    List<VolunteerApplications> findAllWithToOneRelationships();

    @Query(
        "select volunteerApplications from VolunteerApplications volunteerApplications left join fetch volunteerApplications.userPage where volunteerApplications.id =:id"
    )
    Optional<VolunteerApplications> findOneWithToOneRelationships(@Param("id") Long id);
}

package team.bham.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import team.bham.domain.CharityAdmin;

/**
 * Spring Data JPA repository for the CharityAdmin entity.
 */
@Repository
public interface CharityAdminRepository extends JpaRepository<CharityAdmin, Long> {
    default Optional<CharityAdmin> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<CharityAdmin> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<CharityAdmin> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct charityAdmin from CharityAdmin charityAdmin left join fetch charityAdmin.charityProfile",
        countQuery = "select count(distinct charityAdmin) from CharityAdmin charityAdmin"
    )
    Page<CharityAdmin> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct charityAdmin from CharityAdmin charityAdmin left join fetch charityAdmin.charityProfile")
    List<CharityAdmin> findAllWithToOneRelationships();

    @Query("select charityAdmin from CharityAdmin charityAdmin left join fetch charityAdmin.charityProfile where charityAdmin.id =:id")
    Optional<CharityAdmin> findOneWithToOneRelationships(@Param("id") Long id);
}

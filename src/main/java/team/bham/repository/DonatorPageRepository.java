package team.bham.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import team.bham.domain.DonatorPage;

/**
 * Spring Data JPA repository for the DonatorPage entity.
 */
@Repository
public interface DonatorPageRepository extends JpaRepository<DonatorPage, Long> {
    default Optional<DonatorPage> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<DonatorPage> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<DonatorPage> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct donatorPage from DonatorPage donatorPage left join fetch donatorPage.charityProfile",
        countQuery = "select count(distinct donatorPage) from DonatorPage donatorPage"
    )
    Page<DonatorPage> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct donatorPage from DonatorPage donatorPage left join fetch donatorPage.charityProfile")
    List<DonatorPage> findAllWithToOneRelationships();

    @Query("select donatorPage from DonatorPage donatorPage left join fetch donatorPage.charityProfile where donatorPage.id =:id")
    Optional<DonatorPage> findOneWithToOneRelationships(@Param("id") Long id);
}

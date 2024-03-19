package team.bham.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import team.bham.domain.ReviewComments;

/**
 * Spring Data JPA repository for the ReviewComments entity.
 */
@Repository
public interface ReviewCommentsRepository extends JpaRepository<ReviewComments, Long> {
    default Optional<ReviewComments> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<ReviewComments> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<ReviewComments> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct reviewComments from ReviewComments reviewComments left join fetch reviewComments.userPage left join fetch reviewComments.charityProfile",
        countQuery = "select count(distinct reviewComments) from ReviewComments reviewComments"
    )
    Page<ReviewComments> findAllWithToOneRelationships(Pageable pageable);

    @Query(
        "select distinct reviewComments from ReviewComments reviewComments left join fetch reviewComments.userPage left join fetch reviewComments.charityProfile"
    )
    List<ReviewComments> findAllWithToOneRelationships();

    @Query(
        "select reviewComments from ReviewComments reviewComments left join fetch reviewComments.userPage left join fetch reviewComments.charityProfile where reviewComments.id =:id"
    )
    Optional<ReviewComments> findOneWithToOneRelationships(@Param("id") Long id);
}

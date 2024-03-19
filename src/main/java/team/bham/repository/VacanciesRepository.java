package team.bham.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import team.bham.domain.Vacancies;

/**
 * Spring Data JPA repository for the Vacancies entity.
 */
@Repository
public interface VacanciesRepository extends JpaRepository<Vacancies, Long> {
    default Optional<Vacancies> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Vacancies> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Vacancies> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct vacancies from Vacancies vacancies left join fetch vacancies.charityProfile",
        countQuery = "select count(distinct vacancies) from Vacancies vacancies"
    )
    Page<Vacancies> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct vacancies from Vacancies vacancies left join fetch vacancies.charityProfile")
    List<Vacancies> findAllWithToOneRelationships();

    @Query("select vacancies from Vacancies vacancies left join fetch vacancies.charityProfile where vacancies.id =:id")
    Optional<Vacancies> findOneWithToOneRelationships(@Param("id") Long id);

    @Query("select vacancies from Vacancies vacancies where vacancies.charityProfile.id =:id")
    Optional<Vacancies> charityVacancies(@Param("id") Long id);
}

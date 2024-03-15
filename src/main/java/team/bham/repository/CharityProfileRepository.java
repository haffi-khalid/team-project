package team.bham.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import team.bham.domain.CharityProfile;
import team.bham.domain.Vacancies;

/**
 * Spring Data JPA repository for the CharityProfile entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CharityProfileRepository extends JpaRepository<CharityProfile, Long> {
    @Query(
        value = "select distinct charityProfile.charityName from CharityProfile charityProfile inner join Vacancies vacancies on vacancies.charityProfile.id=charityProfile.id"
    )
    // Step 1: Define the type your statement returns and create a function name for it
    List<String> findAllVacancyCharityName();

    @Query(value = "select distinct charityProfile.id from CharityProfile charityProfile where charityProfile.charityName=:name")
    Optional<Long> findCharityId(@Param("name") String name);
}

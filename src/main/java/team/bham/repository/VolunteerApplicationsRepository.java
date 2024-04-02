package team.bham.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import team.bham.domain.VolunteerApplications;

/**
 * Spring Data JPA repository for the VolunteerApplications entity.
 */
@SuppressWarnings("unused")
@Repository
public interface VolunteerApplicationsRepository extends JpaRepository<VolunteerApplications, Long> {
    @Query(
        value = "select distinct volunteerApplication.id from VolunteerApplications volunteerApplication where volunteerApplication.charityHubUser.id=:hubUserId and volunteerApplication.vacancies.id=:vacancyId"
    )
    Optional<Long> findByCharityHubUser(@Param("hubUserId") Long hubUserId, @Param("vacancyId") Long vacancyId);
}

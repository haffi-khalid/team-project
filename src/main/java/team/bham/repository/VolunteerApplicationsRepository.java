package team.bham.repository;

import java.lang.Object;
import java.util.List;
import java.util.Optional;
import org.apache.commons.text.similarity.JaroWinklerSimilarity;
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

    @Query(
        value = "select count(*) from VolunteerApplications volunteerApplications group by volunteerApplications.charityHubUser.id order by count(*) desc"
    )
    List<Integer> findMaxNumberOfApplications();

    @Query(
        value = "select sum(vacancy.vacancyDuration) as total_duration from Vacancies vacancy right join VolunteerApplications volunteerApplications on vacancy.id=volunteerApplications.vacancies.id where volunteerApplications.volunteerStatus='ACCEPTED' group by volunteerApplications.charityHubUser order by total_duration desc"
    )
    List<Integer> findMaxHoursOfVolunteering();
}

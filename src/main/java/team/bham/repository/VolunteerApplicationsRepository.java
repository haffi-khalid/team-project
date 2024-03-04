package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.VolunteerApplications;

/**
 * Spring Data JPA repository for the VolunteerApplications entity.
 */
@SuppressWarnings("unused")
@Repository
public interface VolunteerApplicationsRepository extends JpaRepository<VolunteerApplications, Long> {}

package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.ApprovedVolunteers;

/**
 * Spring Data JPA repository for the ApprovedVolunteers entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ApprovedVolunteersRepository extends JpaRepository<ApprovedVolunteers, Long> {}

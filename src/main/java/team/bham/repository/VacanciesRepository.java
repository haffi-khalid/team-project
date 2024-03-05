package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.Vacancies;

/**
 * Spring Data JPA repository for the Vacancies entity.
 */
@SuppressWarnings("unused")
@Repository
public interface VacanciesRepository extends JpaRepository<Vacancies, Long> {}

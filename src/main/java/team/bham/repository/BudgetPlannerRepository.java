package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.BudgetPlanner;

/**
 * Spring Data JPA repository for the BudgetPlanner entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BudgetPlannerRepository extends JpaRepository<BudgetPlanner, Long> {}

package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.GroupDonatorCollector;

/**
 * Spring Data JPA repository for the GroupDonatorCollector entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GroupDonatorCollectorRepository extends JpaRepository<GroupDonatorCollector, Long> {}

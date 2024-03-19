package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.GroupDonator;

/**
 * Spring Data JPA repository for the GroupDonator entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GroupDonatorRepository extends JpaRepository<GroupDonator, Long> {}

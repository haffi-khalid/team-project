package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.SocialFeed;

/**
 * Spring Data JPA repository for the SocialFeed entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SocialFeedRepository extends JpaRepository<SocialFeed, Long> {}

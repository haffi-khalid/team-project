package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.Posts;

/**
 * Spring Data JPA repository for the Posts entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PostsRepository extends JpaRepository<Posts, Long> {}

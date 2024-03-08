package team.bham.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;
import team.bham.IntegrationTest;
import team.bham.domain.Posts;
import team.bham.repository.PostsRepository;

/**
 * Integration tests for the {@link PostsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PostsResourceIT {

    private static final String DEFAULT_CONTENT = "AAAAAAAAAA";
    private static final String UPDATED_CONTENT = "BBBBBBBBBB";

    private static final Instant DEFAULT_TIMESTAMP = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_TIMESTAMP = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/posts";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PostsRepository postsRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPostsMockMvc;

    private Posts posts;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Posts createEntity(EntityManager em) {
        Posts posts = new Posts().content(DEFAULT_CONTENT).timestamp(DEFAULT_TIMESTAMP);
        return posts;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Posts createUpdatedEntity(EntityManager em) {
        Posts posts = new Posts().content(UPDATED_CONTENT).timestamp(UPDATED_TIMESTAMP);
        return posts;
    }

    @BeforeEach
    public void initTest() {
        posts = createEntity(em);
    }

    @Test
    @Transactional
    void createPosts() throws Exception {
        int databaseSizeBeforeCreate = postsRepository.findAll().size();
        // Create the Posts
        restPostsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(posts)))
            .andExpect(status().isCreated());

        // Validate the Posts in the database
        List<Posts> postsList = postsRepository.findAll();
        assertThat(postsList).hasSize(databaseSizeBeforeCreate + 1);
        Posts testPosts = postsList.get(postsList.size() - 1);
        assertThat(testPosts.getContent()).isEqualTo(DEFAULT_CONTENT);
        assertThat(testPosts.getTimestamp()).isEqualTo(DEFAULT_TIMESTAMP);
    }

    @Test
    @Transactional
    void createPostsWithExistingId() throws Exception {
        // Create the Posts with an existing ID
        posts.setId(1L);

        int databaseSizeBeforeCreate = postsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPostsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(posts)))
            .andExpect(status().isBadRequest());

        // Validate the Posts in the database
        List<Posts> postsList = postsRepository.findAll();
        assertThat(postsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllPosts() throws Exception {
        // Initialize the database
        postsRepository.saveAndFlush(posts);

        // Get all the postsList
        restPostsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(posts.getId().intValue())))
            .andExpect(jsonPath("$.[*].content").value(hasItem(DEFAULT_CONTENT.toString())))
            .andExpect(jsonPath("$.[*].timestamp").value(hasItem(DEFAULT_TIMESTAMP.toString())));
    }

    @Test
    @Transactional
    void getPosts() throws Exception {
        // Initialize the database
        postsRepository.saveAndFlush(posts);

        // Get the posts
        restPostsMockMvc
            .perform(get(ENTITY_API_URL_ID, posts.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(posts.getId().intValue()))
            .andExpect(jsonPath("$.content").value(DEFAULT_CONTENT.toString()))
            .andExpect(jsonPath("$.timestamp").value(DEFAULT_TIMESTAMP.toString()));
    }

    @Test
    @Transactional
    void getNonExistingPosts() throws Exception {
        // Get the posts
        restPostsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingPosts() throws Exception {
        // Initialize the database
        postsRepository.saveAndFlush(posts);

        int databaseSizeBeforeUpdate = postsRepository.findAll().size();

        // Update the posts
        Posts updatedPosts = postsRepository.findById(posts.getId()).get();
        // Disconnect from session so that the updates on updatedPosts are not directly saved in db
        em.detach(updatedPosts);
        updatedPosts.content(UPDATED_CONTENT).timestamp(UPDATED_TIMESTAMP);

        restPostsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPosts.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPosts))
            )
            .andExpect(status().isOk());

        // Validate the Posts in the database
        List<Posts> postsList = postsRepository.findAll();
        assertThat(postsList).hasSize(databaseSizeBeforeUpdate);
        Posts testPosts = postsList.get(postsList.size() - 1);
        assertThat(testPosts.getContent()).isEqualTo(UPDATED_CONTENT);
        assertThat(testPosts.getTimestamp()).isEqualTo(UPDATED_TIMESTAMP);
    }

    @Test
    @Transactional
    void putNonExistingPosts() throws Exception {
        int databaseSizeBeforeUpdate = postsRepository.findAll().size();
        posts.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPostsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, posts.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(posts))
            )
            .andExpect(status().isBadRequest());

        // Validate the Posts in the database
        List<Posts> postsList = postsRepository.findAll();
        assertThat(postsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPosts() throws Exception {
        int databaseSizeBeforeUpdate = postsRepository.findAll().size();
        posts.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPostsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(posts))
            )
            .andExpect(status().isBadRequest());

        // Validate the Posts in the database
        List<Posts> postsList = postsRepository.findAll();
        assertThat(postsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPosts() throws Exception {
        int databaseSizeBeforeUpdate = postsRepository.findAll().size();
        posts.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPostsMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(posts)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Posts in the database
        List<Posts> postsList = postsRepository.findAll();
        assertThat(postsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePostsWithPatch() throws Exception {
        // Initialize the database
        postsRepository.saveAndFlush(posts);

        int databaseSizeBeforeUpdate = postsRepository.findAll().size();

        // Update the posts using partial update
        Posts partialUpdatedPosts = new Posts();
        partialUpdatedPosts.setId(posts.getId());

        partialUpdatedPosts.content(UPDATED_CONTENT);

        restPostsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPosts.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPosts))
            )
            .andExpect(status().isOk());

        // Validate the Posts in the database
        List<Posts> postsList = postsRepository.findAll();
        assertThat(postsList).hasSize(databaseSizeBeforeUpdate);
        Posts testPosts = postsList.get(postsList.size() - 1);
        assertThat(testPosts.getContent()).isEqualTo(UPDATED_CONTENT);
        assertThat(testPosts.getTimestamp()).isEqualTo(DEFAULT_TIMESTAMP);
    }

    @Test
    @Transactional
    void fullUpdatePostsWithPatch() throws Exception {
        // Initialize the database
        postsRepository.saveAndFlush(posts);

        int databaseSizeBeforeUpdate = postsRepository.findAll().size();

        // Update the posts using partial update
        Posts partialUpdatedPosts = new Posts();
        partialUpdatedPosts.setId(posts.getId());

        partialUpdatedPosts.content(UPDATED_CONTENT).timestamp(UPDATED_TIMESTAMP);

        restPostsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPosts.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPosts))
            )
            .andExpect(status().isOk());

        // Validate the Posts in the database
        List<Posts> postsList = postsRepository.findAll();
        assertThat(postsList).hasSize(databaseSizeBeforeUpdate);
        Posts testPosts = postsList.get(postsList.size() - 1);
        assertThat(testPosts.getContent()).isEqualTo(UPDATED_CONTENT);
        assertThat(testPosts.getTimestamp()).isEqualTo(UPDATED_TIMESTAMP);
    }

    @Test
    @Transactional
    void patchNonExistingPosts() throws Exception {
        int databaseSizeBeforeUpdate = postsRepository.findAll().size();
        posts.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPostsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, posts.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(posts))
            )
            .andExpect(status().isBadRequest());

        // Validate the Posts in the database
        List<Posts> postsList = postsRepository.findAll();
        assertThat(postsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPosts() throws Exception {
        int databaseSizeBeforeUpdate = postsRepository.findAll().size();
        posts.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPostsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(posts))
            )
            .andExpect(status().isBadRequest());

        // Validate the Posts in the database
        List<Posts> postsList = postsRepository.findAll();
        assertThat(postsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPosts() throws Exception {
        int databaseSizeBeforeUpdate = postsRepository.findAll().size();
        posts.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPostsMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(posts)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Posts in the database
        List<Posts> postsList = postsRepository.findAll();
        assertThat(postsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePosts() throws Exception {
        // Initialize the database
        postsRepository.saveAndFlush(posts);

        int databaseSizeBeforeDelete = postsRepository.findAll().size();

        // Delete the posts
        restPostsMockMvc
            .perform(delete(ENTITY_API_URL_ID, posts.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Posts> postsList = postsRepository.findAll();
        assertThat(postsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

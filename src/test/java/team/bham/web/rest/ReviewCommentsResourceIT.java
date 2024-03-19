package team.bham.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;
import team.bham.IntegrationTest;
import team.bham.domain.ReviewComments;
import team.bham.repository.ReviewCommentsRepository;

/**
 * Integration tests for the {@link ReviewCommentsResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class ReviewCommentsResourceIT {

    private static final Integer DEFAULT_PARENT_ID = 1;
    private static final Integer UPDATED_PARENT_ID = 2;

    private static final String DEFAULT_CONTENT = "AAAAAAAAAA";
    private static final String UPDATED_CONTENT = "BBBBBBBBBB";

    private static final Instant DEFAULT_TIMESTAMP = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_TIMESTAMP = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_STATUS = "AAAAAAAAAA";
    private static final String UPDATED_STATUS = "BBBBBBBBBB";

    private static final Integer DEFAULT_LIKE_COUNT = 1;
    private static final Integer UPDATED_LIKE_COUNT = 2;

    private static final String ENTITY_API_URL = "/api/review-comments";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ReviewCommentsRepository reviewCommentsRepository;

    @Mock
    private ReviewCommentsRepository reviewCommentsRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restReviewCommentsMockMvc;

    private ReviewComments reviewComments;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ReviewComments createEntity(EntityManager em) {
        ReviewComments reviewComments = new ReviewComments()
            .parentID(DEFAULT_PARENT_ID)
            .content(DEFAULT_CONTENT)
            .timestamp(DEFAULT_TIMESTAMP)
            .status(DEFAULT_STATUS)
            .likeCount(DEFAULT_LIKE_COUNT);
        return reviewComments;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ReviewComments createUpdatedEntity(EntityManager em) {
        ReviewComments reviewComments = new ReviewComments()
            .parentID(UPDATED_PARENT_ID)
            .content(UPDATED_CONTENT)
            .timestamp(UPDATED_TIMESTAMP)
            .status(UPDATED_STATUS)
            .likeCount(UPDATED_LIKE_COUNT);
        return reviewComments;
    }

    @BeforeEach
    public void initTest() {
        reviewComments = createEntity(em);
    }

    @Test
    @Transactional
    void createReviewComments() throws Exception {
        int databaseSizeBeforeCreate = reviewCommentsRepository.findAll().size();
        // Create the ReviewComments
        restReviewCommentsMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(reviewComments))
            )
            .andExpect(status().isCreated());

        // Validate the ReviewComments in the database
        List<ReviewComments> reviewCommentsList = reviewCommentsRepository.findAll();
        assertThat(reviewCommentsList).hasSize(databaseSizeBeforeCreate + 1);
        ReviewComments testReviewComments = reviewCommentsList.get(reviewCommentsList.size() - 1);
        assertThat(testReviewComments.getParentID()).isEqualTo(DEFAULT_PARENT_ID);
        assertThat(testReviewComments.getContent()).isEqualTo(DEFAULT_CONTENT);
        assertThat(testReviewComments.getTimestamp()).isEqualTo(DEFAULT_TIMESTAMP);
        assertThat(testReviewComments.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testReviewComments.getLikeCount()).isEqualTo(DEFAULT_LIKE_COUNT);
    }

    @Test
    @Transactional
    void createReviewCommentsWithExistingId() throws Exception {
        // Create the ReviewComments with an existing ID
        reviewComments.setId(1L);

        int databaseSizeBeforeCreate = reviewCommentsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restReviewCommentsMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(reviewComments))
            )
            .andExpect(status().isBadRequest());

        // Validate the ReviewComments in the database
        List<ReviewComments> reviewCommentsList = reviewCommentsRepository.findAll();
        assertThat(reviewCommentsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllReviewComments() throws Exception {
        // Initialize the database
        reviewCommentsRepository.saveAndFlush(reviewComments);

        // Get all the reviewCommentsList
        restReviewCommentsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(reviewComments.getId().intValue())))
            .andExpect(jsonPath("$.[*].parentID").value(hasItem(DEFAULT_PARENT_ID)))
            .andExpect(jsonPath("$.[*].content").value(hasItem(DEFAULT_CONTENT.toString())))
            .andExpect(jsonPath("$.[*].timestamp").value(hasItem(DEFAULT_TIMESTAMP.toString())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS)))
            .andExpect(jsonPath("$.[*].likeCount").value(hasItem(DEFAULT_LIKE_COUNT)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllReviewCommentsWithEagerRelationshipsIsEnabled() throws Exception {
        when(reviewCommentsRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restReviewCommentsMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(reviewCommentsRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllReviewCommentsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(reviewCommentsRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restReviewCommentsMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(reviewCommentsRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getReviewComments() throws Exception {
        // Initialize the database
        reviewCommentsRepository.saveAndFlush(reviewComments);

        // Get the reviewComments
        restReviewCommentsMockMvc
            .perform(get(ENTITY_API_URL_ID, reviewComments.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(reviewComments.getId().intValue()))
            .andExpect(jsonPath("$.parentID").value(DEFAULT_PARENT_ID))
            .andExpect(jsonPath("$.content").value(DEFAULT_CONTENT.toString()))
            .andExpect(jsonPath("$.timestamp").value(DEFAULT_TIMESTAMP.toString()))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS))
            .andExpect(jsonPath("$.likeCount").value(DEFAULT_LIKE_COUNT));
    }

    @Test
    @Transactional
    void getNonExistingReviewComments() throws Exception {
        // Get the reviewComments
        restReviewCommentsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingReviewComments() throws Exception {
        // Initialize the database
        reviewCommentsRepository.saveAndFlush(reviewComments);

        int databaseSizeBeforeUpdate = reviewCommentsRepository.findAll().size();

        // Update the reviewComments
        ReviewComments updatedReviewComments = reviewCommentsRepository.findById(reviewComments.getId()).get();
        // Disconnect from session so that the updates on updatedReviewComments are not directly saved in db
        em.detach(updatedReviewComments);
        updatedReviewComments
            .parentID(UPDATED_PARENT_ID)
            .content(UPDATED_CONTENT)
            .timestamp(UPDATED_TIMESTAMP)
            .status(UPDATED_STATUS)
            .likeCount(UPDATED_LIKE_COUNT);

        restReviewCommentsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedReviewComments.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedReviewComments))
            )
            .andExpect(status().isOk());

        // Validate the ReviewComments in the database
        List<ReviewComments> reviewCommentsList = reviewCommentsRepository.findAll();
        assertThat(reviewCommentsList).hasSize(databaseSizeBeforeUpdate);
        ReviewComments testReviewComments = reviewCommentsList.get(reviewCommentsList.size() - 1);
        assertThat(testReviewComments.getParentID()).isEqualTo(UPDATED_PARENT_ID);
        assertThat(testReviewComments.getContent()).isEqualTo(UPDATED_CONTENT);
        assertThat(testReviewComments.getTimestamp()).isEqualTo(UPDATED_TIMESTAMP);
        assertThat(testReviewComments.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testReviewComments.getLikeCount()).isEqualTo(UPDATED_LIKE_COUNT);
    }

    @Test
    @Transactional
    void putNonExistingReviewComments() throws Exception {
        int databaseSizeBeforeUpdate = reviewCommentsRepository.findAll().size();
        reviewComments.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restReviewCommentsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, reviewComments.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(reviewComments))
            )
            .andExpect(status().isBadRequest());

        // Validate the ReviewComments in the database
        List<ReviewComments> reviewCommentsList = reviewCommentsRepository.findAll();
        assertThat(reviewCommentsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchReviewComments() throws Exception {
        int databaseSizeBeforeUpdate = reviewCommentsRepository.findAll().size();
        reviewComments.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReviewCommentsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(reviewComments))
            )
            .andExpect(status().isBadRequest());

        // Validate the ReviewComments in the database
        List<ReviewComments> reviewCommentsList = reviewCommentsRepository.findAll();
        assertThat(reviewCommentsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamReviewComments() throws Exception {
        int databaseSizeBeforeUpdate = reviewCommentsRepository.findAll().size();
        reviewComments.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReviewCommentsMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(reviewComments)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ReviewComments in the database
        List<ReviewComments> reviewCommentsList = reviewCommentsRepository.findAll();
        assertThat(reviewCommentsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateReviewCommentsWithPatch() throws Exception {
        // Initialize the database
        reviewCommentsRepository.saveAndFlush(reviewComments);

        int databaseSizeBeforeUpdate = reviewCommentsRepository.findAll().size();

        // Update the reviewComments using partial update
        ReviewComments partialUpdatedReviewComments = new ReviewComments();
        partialUpdatedReviewComments.setId(reviewComments.getId());

        partialUpdatedReviewComments
            .parentID(UPDATED_PARENT_ID)
            .content(UPDATED_CONTENT)
            .timestamp(UPDATED_TIMESTAMP)
            .status(UPDATED_STATUS);

        restReviewCommentsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedReviewComments.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedReviewComments))
            )
            .andExpect(status().isOk());

        // Validate the ReviewComments in the database
        List<ReviewComments> reviewCommentsList = reviewCommentsRepository.findAll();
        assertThat(reviewCommentsList).hasSize(databaseSizeBeforeUpdate);
        ReviewComments testReviewComments = reviewCommentsList.get(reviewCommentsList.size() - 1);
        assertThat(testReviewComments.getParentID()).isEqualTo(UPDATED_PARENT_ID);
        assertThat(testReviewComments.getContent()).isEqualTo(UPDATED_CONTENT);
        assertThat(testReviewComments.getTimestamp()).isEqualTo(UPDATED_TIMESTAMP);
        assertThat(testReviewComments.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testReviewComments.getLikeCount()).isEqualTo(DEFAULT_LIKE_COUNT);
    }

    @Test
    @Transactional
    void fullUpdateReviewCommentsWithPatch() throws Exception {
        // Initialize the database
        reviewCommentsRepository.saveAndFlush(reviewComments);

        int databaseSizeBeforeUpdate = reviewCommentsRepository.findAll().size();

        // Update the reviewComments using partial update
        ReviewComments partialUpdatedReviewComments = new ReviewComments();
        partialUpdatedReviewComments.setId(reviewComments.getId());

        partialUpdatedReviewComments
            .parentID(UPDATED_PARENT_ID)
            .content(UPDATED_CONTENT)
            .timestamp(UPDATED_TIMESTAMP)
            .status(UPDATED_STATUS)
            .likeCount(UPDATED_LIKE_COUNT);

        restReviewCommentsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedReviewComments.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedReviewComments))
            )
            .andExpect(status().isOk());

        // Validate the ReviewComments in the database
        List<ReviewComments> reviewCommentsList = reviewCommentsRepository.findAll();
        assertThat(reviewCommentsList).hasSize(databaseSizeBeforeUpdate);
        ReviewComments testReviewComments = reviewCommentsList.get(reviewCommentsList.size() - 1);
        assertThat(testReviewComments.getParentID()).isEqualTo(UPDATED_PARENT_ID);
        assertThat(testReviewComments.getContent()).isEqualTo(UPDATED_CONTENT);
        assertThat(testReviewComments.getTimestamp()).isEqualTo(UPDATED_TIMESTAMP);
        assertThat(testReviewComments.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testReviewComments.getLikeCount()).isEqualTo(UPDATED_LIKE_COUNT);
    }

    @Test
    @Transactional
    void patchNonExistingReviewComments() throws Exception {
        int databaseSizeBeforeUpdate = reviewCommentsRepository.findAll().size();
        reviewComments.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restReviewCommentsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, reviewComments.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(reviewComments))
            )
            .andExpect(status().isBadRequest());

        // Validate the ReviewComments in the database
        List<ReviewComments> reviewCommentsList = reviewCommentsRepository.findAll();
        assertThat(reviewCommentsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchReviewComments() throws Exception {
        int databaseSizeBeforeUpdate = reviewCommentsRepository.findAll().size();
        reviewComments.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReviewCommentsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(reviewComments))
            )
            .andExpect(status().isBadRequest());

        // Validate the ReviewComments in the database
        List<ReviewComments> reviewCommentsList = reviewCommentsRepository.findAll();
        assertThat(reviewCommentsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamReviewComments() throws Exception {
        int databaseSizeBeforeUpdate = reviewCommentsRepository.findAll().size();
        reviewComments.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReviewCommentsMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(reviewComments))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ReviewComments in the database
        List<ReviewComments> reviewCommentsList = reviewCommentsRepository.findAll();
        assertThat(reviewCommentsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteReviewComments() throws Exception {
        // Initialize the database
        reviewCommentsRepository.saveAndFlush(reviewComments);

        int databaseSizeBeforeDelete = reviewCommentsRepository.findAll().size();

        // Delete the reviewComments
        restReviewCommentsMockMvc
            .perform(delete(ENTITY_API_URL_ID, reviewComments.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ReviewComments> reviewCommentsList = reviewCommentsRepository.findAll();
        assertThat(reviewCommentsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

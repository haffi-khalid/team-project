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
import team.bham.IntegrationTest;
import team.bham.domain.SocialFeed;
import team.bham.repository.SocialFeedRepository;

/**
 * Integration tests for the {@link SocialFeedResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SocialFeedResourceIT {

    private static final String DEFAULT_PLATFORM = "AAAAAAAAAA";
    private static final String UPDATED_PLATFORM = "BBBBBBBBBB";

    private static final Instant DEFAULT_LAST_UPDATED = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_LAST_UPDATED = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/social-feeds";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SocialFeedRepository socialFeedRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSocialFeedMockMvc;

    private SocialFeed socialFeed;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SocialFeed createEntity(EntityManager em) {
        SocialFeed socialFeed = new SocialFeed().platform(DEFAULT_PLATFORM).lastUpdated(DEFAULT_LAST_UPDATED);
        return socialFeed;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SocialFeed createUpdatedEntity(EntityManager em) {
        SocialFeed socialFeed = new SocialFeed().platform(UPDATED_PLATFORM).lastUpdated(UPDATED_LAST_UPDATED);
        return socialFeed;
    }

    @BeforeEach
    public void initTest() {
        socialFeed = createEntity(em);
    }

    @Test
    @Transactional
    void createSocialFeed() throws Exception {
        int databaseSizeBeforeCreate = socialFeedRepository.findAll().size();
        // Create the SocialFeed
        restSocialFeedMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(socialFeed)))
            .andExpect(status().isCreated());

        // Validate the SocialFeed in the database
        List<SocialFeed> socialFeedList = socialFeedRepository.findAll();
        assertThat(socialFeedList).hasSize(databaseSizeBeforeCreate + 1);
        SocialFeed testSocialFeed = socialFeedList.get(socialFeedList.size() - 1);
        assertThat(testSocialFeed.getPlatform()).isEqualTo(DEFAULT_PLATFORM);
        assertThat(testSocialFeed.getLastUpdated()).isEqualTo(DEFAULT_LAST_UPDATED);
    }

    @Test
    @Transactional
    void createSocialFeedWithExistingId() throws Exception {
        // Create the SocialFeed with an existing ID
        socialFeed.setId(1L);

        int databaseSizeBeforeCreate = socialFeedRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSocialFeedMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(socialFeed)))
            .andExpect(status().isBadRequest());

        // Validate the SocialFeed in the database
        List<SocialFeed> socialFeedList = socialFeedRepository.findAll();
        assertThat(socialFeedList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkPlatformIsRequired() throws Exception {
        int databaseSizeBeforeTest = socialFeedRepository.findAll().size();
        // set the field null
        socialFeed.setPlatform(null);

        // Create the SocialFeed, which fails.

        restSocialFeedMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(socialFeed)))
            .andExpect(status().isBadRequest());

        List<SocialFeed> socialFeedList = socialFeedRepository.findAll();
        assertThat(socialFeedList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllSocialFeeds() throws Exception {
        // Initialize the database
        socialFeedRepository.saveAndFlush(socialFeed);

        // Get all the socialFeedList
        restSocialFeedMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(socialFeed.getId().intValue())))
            .andExpect(jsonPath("$.[*].platform").value(hasItem(DEFAULT_PLATFORM)))
            .andExpect(jsonPath("$.[*].lastUpdated").value(hasItem(DEFAULT_LAST_UPDATED.toString())));
    }

    @Test
    @Transactional
    void getSocialFeed() throws Exception {
        // Initialize the database
        socialFeedRepository.saveAndFlush(socialFeed);

        // Get the socialFeed
        restSocialFeedMockMvc
            .perform(get(ENTITY_API_URL_ID, socialFeed.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(socialFeed.getId().intValue()))
            .andExpect(jsonPath("$.platform").value(DEFAULT_PLATFORM))
            .andExpect(jsonPath("$.lastUpdated").value(DEFAULT_LAST_UPDATED.toString()));
    }

    @Test
    @Transactional
    void getNonExistingSocialFeed() throws Exception {
        // Get the socialFeed
        restSocialFeedMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingSocialFeed() throws Exception {
        // Initialize the database
        socialFeedRepository.saveAndFlush(socialFeed);

        int databaseSizeBeforeUpdate = socialFeedRepository.findAll().size();

        // Update the socialFeed
        SocialFeed updatedSocialFeed = socialFeedRepository.findById(socialFeed.getId()).get();
        // Disconnect from session so that the updates on updatedSocialFeed are not directly saved in db
        em.detach(updatedSocialFeed);
        updatedSocialFeed.platform(UPDATED_PLATFORM).lastUpdated(UPDATED_LAST_UPDATED);

        restSocialFeedMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSocialFeed.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSocialFeed))
            )
            .andExpect(status().isOk());

        // Validate the SocialFeed in the database
        List<SocialFeed> socialFeedList = socialFeedRepository.findAll();
        assertThat(socialFeedList).hasSize(databaseSizeBeforeUpdate);
        SocialFeed testSocialFeed = socialFeedList.get(socialFeedList.size() - 1);
        assertThat(testSocialFeed.getPlatform()).isEqualTo(UPDATED_PLATFORM);
        assertThat(testSocialFeed.getLastUpdated()).isEqualTo(UPDATED_LAST_UPDATED);
    }

    @Test
    @Transactional
    void putNonExistingSocialFeed() throws Exception {
        int databaseSizeBeforeUpdate = socialFeedRepository.findAll().size();
        socialFeed.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSocialFeedMockMvc
            .perform(
                put(ENTITY_API_URL_ID, socialFeed.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(socialFeed))
            )
            .andExpect(status().isBadRequest());

        // Validate the SocialFeed in the database
        List<SocialFeed> socialFeedList = socialFeedRepository.findAll();
        assertThat(socialFeedList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSocialFeed() throws Exception {
        int databaseSizeBeforeUpdate = socialFeedRepository.findAll().size();
        socialFeed.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSocialFeedMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(socialFeed))
            )
            .andExpect(status().isBadRequest());

        // Validate the SocialFeed in the database
        List<SocialFeed> socialFeedList = socialFeedRepository.findAll();
        assertThat(socialFeedList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSocialFeed() throws Exception {
        int databaseSizeBeforeUpdate = socialFeedRepository.findAll().size();
        socialFeed.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSocialFeedMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(socialFeed)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the SocialFeed in the database
        List<SocialFeed> socialFeedList = socialFeedRepository.findAll();
        assertThat(socialFeedList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSocialFeedWithPatch() throws Exception {
        // Initialize the database
        socialFeedRepository.saveAndFlush(socialFeed);

        int databaseSizeBeforeUpdate = socialFeedRepository.findAll().size();

        // Update the socialFeed using partial update
        SocialFeed partialUpdatedSocialFeed = new SocialFeed();
        partialUpdatedSocialFeed.setId(socialFeed.getId());

        partialUpdatedSocialFeed.platform(UPDATED_PLATFORM).lastUpdated(UPDATED_LAST_UPDATED);

        restSocialFeedMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSocialFeed.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSocialFeed))
            )
            .andExpect(status().isOk());

        // Validate the SocialFeed in the database
        List<SocialFeed> socialFeedList = socialFeedRepository.findAll();
        assertThat(socialFeedList).hasSize(databaseSizeBeforeUpdate);
        SocialFeed testSocialFeed = socialFeedList.get(socialFeedList.size() - 1);
        assertThat(testSocialFeed.getPlatform()).isEqualTo(UPDATED_PLATFORM);
        assertThat(testSocialFeed.getLastUpdated()).isEqualTo(UPDATED_LAST_UPDATED);
    }

    @Test
    @Transactional
    void fullUpdateSocialFeedWithPatch() throws Exception {
        // Initialize the database
        socialFeedRepository.saveAndFlush(socialFeed);

        int databaseSizeBeforeUpdate = socialFeedRepository.findAll().size();

        // Update the socialFeed using partial update
        SocialFeed partialUpdatedSocialFeed = new SocialFeed();
        partialUpdatedSocialFeed.setId(socialFeed.getId());

        partialUpdatedSocialFeed.platform(UPDATED_PLATFORM).lastUpdated(UPDATED_LAST_UPDATED);

        restSocialFeedMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSocialFeed.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSocialFeed))
            )
            .andExpect(status().isOk());

        // Validate the SocialFeed in the database
        List<SocialFeed> socialFeedList = socialFeedRepository.findAll();
        assertThat(socialFeedList).hasSize(databaseSizeBeforeUpdate);
        SocialFeed testSocialFeed = socialFeedList.get(socialFeedList.size() - 1);
        assertThat(testSocialFeed.getPlatform()).isEqualTo(UPDATED_PLATFORM);
        assertThat(testSocialFeed.getLastUpdated()).isEqualTo(UPDATED_LAST_UPDATED);
    }

    @Test
    @Transactional
    void patchNonExistingSocialFeed() throws Exception {
        int databaseSizeBeforeUpdate = socialFeedRepository.findAll().size();
        socialFeed.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSocialFeedMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, socialFeed.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(socialFeed))
            )
            .andExpect(status().isBadRequest());

        // Validate the SocialFeed in the database
        List<SocialFeed> socialFeedList = socialFeedRepository.findAll();
        assertThat(socialFeedList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSocialFeed() throws Exception {
        int databaseSizeBeforeUpdate = socialFeedRepository.findAll().size();
        socialFeed.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSocialFeedMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(socialFeed))
            )
            .andExpect(status().isBadRequest());

        // Validate the SocialFeed in the database
        List<SocialFeed> socialFeedList = socialFeedRepository.findAll();
        assertThat(socialFeedList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSocialFeed() throws Exception {
        int databaseSizeBeforeUpdate = socialFeedRepository.findAll().size();
        socialFeed.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSocialFeedMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(socialFeed))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the SocialFeed in the database
        List<SocialFeed> socialFeedList = socialFeedRepository.findAll();
        assertThat(socialFeedList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSocialFeed() throws Exception {
        // Initialize the database
        socialFeedRepository.saveAndFlush(socialFeed);

        int databaseSizeBeforeDelete = socialFeedRepository.findAll().size();

        // Delete the socialFeed
        restSocialFeedMockMvc
            .perform(delete(ENTITY_API_URL_ID, socialFeed.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<SocialFeed> socialFeedList = socialFeedRepository.findAll();
        assertThat(socialFeedList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

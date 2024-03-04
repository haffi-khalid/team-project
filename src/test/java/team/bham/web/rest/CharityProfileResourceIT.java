package team.bham.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

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
import team.bham.domain.CharityProfile;
import team.bham.repository.CharityProfileRepository;

/**
 * Integration tests for the {@link CharityProfileResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CharityProfileResourceIT {

    private static final String DEFAULT_CHARITY_NAME = "AAAAAAAAAA";
    private static final String UPDATED_CHARITY_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_PURPOSE = "AAAAAAAAAA";
    private static final String UPDATED_PURPOSE = "BBBBBBBBBB";

    private static final String DEFAULT_AIM = "AAAAAAAAAA";
    private static final String UPDATED_AIM = "BBBBBBBBBB";

    private static final String DEFAULT_EMAIL_ADDRESS = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL_ADDRESS = "BBBBBBBBBB";

    private static final byte[] DEFAULT_LOGO = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_LOGO = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_LOGO_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_LOGO_CONTENT_TYPE = "image/png";

    private static final byte[] DEFAULT_PICTURES = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_PICTURES = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_PICTURES_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_PICTURES_CONTENT_TYPE = "image/png";

    private static final String ENTITY_API_URL = "/api/charity-profiles";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CharityProfileRepository charityProfileRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCharityProfileMockMvc;

    private CharityProfile charityProfile;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CharityProfile createEntity(EntityManager em) {
        CharityProfile charityProfile = new CharityProfile()
            .charityName(DEFAULT_CHARITY_NAME)
            .purpose(DEFAULT_PURPOSE)
            .aim(DEFAULT_AIM)
            .emailAddress(DEFAULT_EMAIL_ADDRESS)
            .logo(DEFAULT_LOGO)
            .logoContentType(DEFAULT_LOGO_CONTENT_TYPE)
            .pictures(DEFAULT_PICTURES)
            .picturesContentType(DEFAULT_PICTURES_CONTENT_TYPE);
        return charityProfile;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CharityProfile createUpdatedEntity(EntityManager em) {
        CharityProfile charityProfile = new CharityProfile()
            .charityName(UPDATED_CHARITY_NAME)
            .purpose(UPDATED_PURPOSE)
            .aim(UPDATED_AIM)
            .emailAddress(UPDATED_EMAIL_ADDRESS)
            .logo(UPDATED_LOGO)
            .logoContentType(UPDATED_LOGO_CONTENT_TYPE)
            .pictures(UPDATED_PICTURES)
            .picturesContentType(UPDATED_PICTURES_CONTENT_TYPE);
        return charityProfile;
    }

    @BeforeEach
    public void initTest() {
        charityProfile = createEntity(em);
    }

    @Test
    @Transactional
    void createCharityProfile() throws Exception {
        int databaseSizeBeforeCreate = charityProfileRepository.findAll().size();
        // Create the CharityProfile
        restCharityProfileMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(charityProfile))
            )
            .andExpect(status().isCreated());

        // Validate the CharityProfile in the database
        List<CharityProfile> charityProfileList = charityProfileRepository.findAll();
        assertThat(charityProfileList).hasSize(databaseSizeBeforeCreate + 1);
        CharityProfile testCharityProfile = charityProfileList.get(charityProfileList.size() - 1);
        assertThat(testCharityProfile.getCharityName()).isEqualTo(DEFAULT_CHARITY_NAME);
        assertThat(testCharityProfile.getPurpose()).isEqualTo(DEFAULT_PURPOSE);
        assertThat(testCharityProfile.getAim()).isEqualTo(DEFAULT_AIM);
        assertThat(testCharityProfile.getEmailAddress()).isEqualTo(DEFAULT_EMAIL_ADDRESS);
        assertThat(testCharityProfile.getLogo()).isEqualTo(DEFAULT_LOGO);
        assertThat(testCharityProfile.getLogoContentType()).isEqualTo(DEFAULT_LOGO_CONTENT_TYPE);
        assertThat(testCharityProfile.getPictures()).isEqualTo(DEFAULT_PICTURES);
        assertThat(testCharityProfile.getPicturesContentType()).isEqualTo(DEFAULT_PICTURES_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void createCharityProfileWithExistingId() throws Exception {
        // Create the CharityProfile with an existing ID
        charityProfile.setId(1L);

        int databaseSizeBeforeCreate = charityProfileRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCharityProfileMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(charityProfile))
            )
            .andExpect(status().isBadRequest());

        // Validate the CharityProfile in the database
        List<CharityProfile> charityProfileList = charityProfileRepository.findAll();
        assertThat(charityProfileList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCharityProfiles() throws Exception {
        // Initialize the database
        charityProfileRepository.saveAndFlush(charityProfile);

        // Get all the charityProfileList
        restCharityProfileMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(charityProfile.getId().intValue())))
            .andExpect(jsonPath("$.[*].charityName").value(hasItem(DEFAULT_CHARITY_NAME)))
            .andExpect(jsonPath("$.[*].purpose").value(hasItem(DEFAULT_PURPOSE)))
            .andExpect(jsonPath("$.[*].aim").value(hasItem(DEFAULT_AIM)))
            .andExpect(jsonPath("$.[*].emailAddress").value(hasItem(DEFAULT_EMAIL_ADDRESS)))
            .andExpect(jsonPath("$.[*].logoContentType").value(hasItem(DEFAULT_LOGO_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].logo").value(hasItem(Base64Utils.encodeToString(DEFAULT_LOGO))))
            .andExpect(jsonPath("$.[*].picturesContentType").value(hasItem(DEFAULT_PICTURES_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].pictures").value(hasItem(Base64Utils.encodeToString(DEFAULT_PICTURES))));
    }

    @Test
    @Transactional
    void getCharityProfile() throws Exception {
        // Initialize the database
        charityProfileRepository.saveAndFlush(charityProfile);

        // Get the charityProfile
        restCharityProfileMockMvc
            .perform(get(ENTITY_API_URL_ID, charityProfile.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(charityProfile.getId().intValue()))
            .andExpect(jsonPath("$.charityName").value(DEFAULT_CHARITY_NAME))
            .andExpect(jsonPath("$.purpose").value(DEFAULT_PURPOSE))
            .andExpect(jsonPath("$.aim").value(DEFAULT_AIM))
            .andExpect(jsonPath("$.emailAddress").value(DEFAULT_EMAIL_ADDRESS))
            .andExpect(jsonPath("$.logoContentType").value(DEFAULT_LOGO_CONTENT_TYPE))
            .andExpect(jsonPath("$.logo").value(Base64Utils.encodeToString(DEFAULT_LOGO)))
            .andExpect(jsonPath("$.picturesContentType").value(DEFAULT_PICTURES_CONTENT_TYPE))
            .andExpect(jsonPath("$.pictures").value(Base64Utils.encodeToString(DEFAULT_PICTURES)));
    }

    @Test
    @Transactional
    void getNonExistingCharityProfile() throws Exception {
        // Get the charityProfile
        restCharityProfileMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingCharityProfile() throws Exception {
        // Initialize the database
        charityProfileRepository.saveAndFlush(charityProfile);

        int databaseSizeBeforeUpdate = charityProfileRepository.findAll().size();

        // Update the charityProfile
        CharityProfile updatedCharityProfile = charityProfileRepository.findById(charityProfile.getId()).get();
        // Disconnect from session so that the updates on updatedCharityProfile are not directly saved in db
        em.detach(updatedCharityProfile);
        updatedCharityProfile
            .charityName(UPDATED_CHARITY_NAME)
            .purpose(UPDATED_PURPOSE)
            .aim(UPDATED_AIM)
            .emailAddress(UPDATED_EMAIL_ADDRESS)
            .logo(UPDATED_LOGO)
            .logoContentType(UPDATED_LOGO_CONTENT_TYPE)
            .pictures(UPDATED_PICTURES)
            .picturesContentType(UPDATED_PICTURES_CONTENT_TYPE);

        restCharityProfileMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCharityProfile.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCharityProfile))
            )
            .andExpect(status().isOk());

        // Validate the CharityProfile in the database
        List<CharityProfile> charityProfileList = charityProfileRepository.findAll();
        assertThat(charityProfileList).hasSize(databaseSizeBeforeUpdate);
        CharityProfile testCharityProfile = charityProfileList.get(charityProfileList.size() - 1);
        assertThat(testCharityProfile.getCharityName()).isEqualTo(UPDATED_CHARITY_NAME);
        assertThat(testCharityProfile.getPurpose()).isEqualTo(UPDATED_PURPOSE);
        assertThat(testCharityProfile.getAim()).isEqualTo(UPDATED_AIM);
        assertThat(testCharityProfile.getEmailAddress()).isEqualTo(UPDATED_EMAIL_ADDRESS);
        assertThat(testCharityProfile.getLogo()).isEqualTo(UPDATED_LOGO);
        assertThat(testCharityProfile.getLogoContentType()).isEqualTo(UPDATED_LOGO_CONTENT_TYPE);
        assertThat(testCharityProfile.getPictures()).isEqualTo(UPDATED_PICTURES);
        assertThat(testCharityProfile.getPicturesContentType()).isEqualTo(UPDATED_PICTURES_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void putNonExistingCharityProfile() throws Exception {
        int databaseSizeBeforeUpdate = charityProfileRepository.findAll().size();
        charityProfile.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCharityProfileMockMvc
            .perform(
                put(ENTITY_API_URL_ID, charityProfile.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(charityProfile))
            )
            .andExpect(status().isBadRequest());

        // Validate the CharityProfile in the database
        List<CharityProfile> charityProfileList = charityProfileRepository.findAll();
        assertThat(charityProfileList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCharityProfile() throws Exception {
        int databaseSizeBeforeUpdate = charityProfileRepository.findAll().size();
        charityProfile.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCharityProfileMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(charityProfile))
            )
            .andExpect(status().isBadRequest());

        // Validate the CharityProfile in the database
        List<CharityProfile> charityProfileList = charityProfileRepository.findAll();
        assertThat(charityProfileList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCharityProfile() throws Exception {
        int databaseSizeBeforeUpdate = charityProfileRepository.findAll().size();
        charityProfile.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCharityProfileMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(charityProfile)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the CharityProfile in the database
        List<CharityProfile> charityProfileList = charityProfileRepository.findAll();
        assertThat(charityProfileList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCharityProfileWithPatch() throws Exception {
        // Initialize the database
        charityProfileRepository.saveAndFlush(charityProfile);

        int databaseSizeBeforeUpdate = charityProfileRepository.findAll().size();

        // Update the charityProfile using partial update
        CharityProfile partialUpdatedCharityProfile = new CharityProfile();
        partialUpdatedCharityProfile.setId(charityProfile.getId());

        partialUpdatedCharityProfile
            .aim(UPDATED_AIM)
            .emailAddress(UPDATED_EMAIL_ADDRESS)
            .pictures(UPDATED_PICTURES)
            .picturesContentType(UPDATED_PICTURES_CONTENT_TYPE);

        restCharityProfileMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCharityProfile.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCharityProfile))
            )
            .andExpect(status().isOk());

        // Validate the CharityProfile in the database
        List<CharityProfile> charityProfileList = charityProfileRepository.findAll();
        assertThat(charityProfileList).hasSize(databaseSizeBeforeUpdate);
        CharityProfile testCharityProfile = charityProfileList.get(charityProfileList.size() - 1);
        assertThat(testCharityProfile.getCharityName()).isEqualTo(DEFAULT_CHARITY_NAME);
        assertThat(testCharityProfile.getPurpose()).isEqualTo(DEFAULT_PURPOSE);
        assertThat(testCharityProfile.getAim()).isEqualTo(UPDATED_AIM);
        assertThat(testCharityProfile.getEmailAddress()).isEqualTo(UPDATED_EMAIL_ADDRESS);
        assertThat(testCharityProfile.getLogo()).isEqualTo(DEFAULT_LOGO);
        assertThat(testCharityProfile.getLogoContentType()).isEqualTo(DEFAULT_LOGO_CONTENT_TYPE);
        assertThat(testCharityProfile.getPictures()).isEqualTo(UPDATED_PICTURES);
        assertThat(testCharityProfile.getPicturesContentType()).isEqualTo(UPDATED_PICTURES_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void fullUpdateCharityProfileWithPatch() throws Exception {
        // Initialize the database
        charityProfileRepository.saveAndFlush(charityProfile);

        int databaseSizeBeforeUpdate = charityProfileRepository.findAll().size();

        // Update the charityProfile using partial update
        CharityProfile partialUpdatedCharityProfile = new CharityProfile();
        partialUpdatedCharityProfile.setId(charityProfile.getId());

        partialUpdatedCharityProfile
            .charityName(UPDATED_CHARITY_NAME)
            .purpose(UPDATED_PURPOSE)
            .aim(UPDATED_AIM)
            .emailAddress(UPDATED_EMAIL_ADDRESS)
            .logo(UPDATED_LOGO)
            .logoContentType(UPDATED_LOGO_CONTENT_TYPE)
            .pictures(UPDATED_PICTURES)
            .picturesContentType(UPDATED_PICTURES_CONTENT_TYPE);

        restCharityProfileMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCharityProfile.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCharityProfile))
            )
            .andExpect(status().isOk());

        // Validate the CharityProfile in the database
        List<CharityProfile> charityProfileList = charityProfileRepository.findAll();
        assertThat(charityProfileList).hasSize(databaseSizeBeforeUpdate);
        CharityProfile testCharityProfile = charityProfileList.get(charityProfileList.size() - 1);
        assertThat(testCharityProfile.getCharityName()).isEqualTo(UPDATED_CHARITY_NAME);
        assertThat(testCharityProfile.getPurpose()).isEqualTo(UPDATED_PURPOSE);
        assertThat(testCharityProfile.getAim()).isEqualTo(UPDATED_AIM);
        assertThat(testCharityProfile.getEmailAddress()).isEqualTo(UPDATED_EMAIL_ADDRESS);
        assertThat(testCharityProfile.getLogo()).isEqualTo(UPDATED_LOGO);
        assertThat(testCharityProfile.getLogoContentType()).isEqualTo(UPDATED_LOGO_CONTENT_TYPE);
        assertThat(testCharityProfile.getPictures()).isEqualTo(UPDATED_PICTURES);
        assertThat(testCharityProfile.getPicturesContentType()).isEqualTo(UPDATED_PICTURES_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void patchNonExistingCharityProfile() throws Exception {
        int databaseSizeBeforeUpdate = charityProfileRepository.findAll().size();
        charityProfile.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCharityProfileMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, charityProfile.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(charityProfile))
            )
            .andExpect(status().isBadRequest());

        // Validate the CharityProfile in the database
        List<CharityProfile> charityProfileList = charityProfileRepository.findAll();
        assertThat(charityProfileList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCharityProfile() throws Exception {
        int databaseSizeBeforeUpdate = charityProfileRepository.findAll().size();
        charityProfile.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCharityProfileMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(charityProfile))
            )
            .andExpect(status().isBadRequest());

        // Validate the CharityProfile in the database
        List<CharityProfile> charityProfileList = charityProfileRepository.findAll();
        assertThat(charityProfileList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCharityProfile() throws Exception {
        int databaseSizeBeforeUpdate = charityProfileRepository.findAll().size();
        charityProfile.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCharityProfileMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(charityProfile))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CharityProfile in the database
        List<CharityProfile> charityProfileList = charityProfileRepository.findAll();
        assertThat(charityProfileList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCharityProfile() throws Exception {
        // Initialize the database
        charityProfileRepository.saveAndFlush(charityProfile);

        int databaseSizeBeforeDelete = charityProfileRepository.findAll().size();

        // Delete the charityProfile
        restCharityProfileMockMvc
            .perform(delete(ENTITY_API_URL_ID, charityProfile.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<CharityProfile> charityProfileList = charityProfileRepository.findAll();
        assertThat(charityProfileList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

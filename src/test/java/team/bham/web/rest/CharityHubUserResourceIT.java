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
import team.bham.IntegrationTest;
import team.bham.domain.CharityHubUser;
import team.bham.repository.CharityHubUserRepository;

/**
 * Integration tests for the {@link CharityHubUserResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CharityHubUserResourceIT {

    private static final String DEFAULT_USERNAME = "AAAAAAAAAA";
    private static final String UPDATED_USERNAME = "BBBBBBBBBB";

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/charity-hub-users";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CharityHubUserRepository charityHubUserRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCharityHubUserMockMvc;

    private CharityHubUser charityHubUser;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CharityHubUser createEntity(EntityManager em) {
        CharityHubUser charityHubUser = new CharityHubUser().username(DEFAULT_USERNAME).email(DEFAULT_EMAIL);
        return charityHubUser;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CharityHubUser createUpdatedEntity(EntityManager em) {
        CharityHubUser charityHubUser = new CharityHubUser().username(UPDATED_USERNAME).email(UPDATED_EMAIL);
        return charityHubUser;
    }

    @BeforeEach
    public void initTest() {
        charityHubUser = createEntity(em);
    }

    @Test
    @Transactional
    void createCharityHubUser() throws Exception {
        int databaseSizeBeforeCreate = charityHubUserRepository.findAll().size();
        // Create the CharityHubUser
        restCharityHubUserMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(charityHubUser))
            )
            .andExpect(status().isCreated());

        // Validate the CharityHubUser in the database
        List<CharityHubUser> charityHubUserList = charityHubUserRepository.findAll();
        assertThat(charityHubUserList).hasSize(databaseSizeBeforeCreate + 1);
        CharityHubUser testCharityHubUser = charityHubUserList.get(charityHubUserList.size() - 1);
        assertThat(testCharityHubUser.getUsername()).isEqualTo(DEFAULT_USERNAME);
        assertThat(testCharityHubUser.getEmail()).isEqualTo(DEFAULT_EMAIL);
    }

    @Test
    @Transactional
    void createCharityHubUserWithExistingId() throws Exception {
        // Create the CharityHubUser with an existing ID
        charityHubUser.setId(1L);

        int databaseSizeBeforeCreate = charityHubUserRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCharityHubUserMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(charityHubUser))
            )
            .andExpect(status().isBadRequest());

        // Validate the CharityHubUser in the database
        List<CharityHubUser> charityHubUserList = charityHubUserRepository.findAll();
        assertThat(charityHubUserList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCharityHubUsers() throws Exception {
        // Initialize the database
        charityHubUserRepository.saveAndFlush(charityHubUser);

        // Get all the charityHubUserList
        restCharityHubUserMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(charityHubUser.getId().intValue())))
            .andExpect(jsonPath("$.[*].username").value(hasItem(DEFAULT_USERNAME)))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)));
    }

    @Test
    @Transactional
    void getCharityHubUser() throws Exception {
        // Initialize the database
        charityHubUserRepository.saveAndFlush(charityHubUser);

        // Get the charityHubUser
        restCharityHubUserMockMvc
            .perform(get(ENTITY_API_URL_ID, charityHubUser.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(charityHubUser.getId().intValue()))
            .andExpect(jsonPath("$.username").value(DEFAULT_USERNAME))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL));
    }

    @Test
    @Transactional
    void getNonExistingCharityHubUser() throws Exception {
        // Get the charityHubUser
        restCharityHubUserMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingCharityHubUser() throws Exception {
        // Initialize the database
        charityHubUserRepository.saveAndFlush(charityHubUser);

        int databaseSizeBeforeUpdate = charityHubUserRepository.findAll().size();

        // Update the charityHubUser
        CharityHubUser updatedCharityHubUser = charityHubUserRepository.findById(charityHubUser.getId()).get();
        // Disconnect from session so that the updates on updatedCharityHubUser are not directly saved in db
        em.detach(updatedCharityHubUser);
        updatedCharityHubUser.username(UPDATED_USERNAME).email(UPDATED_EMAIL);

        restCharityHubUserMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCharityHubUser.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCharityHubUser))
            )
            .andExpect(status().isOk());

        // Validate the CharityHubUser in the database
        List<CharityHubUser> charityHubUserList = charityHubUserRepository.findAll();
        assertThat(charityHubUserList).hasSize(databaseSizeBeforeUpdate);
        CharityHubUser testCharityHubUser = charityHubUserList.get(charityHubUserList.size() - 1);
        assertThat(testCharityHubUser.getUsername()).isEqualTo(UPDATED_USERNAME);
        assertThat(testCharityHubUser.getEmail()).isEqualTo(UPDATED_EMAIL);
    }

    @Test
    @Transactional
    void putNonExistingCharityHubUser() throws Exception {
        int databaseSizeBeforeUpdate = charityHubUserRepository.findAll().size();
        charityHubUser.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCharityHubUserMockMvc
            .perform(
                put(ENTITY_API_URL_ID, charityHubUser.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(charityHubUser))
            )
            .andExpect(status().isBadRequest());

        // Validate the CharityHubUser in the database
        List<CharityHubUser> charityHubUserList = charityHubUserRepository.findAll();
        assertThat(charityHubUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCharityHubUser() throws Exception {
        int databaseSizeBeforeUpdate = charityHubUserRepository.findAll().size();
        charityHubUser.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCharityHubUserMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(charityHubUser))
            )
            .andExpect(status().isBadRequest());

        // Validate the CharityHubUser in the database
        List<CharityHubUser> charityHubUserList = charityHubUserRepository.findAll();
        assertThat(charityHubUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCharityHubUser() throws Exception {
        int databaseSizeBeforeUpdate = charityHubUserRepository.findAll().size();
        charityHubUser.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCharityHubUserMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(charityHubUser)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the CharityHubUser in the database
        List<CharityHubUser> charityHubUserList = charityHubUserRepository.findAll();
        assertThat(charityHubUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCharityHubUserWithPatch() throws Exception {
        // Initialize the database
        charityHubUserRepository.saveAndFlush(charityHubUser);

        int databaseSizeBeforeUpdate = charityHubUserRepository.findAll().size();

        // Update the charityHubUser using partial update
        CharityHubUser partialUpdatedCharityHubUser = new CharityHubUser();
        partialUpdatedCharityHubUser.setId(charityHubUser.getId());

        partialUpdatedCharityHubUser.username(UPDATED_USERNAME);

        restCharityHubUserMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCharityHubUser.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCharityHubUser))
            )
            .andExpect(status().isOk());

        // Validate the CharityHubUser in the database
        List<CharityHubUser> charityHubUserList = charityHubUserRepository.findAll();
        assertThat(charityHubUserList).hasSize(databaseSizeBeforeUpdate);
        CharityHubUser testCharityHubUser = charityHubUserList.get(charityHubUserList.size() - 1);
        assertThat(testCharityHubUser.getUsername()).isEqualTo(UPDATED_USERNAME);
        assertThat(testCharityHubUser.getEmail()).isEqualTo(DEFAULT_EMAIL);
    }

    @Test
    @Transactional
    void fullUpdateCharityHubUserWithPatch() throws Exception {
        // Initialize the database
        charityHubUserRepository.saveAndFlush(charityHubUser);

        int databaseSizeBeforeUpdate = charityHubUserRepository.findAll().size();

        // Update the charityHubUser using partial update
        CharityHubUser partialUpdatedCharityHubUser = new CharityHubUser();
        partialUpdatedCharityHubUser.setId(charityHubUser.getId());

        partialUpdatedCharityHubUser.username(UPDATED_USERNAME).email(UPDATED_EMAIL);

        restCharityHubUserMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCharityHubUser.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCharityHubUser))
            )
            .andExpect(status().isOk());

        // Validate the CharityHubUser in the database
        List<CharityHubUser> charityHubUserList = charityHubUserRepository.findAll();
        assertThat(charityHubUserList).hasSize(databaseSizeBeforeUpdate);
        CharityHubUser testCharityHubUser = charityHubUserList.get(charityHubUserList.size() - 1);
        assertThat(testCharityHubUser.getUsername()).isEqualTo(UPDATED_USERNAME);
        assertThat(testCharityHubUser.getEmail()).isEqualTo(UPDATED_EMAIL);
    }

    @Test
    @Transactional
    void patchNonExistingCharityHubUser() throws Exception {
        int databaseSizeBeforeUpdate = charityHubUserRepository.findAll().size();
        charityHubUser.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCharityHubUserMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, charityHubUser.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(charityHubUser))
            )
            .andExpect(status().isBadRequest());

        // Validate the CharityHubUser in the database
        List<CharityHubUser> charityHubUserList = charityHubUserRepository.findAll();
        assertThat(charityHubUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCharityHubUser() throws Exception {
        int databaseSizeBeforeUpdate = charityHubUserRepository.findAll().size();
        charityHubUser.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCharityHubUserMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(charityHubUser))
            )
            .andExpect(status().isBadRequest());

        // Validate the CharityHubUser in the database
        List<CharityHubUser> charityHubUserList = charityHubUserRepository.findAll();
        assertThat(charityHubUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCharityHubUser() throws Exception {
        int databaseSizeBeforeUpdate = charityHubUserRepository.findAll().size();
        charityHubUser.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCharityHubUserMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(charityHubUser))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CharityHubUser in the database
        List<CharityHubUser> charityHubUserList = charityHubUserRepository.findAll();
        assertThat(charityHubUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCharityHubUser() throws Exception {
        // Initialize the database
        charityHubUserRepository.saveAndFlush(charityHubUser);

        int databaseSizeBeforeDelete = charityHubUserRepository.findAll().size();

        // Delete the charityHubUser
        restCharityHubUserMockMvc
            .perform(delete(ENTITY_API_URL_ID, charityHubUser.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<CharityHubUser> charityHubUserList = charityHubUserRepository.findAll();
        assertThat(charityHubUserList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

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
import team.bham.domain.Charity;
import team.bham.repository.CharityRepository;

/**
 * Integration tests for the {@link CharityResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CharityResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/charities";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CharityRepository charityRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCharityMockMvc;

    private Charity charity;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Charity createEntity(EntityManager em) {
        Charity charity = new Charity().name(DEFAULT_NAME);
        return charity;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Charity createUpdatedEntity(EntityManager em) {
        Charity charity = new Charity().name(UPDATED_NAME);
        return charity;
    }

    @BeforeEach
    public void initTest() {
        charity = createEntity(em);
    }

    @Test
    @Transactional
    void createCharity() throws Exception {
        int databaseSizeBeforeCreate = charityRepository.findAll().size();
        // Create the Charity
        restCharityMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(charity)))
            .andExpect(status().isCreated());

        // Validate the Charity in the database
        List<Charity> charityList = charityRepository.findAll();
        assertThat(charityList).hasSize(databaseSizeBeforeCreate + 1);
        Charity testCharity = charityList.get(charityList.size() - 1);
        assertThat(testCharity.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void createCharityWithExistingId() throws Exception {
        // Create the Charity with an existing ID
        charity.setId(1L);

        int databaseSizeBeforeCreate = charityRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCharityMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(charity)))
            .andExpect(status().isBadRequest());

        // Validate the Charity in the database
        List<Charity> charityList = charityRepository.findAll();
        assertThat(charityList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCharities() throws Exception {
        // Initialize the database
        charityRepository.saveAndFlush(charity);

        // Get all the charityList
        restCharityMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(charity.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @Test
    @Transactional
    void getCharity() throws Exception {
        // Initialize the database
        charityRepository.saveAndFlush(charity);

        // Get the charity
        restCharityMockMvc
            .perform(get(ENTITY_API_URL_ID, charity.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(charity.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }

    @Test
    @Transactional
    void getNonExistingCharity() throws Exception {
        // Get the charity
        restCharityMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingCharity() throws Exception {
        // Initialize the database
        charityRepository.saveAndFlush(charity);

        int databaseSizeBeforeUpdate = charityRepository.findAll().size();

        // Update the charity
        Charity updatedCharity = charityRepository.findById(charity.getId()).get();
        // Disconnect from session so that the updates on updatedCharity are not directly saved in db
        em.detach(updatedCharity);
        updatedCharity.name(UPDATED_NAME);

        restCharityMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCharity.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCharity))
            )
            .andExpect(status().isOk());

        // Validate the Charity in the database
        List<Charity> charityList = charityRepository.findAll();
        assertThat(charityList).hasSize(databaseSizeBeforeUpdate);
        Charity testCharity = charityList.get(charityList.size() - 1);
        assertThat(testCharity.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void putNonExistingCharity() throws Exception {
        int databaseSizeBeforeUpdate = charityRepository.findAll().size();
        charity.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCharityMockMvc
            .perform(
                put(ENTITY_API_URL_ID, charity.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(charity))
            )
            .andExpect(status().isBadRequest());

        // Validate the Charity in the database
        List<Charity> charityList = charityRepository.findAll();
        assertThat(charityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCharity() throws Exception {
        int databaseSizeBeforeUpdate = charityRepository.findAll().size();
        charity.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCharityMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(charity))
            )
            .andExpect(status().isBadRequest());

        // Validate the Charity in the database
        List<Charity> charityList = charityRepository.findAll();
        assertThat(charityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCharity() throws Exception {
        int databaseSizeBeforeUpdate = charityRepository.findAll().size();
        charity.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCharityMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(charity)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Charity in the database
        List<Charity> charityList = charityRepository.findAll();
        assertThat(charityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCharityWithPatch() throws Exception {
        // Initialize the database
        charityRepository.saveAndFlush(charity);

        int databaseSizeBeforeUpdate = charityRepository.findAll().size();

        // Update the charity using partial update
        Charity partialUpdatedCharity = new Charity();
        partialUpdatedCharity.setId(charity.getId());

        restCharityMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCharity.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCharity))
            )
            .andExpect(status().isOk());

        // Validate the Charity in the database
        List<Charity> charityList = charityRepository.findAll();
        assertThat(charityList).hasSize(databaseSizeBeforeUpdate);
        Charity testCharity = charityList.get(charityList.size() - 1);
        assertThat(testCharity.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void fullUpdateCharityWithPatch() throws Exception {
        // Initialize the database
        charityRepository.saveAndFlush(charity);

        int databaseSizeBeforeUpdate = charityRepository.findAll().size();

        // Update the charity using partial update
        Charity partialUpdatedCharity = new Charity();
        partialUpdatedCharity.setId(charity.getId());

        partialUpdatedCharity.name(UPDATED_NAME);

        restCharityMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCharity.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCharity))
            )
            .andExpect(status().isOk());

        // Validate the Charity in the database
        List<Charity> charityList = charityRepository.findAll();
        assertThat(charityList).hasSize(databaseSizeBeforeUpdate);
        Charity testCharity = charityList.get(charityList.size() - 1);
        assertThat(testCharity.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingCharity() throws Exception {
        int databaseSizeBeforeUpdate = charityRepository.findAll().size();
        charity.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCharityMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, charity.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(charity))
            )
            .andExpect(status().isBadRequest());

        // Validate the Charity in the database
        List<Charity> charityList = charityRepository.findAll();
        assertThat(charityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCharity() throws Exception {
        int databaseSizeBeforeUpdate = charityRepository.findAll().size();
        charity.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCharityMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(charity))
            )
            .andExpect(status().isBadRequest());

        // Validate the Charity in the database
        List<Charity> charityList = charityRepository.findAll();
        assertThat(charityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCharity() throws Exception {
        int databaseSizeBeforeUpdate = charityRepository.findAll().size();
        charity.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCharityMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(charity)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Charity in the database
        List<Charity> charityList = charityRepository.findAll();
        assertThat(charityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCharity() throws Exception {
        // Initialize the database
        charityRepository.saveAndFlush(charity);

        int databaseSizeBeforeDelete = charityRepository.findAll().size();

        // Delete the charity
        restCharityMockMvc
            .perform(delete(ENTITY_API_URL_ID, charity.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Charity> charityList = charityRepository.findAll();
        assertThat(charityList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

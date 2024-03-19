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
import team.bham.domain.DonatorPage;
import team.bham.repository.DonatorPageRepository;

/**
 * Integration tests for the {@link DonatorPageResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class DonatorPageResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final Boolean DEFAULT_ANONYMOUS = false;
    private static final Boolean UPDATED_ANONYMOUS = true;

    private static final Double DEFAULT_AMOUNT = 1D;
    private static final Double UPDATED_AMOUNT = 2D;

    private static final Boolean DEFAULT_GROUP_DONATION = false;
    private static final Boolean UPDATED_GROUP_DONATION = true;

    private static final String ENTITY_API_URL = "/api/donator-pages";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private DonatorPageRepository donatorPageRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDonatorPageMockMvc;

    private DonatorPage donatorPage;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DonatorPage createEntity(EntityManager em) {
        DonatorPage donatorPage = new DonatorPage()
            .name(DEFAULT_NAME)
            .anonymous(DEFAULT_ANONYMOUS)
            .amount(DEFAULT_AMOUNT)
            .groupDonation(DEFAULT_GROUP_DONATION);
        return donatorPage;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DonatorPage createUpdatedEntity(EntityManager em) {
        DonatorPage donatorPage = new DonatorPage()
            .name(UPDATED_NAME)
            .anonymous(UPDATED_ANONYMOUS)
            .amount(UPDATED_AMOUNT)
            .groupDonation(UPDATED_GROUP_DONATION);
        return donatorPage;
    }

    @BeforeEach
    public void initTest() {
        donatorPage = createEntity(em);
    }

    @Test
    @Transactional
    void createDonatorPage() throws Exception {
        int databaseSizeBeforeCreate = donatorPageRepository.findAll().size();
        // Create the DonatorPage
        restDonatorPageMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(donatorPage)))
            .andExpect(status().isCreated());

        // Validate the DonatorPage in the database
        List<DonatorPage> donatorPageList = donatorPageRepository.findAll();
        assertThat(donatorPageList).hasSize(databaseSizeBeforeCreate + 1);
        DonatorPage testDonatorPage = donatorPageList.get(donatorPageList.size() - 1);
        assertThat(testDonatorPage.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testDonatorPage.getAnonymous()).isEqualTo(DEFAULT_ANONYMOUS);
        assertThat(testDonatorPage.getAmount()).isEqualTo(DEFAULT_AMOUNT);
        assertThat(testDonatorPage.getGroupDonation()).isEqualTo(DEFAULT_GROUP_DONATION);
    }

    @Test
    @Transactional
    void createDonatorPageWithExistingId() throws Exception {
        // Create the DonatorPage with an existing ID
        donatorPage.setId(1L);

        int databaseSizeBeforeCreate = donatorPageRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDonatorPageMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(donatorPage)))
            .andExpect(status().isBadRequest());

        // Validate the DonatorPage in the database
        List<DonatorPage> donatorPageList = donatorPageRepository.findAll();
        assertThat(donatorPageList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllDonatorPages() throws Exception {
        // Initialize the database
        donatorPageRepository.saveAndFlush(donatorPage);

        // Get all the donatorPageList
        restDonatorPageMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(donatorPage.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].anonymous").value(hasItem(DEFAULT_ANONYMOUS.booleanValue())))
            .andExpect(jsonPath("$.[*].amount").value(hasItem(DEFAULT_AMOUNT.doubleValue())))
            .andExpect(jsonPath("$.[*].groupDonation").value(hasItem(DEFAULT_GROUP_DONATION.booleanValue())));
    }

    @Test
    @Transactional
    void getDonatorPage() throws Exception {
        // Initialize the database
        donatorPageRepository.saveAndFlush(donatorPage);

        // Get the donatorPage
        restDonatorPageMockMvc
            .perform(get(ENTITY_API_URL_ID, donatorPage.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(donatorPage.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.anonymous").value(DEFAULT_ANONYMOUS.booleanValue()))
            .andExpect(jsonPath("$.amount").value(DEFAULT_AMOUNT.doubleValue()))
            .andExpect(jsonPath("$.groupDonation").value(DEFAULT_GROUP_DONATION.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingDonatorPage() throws Exception {
        // Get the donatorPage
        restDonatorPageMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingDonatorPage() throws Exception {
        // Initialize the database
        donatorPageRepository.saveAndFlush(donatorPage);

        int databaseSizeBeforeUpdate = donatorPageRepository.findAll().size();

        // Update the donatorPage
        DonatorPage updatedDonatorPage = donatorPageRepository.findById(donatorPage.getId()).get();
        // Disconnect from session so that the updates on updatedDonatorPage are not directly saved in db
        em.detach(updatedDonatorPage);
        updatedDonatorPage.name(UPDATED_NAME).anonymous(UPDATED_ANONYMOUS).amount(UPDATED_AMOUNT).groupDonation(UPDATED_GROUP_DONATION);

        restDonatorPageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedDonatorPage.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedDonatorPage))
            )
            .andExpect(status().isOk());

        // Validate the DonatorPage in the database
        List<DonatorPage> donatorPageList = donatorPageRepository.findAll();
        assertThat(donatorPageList).hasSize(databaseSizeBeforeUpdate);
        DonatorPage testDonatorPage = donatorPageList.get(donatorPageList.size() - 1);
        assertThat(testDonatorPage.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testDonatorPage.getAnonymous()).isEqualTo(UPDATED_ANONYMOUS);
        assertThat(testDonatorPage.getAmount()).isEqualTo(UPDATED_AMOUNT);
        assertThat(testDonatorPage.getGroupDonation()).isEqualTo(UPDATED_GROUP_DONATION);
    }

    @Test
    @Transactional
    void putNonExistingDonatorPage() throws Exception {
        int databaseSizeBeforeUpdate = donatorPageRepository.findAll().size();
        donatorPage.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDonatorPageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, donatorPage.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(donatorPage))
            )
            .andExpect(status().isBadRequest());

        // Validate the DonatorPage in the database
        List<DonatorPage> donatorPageList = donatorPageRepository.findAll();
        assertThat(donatorPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDonatorPage() throws Exception {
        int databaseSizeBeforeUpdate = donatorPageRepository.findAll().size();
        donatorPage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDonatorPageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(donatorPage))
            )
            .andExpect(status().isBadRequest());

        // Validate the DonatorPage in the database
        List<DonatorPage> donatorPageList = donatorPageRepository.findAll();
        assertThat(donatorPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDonatorPage() throws Exception {
        int databaseSizeBeforeUpdate = donatorPageRepository.findAll().size();
        donatorPage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDonatorPageMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(donatorPage)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the DonatorPage in the database
        List<DonatorPage> donatorPageList = donatorPageRepository.findAll();
        assertThat(donatorPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDonatorPageWithPatch() throws Exception {
        // Initialize the database
        donatorPageRepository.saveAndFlush(donatorPage);

        int databaseSizeBeforeUpdate = donatorPageRepository.findAll().size();

        // Update the donatorPage using partial update
        DonatorPage partialUpdatedDonatorPage = new DonatorPage();
        partialUpdatedDonatorPage.setId(donatorPage.getId());

        partialUpdatedDonatorPage.name(UPDATED_NAME);

        restDonatorPageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDonatorPage.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDonatorPage))
            )
            .andExpect(status().isOk());

        // Validate the DonatorPage in the database
        List<DonatorPage> donatorPageList = donatorPageRepository.findAll();
        assertThat(donatorPageList).hasSize(databaseSizeBeforeUpdate);
        DonatorPage testDonatorPage = donatorPageList.get(donatorPageList.size() - 1);
        assertThat(testDonatorPage.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testDonatorPage.getAnonymous()).isEqualTo(DEFAULT_ANONYMOUS);
        assertThat(testDonatorPage.getAmount()).isEqualTo(DEFAULT_AMOUNT);
        assertThat(testDonatorPage.getGroupDonation()).isEqualTo(DEFAULT_GROUP_DONATION);
    }

    @Test
    @Transactional
    void fullUpdateDonatorPageWithPatch() throws Exception {
        // Initialize the database
        donatorPageRepository.saveAndFlush(donatorPage);

        int databaseSizeBeforeUpdate = donatorPageRepository.findAll().size();

        // Update the donatorPage using partial update
        DonatorPage partialUpdatedDonatorPage = new DonatorPage();
        partialUpdatedDonatorPage.setId(donatorPage.getId());

        partialUpdatedDonatorPage
            .name(UPDATED_NAME)
            .anonymous(UPDATED_ANONYMOUS)
            .amount(UPDATED_AMOUNT)
            .groupDonation(UPDATED_GROUP_DONATION);

        restDonatorPageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDonatorPage.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDonatorPage))
            )
            .andExpect(status().isOk());

        // Validate the DonatorPage in the database
        List<DonatorPage> donatorPageList = donatorPageRepository.findAll();
        assertThat(donatorPageList).hasSize(databaseSizeBeforeUpdate);
        DonatorPage testDonatorPage = donatorPageList.get(donatorPageList.size() - 1);
        assertThat(testDonatorPage.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testDonatorPage.getAnonymous()).isEqualTo(UPDATED_ANONYMOUS);
        assertThat(testDonatorPage.getAmount()).isEqualTo(UPDATED_AMOUNT);
        assertThat(testDonatorPage.getGroupDonation()).isEqualTo(UPDATED_GROUP_DONATION);
    }

    @Test
    @Transactional
    void patchNonExistingDonatorPage() throws Exception {
        int databaseSizeBeforeUpdate = donatorPageRepository.findAll().size();
        donatorPage.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDonatorPageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, donatorPage.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(donatorPage))
            )
            .andExpect(status().isBadRequest());

        // Validate the DonatorPage in the database
        List<DonatorPage> donatorPageList = donatorPageRepository.findAll();
        assertThat(donatorPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDonatorPage() throws Exception {
        int databaseSizeBeforeUpdate = donatorPageRepository.findAll().size();
        donatorPage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDonatorPageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(donatorPage))
            )
            .andExpect(status().isBadRequest());

        // Validate the DonatorPage in the database
        List<DonatorPage> donatorPageList = donatorPageRepository.findAll();
        assertThat(donatorPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDonatorPage() throws Exception {
        int databaseSizeBeforeUpdate = donatorPageRepository.findAll().size();
        donatorPage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDonatorPageMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(donatorPage))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the DonatorPage in the database
        List<DonatorPage> donatorPageList = donatorPageRepository.findAll();
        assertThat(donatorPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDonatorPage() throws Exception {
        // Initialize the database
        donatorPageRepository.saveAndFlush(donatorPage);

        int databaseSizeBeforeDelete = donatorPageRepository.findAll().size();

        // Delete the donatorPage
        restDonatorPageMockMvc
            .perform(delete(ENTITY_API_URL_ID, donatorPage.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<DonatorPage> donatorPageList = donatorPageRepository.findAll();
        assertThat(donatorPageList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

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
import team.bham.domain.GroupDonatorCollector;
import team.bham.repository.GroupDonatorCollectorRepository;

/**
 * Integration tests for the {@link GroupDonatorCollectorResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class GroupDonatorCollectorResourceIT {

    private static final String DEFAULT_DONATOR_NAME = "AAAAAAAAAA";
    private static final String UPDATED_DONATOR_NAME = "BBBBBBBBBB";

    private static final Double DEFAULT_DONATION_AMOUNT = 1D;
    private static final Double UPDATED_DONATION_AMOUNT = 2D;

    private static final String ENTITY_API_URL = "/api/group-donator-collectors";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private GroupDonatorCollectorRepository groupDonatorCollectorRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restGroupDonatorCollectorMockMvc;

    private GroupDonatorCollector groupDonatorCollector;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static GroupDonatorCollector createEntity(EntityManager em) {
        GroupDonatorCollector groupDonatorCollector = new GroupDonatorCollector()
            .donatorName(DEFAULT_DONATOR_NAME)
            .donationAmount(DEFAULT_DONATION_AMOUNT);
        return groupDonatorCollector;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static GroupDonatorCollector createUpdatedEntity(EntityManager em) {
        GroupDonatorCollector groupDonatorCollector = new GroupDonatorCollector()
            .donatorName(UPDATED_DONATOR_NAME)
            .donationAmount(UPDATED_DONATION_AMOUNT);
        return groupDonatorCollector;
    }

    @BeforeEach
    public void initTest() {
        groupDonatorCollector = createEntity(em);
    }

    @Test
    @Transactional
    void createGroupDonatorCollector() throws Exception {
        int databaseSizeBeforeCreate = groupDonatorCollectorRepository.findAll().size();
        // Create the GroupDonatorCollector
        restGroupDonatorCollectorMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(groupDonatorCollector))
            )
            .andExpect(status().isCreated());

        // Validate the GroupDonatorCollector in the database
        List<GroupDonatorCollector> groupDonatorCollectorList = groupDonatorCollectorRepository.findAll();
        assertThat(groupDonatorCollectorList).hasSize(databaseSizeBeforeCreate + 1);
        GroupDonatorCollector testGroupDonatorCollector = groupDonatorCollectorList.get(groupDonatorCollectorList.size() - 1);
        assertThat(testGroupDonatorCollector.getDonatorName()).isEqualTo(DEFAULT_DONATOR_NAME);
        assertThat(testGroupDonatorCollector.getDonationAmount()).isEqualTo(DEFAULT_DONATION_AMOUNT);
    }

    @Test
    @Transactional
    void createGroupDonatorCollectorWithExistingId() throws Exception {
        // Create the GroupDonatorCollector with an existing ID
        groupDonatorCollector.setId(1L);

        int databaseSizeBeforeCreate = groupDonatorCollectorRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restGroupDonatorCollectorMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(groupDonatorCollector))
            )
            .andExpect(status().isBadRequest());

        // Validate the GroupDonatorCollector in the database
        List<GroupDonatorCollector> groupDonatorCollectorList = groupDonatorCollectorRepository.findAll();
        assertThat(groupDonatorCollectorList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllGroupDonatorCollectors() throws Exception {
        // Initialize the database
        groupDonatorCollectorRepository.saveAndFlush(groupDonatorCollector);

        // Get all the groupDonatorCollectorList
        restGroupDonatorCollectorMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(groupDonatorCollector.getId().intValue())))
            .andExpect(jsonPath("$.[*].donatorName").value(hasItem(DEFAULT_DONATOR_NAME)))
            .andExpect(jsonPath("$.[*].donationAmount").value(hasItem(DEFAULT_DONATION_AMOUNT.doubleValue())));
    }

    @Test
    @Transactional
    void getGroupDonatorCollector() throws Exception {
        // Initialize the database
        groupDonatorCollectorRepository.saveAndFlush(groupDonatorCollector);

        // Get the groupDonatorCollector
        restGroupDonatorCollectorMockMvc
            .perform(get(ENTITY_API_URL_ID, groupDonatorCollector.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(groupDonatorCollector.getId().intValue()))
            .andExpect(jsonPath("$.donatorName").value(DEFAULT_DONATOR_NAME))
            .andExpect(jsonPath("$.donationAmount").value(DEFAULT_DONATION_AMOUNT.doubleValue()));
    }

    @Test
    @Transactional
    void getNonExistingGroupDonatorCollector() throws Exception {
        // Get the groupDonatorCollector
        restGroupDonatorCollectorMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingGroupDonatorCollector() throws Exception {
        // Initialize the database
        groupDonatorCollectorRepository.saveAndFlush(groupDonatorCollector);

        int databaseSizeBeforeUpdate = groupDonatorCollectorRepository.findAll().size();

        // Update the groupDonatorCollector
        GroupDonatorCollector updatedGroupDonatorCollector = groupDonatorCollectorRepository.findById(groupDonatorCollector.getId()).get();
        // Disconnect from session so that the updates on updatedGroupDonatorCollector are not directly saved in db
        em.detach(updatedGroupDonatorCollector);
        updatedGroupDonatorCollector.donatorName(UPDATED_DONATOR_NAME).donationAmount(UPDATED_DONATION_AMOUNT);

        restGroupDonatorCollectorMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedGroupDonatorCollector.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedGroupDonatorCollector))
            )
            .andExpect(status().isOk());

        // Validate the GroupDonatorCollector in the database
        List<GroupDonatorCollector> groupDonatorCollectorList = groupDonatorCollectorRepository.findAll();
        assertThat(groupDonatorCollectorList).hasSize(databaseSizeBeforeUpdate);
        GroupDonatorCollector testGroupDonatorCollector = groupDonatorCollectorList.get(groupDonatorCollectorList.size() - 1);
        assertThat(testGroupDonatorCollector.getDonatorName()).isEqualTo(UPDATED_DONATOR_NAME);
        assertThat(testGroupDonatorCollector.getDonationAmount()).isEqualTo(UPDATED_DONATION_AMOUNT);
    }

    @Test
    @Transactional
    void putNonExistingGroupDonatorCollector() throws Exception {
        int databaseSizeBeforeUpdate = groupDonatorCollectorRepository.findAll().size();
        groupDonatorCollector.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGroupDonatorCollectorMockMvc
            .perform(
                put(ENTITY_API_URL_ID, groupDonatorCollector.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(groupDonatorCollector))
            )
            .andExpect(status().isBadRequest());

        // Validate the GroupDonatorCollector in the database
        List<GroupDonatorCollector> groupDonatorCollectorList = groupDonatorCollectorRepository.findAll();
        assertThat(groupDonatorCollectorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchGroupDonatorCollector() throws Exception {
        int databaseSizeBeforeUpdate = groupDonatorCollectorRepository.findAll().size();
        groupDonatorCollector.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGroupDonatorCollectorMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(groupDonatorCollector))
            )
            .andExpect(status().isBadRequest());

        // Validate the GroupDonatorCollector in the database
        List<GroupDonatorCollector> groupDonatorCollectorList = groupDonatorCollectorRepository.findAll();
        assertThat(groupDonatorCollectorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamGroupDonatorCollector() throws Exception {
        int databaseSizeBeforeUpdate = groupDonatorCollectorRepository.findAll().size();
        groupDonatorCollector.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGroupDonatorCollectorMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(groupDonatorCollector))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the GroupDonatorCollector in the database
        List<GroupDonatorCollector> groupDonatorCollectorList = groupDonatorCollectorRepository.findAll();
        assertThat(groupDonatorCollectorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateGroupDonatorCollectorWithPatch() throws Exception {
        // Initialize the database
        groupDonatorCollectorRepository.saveAndFlush(groupDonatorCollector);

        int databaseSizeBeforeUpdate = groupDonatorCollectorRepository.findAll().size();

        // Update the groupDonatorCollector using partial update
        GroupDonatorCollector partialUpdatedGroupDonatorCollector = new GroupDonatorCollector();
        partialUpdatedGroupDonatorCollector.setId(groupDonatorCollector.getId());

        partialUpdatedGroupDonatorCollector.donationAmount(UPDATED_DONATION_AMOUNT);

        restGroupDonatorCollectorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGroupDonatorCollector.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedGroupDonatorCollector))
            )
            .andExpect(status().isOk());

        // Validate the GroupDonatorCollector in the database
        List<GroupDonatorCollector> groupDonatorCollectorList = groupDonatorCollectorRepository.findAll();
        assertThat(groupDonatorCollectorList).hasSize(databaseSizeBeforeUpdate);
        GroupDonatorCollector testGroupDonatorCollector = groupDonatorCollectorList.get(groupDonatorCollectorList.size() - 1);
        assertThat(testGroupDonatorCollector.getDonatorName()).isEqualTo(DEFAULT_DONATOR_NAME);
        assertThat(testGroupDonatorCollector.getDonationAmount()).isEqualTo(UPDATED_DONATION_AMOUNT);
    }

    @Test
    @Transactional
    void fullUpdateGroupDonatorCollectorWithPatch() throws Exception {
        // Initialize the database
        groupDonatorCollectorRepository.saveAndFlush(groupDonatorCollector);

        int databaseSizeBeforeUpdate = groupDonatorCollectorRepository.findAll().size();

        // Update the groupDonatorCollector using partial update
        GroupDonatorCollector partialUpdatedGroupDonatorCollector = new GroupDonatorCollector();
        partialUpdatedGroupDonatorCollector.setId(groupDonatorCollector.getId());

        partialUpdatedGroupDonatorCollector.donatorName(UPDATED_DONATOR_NAME).donationAmount(UPDATED_DONATION_AMOUNT);

        restGroupDonatorCollectorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGroupDonatorCollector.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedGroupDonatorCollector))
            )
            .andExpect(status().isOk());

        // Validate the GroupDonatorCollector in the database
        List<GroupDonatorCollector> groupDonatorCollectorList = groupDonatorCollectorRepository.findAll();
        assertThat(groupDonatorCollectorList).hasSize(databaseSizeBeforeUpdate);
        GroupDonatorCollector testGroupDonatorCollector = groupDonatorCollectorList.get(groupDonatorCollectorList.size() - 1);
        assertThat(testGroupDonatorCollector.getDonatorName()).isEqualTo(UPDATED_DONATOR_NAME);
        assertThat(testGroupDonatorCollector.getDonationAmount()).isEqualTo(UPDATED_DONATION_AMOUNT);
    }

    @Test
    @Transactional
    void patchNonExistingGroupDonatorCollector() throws Exception {
        int databaseSizeBeforeUpdate = groupDonatorCollectorRepository.findAll().size();
        groupDonatorCollector.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGroupDonatorCollectorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, groupDonatorCollector.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(groupDonatorCollector))
            )
            .andExpect(status().isBadRequest());

        // Validate the GroupDonatorCollector in the database
        List<GroupDonatorCollector> groupDonatorCollectorList = groupDonatorCollectorRepository.findAll();
        assertThat(groupDonatorCollectorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchGroupDonatorCollector() throws Exception {
        int databaseSizeBeforeUpdate = groupDonatorCollectorRepository.findAll().size();
        groupDonatorCollector.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGroupDonatorCollectorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(groupDonatorCollector))
            )
            .andExpect(status().isBadRequest());

        // Validate the GroupDonatorCollector in the database
        List<GroupDonatorCollector> groupDonatorCollectorList = groupDonatorCollectorRepository.findAll();
        assertThat(groupDonatorCollectorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamGroupDonatorCollector() throws Exception {
        int databaseSizeBeforeUpdate = groupDonatorCollectorRepository.findAll().size();
        groupDonatorCollector.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGroupDonatorCollectorMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(groupDonatorCollector))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the GroupDonatorCollector in the database
        List<GroupDonatorCollector> groupDonatorCollectorList = groupDonatorCollectorRepository.findAll();
        assertThat(groupDonatorCollectorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteGroupDonatorCollector() throws Exception {
        // Initialize the database
        groupDonatorCollectorRepository.saveAndFlush(groupDonatorCollector);

        int databaseSizeBeforeDelete = groupDonatorCollectorRepository.findAll().size();

        // Delete the groupDonatorCollector
        restGroupDonatorCollectorMockMvc
            .perform(delete(ENTITY_API_URL_ID, groupDonatorCollector.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<GroupDonatorCollector> groupDonatorCollectorList = groupDonatorCollectorRepository.findAll();
        assertThat(groupDonatorCollectorList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

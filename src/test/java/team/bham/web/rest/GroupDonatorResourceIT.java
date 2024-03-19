package team.bham.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

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
import team.bham.IntegrationTest;
import team.bham.domain.GroupDonator;
import team.bham.repository.GroupDonatorRepository;

/**
 * Integration tests for the {@link GroupDonatorResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class GroupDonatorResourceIT {

    private static final String DEFAULT_GROUP_NAME = "AAAAAAAAAA";
    private static final String UPDATED_GROUP_NAME = "BBBBBBBBBB";

    private static final Double DEFAULT_TOTAL_COLLECTED_AMOUNT = 1D;
    private static final Double UPDATED_TOTAL_COLLECTED_AMOUNT = 2D;

    private static final String ENTITY_API_URL = "/api/group-donators";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private GroupDonatorRepository groupDonatorRepository;

    @Mock
    private GroupDonatorRepository groupDonatorRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restGroupDonatorMockMvc;

    private GroupDonator groupDonator;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static GroupDonator createEntity(EntityManager em) {
        GroupDonator groupDonator = new GroupDonator().groupName(DEFAULT_GROUP_NAME).totalCollectedAmount(DEFAULT_TOTAL_COLLECTED_AMOUNT);
        return groupDonator;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static GroupDonator createUpdatedEntity(EntityManager em) {
        GroupDonator groupDonator = new GroupDonator().groupName(UPDATED_GROUP_NAME).totalCollectedAmount(UPDATED_TOTAL_COLLECTED_AMOUNT);
        return groupDonator;
    }

    @BeforeEach
    public void initTest() {
        groupDonator = createEntity(em);
    }

    @Test
    @Transactional
    void createGroupDonator() throws Exception {
        int databaseSizeBeforeCreate = groupDonatorRepository.findAll().size();
        // Create the GroupDonator
        restGroupDonatorMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(groupDonator)))
            .andExpect(status().isCreated());

        // Validate the GroupDonator in the database
        List<GroupDonator> groupDonatorList = groupDonatorRepository.findAll();
        assertThat(groupDonatorList).hasSize(databaseSizeBeforeCreate + 1);
        GroupDonator testGroupDonator = groupDonatorList.get(groupDonatorList.size() - 1);
        assertThat(testGroupDonator.getGroupName()).isEqualTo(DEFAULT_GROUP_NAME);
        assertThat(testGroupDonator.getTotalCollectedAmount()).isEqualTo(DEFAULT_TOTAL_COLLECTED_AMOUNT);
    }

    @Test
    @Transactional
    void createGroupDonatorWithExistingId() throws Exception {
        // Create the GroupDonator with an existing ID
        groupDonator.setId(1L);

        int databaseSizeBeforeCreate = groupDonatorRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restGroupDonatorMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(groupDonator)))
            .andExpect(status().isBadRequest());

        // Validate the GroupDonator in the database
        List<GroupDonator> groupDonatorList = groupDonatorRepository.findAll();
        assertThat(groupDonatorList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllGroupDonators() throws Exception {
        // Initialize the database
        groupDonatorRepository.saveAndFlush(groupDonator);

        // Get all the groupDonatorList
        restGroupDonatorMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(groupDonator.getId().intValue())))
            .andExpect(jsonPath("$.[*].groupName").value(hasItem(DEFAULT_GROUP_NAME)))
            .andExpect(jsonPath("$.[*].totalCollectedAmount").value(hasItem(DEFAULT_TOTAL_COLLECTED_AMOUNT.doubleValue())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllGroupDonatorsWithEagerRelationshipsIsEnabled() throws Exception {
        when(groupDonatorRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restGroupDonatorMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(groupDonatorRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllGroupDonatorsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(groupDonatorRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restGroupDonatorMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(groupDonatorRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getGroupDonator() throws Exception {
        // Initialize the database
        groupDonatorRepository.saveAndFlush(groupDonator);

        // Get the groupDonator
        restGroupDonatorMockMvc
            .perform(get(ENTITY_API_URL_ID, groupDonator.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(groupDonator.getId().intValue()))
            .andExpect(jsonPath("$.groupName").value(DEFAULT_GROUP_NAME))
            .andExpect(jsonPath("$.totalCollectedAmount").value(DEFAULT_TOTAL_COLLECTED_AMOUNT.doubleValue()));
    }

    @Test
    @Transactional
    void getNonExistingGroupDonator() throws Exception {
        // Get the groupDonator
        restGroupDonatorMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingGroupDonator() throws Exception {
        // Initialize the database
        groupDonatorRepository.saveAndFlush(groupDonator);

        int databaseSizeBeforeUpdate = groupDonatorRepository.findAll().size();

        // Update the groupDonator
        GroupDonator updatedGroupDonator = groupDonatorRepository.findById(groupDonator.getId()).get();
        // Disconnect from session so that the updates on updatedGroupDonator are not directly saved in db
        em.detach(updatedGroupDonator);
        updatedGroupDonator.groupName(UPDATED_GROUP_NAME).totalCollectedAmount(UPDATED_TOTAL_COLLECTED_AMOUNT);

        restGroupDonatorMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedGroupDonator.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedGroupDonator))
            )
            .andExpect(status().isOk());

        // Validate the GroupDonator in the database
        List<GroupDonator> groupDonatorList = groupDonatorRepository.findAll();
        assertThat(groupDonatorList).hasSize(databaseSizeBeforeUpdate);
        GroupDonator testGroupDonator = groupDonatorList.get(groupDonatorList.size() - 1);
        assertThat(testGroupDonator.getGroupName()).isEqualTo(UPDATED_GROUP_NAME);
        assertThat(testGroupDonator.getTotalCollectedAmount()).isEqualTo(UPDATED_TOTAL_COLLECTED_AMOUNT);
    }

    @Test
    @Transactional
    void putNonExistingGroupDonator() throws Exception {
        int databaseSizeBeforeUpdate = groupDonatorRepository.findAll().size();
        groupDonator.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGroupDonatorMockMvc
            .perform(
                put(ENTITY_API_URL_ID, groupDonator.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(groupDonator))
            )
            .andExpect(status().isBadRequest());

        // Validate the GroupDonator in the database
        List<GroupDonator> groupDonatorList = groupDonatorRepository.findAll();
        assertThat(groupDonatorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchGroupDonator() throws Exception {
        int databaseSizeBeforeUpdate = groupDonatorRepository.findAll().size();
        groupDonator.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGroupDonatorMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(groupDonator))
            )
            .andExpect(status().isBadRequest());

        // Validate the GroupDonator in the database
        List<GroupDonator> groupDonatorList = groupDonatorRepository.findAll();
        assertThat(groupDonatorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamGroupDonator() throws Exception {
        int databaseSizeBeforeUpdate = groupDonatorRepository.findAll().size();
        groupDonator.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGroupDonatorMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(groupDonator)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the GroupDonator in the database
        List<GroupDonator> groupDonatorList = groupDonatorRepository.findAll();
        assertThat(groupDonatorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateGroupDonatorWithPatch() throws Exception {
        // Initialize the database
        groupDonatorRepository.saveAndFlush(groupDonator);

        int databaseSizeBeforeUpdate = groupDonatorRepository.findAll().size();

        // Update the groupDonator using partial update
        GroupDonator partialUpdatedGroupDonator = new GroupDonator();
        partialUpdatedGroupDonator.setId(groupDonator.getId());

        partialUpdatedGroupDonator.groupName(UPDATED_GROUP_NAME);

        restGroupDonatorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGroupDonator.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedGroupDonator))
            )
            .andExpect(status().isOk());

        // Validate the GroupDonator in the database
        List<GroupDonator> groupDonatorList = groupDonatorRepository.findAll();
        assertThat(groupDonatorList).hasSize(databaseSizeBeforeUpdate);
        GroupDonator testGroupDonator = groupDonatorList.get(groupDonatorList.size() - 1);
        assertThat(testGroupDonator.getGroupName()).isEqualTo(UPDATED_GROUP_NAME);
        assertThat(testGroupDonator.getTotalCollectedAmount()).isEqualTo(DEFAULT_TOTAL_COLLECTED_AMOUNT);
    }

    @Test
    @Transactional
    void fullUpdateGroupDonatorWithPatch() throws Exception {
        // Initialize the database
        groupDonatorRepository.saveAndFlush(groupDonator);

        int databaseSizeBeforeUpdate = groupDonatorRepository.findAll().size();

        // Update the groupDonator using partial update
        GroupDonator partialUpdatedGroupDonator = new GroupDonator();
        partialUpdatedGroupDonator.setId(groupDonator.getId());

        partialUpdatedGroupDonator.groupName(UPDATED_GROUP_NAME).totalCollectedAmount(UPDATED_TOTAL_COLLECTED_AMOUNT);

        restGroupDonatorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGroupDonator.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedGroupDonator))
            )
            .andExpect(status().isOk());

        // Validate the GroupDonator in the database
        List<GroupDonator> groupDonatorList = groupDonatorRepository.findAll();
        assertThat(groupDonatorList).hasSize(databaseSizeBeforeUpdate);
        GroupDonator testGroupDonator = groupDonatorList.get(groupDonatorList.size() - 1);
        assertThat(testGroupDonator.getGroupName()).isEqualTo(UPDATED_GROUP_NAME);
        assertThat(testGroupDonator.getTotalCollectedAmount()).isEqualTo(UPDATED_TOTAL_COLLECTED_AMOUNT);
    }

    @Test
    @Transactional
    void patchNonExistingGroupDonator() throws Exception {
        int databaseSizeBeforeUpdate = groupDonatorRepository.findAll().size();
        groupDonator.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGroupDonatorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, groupDonator.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(groupDonator))
            )
            .andExpect(status().isBadRequest());

        // Validate the GroupDonator in the database
        List<GroupDonator> groupDonatorList = groupDonatorRepository.findAll();
        assertThat(groupDonatorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchGroupDonator() throws Exception {
        int databaseSizeBeforeUpdate = groupDonatorRepository.findAll().size();
        groupDonator.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGroupDonatorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(groupDonator))
            )
            .andExpect(status().isBadRequest());

        // Validate the GroupDonator in the database
        List<GroupDonator> groupDonatorList = groupDonatorRepository.findAll();
        assertThat(groupDonatorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamGroupDonator() throws Exception {
        int databaseSizeBeforeUpdate = groupDonatorRepository.findAll().size();
        groupDonator.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGroupDonatorMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(groupDonator))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the GroupDonator in the database
        List<GroupDonator> groupDonatorList = groupDonatorRepository.findAll();
        assertThat(groupDonatorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteGroupDonator() throws Exception {
        // Initialize the database
        groupDonatorRepository.saveAndFlush(groupDonator);

        int databaseSizeBeforeDelete = groupDonatorRepository.findAll().size();

        // Delete the groupDonator
        restGroupDonatorMockMvc
            .perform(delete(ENTITY_API_URL_ID, groupDonator.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<GroupDonator> groupDonatorList = groupDonatorRepository.findAll();
        assertThat(groupDonatorList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

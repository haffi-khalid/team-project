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
import team.bham.domain.ApprovedVolunteers;
import team.bham.repository.ApprovedVolunteersRepository;

/**
 * Integration tests for the {@link ApprovedVolunteersResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class ApprovedVolunteersResourceIT {

    private static final Boolean DEFAULT_VOLUNTEER_STATUS = false;
    private static final Boolean UPDATED_VOLUNTEER_STATUS = true;

    private static final Integer DEFAULT_VOLUNTEER_HOURS_COMPLETED_IN_CHARITY = 1;
    private static final Integer UPDATED_VOLUNTEER_HOURS_COMPLETED_IN_CHARITY = 2;

    private static final String DEFAULT_CURRENT_EVENT_VOLUNTEERING_IN = "AAAAAAAAAA";
    private static final String UPDATED_CURRENT_EVENT_VOLUNTEERING_IN = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/approved-volunteers";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ApprovedVolunteersRepository approvedVolunteersRepository;

    @Mock
    private ApprovedVolunteersRepository approvedVolunteersRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restApprovedVolunteersMockMvc;

    private ApprovedVolunteers approvedVolunteers;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ApprovedVolunteers createEntity(EntityManager em) {
        ApprovedVolunteers approvedVolunteers = new ApprovedVolunteers()
            .volunteerStatus(DEFAULT_VOLUNTEER_STATUS)
            .volunteerHoursCompletedInCharity(DEFAULT_VOLUNTEER_HOURS_COMPLETED_IN_CHARITY)
            .currentEventVolunteeringIn(DEFAULT_CURRENT_EVENT_VOLUNTEERING_IN);
        return approvedVolunteers;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ApprovedVolunteers createUpdatedEntity(EntityManager em) {
        ApprovedVolunteers approvedVolunteers = new ApprovedVolunteers()
            .volunteerStatus(UPDATED_VOLUNTEER_STATUS)
            .volunteerHoursCompletedInCharity(UPDATED_VOLUNTEER_HOURS_COMPLETED_IN_CHARITY)
            .currentEventVolunteeringIn(UPDATED_CURRENT_EVENT_VOLUNTEERING_IN);
        return approvedVolunteers;
    }

    @BeforeEach
    public void initTest() {
        approvedVolunteers = createEntity(em);
    }

    @Test
    @Transactional
    void createApprovedVolunteers() throws Exception {
        int databaseSizeBeforeCreate = approvedVolunteersRepository.findAll().size();
        // Create the ApprovedVolunteers
        restApprovedVolunteersMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(approvedVolunteers))
            )
            .andExpect(status().isCreated());

        // Validate the ApprovedVolunteers in the database
        List<ApprovedVolunteers> approvedVolunteersList = approvedVolunteersRepository.findAll();
        assertThat(approvedVolunteersList).hasSize(databaseSizeBeforeCreate + 1);
        ApprovedVolunteers testApprovedVolunteers = approvedVolunteersList.get(approvedVolunteersList.size() - 1);
        assertThat(testApprovedVolunteers.getVolunteerStatus()).isEqualTo(DEFAULT_VOLUNTEER_STATUS);
        assertThat(testApprovedVolunteers.getVolunteerHoursCompletedInCharity()).isEqualTo(DEFAULT_VOLUNTEER_HOURS_COMPLETED_IN_CHARITY);
        assertThat(testApprovedVolunteers.getCurrentEventVolunteeringIn()).isEqualTo(DEFAULT_CURRENT_EVENT_VOLUNTEERING_IN);
    }

    @Test
    @Transactional
    void createApprovedVolunteersWithExistingId() throws Exception {
        // Create the ApprovedVolunteers with an existing ID
        approvedVolunteers.setId(1L);

        int databaseSizeBeforeCreate = approvedVolunteersRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restApprovedVolunteersMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(approvedVolunteers))
            )
            .andExpect(status().isBadRequest());

        // Validate the ApprovedVolunteers in the database
        List<ApprovedVolunteers> approvedVolunteersList = approvedVolunteersRepository.findAll();
        assertThat(approvedVolunteersList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllApprovedVolunteers() throws Exception {
        // Initialize the database
        approvedVolunteersRepository.saveAndFlush(approvedVolunteers);

        // Get all the approvedVolunteersList
        restApprovedVolunteersMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(approvedVolunteers.getId().intValue())))
            .andExpect(jsonPath("$.[*].volunteerStatus").value(hasItem(DEFAULT_VOLUNTEER_STATUS.booleanValue())))
            .andExpect(jsonPath("$.[*].volunteerHoursCompletedInCharity").value(hasItem(DEFAULT_VOLUNTEER_HOURS_COMPLETED_IN_CHARITY)))
            .andExpect(jsonPath("$.[*].currentEventVolunteeringIn").value(hasItem(DEFAULT_CURRENT_EVENT_VOLUNTEERING_IN)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllApprovedVolunteersWithEagerRelationshipsIsEnabled() throws Exception {
        when(approvedVolunteersRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restApprovedVolunteersMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(approvedVolunteersRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllApprovedVolunteersWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(approvedVolunteersRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restApprovedVolunteersMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(approvedVolunteersRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getApprovedVolunteers() throws Exception {
        // Initialize the database
        approvedVolunteersRepository.saveAndFlush(approvedVolunteers);

        // Get the approvedVolunteers
        restApprovedVolunteersMockMvc
            .perform(get(ENTITY_API_URL_ID, approvedVolunteers.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(approvedVolunteers.getId().intValue()))
            .andExpect(jsonPath("$.volunteerStatus").value(DEFAULT_VOLUNTEER_STATUS.booleanValue()))
            .andExpect(jsonPath("$.volunteerHoursCompletedInCharity").value(DEFAULT_VOLUNTEER_HOURS_COMPLETED_IN_CHARITY))
            .andExpect(jsonPath("$.currentEventVolunteeringIn").value(DEFAULT_CURRENT_EVENT_VOLUNTEERING_IN));
    }

    @Test
    @Transactional
    void getNonExistingApprovedVolunteers() throws Exception {
        // Get the approvedVolunteers
        restApprovedVolunteersMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingApprovedVolunteers() throws Exception {
        // Initialize the database
        approvedVolunteersRepository.saveAndFlush(approvedVolunteers);

        int databaseSizeBeforeUpdate = approvedVolunteersRepository.findAll().size();

        // Update the approvedVolunteers
        ApprovedVolunteers updatedApprovedVolunteers = approvedVolunteersRepository.findById(approvedVolunteers.getId()).get();
        // Disconnect from session so that the updates on updatedApprovedVolunteers are not directly saved in db
        em.detach(updatedApprovedVolunteers);
        updatedApprovedVolunteers
            .volunteerStatus(UPDATED_VOLUNTEER_STATUS)
            .volunteerHoursCompletedInCharity(UPDATED_VOLUNTEER_HOURS_COMPLETED_IN_CHARITY)
            .currentEventVolunteeringIn(UPDATED_CURRENT_EVENT_VOLUNTEERING_IN);

        restApprovedVolunteersMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedApprovedVolunteers.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedApprovedVolunteers))
            )
            .andExpect(status().isOk());

        // Validate the ApprovedVolunteers in the database
        List<ApprovedVolunteers> approvedVolunteersList = approvedVolunteersRepository.findAll();
        assertThat(approvedVolunteersList).hasSize(databaseSizeBeforeUpdate);
        ApprovedVolunteers testApprovedVolunteers = approvedVolunteersList.get(approvedVolunteersList.size() - 1);
        assertThat(testApprovedVolunteers.getVolunteerStatus()).isEqualTo(UPDATED_VOLUNTEER_STATUS);
        assertThat(testApprovedVolunteers.getVolunteerHoursCompletedInCharity()).isEqualTo(UPDATED_VOLUNTEER_HOURS_COMPLETED_IN_CHARITY);
        assertThat(testApprovedVolunteers.getCurrentEventVolunteeringIn()).isEqualTo(UPDATED_CURRENT_EVENT_VOLUNTEERING_IN);
    }

    @Test
    @Transactional
    void putNonExistingApprovedVolunteers() throws Exception {
        int databaseSizeBeforeUpdate = approvedVolunteersRepository.findAll().size();
        approvedVolunteers.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restApprovedVolunteersMockMvc
            .perform(
                put(ENTITY_API_URL_ID, approvedVolunteers.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(approvedVolunteers))
            )
            .andExpect(status().isBadRequest());

        // Validate the ApprovedVolunteers in the database
        List<ApprovedVolunteers> approvedVolunteersList = approvedVolunteersRepository.findAll();
        assertThat(approvedVolunteersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchApprovedVolunteers() throws Exception {
        int databaseSizeBeforeUpdate = approvedVolunteersRepository.findAll().size();
        approvedVolunteers.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restApprovedVolunteersMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(approvedVolunteers))
            )
            .andExpect(status().isBadRequest());

        // Validate the ApprovedVolunteers in the database
        List<ApprovedVolunteers> approvedVolunteersList = approvedVolunteersRepository.findAll();
        assertThat(approvedVolunteersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamApprovedVolunteers() throws Exception {
        int databaseSizeBeforeUpdate = approvedVolunteersRepository.findAll().size();
        approvedVolunteers.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restApprovedVolunteersMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(approvedVolunteers))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ApprovedVolunteers in the database
        List<ApprovedVolunteers> approvedVolunteersList = approvedVolunteersRepository.findAll();
        assertThat(approvedVolunteersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateApprovedVolunteersWithPatch() throws Exception {
        // Initialize the database
        approvedVolunteersRepository.saveAndFlush(approvedVolunteers);

        int databaseSizeBeforeUpdate = approvedVolunteersRepository.findAll().size();

        // Update the approvedVolunteers using partial update
        ApprovedVolunteers partialUpdatedApprovedVolunteers = new ApprovedVolunteers();
        partialUpdatedApprovedVolunteers.setId(approvedVolunteers.getId());

        partialUpdatedApprovedVolunteers.currentEventVolunteeringIn(UPDATED_CURRENT_EVENT_VOLUNTEERING_IN);

        restApprovedVolunteersMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedApprovedVolunteers.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedApprovedVolunteers))
            )
            .andExpect(status().isOk());

        // Validate the ApprovedVolunteers in the database
        List<ApprovedVolunteers> approvedVolunteersList = approvedVolunteersRepository.findAll();
        assertThat(approvedVolunteersList).hasSize(databaseSizeBeforeUpdate);
        ApprovedVolunteers testApprovedVolunteers = approvedVolunteersList.get(approvedVolunteersList.size() - 1);
        assertThat(testApprovedVolunteers.getVolunteerStatus()).isEqualTo(DEFAULT_VOLUNTEER_STATUS);
        assertThat(testApprovedVolunteers.getVolunteerHoursCompletedInCharity()).isEqualTo(DEFAULT_VOLUNTEER_HOURS_COMPLETED_IN_CHARITY);
        assertThat(testApprovedVolunteers.getCurrentEventVolunteeringIn()).isEqualTo(UPDATED_CURRENT_EVENT_VOLUNTEERING_IN);
    }

    @Test
    @Transactional
    void fullUpdateApprovedVolunteersWithPatch() throws Exception {
        // Initialize the database
        approvedVolunteersRepository.saveAndFlush(approvedVolunteers);

        int databaseSizeBeforeUpdate = approvedVolunteersRepository.findAll().size();

        // Update the approvedVolunteers using partial update
        ApprovedVolunteers partialUpdatedApprovedVolunteers = new ApprovedVolunteers();
        partialUpdatedApprovedVolunteers.setId(approvedVolunteers.getId());

        partialUpdatedApprovedVolunteers
            .volunteerStatus(UPDATED_VOLUNTEER_STATUS)
            .volunteerHoursCompletedInCharity(UPDATED_VOLUNTEER_HOURS_COMPLETED_IN_CHARITY)
            .currentEventVolunteeringIn(UPDATED_CURRENT_EVENT_VOLUNTEERING_IN);

        restApprovedVolunteersMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedApprovedVolunteers.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedApprovedVolunteers))
            )
            .andExpect(status().isOk());

        // Validate the ApprovedVolunteers in the database
        List<ApprovedVolunteers> approvedVolunteersList = approvedVolunteersRepository.findAll();
        assertThat(approvedVolunteersList).hasSize(databaseSizeBeforeUpdate);
        ApprovedVolunteers testApprovedVolunteers = approvedVolunteersList.get(approvedVolunteersList.size() - 1);
        assertThat(testApprovedVolunteers.getVolunteerStatus()).isEqualTo(UPDATED_VOLUNTEER_STATUS);
        assertThat(testApprovedVolunteers.getVolunteerHoursCompletedInCharity()).isEqualTo(UPDATED_VOLUNTEER_HOURS_COMPLETED_IN_CHARITY);
        assertThat(testApprovedVolunteers.getCurrentEventVolunteeringIn()).isEqualTo(UPDATED_CURRENT_EVENT_VOLUNTEERING_IN);
    }

    @Test
    @Transactional
    void patchNonExistingApprovedVolunteers() throws Exception {
        int databaseSizeBeforeUpdate = approvedVolunteersRepository.findAll().size();
        approvedVolunteers.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restApprovedVolunteersMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, approvedVolunteers.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(approvedVolunteers))
            )
            .andExpect(status().isBadRequest());

        // Validate the ApprovedVolunteers in the database
        List<ApprovedVolunteers> approvedVolunteersList = approvedVolunteersRepository.findAll();
        assertThat(approvedVolunteersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchApprovedVolunteers() throws Exception {
        int databaseSizeBeforeUpdate = approvedVolunteersRepository.findAll().size();
        approvedVolunteers.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restApprovedVolunteersMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(approvedVolunteers))
            )
            .andExpect(status().isBadRequest());

        // Validate the ApprovedVolunteers in the database
        List<ApprovedVolunteers> approvedVolunteersList = approvedVolunteersRepository.findAll();
        assertThat(approvedVolunteersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamApprovedVolunteers() throws Exception {
        int databaseSizeBeforeUpdate = approvedVolunteersRepository.findAll().size();
        approvedVolunteers.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restApprovedVolunteersMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(approvedVolunteers))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ApprovedVolunteers in the database
        List<ApprovedVolunteers> approvedVolunteersList = approvedVolunteersRepository.findAll();
        assertThat(approvedVolunteersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteApprovedVolunteers() throws Exception {
        // Initialize the database
        approvedVolunteersRepository.saveAndFlush(approvedVolunteers);

        int databaseSizeBeforeDelete = approvedVolunteersRepository.findAll().size();

        // Delete the approvedVolunteers
        restApprovedVolunteersMockMvc
            .perform(delete(ENTITY_API_URL_ID, approvedVolunteers.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ApprovedVolunteers> approvedVolunteersList = approvedVolunteersRepository.findAll();
        assertThat(approvedVolunteersList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

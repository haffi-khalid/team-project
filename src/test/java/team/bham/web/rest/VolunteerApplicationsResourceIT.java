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
import team.bham.IntegrationTest;
import team.bham.domain.VolunteerApplications;
import team.bham.domain.enumeration.ApplicationCategory;
import team.bham.repository.VolunteerApplicationsRepository;

/**
 * Integration tests for the {@link VolunteerApplicationsResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class VolunteerApplicationsResourceIT {

    private static final Instant DEFAULT_TIME_STAMP = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_TIME_STAMP = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final ApplicationCategory DEFAULT_VOLUNTEER_STATUS = ApplicationCategory.PENDING;
    private static final ApplicationCategory UPDATED_VOLUNTEER_STATUS = ApplicationCategory.INTERVIEW;

    private static final String ENTITY_API_URL = "/api/volunteer-applications";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private VolunteerApplicationsRepository volunteerApplicationsRepository;

    @Mock
    private VolunteerApplicationsRepository volunteerApplicationsRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restVolunteerApplicationsMockMvc;

    private VolunteerApplications volunteerApplications;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static VolunteerApplications createEntity(EntityManager em) {
        VolunteerApplications volunteerApplications = new VolunteerApplications()
            .timeStamp(DEFAULT_TIME_STAMP)
            .volunteerStatus(DEFAULT_VOLUNTEER_STATUS);
        return volunteerApplications;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static VolunteerApplications createUpdatedEntity(EntityManager em) {
        VolunteerApplications volunteerApplications = new VolunteerApplications()
            .timeStamp(UPDATED_TIME_STAMP)
            .volunteerStatus(UPDATED_VOLUNTEER_STATUS);
        return volunteerApplications;
    }

    @BeforeEach
    public void initTest() {
        volunteerApplications = createEntity(em);
    }

    @Test
    @Transactional
    void createVolunteerApplications() throws Exception {
        int databaseSizeBeforeCreate = volunteerApplicationsRepository.findAll().size();
        // Create the VolunteerApplications
        restVolunteerApplicationsMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(volunteerApplications))
            )
            .andExpect(status().isCreated());

        // Validate the VolunteerApplications in the database
        List<VolunteerApplications> volunteerApplicationsList = volunteerApplicationsRepository.findAll();
        assertThat(volunteerApplicationsList).hasSize(databaseSizeBeforeCreate + 1);
        VolunteerApplications testVolunteerApplications = volunteerApplicationsList.get(volunteerApplicationsList.size() - 1);
        assertThat(testVolunteerApplications.getTimeStamp()).isEqualTo(DEFAULT_TIME_STAMP);
        assertThat(testVolunteerApplications.getVolunteerStatus()).isEqualTo(DEFAULT_VOLUNTEER_STATUS);
    }

    @Test
    @Transactional
    void createVolunteerApplicationsWithExistingId() throws Exception {
        // Create the VolunteerApplications with an existing ID
        volunteerApplications.setId(1L);

        int databaseSizeBeforeCreate = volunteerApplicationsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restVolunteerApplicationsMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(volunteerApplications))
            )
            .andExpect(status().isBadRequest());

        // Validate the VolunteerApplications in the database
        List<VolunteerApplications> volunteerApplicationsList = volunteerApplicationsRepository.findAll();
        assertThat(volunteerApplicationsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllVolunteerApplications() throws Exception {
        // Initialize the database
        volunteerApplicationsRepository.saveAndFlush(volunteerApplications);

        // Get all the volunteerApplicationsList
        restVolunteerApplicationsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(volunteerApplications.getId().intValue())))
            .andExpect(jsonPath("$.[*].timeStamp").value(hasItem(DEFAULT_TIME_STAMP.toString())))
            .andExpect(jsonPath("$.[*].volunteerStatus").value(hasItem(DEFAULT_VOLUNTEER_STATUS.toString())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllVolunteerApplicationsWithEagerRelationshipsIsEnabled() throws Exception {
        when(volunteerApplicationsRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restVolunteerApplicationsMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(volunteerApplicationsRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllVolunteerApplicationsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(volunteerApplicationsRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restVolunteerApplicationsMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(volunteerApplicationsRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getVolunteerApplications() throws Exception {
        // Initialize the database
        volunteerApplicationsRepository.saveAndFlush(volunteerApplications);

        // Get the volunteerApplications
        restVolunteerApplicationsMockMvc
            .perform(get(ENTITY_API_URL_ID, volunteerApplications.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(volunteerApplications.getId().intValue()))
            .andExpect(jsonPath("$.timeStamp").value(DEFAULT_TIME_STAMP.toString()))
            .andExpect(jsonPath("$.volunteerStatus").value(DEFAULT_VOLUNTEER_STATUS.toString()));
    }

    @Test
    @Transactional
    void getNonExistingVolunteerApplications() throws Exception {
        // Get the volunteerApplications
        restVolunteerApplicationsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingVolunteerApplications() throws Exception {
        // Initialize the database
        volunteerApplicationsRepository.saveAndFlush(volunteerApplications);

        int databaseSizeBeforeUpdate = volunteerApplicationsRepository.findAll().size();

        // Update the volunteerApplications
        VolunteerApplications updatedVolunteerApplications = volunteerApplicationsRepository.findById(volunteerApplications.getId()).get();
        // Disconnect from session so that the updates on updatedVolunteerApplications are not directly saved in db
        em.detach(updatedVolunteerApplications);
        updatedVolunteerApplications.timeStamp(UPDATED_TIME_STAMP).volunteerStatus(UPDATED_VOLUNTEER_STATUS);

        restVolunteerApplicationsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedVolunteerApplications.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedVolunteerApplications))
            )
            .andExpect(status().isOk());

        // Validate the VolunteerApplications in the database
        List<VolunteerApplications> volunteerApplicationsList = volunteerApplicationsRepository.findAll();
        assertThat(volunteerApplicationsList).hasSize(databaseSizeBeforeUpdate);
        VolunteerApplications testVolunteerApplications = volunteerApplicationsList.get(volunteerApplicationsList.size() - 1);
        assertThat(testVolunteerApplications.getTimeStamp()).isEqualTo(UPDATED_TIME_STAMP);
        assertThat(testVolunteerApplications.getVolunteerStatus()).isEqualTo(UPDATED_VOLUNTEER_STATUS);
    }

    @Test
    @Transactional
    void putNonExistingVolunteerApplications() throws Exception {
        int databaseSizeBeforeUpdate = volunteerApplicationsRepository.findAll().size();
        volunteerApplications.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVolunteerApplicationsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, volunteerApplications.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(volunteerApplications))
            )
            .andExpect(status().isBadRequest());

        // Validate the VolunteerApplications in the database
        List<VolunteerApplications> volunteerApplicationsList = volunteerApplicationsRepository.findAll();
        assertThat(volunteerApplicationsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchVolunteerApplications() throws Exception {
        int databaseSizeBeforeUpdate = volunteerApplicationsRepository.findAll().size();
        volunteerApplications.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVolunteerApplicationsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(volunteerApplications))
            )
            .andExpect(status().isBadRequest());

        // Validate the VolunteerApplications in the database
        List<VolunteerApplications> volunteerApplicationsList = volunteerApplicationsRepository.findAll();
        assertThat(volunteerApplicationsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamVolunteerApplications() throws Exception {
        int databaseSizeBeforeUpdate = volunteerApplicationsRepository.findAll().size();
        volunteerApplications.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVolunteerApplicationsMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(volunteerApplications))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the VolunteerApplications in the database
        List<VolunteerApplications> volunteerApplicationsList = volunteerApplicationsRepository.findAll();
        assertThat(volunteerApplicationsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateVolunteerApplicationsWithPatch() throws Exception {
        // Initialize the database
        volunteerApplicationsRepository.saveAndFlush(volunteerApplications);

        int databaseSizeBeforeUpdate = volunteerApplicationsRepository.findAll().size();

        // Update the volunteerApplications using partial update
        VolunteerApplications partialUpdatedVolunteerApplications = new VolunteerApplications();
        partialUpdatedVolunteerApplications.setId(volunteerApplications.getId());

        partialUpdatedVolunteerApplications.timeStamp(UPDATED_TIME_STAMP);

        restVolunteerApplicationsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVolunteerApplications.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedVolunteerApplications))
            )
            .andExpect(status().isOk());

        // Validate the VolunteerApplications in the database
        List<VolunteerApplications> volunteerApplicationsList = volunteerApplicationsRepository.findAll();
        assertThat(volunteerApplicationsList).hasSize(databaseSizeBeforeUpdate);
        VolunteerApplications testVolunteerApplications = volunteerApplicationsList.get(volunteerApplicationsList.size() - 1);
        assertThat(testVolunteerApplications.getTimeStamp()).isEqualTo(UPDATED_TIME_STAMP);
        assertThat(testVolunteerApplications.getVolunteerStatus()).isEqualTo(DEFAULT_VOLUNTEER_STATUS);
    }

    @Test
    @Transactional
    void fullUpdateVolunteerApplicationsWithPatch() throws Exception {
        // Initialize the database
        volunteerApplicationsRepository.saveAndFlush(volunteerApplications);

        int databaseSizeBeforeUpdate = volunteerApplicationsRepository.findAll().size();

        // Update the volunteerApplications using partial update
        VolunteerApplications partialUpdatedVolunteerApplications = new VolunteerApplications();
        partialUpdatedVolunteerApplications.setId(volunteerApplications.getId());

        partialUpdatedVolunteerApplications.timeStamp(UPDATED_TIME_STAMP).volunteerStatus(UPDATED_VOLUNTEER_STATUS);

        restVolunteerApplicationsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVolunteerApplications.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedVolunteerApplications))
            )
            .andExpect(status().isOk());

        // Validate the VolunteerApplications in the database
        List<VolunteerApplications> volunteerApplicationsList = volunteerApplicationsRepository.findAll();
        assertThat(volunteerApplicationsList).hasSize(databaseSizeBeforeUpdate);
        VolunteerApplications testVolunteerApplications = volunteerApplicationsList.get(volunteerApplicationsList.size() - 1);
        assertThat(testVolunteerApplications.getTimeStamp()).isEqualTo(UPDATED_TIME_STAMP);
        assertThat(testVolunteerApplications.getVolunteerStatus()).isEqualTo(UPDATED_VOLUNTEER_STATUS);
    }

    @Test
    @Transactional
    void patchNonExistingVolunteerApplications() throws Exception {
        int databaseSizeBeforeUpdate = volunteerApplicationsRepository.findAll().size();
        volunteerApplications.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVolunteerApplicationsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, volunteerApplications.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(volunteerApplications))
            )
            .andExpect(status().isBadRequest());

        // Validate the VolunteerApplications in the database
        List<VolunteerApplications> volunteerApplicationsList = volunteerApplicationsRepository.findAll();
        assertThat(volunteerApplicationsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchVolunteerApplications() throws Exception {
        int databaseSizeBeforeUpdate = volunteerApplicationsRepository.findAll().size();
        volunteerApplications.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVolunteerApplicationsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(volunteerApplications))
            )
            .andExpect(status().isBadRequest());

        // Validate the VolunteerApplications in the database
        List<VolunteerApplications> volunteerApplicationsList = volunteerApplicationsRepository.findAll();
        assertThat(volunteerApplicationsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamVolunteerApplications() throws Exception {
        int databaseSizeBeforeUpdate = volunteerApplicationsRepository.findAll().size();
        volunteerApplications.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVolunteerApplicationsMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(volunteerApplications))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the VolunteerApplications in the database
        List<VolunteerApplications> volunteerApplicationsList = volunteerApplicationsRepository.findAll();
        assertThat(volunteerApplicationsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteVolunteerApplications() throws Exception {
        // Initialize the database
        volunteerApplicationsRepository.saveAndFlush(volunteerApplications);

        int databaseSizeBeforeDelete = volunteerApplicationsRepository.findAll().size();

        // Delete the volunteerApplications
        restVolunteerApplicationsMockMvc
            .perform(delete(ENTITY_API_URL_ID, volunteerApplications.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<VolunteerApplications> volunteerApplicationsList = volunteerApplicationsRepository.findAll();
        assertThat(volunteerApplicationsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

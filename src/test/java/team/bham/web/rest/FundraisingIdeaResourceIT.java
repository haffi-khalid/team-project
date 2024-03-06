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
import team.bham.domain.FundraisingIdea;
import team.bham.domain.enumeration.LocationCategory;
import team.bham.repository.FundraisingIdeaRepository;

/**
 * Integration tests for the {@link FundraisingIdeaResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class FundraisingIdeaResourceIT {

    private static final String DEFAULT_IDEA_NAME = "AAAAAAAAAA";
    private static final String UPDATED_IDEA_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_IDEA_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_IDEA_DESCRIPTION = "BBBBBBBBBB";

    private static final Integer DEFAULT_NUMBER_OF_VOLUNTEERS = 1;
    private static final Integer UPDATED_NUMBER_OF_VOLUNTEERS = 2;

    private static final LocationCategory DEFAULT_LOCATION = LocationCategory.INPERSON;
    private static final LocationCategory UPDATED_LOCATION = LocationCategory.REMOTE;

    private static final Double DEFAULT_EXPECTED_COST = 1D;
    private static final Double UPDATED_EXPECTED_COST = 2D;

    private static final Integer DEFAULT_EXPECTED_ATTENDANCE = 1;
    private static final Integer UPDATED_EXPECTED_ATTENDANCE = 2;

    private static final String ENTITY_API_URL = "/api/fundraising-ideas";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private FundraisingIdeaRepository fundraisingIdeaRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restFundraisingIdeaMockMvc;

    private FundraisingIdea fundraisingIdea;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FundraisingIdea createEntity(EntityManager em) {
        FundraisingIdea fundraisingIdea = new FundraisingIdea()
            .ideaName(DEFAULT_IDEA_NAME)
            .ideaDescription(DEFAULT_IDEA_DESCRIPTION)
            .numberOfVolunteers(DEFAULT_NUMBER_OF_VOLUNTEERS)
            .location(DEFAULT_LOCATION)
            .expectedCost(DEFAULT_EXPECTED_COST)
            .expectedAttendance(DEFAULT_EXPECTED_ATTENDANCE);
        return fundraisingIdea;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FundraisingIdea createUpdatedEntity(EntityManager em) {
        FundraisingIdea fundraisingIdea = new FundraisingIdea()
            .ideaName(UPDATED_IDEA_NAME)
            .ideaDescription(UPDATED_IDEA_DESCRIPTION)
            .numberOfVolunteers(UPDATED_NUMBER_OF_VOLUNTEERS)
            .location(UPDATED_LOCATION)
            .expectedCost(UPDATED_EXPECTED_COST)
            .expectedAttendance(UPDATED_EXPECTED_ATTENDANCE);
        return fundraisingIdea;
    }

    @BeforeEach
    public void initTest() {
        fundraisingIdea = createEntity(em);
    }

    @Test
    @Transactional
    void createFundraisingIdea() throws Exception {
        int databaseSizeBeforeCreate = fundraisingIdeaRepository.findAll().size();
        // Create the FundraisingIdea
        restFundraisingIdeaMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(fundraisingIdea))
            )
            .andExpect(status().isCreated());

        // Validate the FundraisingIdea in the database
        List<FundraisingIdea> fundraisingIdeaList = fundraisingIdeaRepository.findAll();
        assertThat(fundraisingIdeaList).hasSize(databaseSizeBeforeCreate + 1);
        FundraisingIdea testFundraisingIdea = fundraisingIdeaList.get(fundraisingIdeaList.size() - 1);
        assertThat(testFundraisingIdea.getIdeaName()).isEqualTo(DEFAULT_IDEA_NAME);
        assertThat(testFundraisingIdea.getIdeaDescription()).isEqualTo(DEFAULT_IDEA_DESCRIPTION);
        assertThat(testFundraisingIdea.getNumberOfVolunteers()).isEqualTo(DEFAULT_NUMBER_OF_VOLUNTEERS);
        assertThat(testFundraisingIdea.getLocation()).isEqualTo(DEFAULT_LOCATION);
        assertThat(testFundraisingIdea.getExpectedCost()).isEqualTo(DEFAULT_EXPECTED_COST);
        assertThat(testFundraisingIdea.getExpectedAttendance()).isEqualTo(DEFAULT_EXPECTED_ATTENDANCE);
    }

    @Test
    @Transactional
    void createFundraisingIdeaWithExistingId() throws Exception {
        // Create the FundraisingIdea with an existing ID
        fundraisingIdea.setId(1L);

        int databaseSizeBeforeCreate = fundraisingIdeaRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restFundraisingIdeaMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(fundraisingIdea))
            )
            .andExpect(status().isBadRequest());

        // Validate the FundraisingIdea in the database
        List<FundraisingIdea> fundraisingIdeaList = fundraisingIdeaRepository.findAll();
        assertThat(fundraisingIdeaList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllFundraisingIdeas() throws Exception {
        // Initialize the database
        fundraisingIdeaRepository.saveAndFlush(fundraisingIdea);

        // Get all the fundraisingIdeaList
        restFundraisingIdeaMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(fundraisingIdea.getId().intValue())))
            .andExpect(jsonPath("$.[*].ideaName").value(hasItem(DEFAULT_IDEA_NAME)))
            .andExpect(jsonPath("$.[*].ideaDescription").value(hasItem(DEFAULT_IDEA_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].numberOfVolunteers").value(hasItem(DEFAULT_NUMBER_OF_VOLUNTEERS)))
            .andExpect(jsonPath("$.[*].location").value(hasItem(DEFAULT_LOCATION.toString())))
            .andExpect(jsonPath("$.[*].expectedCost").value(hasItem(DEFAULT_EXPECTED_COST.doubleValue())))
            .andExpect(jsonPath("$.[*].expectedAttendance").value(hasItem(DEFAULT_EXPECTED_ATTENDANCE)));
    }

    @Test
    @Transactional
    void getFundraisingIdea() throws Exception {
        // Initialize the database
        fundraisingIdeaRepository.saveAndFlush(fundraisingIdea);

        // Get the fundraisingIdea
        restFundraisingIdeaMockMvc
            .perform(get(ENTITY_API_URL_ID, fundraisingIdea.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(fundraisingIdea.getId().intValue()))
            .andExpect(jsonPath("$.ideaName").value(DEFAULT_IDEA_NAME))
            .andExpect(jsonPath("$.ideaDescription").value(DEFAULT_IDEA_DESCRIPTION))
            .andExpect(jsonPath("$.numberOfVolunteers").value(DEFAULT_NUMBER_OF_VOLUNTEERS))
            .andExpect(jsonPath("$.location").value(DEFAULT_LOCATION.toString()))
            .andExpect(jsonPath("$.expectedCost").value(DEFAULT_EXPECTED_COST.doubleValue()))
            .andExpect(jsonPath("$.expectedAttendance").value(DEFAULT_EXPECTED_ATTENDANCE));
    }

    @Test
    @Transactional
    void getNonExistingFundraisingIdea() throws Exception {
        // Get the fundraisingIdea
        restFundraisingIdeaMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingFundraisingIdea() throws Exception {
        // Initialize the database
        fundraisingIdeaRepository.saveAndFlush(fundraisingIdea);

        int databaseSizeBeforeUpdate = fundraisingIdeaRepository.findAll().size();

        // Update the fundraisingIdea
        FundraisingIdea updatedFundraisingIdea = fundraisingIdeaRepository.findById(fundraisingIdea.getId()).get();
        // Disconnect from session so that the updates on updatedFundraisingIdea are not directly saved in db
        em.detach(updatedFundraisingIdea);
        updatedFundraisingIdea
            .ideaName(UPDATED_IDEA_NAME)
            .ideaDescription(UPDATED_IDEA_DESCRIPTION)
            .numberOfVolunteers(UPDATED_NUMBER_OF_VOLUNTEERS)
            .location(UPDATED_LOCATION)
            .expectedCost(UPDATED_EXPECTED_COST)
            .expectedAttendance(UPDATED_EXPECTED_ATTENDANCE);

        restFundraisingIdeaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedFundraisingIdea.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedFundraisingIdea))
            )
            .andExpect(status().isOk());

        // Validate the FundraisingIdea in the database
        List<FundraisingIdea> fundraisingIdeaList = fundraisingIdeaRepository.findAll();
        assertThat(fundraisingIdeaList).hasSize(databaseSizeBeforeUpdate);
        FundraisingIdea testFundraisingIdea = fundraisingIdeaList.get(fundraisingIdeaList.size() - 1);
        assertThat(testFundraisingIdea.getIdeaName()).isEqualTo(UPDATED_IDEA_NAME);
        assertThat(testFundraisingIdea.getIdeaDescription()).isEqualTo(UPDATED_IDEA_DESCRIPTION);
        assertThat(testFundraisingIdea.getNumberOfVolunteers()).isEqualTo(UPDATED_NUMBER_OF_VOLUNTEERS);
        assertThat(testFundraisingIdea.getLocation()).isEqualTo(UPDATED_LOCATION);
        assertThat(testFundraisingIdea.getExpectedCost()).isEqualTo(UPDATED_EXPECTED_COST);
        assertThat(testFundraisingIdea.getExpectedAttendance()).isEqualTo(UPDATED_EXPECTED_ATTENDANCE);
    }

    @Test
    @Transactional
    void putNonExistingFundraisingIdea() throws Exception {
        int databaseSizeBeforeUpdate = fundraisingIdeaRepository.findAll().size();
        fundraisingIdea.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFundraisingIdeaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, fundraisingIdea.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(fundraisingIdea))
            )
            .andExpect(status().isBadRequest());

        // Validate the FundraisingIdea in the database
        List<FundraisingIdea> fundraisingIdeaList = fundraisingIdeaRepository.findAll();
        assertThat(fundraisingIdeaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchFundraisingIdea() throws Exception {
        int databaseSizeBeforeUpdate = fundraisingIdeaRepository.findAll().size();
        fundraisingIdea.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFundraisingIdeaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(fundraisingIdea))
            )
            .andExpect(status().isBadRequest());

        // Validate the FundraisingIdea in the database
        List<FundraisingIdea> fundraisingIdeaList = fundraisingIdeaRepository.findAll();
        assertThat(fundraisingIdeaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamFundraisingIdea() throws Exception {
        int databaseSizeBeforeUpdate = fundraisingIdeaRepository.findAll().size();
        fundraisingIdea.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFundraisingIdeaMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(fundraisingIdea))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the FundraisingIdea in the database
        List<FundraisingIdea> fundraisingIdeaList = fundraisingIdeaRepository.findAll();
        assertThat(fundraisingIdeaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateFundraisingIdeaWithPatch() throws Exception {
        // Initialize the database
        fundraisingIdeaRepository.saveAndFlush(fundraisingIdea);

        int databaseSizeBeforeUpdate = fundraisingIdeaRepository.findAll().size();

        // Update the fundraisingIdea using partial update
        FundraisingIdea partialUpdatedFundraisingIdea = new FundraisingIdea();
        partialUpdatedFundraisingIdea.setId(fundraisingIdea.getId());

        partialUpdatedFundraisingIdea
            .ideaDescription(UPDATED_IDEA_DESCRIPTION)
            .numberOfVolunteers(UPDATED_NUMBER_OF_VOLUNTEERS)
            .location(UPDATED_LOCATION)
            .expectedCost(UPDATED_EXPECTED_COST);

        restFundraisingIdeaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFundraisingIdea.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFundraisingIdea))
            )
            .andExpect(status().isOk());

        // Validate the FundraisingIdea in the database
        List<FundraisingIdea> fundraisingIdeaList = fundraisingIdeaRepository.findAll();
        assertThat(fundraisingIdeaList).hasSize(databaseSizeBeforeUpdate);
        FundraisingIdea testFundraisingIdea = fundraisingIdeaList.get(fundraisingIdeaList.size() - 1);
        assertThat(testFundraisingIdea.getIdeaName()).isEqualTo(DEFAULT_IDEA_NAME);
        assertThat(testFundraisingIdea.getIdeaDescription()).isEqualTo(UPDATED_IDEA_DESCRIPTION);
        assertThat(testFundraisingIdea.getNumberOfVolunteers()).isEqualTo(UPDATED_NUMBER_OF_VOLUNTEERS);
        assertThat(testFundraisingIdea.getLocation()).isEqualTo(UPDATED_LOCATION);
        assertThat(testFundraisingIdea.getExpectedCost()).isEqualTo(UPDATED_EXPECTED_COST);
        assertThat(testFundraisingIdea.getExpectedAttendance()).isEqualTo(DEFAULT_EXPECTED_ATTENDANCE);
    }

    @Test
    @Transactional
    void fullUpdateFundraisingIdeaWithPatch() throws Exception {
        // Initialize the database
        fundraisingIdeaRepository.saveAndFlush(fundraisingIdea);

        int databaseSizeBeforeUpdate = fundraisingIdeaRepository.findAll().size();

        // Update the fundraisingIdea using partial update
        FundraisingIdea partialUpdatedFundraisingIdea = new FundraisingIdea();
        partialUpdatedFundraisingIdea.setId(fundraisingIdea.getId());

        partialUpdatedFundraisingIdea
            .ideaName(UPDATED_IDEA_NAME)
            .ideaDescription(UPDATED_IDEA_DESCRIPTION)
            .numberOfVolunteers(UPDATED_NUMBER_OF_VOLUNTEERS)
            .location(UPDATED_LOCATION)
            .expectedCost(UPDATED_EXPECTED_COST)
            .expectedAttendance(UPDATED_EXPECTED_ATTENDANCE);

        restFundraisingIdeaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFundraisingIdea.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFundraisingIdea))
            )
            .andExpect(status().isOk());

        // Validate the FundraisingIdea in the database
        List<FundraisingIdea> fundraisingIdeaList = fundraisingIdeaRepository.findAll();
        assertThat(fundraisingIdeaList).hasSize(databaseSizeBeforeUpdate);
        FundraisingIdea testFundraisingIdea = fundraisingIdeaList.get(fundraisingIdeaList.size() - 1);
        assertThat(testFundraisingIdea.getIdeaName()).isEqualTo(UPDATED_IDEA_NAME);
        assertThat(testFundraisingIdea.getIdeaDescription()).isEqualTo(UPDATED_IDEA_DESCRIPTION);
        assertThat(testFundraisingIdea.getNumberOfVolunteers()).isEqualTo(UPDATED_NUMBER_OF_VOLUNTEERS);
        assertThat(testFundraisingIdea.getLocation()).isEqualTo(UPDATED_LOCATION);
        assertThat(testFundraisingIdea.getExpectedCost()).isEqualTo(UPDATED_EXPECTED_COST);
        assertThat(testFundraisingIdea.getExpectedAttendance()).isEqualTo(UPDATED_EXPECTED_ATTENDANCE);
    }

    @Test
    @Transactional
    void patchNonExistingFundraisingIdea() throws Exception {
        int databaseSizeBeforeUpdate = fundraisingIdeaRepository.findAll().size();
        fundraisingIdea.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFundraisingIdeaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, fundraisingIdea.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(fundraisingIdea))
            )
            .andExpect(status().isBadRequest());

        // Validate the FundraisingIdea in the database
        List<FundraisingIdea> fundraisingIdeaList = fundraisingIdeaRepository.findAll();
        assertThat(fundraisingIdeaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchFundraisingIdea() throws Exception {
        int databaseSizeBeforeUpdate = fundraisingIdeaRepository.findAll().size();
        fundraisingIdea.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFundraisingIdeaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(fundraisingIdea))
            )
            .andExpect(status().isBadRequest());

        // Validate the FundraisingIdea in the database
        List<FundraisingIdea> fundraisingIdeaList = fundraisingIdeaRepository.findAll();
        assertThat(fundraisingIdeaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamFundraisingIdea() throws Exception {
        int databaseSizeBeforeUpdate = fundraisingIdeaRepository.findAll().size();
        fundraisingIdea.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFundraisingIdeaMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(fundraisingIdea))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the FundraisingIdea in the database
        List<FundraisingIdea> fundraisingIdeaList = fundraisingIdeaRepository.findAll();
        assertThat(fundraisingIdeaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteFundraisingIdea() throws Exception {
        // Initialize the database
        fundraisingIdeaRepository.saveAndFlush(fundraisingIdea);

        int databaseSizeBeforeDelete = fundraisingIdeaRepository.findAll().size();

        // Delete the fundraisingIdea
        restFundraisingIdeaMockMvc
            .perform(delete(ENTITY_API_URL_ID, fundraisingIdea.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<FundraisingIdea> fundraisingIdeaList = fundraisingIdeaRepository.findAll();
        assertThat(fundraisingIdeaList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

package team.bham.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.LocalDate;
import java.time.ZoneId;
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
import org.springframework.util.Base64Utils;
import team.bham.IntegrationTest;
import team.bham.domain.Vacancies;
import team.bham.domain.enumeration.LocationCategory;
import team.bham.repository.VacanciesRepository;

/**
 * Integration tests for the {@link VacanciesResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class VacanciesResourceIT {

    private static final String DEFAULT_VACANCY_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_VACANCY_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_VACANCY_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_VACANCY_DESCRIPTION = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_VACANCY_START_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_VACANCY_START_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final byte[] DEFAULT_VACANCY_LOGO = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_VACANCY_LOGO = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_VACANCY_LOGO_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_VACANCY_LOGO_CONTENT_TYPE = "image/png";

    private static final Integer DEFAULT_VACANCY_DURATION = 1;
    private static final Integer UPDATED_VACANCY_DURATION = 2;

    private static final LocationCategory DEFAULT_VACANCY_LOCATION = LocationCategory.INPERSON;
    private static final LocationCategory UPDATED_VACANCY_LOCATION = LocationCategory.REMOTE;

    private static final String ENTITY_API_URL = "/api/vacancies";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private VacanciesRepository vacanciesRepository;

    @Mock
    private VacanciesRepository vacanciesRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restVacanciesMockMvc;

    private Vacancies vacancies;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Vacancies createEntity(EntityManager em) {
        Vacancies vacancies = new Vacancies()
            .vacancyTitle(DEFAULT_VACANCY_TITLE)
            .vacancyDescription(DEFAULT_VACANCY_DESCRIPTION)
            .vacancyStartDate(DEFAULT_VACANCY_START_DATE)
            .vacancyLogo(DEFAULT_VACANCY_LOGO)
            .vacancyLogoContentType(DEFAULT_VACANCY_LOGO_CONTENT_TYPE)
            .vacancyDuration(DEFAULT_VACANCY_DURATION)
            .vacancyLocation(DEFAULT_VACANCY_LOCATION);
        return vacancies;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Vacancies createUpdatedEntity(EntityManager em) {
        Vacancies vacancies = new Vacancies()
            .vacancyTitle(UPDATED_VACANCY_TITLE)
            .vacancyDescription(UPDATED_VACANCY_DESCRIPTION)
            .vacancyStartDate(UPDATED_VACANCY_START_DATE)
            .vacancyLogo(UPDATED_VACANCY_LOGO)
            .vacancyLogoContentType(UPDATED_VACANCY_LOGO_CONTENT_TYPE)
            .vacancyDuration(UPDATED_VACANCY_DURATION)
            .vacancyLocation(UPDATED_VACANCY_LOCATION);
        return vacancies;
    }

    @BeforeEach
    public void initTest() {
        vacancies = createEntity(em);
    }

    @Test
    @Transactional
    void createVacancies() throws Exception {
        int databaseSizeBeforeCreate = vacanciesRepository.findAll().size();
        // Create the Vacancies
        restVacanciesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(vacancies)))
            .andExpect(status().isCreated());

        // Validate the Vacancies in the database
        List<Vacancies> vacanciesList = vacanciesRepository.findAll();
        assertThat(vacanciesList).hasSize(databaseSizeBeforeCreate + 1);
        Vacancies testVacancies = vacanciesList.get(vacanciesList.size() - 1);
        assertThat(testVacancies.getVacancyTitle()).isEqualTo(DEFAULT_VACANCY_TITLE);
        assertThat(testVacancies.getVacancyDescription()).isEqualTo(DEFAULT_VACANCY_DESCRIPTION);
        assertThat(testVacancies.getVacancyStartDate()).isEqualTo(DEFAULT_VACANCY_START_DATE);
        assertThat(testVacancies.getVacancyLogo()).isEqualTo(DEFAULT_VACANCY_LOGO);
        assertThat(testVacancies.getVacancyLogoContentType()).isEqualTo(DEFAULT_VACANCY_LOGO_CONTENT_TYPE);
        assertThat(testVacancies.getVacancyDuration()).isEqualTo(DEFAULT_VACANCY_DURATION);
        assertThat(testVacancies.getVacancyLocation()).isEqualTo(DEFAULT_VACANCY_LOCATION);
    }

    @Test
    @Transactional
    void createVacanciesWithExistingId() throws Exception {
        // Create the Vacancies with an existing ID
        vacancies.setId(1L);

        int databaseSizeBeforeCreate = vacanciesRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restVacanciesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(vacancies)))
            .andExpect(status().isBadRequest());

        // Validate the Vacancies in the database
        List<Vacancies> vacanciesList = vacanciesRepository.findAll();
        assertThat(vacanciesList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllVacancies() throws Exception {
        // Initialize the database
        vacanciesRepository.saveAndFlush(vacancies);

        // Get all the vacanciesList
        restVacanciesMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(vacancies.getId().intValue())))
            .andExpect(jsonPath("$.[*].vacancyTitle").value(hasItem(DEFAULT_VACANCY_TITLE)))
            .andExpect(jsonPath("$.[*].vacancyDescription").value(hasItem(DEFAULT_VACANCY_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].vacancyStartDate").value(hasItem(DEFAULT_VACANCY_START_DATE.toString())))
            .andExpect(jsonPath("$.[*].vacancyLogoContentType").value(hasItem(DEFAULT_VACANCY_LOGO_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].vacancyLogo").value(hasItem(Base64Utils.encodeToString(DEFAULT_VACANCY_LOGO))))
            .andExpect(jsonPath("$.[*].vacancyDuration").value(hasItem(DEFAULT_VACANCY_DURATION)))
            .andExpect(jsonPath("$.[*].vacancyLocation").value(hasItem(DEFAULT_VACANCY_LOCATION.toString())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllVacanciesWithEagerRelationshipsIsEnabled() throws Exception {
        when(vacanciesRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restVacanciesMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(vacanciesRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllVacanciesWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(vacanciesRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restVacanciesMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(vacanciesRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getVacancies() throws Exception {
        // Initialize the database
        vacanciesRepository.saveAndFlush(vacancies);

        // Get the vacancies
        restVacanciesMockMvc
            .perform(get(ENTITY_API_URL_ID, vacancies.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(vacancies.getId().intValue()))
            .andExpect(jsonPath("$.vacancyTitle").value(DEFAULT_VACANCY_TITLE))
            .andExpect(jsonPath("$.vacancyDescription").value(DEFAULT_VACANCY_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.vacancyStartDate").value(DEFAULT_VACANCY_START_DATE.toString()))
            .andExpect(jsonPath("$.vacancyLogoContentType").value(DEFAULT_VACANCY_LOGO_CONTENT_TYPE))
            .andExpect(jsonPath("$.vacancyLogo").value(Base64Utils.encodeToString(DEFAULT_VACANCY_LOGO)))
            .andExpect(jsonPath("$.vacancyDuration").value(DEFAULT_VACANCY_DURATION))
            .andExpect(jsonPath("$.vacancyLocation").value(DEFAULT_VACANCY_LOCATION.toString()));
    }

    @Test
    @Transactional
    void getNonExistingVacancies() throws Exception {
        // Get the vacancies
        restVacanciesMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingVacancies() throws Exception {
        // Initialize the database
        vacanciesRepository.saveAndFlush(vacancies);

        int databaseSizeBeforeUpdate = vacanciesRepository.findAll().size();

        // Update the vacancies
        Vacancies updatedVacancies = vacanciesRepository.findById(vacancies.getId()).get();
        // Disconnect from session so that the updates on updatedVacancies are not directly saved in db
        em.detach(updatedVacancies);
        updatedVacancies
            .vacancyTitle(UPDATED_VACANCY_TITLE)
            .vacancyDescription(UPDATED_VACANCY_DESCRIPTION)
            .vacancyStartDate(UPDATED_VACANCY_START_DATE)
            .vacancyLogo(UPDATED_VACANCY_LOGO)
            .vacancyLogoContentType(UPDATED_VACANCY_LOGO_CONTENT_TYPE)
            .vacancyDuration(UPDATED_VACANCY_DURATION)
            .vacancyLocation(UPDATED_VACANCY_LOCATION);

        restVacanciesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedVacancies.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedVacancies))
            )
            .andExpect(status().isOk());

        // Validate the Vacancies in the database
        List<Vacancies> vacanciesList = vacanciesRepository.findAll();
        assertThat(vacanciesList).hasSize(databaseSizeBeforeUpdate);
        Vacancies testVacancies = vacanciesList.get(vacanciesList.size() - 1);
        assertThat(testVacancies.getVacancyTitle()).isEqualTo(UPDATED_VACANCY_TITLE);
        assertThat(testVacancies.getVacancyDescription()).isEqualTo(UPDATED_VACANCY_DESCRIPTION);
        assertThat(testVacancies.getVacancyStartDate()).isEqualTo(UPDATED_VACANCY_START_DATE);
        assertThat(testVacancies.getVacancyLogo()).isEqualTo(UPDATED_VACANCY_LOGO);
        assertThat(testVacancies.getVacancyLogoContentType()).isEqualTo(UPDATED_VACANCY_LOGO_CONTENT_TYPE);
        assertThat(testVacancies.getVacancyDuration()).isEqualTo(UPDATED_VACANCY_DURATION);
        assertThat(testVacancies.getVacancyLocation()).isEqualTo(UPDATED_VACANCY_LOCATION);
    }

    @Test
    @Transactional
    void putNonExistingVacancies() throws Exception {
        int databaseSizeBeforeUpdate = vacanciesRepository.findAll().size();
        vacancies.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVacanciesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, vacancies.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(vacancies))
            )
            .andExpect(status().isBadRequest());

        // Validate the Vacancies in the database
        List<Vacancies> vacanciesList = vacanciesRepository.findAll();
        assertThat(vacanciesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchVacancies() throws Exception {
        int databaseSizeBeforeUpdate = vacanciesRepository.findAll().size();
        vacancies.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVacanciesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(vacancies))
            )
            .andExpect(status().isBadRequest());

        // Validate the Vacancies in the database
        List<Vacancies> vacanciesList = vacanciesRepository.findAll();
        assertThat(vacanciesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamVacancies() throws Exception {
        int databaseSizeBeforeUpdate = vacanciesRepository.findAll().size();
        vacancies.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVacanciesMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(vacancies)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Vacancies in the database
        List<Vacancies> vacanciesList = vacanciesRepository.findAll();
        assertThat(vacanciesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateVacanciesWithPatch() throws Exception {
        // Initialize the database
        vacanciesRepository.saveAndFlush(vacancies);

        int databaseSizeBeforeUpdate = vacanciesRepository.findAll().size();

        // Update the vacancies using partial update
        Vacancies partialUpdatedVacancies = new Vacancies();
        partialUpdatedVacancies.setId(vacancies.getId());

        partialUpdatedVacancies
            .vacancyLogo(UPDATED_VACANCY_LOGO)
            .vacancyLogoContentType(UPDATED_VACANCY_LOGO_CONTENT_TYPE)
            .vacancyDuration(UPDATED_VACANCY_DURATION);

        restVacanciesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVacancies.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedVacancies))
            )
            .andExpect(status().isOk());

        // Validate the Vacancies in the database
        List<Vacancies> vacanciesList = vacanciesRepository.findAll();
        assertThat(vacanciesList).hasSize(databaseSizeBeforeUpdate);
        Vacancies testVacancies = vacanciesList.get(vacanciesList.size() - 1);
        assertThat(testVacancies.getVacancyTitle()).isEqualTo(DEFAULT_VACANCY_TITLE);
        assertThat(testVacancies.getVacancyDescription()).isEqualTo(DEFAULT_VACANCY_DESCRIPTION);
        assertThat(testVacancies.getVacancyStartDate()).isEqualTo(DEFAULT_VACANCY_START_DATE);
        assertThat(testVacancies.getVacancyLogo()).isEqualTo(UPDATED_VACANCY_LOGO);
        assertThat(testVacancies.getVacancyLogoContentType()).isEqualTo(UPDATED_VACANCY_LOGO_CONTENT_TYPE);
        assertThat(testVacancies.getVacancyDuration()).isEqualTo(UPDATED_VACANCY_DURATION);
        assertThat(testVacancies.getVacancyLocation()).isEqualTo(DEFAULT_VACANCY_LOCATION);
    }

    @Test
    @Transactional
    void fullUpdateVacanciesWithPatch() throws Exception {
        // Initialize the database
        vacanciesRepository.saveAndFlush(vacancies);

        int databaseSizeBeforeUpdate = vacanciesRepository.findAll().size();

        // Update the vacancies using partial update
        Vacancies partialUpdatedVacancies = new Vacancies();
        partialUpdatedVacancies.setId(vacancies.getId());

        partialUpdatedVacancies
            .vacancyTitle(UPDATED_VACANCY_TITLE)
            .vacancyDescription(UPDATED_VACANCY_DESCRIPTION)
            .vacancyStartDate(UPDATED_VACANCY_START_DATE)
            .vacancyLogo(UPDATED_VACANCY_LOGO)
            .vacancyLogoContentType(UPDATED_VACANCY_LOGO_CONTENT_TYPE)
            .vacancyDuration(UPDATED_VACANCY_DURATION)
            .vacancyLocation(UPDATED_VACANCY_LOCATION);

        restVacanciesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVacancies.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedVacancies))
            )
            .andExpect(status().isOk());

        // Validate the Vacancies in the database
        List<Vacancies> vacanciesList = vacanciesRepository.findAll();
        assertThat(vacanciesList).hasSize(databaseSizeBeforeUpdate);
        Vacancies testVacancies = vacanciesList.get(vacanciesList.size() - 1);
        assertThat(testVacancies.getVacancyTitle()).isEqualTo(UPDATED_VACANCY_TITLE);
        assertThat(testVacancies.getVacancyDescription()).isEqualTo(UPDATED_VACANCY_DESCRIPTION);
        assertThat(testVacancies.getVacancyStartDate()).isEqualTo(UPDATED_VACANCY_START_DATE);
        assertThat(testVacancies.getVacancyLogo()).isEqualTo(UPDATED_VACANCY_LOGO);
        assertThat(testVacancies.getVacancyLogoContentType()).isEqualTo(UPDATED_VACANCY_LOGO_CONTENT_TYPE);
        assertThat(testVacancies.getVacancyDuration()).isEqualTo(UPDATED_VACANCY_DURATION);
        assertThat(testVacancies.getVacancyLocation()).isEqualTo(UPDATED_VACANCY_LOCATION);
    }

    @Test
    @Transactional
    void patchNonExistingVacancies() throws Exception {
        int databaseSizeBeforeUpdate = vacanciesRepository.findAll().size();
        vacancies.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVacanciesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, vacancies.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(vacancies))
            )
            .andExpect(status().isBadRequest());

        // Validate the Vacancies in the database
        List<Vacancies> vacanciesList = vacanciesRepository.findAll();
        assertThat(vacanciesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchVacancies() throws Exception {
        int databaseSizeBeforeUpdate = vacanciesRepository.findAll().size();
        vacancies.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVacanciesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(vacancies))
            )
            .andExpect(status().isBadRequest());

        // Validate the Vacancies in the database
        List<Vacancies> vacanciesList = vacanciesRepository.findAll();
        assertThat(vacanciesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamVacancies() throws Exception {
        int databaseSizeBeforeUpdate = vacanciesRepository.findAll().size();
        vacancies.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVacanciesMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(vacancies))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Vacancies in the database
        List<Vacancies> vacanciesList = vacanciesRepository.findAll();
        assertThat(vacanciesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteVacancies() throws Exception {
        // Initialize the database
        vacanciesRepository.saveAndFlush(vacancies);

        int databaseSizeBeforeDelete = vacanciesRepository.findAll().size();

        // Delete the vacancies
        restVacanciesMockMvc
            .perform(delete(ENTITY_API_URL_ID, vacancies.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Vacancies> vacanciesList = vacanciesRepository.findAll();
        assertThat(vacanciesList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

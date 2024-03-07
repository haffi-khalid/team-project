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
import team.bham.domain.BudgetPlanner;
import team.bham.repository.BudgetPlannerRepository;

/**
 * Integration tests for the {@link BudgetPlannerResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class BudgetPlannerResourceIT {

    private static final String DEFAULT_CHARITY_NAME = "AAAAAAAAAA";
    private static final String UPDATED_CHARITY_NAME = "BBBBBBBBBB";

    private static final Double DEFAULT_TOTAL_BALANCE = 1D;
    private static final Double UPDATED_TOTAL_BALANCE = 2D;

    private static final String DEFAULT_UPCOMING_EVENTS = "AAAAAAAAAA";
    private static final String UPDATED_UPCOMING_EVENTS = "BBBBBBBBBB";

    private static final Double DEFAULT_TARGET_AMOUNT = 1D;
    private static final Double UPDATED_TARGET_AMOUNT = 2D;

    private static final Double DEFAULT_FORECAST_INCOME = 1D;
    private static final Double UPDATED_FORECAST_INCOME = 2D;

    private static final String ENTITY_API_URL = "/api/budget-planners";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private BudgetPlannerRepository budgetPlannerRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restBudgetPlannerMockMvc;

    private BudgetPlanner budgetPlanner;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BudgetPlanner createEntity(EntityManager em) {
        BudgetPlanner budgetPlanner = new BudgetPlanner()
            .charityName(DEFAULT_CHARITY_NAME)
            .totalBalance(DEFAULT_TOTAL_BALANCE)
            .upcomingEvents(DEFAULT_UPCOMING_EVENTS)
            .targetAmount(DEFAULT_TARGET_AMOUNT)
            .forecastIncome(DEFAULT_FORECAST_INCOME);
        return budgetPlanner;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BudgetPlanner createUpdatedEntity(EntityManager em) {
        BudgetPlanner budgetPlanner = new BudgetPlanner()
            .charityName(UPDATED_CHARITY_NAME)
            .totalBalance(UPDATED_TOTAL_BALANCE)
            .upcomingEvents(UPDATED_UPCOMING_EVENTS)
            .targetAmount(UPDATED_TARGET_AMOUNT)
            .forecastIncome(UPDATED_FORECAST_INCOME);
        return budgetPlanner;
    }

    @BeforeEach
    public void initTest() {
        budgetPlanner = createEntity(em);
    }

    @Test
    @Transactional
    void createBudgetPlanner() throws Exception {
        int databaseSizeBeforeCreate = budgetPlannerRepository.findAll().size();
        // Create the BudgetPlanner
        restBudgetPlannerMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(budgetPlanner)))
            .andExpect(status().isCreated());

        // Validate the BudgetPlanner in the database
        List<BudgetPlanner> budgetPlannerList = budgetPlannerRepository.findAll();
        assertThat(budgetPlannerList).hasSize(databaseSizeBeforeCreate + 1);
        BudgetPlanner testBudgetPlanner = budgetPlannerList.get(budgetPlannerList.size() - 1);
        assertThat(testBudgetPlanner.getCharityName()).isEqualTo(DEFAULT_CHARITY_NAME);
        assertThat(testBudgetPlanner.getTotalBalance()).isEqualTo(DEFAULT_TOTAL_BALANCE);
        assertThat(testBudgetPlanner.getUpcomingEvents()).isEqualTo(DEFAULT_UPCOMING_EVENTS);
        assertThat(testBudgetPlanner.getTargetAmount()).isEqualTo(DEFAULT_TARGET_AMOUNT);
        assertThat(testBudgetPlanner.getForecastIncome()).isEqualTo(DEFAULT_FORECAST_INCOME);
    }

    @Test
    @Transactional
    void createBudgetPlannerWithExistingId() throws Exception {
        // Create the BudgetPlanner with an existing ID
        budgetPlanner.setId(1L);

        int databaseSizeBeforeCreate = budgetPlannerRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restBudgetPlannerMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(budgetPlanner)))
            .andExpect(status().isBadRequest());

        // Validate the BudgetPlanner in the database
        List<BudgetPlanner> budgetPlannerList = budgetPlannerRepository.findAll();
        assertThat(budgetPlannerList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllBudgetPlanners() throws Exception {
        // Initialize the database
        budgetPlannerRepository.saveAndFlush(budgetPlanner);

        // Get all the budgetPlannerList
        restBudgetPlannerMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(budgetPlanner.getId().intValue())))
            .andExpect(jsonPath("$.[*].charityName").value(hasItem(DEFAULT_CHARITY_NAME)))
            .andExpect(jsonPath("$.[*].totalBalance").value(hasItem(DEFAULT_TOTAL_BALANCE.doubleValue())))
            .andExpect(jsonPath("$.[*].upcomingEvents").value(hasItem(DEFAULT_UPCOMING_EVENTS.toString())))
            .andExpect(jsonPath("$.[*].targetAmount").value(hasItem(DEFAULT_TARGET_AMOUNT.doubleValue())))
            .andExpect(jsonPath("$.[*].forecastIncome").value(hasItem(DEFAULT_FORECAST_INCOME.doubleValue())));
    }

    @Test
    @Transactional
    void getBudgetPlanner() throws Exception {
        // Initialize the database
        budgetPlannerRepository.saveAndFlush(budgetPlanner);

        // Get the budgetPlanner
        restBudgetPlannerMockMvc
            .perform(get(ENTITY_API_URL_ID, budgetPlanner.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(budgetPlanner.getId().intValue()))
            .andExpect(jsonPath("$.charityName").value(DEFAULT_CHARITY_NAME))
            .andExpect(jsonPath("$.totalBalance").value(DEFAULT_TOTAL_BALANCE.doubleValue()))
            .andExpect(jsonPath("$.upcomingEvents").value(DEFAULT_UPCOMING_EVENTS.toString()))
            .andExpect(jsonPath("$.targetAmount").value(DEFAULT_TARGET_AMOUNT.doubleValue()))
            .andExpect(jsonPath("$.forecastIncome").value(DEFAULT_FORECAST_INCOME.doubleValue()));
    }

    @Test
    @Transactional
    void getNonExistingBudgetPlanner() throws Exception {
        // Get the budgetPlanner
        restBudgetPlannerMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingBudgetPlanner() throws Exception {
        // Initialize the database
        budgetPlannerRepository.saveAndFlush(budgetPlanner);

        int databaseSizeBeforeUpdate = budgetPlannerRepository.findAll().size();

        // Update the budgetPlanner
        BudgetPlanner updatedBudgetPlanner = budgetPlannerRepository.findById(budgetPlanner.getId()).get();
        // Disconnect from session so that the updates on updatedBudgetPlanner are not directly saved in db
        em.detach(updatedBudgetPlanner);
        updatedBudgetPlanner
            .charityName(UPDATED_CHARITY_NAME)
            .totalBalance(UPDATED_TOTAL_BALANCE)
            .upcomingEvents(UPDATED_UPCOMING_EVENTS)
            .targetAmount(UPDATED_TARGET_AMOUNT)
            .forecastIncome(UPDATED_FORECAST_INCOME);

        restBudgetPlannerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedBudgetPlanner.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedBudgetPlanner))
            )
            .andExpect(status().isOk());

        // Validate the BudgetPlanner in the database
        List<BudgetPlanner> budgetPlannerList = budgetPlannerRepository.findAll();
        assertThat(budgetPlannerList).hasSize(databaseSizeBeforeUpdate);
        BudgetPlanner testBudgetPlanner = budgetPlannerList.get(budgetPlannerList.size() - 1);
        assertThat(testBudgetPlanner.getCharityName()).isEqualTo(UPDATED_CHARITY_NAME);
        assertThat(testBudgetPlanner.getTotalBalance()).isEqualTo(UPDATED_TOTAL_BALANCE);
        assertThat(testBudgetPlanner.getUpcomingEvents()).isEqualTo(UPDATED_UPCOMING_EVENTS);
        assertThat(testBudgetPlanner.getTargetAmount()).isEqualTo(UPDATED_TARGET_AMOUNT);
        assertThat(testBudgetPlanner.getForecastIncome()).isEqualTo(UPDATED_FORECAST_INCOME);
    }

    @Test
    @Transactional
    void putNonExistingBudgetPlanner() throws Exception {
        int databaseSizeBeforeUpdate = budgetPlannerRepository.findAll().size();
        budgetPlanner.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBudgetPlannerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, budgetPlanner.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(budgetPlanner))
            )
            .andExpect(status().isBadRequest());

        // Validate the BudgetPlanner in the database
        List<BudgetPlanner> budgetPlannerList = budgetPlannerRepository.findAll();
        assertThat(budgetPlannerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchBudgetPlanner() throws Exception {
        int databaseSizeBeforeUpdate = budgetPlannerRepository.findAll().size();
        budgetPlanner.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBudgetPlannerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(budgetPlanner))
            )
            .andExpect(status().isBadRequest());

        // Validate the BudgetPlanner in the database
        List<BudgetPlanner> budgetPlannerList = budgetPlannerRepository.findAll();
        assertThat(budgetPlannerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamBudgetPlanner() throws Exception {
        int databaseSizeBeforeUpdate = budgetPlannerRepository.findAll().size();
        budgetPlanner.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBudgetPlannerMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(budgetPlanner)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the BudgetPlanner in the database
        List<BudgetPlanner> budgetPlannerList = budgetPlannerRepository.findAll();
        assertThat(budgetPlannerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateBudgetPlannerWithPatch() throws Exception {
        // Initialize the database
        budgetPlannerRepository.saveAndFlush(budgetPlanner);

        int databaseSizeBeforeUpdate = budgetPlannerRepository.findAll().size();

        // Update the budgetPlanner using partial update
        BudgetPlanner partialUpdatedBudgetPlanner = new BudgetPlanner();
        partialUpdatedBudgetPlanner.setId(budgetPlanner.getId());

        partialUpdatedBudgetPlanner
            .charityName(UPDATED_CHARITY_NAME)
            .totalBalance(UPDATED_TOTAL_BALANCE)
            .forecastIncome(UPDATED_FORECAST_INCOME);

        restBudgetPlannerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBudgetPlanner.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBudgetPlanner))
            )
            .andExpect(status().isOk());

        // Validate the BudgetPlanner in the database
        List<BudgetPlanner> budgetPlannerList = budgetPlannerRepository.findAll();
        assertThat(budgetPlannerList).hasSize(databaseSizeBeforeUpdate);
        BudgetPlanner testBudgetPlanner = budgetPlannerList.get(budgetPlannerList.size() - 1);
        assertThat(testBudgetPlanner.getCharityName()).isEqualTo(UPDATED_CHARITY_NAME);
        assertThat(testBudgetPlanner.getTotalBalance()).isEqualTo(UPDATED_TOTAL_BALANCE);
        assertThat(testBudgetPlanner.getUpcomingEvents()).isEqualTo(DEFAULT_UPCOMING_EVENTS);
        assertThat(testBudgetPlanner.getTargetAmount()).isEqualTo(DEFAULT_TARGET_AMOUNT);
        assertThat(testBudgetPlanner.getForecastIncome()).isEqualTo(UPDATED_FORECAST_INCOME);
    }

    @Test
    @Transactional
    void fullUpdateBudgetPlannerWithPatch() throws Exception {
        // Initialize the database
        budgetPlannerRepository.saveAndFlush(budgetPlanner);

        int databaseSizeBeforeUpdate = budgetPlannerRepository.findAll().size();

        // Update the budgetPlanner using partial update
        BudgetPlanner partialUpdatedBudgetPlanner = new BudgetPlanner();
        partialUpdatedBudgetPlanner.setId(budgetPlanner.getId());

        partialUpdatedBudgetPlanner
            .charityName(UPDATED_CHARITY_NAME)
            .totalBalance(UPDATED_TOTAL_BALANCE)
            .upcomingEvents(UPDATED_UPCOMING_EVENTS)
            .targetAmount(UPDATED_TARGET_AMOUNT)
            .forecastIncome(UPDATED_FORECAST_INCOME);

        restBudgetPlannerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBudgetPlanner.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBudgetPlanner))
            )
            .andExpect(status().isOk());

        // Validate the BudgetPlanner in the database
        List<BudgetPlanner> budgetPlannerList = budgetPlannerRepository.findAll();
        assertThat(budgetPlannerList).hasSize(databaseSizeBeforeUpdate);
        BudgetPlanner testBudgetPlanner = budgetPlannerList.get(budgetPlannerList.size() - 1);
        assertThat(testBudgetPlanner.getCharityName()).isEqualTo(UPDATED_CHARITY_NAME);
        assertThat(testBudgetPlanner.getTotalBalance()).isEqualTo(UPDATED_TOTAL_BALANCE);
        assertThat(testBudgetPlanner.getUpcomingEvents()).isEqualTo(UPDATED_UPCOMING_EVENTS);
        assertThat(testBudgetPlanner.getTargetAmount()).isEqualTo(UPDATED_TARGET_AMOUNT);
        assertThat(testBudgetPlanner.getForecastIncome()).isEqualTo(UPDATED_FORECAST_INCOME);
    }

    @Test
    @Transactional
    void patchNonExistingBudgetPlanner() throws Exception {
        int databaseSizeBeforeUpdate = budgetPlannerRepository.findAll().size();
        budgetPlanner.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBudgetPlannerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, budgetPlanner.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(budgetPlanner))
            )
            .andExpect(status().isBadRequest());

        // Validate the BudgetPlanner in the database
        List<BudgetPlanner> budgetPlannerList = budgetPlannerRepository.findAll();
        assertThat(budgetPlannerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchBudgetPlanner() throws Exception {
        int databaseSizeBeforeUpdate = budgetPlannerRepository.findAll().size();
        budgetPlanner.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBudgetPlannerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(budgetPlanner))
            )
            .andExpect(status().isBadRequest());

        // Validate the BudgetPlanner in the database
        List<BudgetPlanner> budgetPlannerList = budgetPlannerRepository.findAll();
        assertThat(budgetPlannerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamBudgetPlanner() throws Exception {
        int databaseSizeBeforeUpdate = budgetPlannerRepository.findAll().size();
        budgetPlanner.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBudgetPlannerMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(budgetPlanner))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the BudgetPlanner in the database
        List<BudgetPlanner> budgetPlannerList = budgetPlannerRepository.findAll();
        assertThat(budgetPlannerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteBudgetPlanner() throws Exception {
        // Initialize the database
        budgetPlannerRepository.saveAndFlush(budgetPlanner);

        int databaseSizeBeforeDelete = budgetPlannerRepository.findAll().size();

        // Delete the budgetPlanner
        restBudgetPlannerMockMvc
            .perform(delete(ENTITY_API_URL_ID, budgetPlanner.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<BudgetPlanner> budgetPlannerList = budgetPlannerRepository.findAll();
        assertThat(budgetPlannerList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

package team.bham.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import team.bham.domain.BudgetPlanner;
import team.bham.repository.BudgetPlannerRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.BudgetPlanner}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class BudgetPlannerResource {

    private final Logger log = LoggerFactory.getLogger(BudgetPlannerResource.class);

    private static final String ENTITY_NAME = "budgetPlanner";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BudgetPlannerRepository budgetPlannerRepository;

    public BudgetPlannerResource(BudgetPlannerRepository budgetPlannerRepository) {
        this.budgetPlannerRepository = budgetPlannerRepository;
    }

    /**
     * {@code POST  /budget-planners} : Create a new budgetPlanner.
     *
     * @param budgetPlanner the budgetPlanner to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new budgetPlanner, or with status {@code 400 (Bad Request)} if the budgetPlanner has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/budget-planners")
    public ResponseEntity<BudgetPlanner> createBudgetPlanner(@RequestBody BudgetPlanner budgetPlanner) throws URISyntaxException {
        log.debug("REST request to save BudgetPlanner : {}", budgetPlanner);
        if (budgetPlanner.getId() != null) {
            throw new BadRequestAlertException("A new budgetPlanner cannot already have an ID", ENTITY_NAME, "idexists");
        }
        BudgetPlanner result = budgetPlannerRepository.save(budgetPlanner);
        return ResponseEntity
            .created(new URI("/api/budget-planners/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /budget-planners/:id} : Updates an existing budgetPlanner.
     *
     * @param id the id of the budgetPlanner to save.
     * @param budgetPlanner the budgetPlanner to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated budgetPlanner,
     * or with status {@code 400 (Bad Request)} if the budgetPlanner is not valid,
     * or with status {@code 500 (Internal Server Error)} if the budgetPlanner couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/budget-planners/{id}")
    public ResponseEntity<BudgetPlanner> updateBudgetPlanner(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody BudgetPlanner budgetPlanner
    ) throws URISyntaxException {
        log.debug("REST request to update BudgetPlanner : {}, {}", id, budgetPlanner);
        if (budgetPlanner.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, budgetPlanner.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!budgetPlannerRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        BudgetPlanner result = budgetPlannerRepository.save(budgetPlanner);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, budgetPlanner.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /budget-planners/:id} : Partial updates given fields of an existing budgetPlanner, field will ignore if it is null
     *
     * @param id the id of the budgetPlanner to save.
     * @param budgetPlanner the budgetPlanner to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated budgetPlanner,
     * or with status {@code 400 (Bad Request)} if the budgetPlanner is not valid,
     * or with status {@code 404 (Not Found)} if the budgetPlanner is not found,
     * or with status {@code 500 (Internal Server Error)} if the budgetPlanner couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/budget-planners/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<BudgetPlanner> partialUpdateBudgetPlanner(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody BudgetPlanner budgetPlanner
    ) throws URISyntaxException {
        log.debug("REST request to partial update BudgetPlanner partially : {}, {}", id, budgetPlanner);
        if (budgetPlanner.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, budgetPlanner.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!budgetPlannerRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<BudgetPlanner> result = budgetPlannerRepository
            .findById(budgetPlanner.getId())
            .map(existingBudgetPlanner -> {
                if (budgetPlanner.getCharityName() != null) {
                    existingBudgetPlanner.setCharityName(budgetPlanner.getCharityName());
                }
                if (budgetPlanner.getTotalBalance() != null) {
                    existingBudgetPlanner.setTotalBalance(budgetPlanner.getTotalBalance());
                }
                if (budgetPlanner.getUpcomingEvents() != null) {
                    existingBudgetPlanner.setUpcomingEvents(budgetPlanner.getUpcomingEvents());
                }
                if (budgetPlanner.getTargetAmount() != null) {
                    existingBudgetPlanner.setTargetAmount(budgetPlanner.getTargetAmount());
                }
                if (budgetPlanner.getForecastIncome() != null) {
                    existingBudgetPlanner.setForecastIncome(budgetPlanner.getForecastIncome());
                }

                return existingBudgetPlanner;
            })
            .map(budgetPlannerRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, budgetPlanner.getId().toString())
        );
    }

    /**
     * {@code GET  /budget-planners} : get all the budgetPlanners.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of budgetPlanners in body.
     */
    @GetMapping("/budget-planners")
    public List<BudgetPlanner> getAllBudgetPlanners(@RequestParam(required = false) String filter) {
        if ("charityadmin-is-null".equals(filter)) {
            log.debug("REST request to get all BudgetPlanners where charityAdmin is null");
            return StreamSupport
                .stream(budgetPlannerRepository.findAll().spliterator(), false)
                .filter(budgetPlanner -> budgetPlanner.getCharityAdmin() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all BudgetPlanners");
        return budgetPlannerRepository.findAll();
    }

    /**
     * {@code GET  /budget-planners/:id} : get the "id" budgetPlanner.
     *
     * @param id the id of the budgetPlanner to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the budgetPlanner, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/budget-planners/{id}")
    public ResponseEntity<BudgetPlanner> getBudgetPlanner(@PathVariable Long id) {
        log.debug("REST request to get BudgetPlanner : {}", id);
        Optional<BudgetPlanner> budgetPlanner = budgetPlannerRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(budgetPlanner);
    }

    /**
     * {@code DELETE  /budget-planners/:id} : delete the "id" budgetPlanner.
     *
     * @param id the id of the budgetPlanner to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/budget-planners/{id}")
    public ResponseEntity<Void> deleteBudgetPlanner(@PathVariable Long id) {
        log.debug("REST request to delete BudgetPlanner : {}", id);
        budgetPlannerRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}

package team.bham.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import team.bham.domain.ApprovedVolunteers;
import team.bham.repository.ApprovedVolunteersRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.ApprovedVolunteers}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ApprovedVolunteersResource {

    private final Logger log = LoggerFactory.getLogger(ApprovedVolunteersResource.class);

    private static final String ENTITY_NAME = "approvedVolunteers";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ApprovedVolunteersRepository approvedVolunteersRepository;

    public ApprovedVolunteersResource(ApprovedVolunteersRepository approvedVolunteersRepository) {
        this.approvedVolunteersRepository = approvedVolunteersRepository;
    }

    /**
     * {@code POST  /approved-volunteers} : Create a new approvedVolunteers.
     *
     * @param approvedVolunteers the approvedVolunteers to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new approvedVolunteers, or with status {@code 400 (Bad Request)} if the approvedVolunteers has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/approved-volunteers")
    public ResponseEntity<ApprovedVolunteers> createApprovedVolunteers(@RequestBody ApprovedVolunteers approvedVolunteers)
        throws URISyntaxException {
        log.debug("REST request to save ApprovedVolunteers : {}", approvedVolunteers);
        if (approvedVolunteers.getId() != null) {
            throw new BadRequestAlertException("A new approvedVolunteers cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ApprovedVolunteers result = approvedVolunteersRepository.save(approvedVolunteers);
        return ResponseEntity
            .created(new URI("/api/approved-volunteers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /approved-volunteers/:id} : Updates an existing approvedVolunteers.
     *
     * @param id the id of the approvedVolunteers to save.
     * @param approvedVolunteers the approvedVolunteers to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated approvedVolunteers,
     * or with status {@code 400 (Bad Request)} if the approvedVolunteers is not valid,
     * or with status {@code 500 (Internal Server Error)} if the approvedVolunteers couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/approved-volunteers/{id}")
    public ResponseEntity<ApprovedVolunteers> updateApprovedVolunteers(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ApprovedVolunteers approvedVolunteers
    ) throws URISyntaxException {
        log.debug("REST request to update ApprovedVolunteers : {}, {}", id, approvedVolunteers);
        if (approvedVolunteers.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, approvedVolunteers.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!approvedVolunteersRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ApprovedVolunteers result = approvedVolunteersRepository.save(approvedVolunteers);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, approvedVolunteers.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /approved-volunteers/:id} : Partial updates given fields of an existing approvedVolunteers, field will ignore if it is null
     *
     * @param id the id of the approvedVolunteers to save.
     * @param approvedVolunteers the approvedVolunteers to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated approvedVolunteers,
     * or with status {@code 400 (Bad Request)} if the approvedVolunteers is not valid,
     * or with status {@code 404 (Not Found)} if the approvedVolunteers is not found,
     * or with status {@code 500 (Internal Server Error)} if the approvedVolunteers couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/approved-volunteers/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ApprovedVolunteers> partialUpdateApprovedVolunteers(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ApprovedVolunteers approvedVolunteers
    ) throws URISyntaxException {
        log.debug("REST request to partial update ApprovedVolunteers partially : {}, {}", id, approvedVolunteers);
        if (approvedVolunteers.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, approvedVolunteers.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!approvedVolunteersRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ApprovedVolunteers> result = approvedVolunteersRepository
            .findById(approvedVolunteers.getId())
            .map(existingApprovedVolunteers -> {
                if (approvedVolunteers.getVolunteerStatus() != null) {
                    existingApprovedVolunteers.setVolunteerStatus(approvedVolunteers.getVolunteerStatus());
                }
                if (approvedVolunteers.getVolunteerHoursCompletedInCharity() != null) {
                    existingApprovedVolunteers.setVolunteerHoursCompletedInCharity(
                        approvedVolunteers.getVolunteerHoursCompletedInCharity()
                    );
                }
                if (approvedVolunteers.getCurrentEventVolunteeringIn() != null) {
                    existingApprovedVolunteers.setCurrentEventVolunteeringIn(approvedVolunteers.getCurrentEventVolunteeringIn());
                }

                return existingApprovedVolunteers;
            })
            .map(approvedVolunteersRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, approvedVolunteers.getId().toString())
        );
    }

    /**
     * {@code GET  /approved-volunteers} : get all the approvedVolunteers.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of approvedVolunteers in body.
     */
    @GetMapping("/approved-volunteers")
    public List<ApprovedVolunteers> getAllApprovedVolunteers(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all ApprovedVolunteers");
        if (eagerload) {
            return approvedVolunteersRepository.findAllWithEagerRelationships();
        } else {
            return approvedVolunteersRepository.findAll();
        }
    }

    /**
     * {@code GET  /approved-volunteers/:id} : get the "id" approvedVolunteers.
     *
     * @param id the id of the approvedVolunteers to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the approvedVolunteers, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/approved-volunteers/{id}")
    public ResponseEntity<ApprovedVolunteers> getApprovedVolunteers(@PathVariable Long id) {
        log.debug("REST request to get ApprovedVolunteers : {}", id);
        Optional<ApprovedVolunteers> approvedVolunteers = approvedVolunteersRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(approvedVolunteers);
    }

    /**
     * {@code DELETE  /approved-volunteers/:id} : delete the "id" approvedVolunteers.
     *
     * @param id the id of the approvedVolunteers to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/approved-volunteers/{id}")
    public ResponseEntity<Void> deleteApprovedVolunteers(@PathVariable Long id) {
        log.debug("REST request to delete ApprovedVolunteers : {}", id);
        approvedVolunteersRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}

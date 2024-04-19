package team.bham.web.rest;

import java.lang.reflect.Array;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.*;
import javax.persistence.criteria.CriteriaBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import team.bham.domain.Vacancies;
import team.bham.domain.VolunteerApplications;
import team.bham.repository.VolunteerApplicationsRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.VolunteerApplications}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class VolunteerApplicationsResource {

    private final Logger log = LoggerFactory.getLogger(VolunteerApplicationsResource.class);

    private static final String ENTITY_NAME = "volunteerApplications";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final VolunteerApplicationsRepository volunteerApplicationsRepository;

    public VolunteerApplicationsResource(VolunteerApplicationsRepository volunteerApplicationsRepository) {
        this.volunteerApplicationsRepository = volunteerApplicationsRepository;
    }

    /**
     * {@code POST  /volunteer-applications} : Create a new volunteerApplications.
     *
     * @param volunteerApplications the volunteerApplications to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new volunteerApplications, or with status {@code 400 (Bad Request)} if the volunteerApplications has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/volunteer-applications")
    public ResponseEntity<VolunteerApplications> createVolunteerApplications(@RequestBody VolunteerApplications volunteerApplications)
        throws URISyntaxException {
        log.debug("REST request to save VolunteerApplications : {}", volunteerApplications);
        if (volunteerApplications.getId() != null) {
            throw new BadRequestAlertException("A new volunteerApplications cannot already have an ID", ENTITY_NAME, "idexists");
        }
        VolunteerApplications result = volunteerApplicationsRepository.save(volunteerApplications);
        return ResponseEntity
            .created(new URI("/api/volunteer-applications/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /volunteer-applications/:id} : Updates an existing volunteerApplications.
     *
     * @param id the id of the volunteerApplications to save.
     * @param volunteerApplications the volunteerApplications to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated volunteerApplications,
     * or with status {@code 400 (Bad Request)} if the volunteerApplications is not valid,
     * or with status {@code 500 (Internal Server Error)} if the volunteerApplications couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/volunteer-applications/{id}")
    public ResponseEntity<VolunteerApplications> updateVolunteerApplications(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody VolunteerApplications volunteerApplications
    ) throws URISyntaxException {
        log.debug("REST request to update VolunteerApplications : {}, {}", id, volunteerApplications);
        if (volunteerApplications.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, volunteerApplications.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!volunteerApplicationsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        VolunteerApplications result = volunteerApplicationsRepository.save(volunteerApplications);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, volunteerApplications.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /volunteer-applications/:id} : Partial updates given fields of an existing volunteerApplications, field will ignore if it is null
     *
     * @param id the id of the volunteerApplications to save.
     * @param volunteerApplications the volunteerApplications to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated volunteerApplications,
     * or with status {@code 400 (Bad Request)} if the volunteerApplications is not valid,
     * or with status {@code 404 (Not Found)} if the volunteerApplications is not found,
     * or with status {@code 500 (Internal Server Error)} if the volunteerApplications couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/volunteer-applications/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<VolunteerApplications> partialUpdateVolunteerApplications(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody VolunteerApplications volunteerApplications
    ) throws URISyntaxException {
        log.debug("REST request to partial update VolunteerApplications partially : {}, {}", id, volunteerApplications);
        if (volunteerApplications.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, volunteerApplications.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!volunteerApplicationsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<VolunteerApplications> result = volunteerApplicationsRepository
            .findById(volunteerApplications.getId())
            .map(existingVolunteerApplications -> {
                if (volunteerApplications.getTimeStamp() != null) {
                    existingVolunteerApplications.setTimeStamp(volunteerApplications.getTimeStamp());
                }
                if (volunteerApplications.getVolunteerStatus() != null) {
                    existingVolunteerApplications.setVolunteerStatus(volunteerApplications.getVolunteerStatus());
                }

                return existingVolunteerApplications;
            })
            .map(volunteerApplicationsRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, volunteerApplications.getId().toString())
        );
    }

    /**
     * {@code GET  /volunteer-applications} : get all the volunteerApplications.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of volunteerApplications in body.
     */
    @GetMapping("/volunteer-applications")
    public List<VolunteerApplications> getAllVolunteerApplications() {
        log.debug("REST request to get all VolunteerApplications");
        return volunteerApplicationsRepository.findAll();
    }

    @GetMapping("/max-volunteer-applications")
    public List<Integer> getMaxNumberOfApplications() {
        List<Integer> list = new ArrayList<>();
        if (this.volunteerApplicationsRepository.findMaxNumberOfApplications().isEmpty()) {
            list.add(0);
        } else {
            list.add(this.volunteerApplicationsRepository.findMaxNumberOfApplications().get(0));
        }
        if ((this.volunteerApplicationsRepository.findMaxHoursOfVolunteering().isEmpty())) {
            list.add(0);
        } else {
            list.add(this.volunteerApplicationsRepository.findMaxHoursOfVolunteering().get(0));
        }
        return list;
    }

    /**
     * {@code GET  /volunteer-applications/:id} : get the "id" volunteerApplications.
     *
     * @param id the id of the volunteerApplications to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the volunteerApplications, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/volunteer-applications/{id}")
    public ResponseEntity<VolunteerApplications> getVolunteerApplications(@PathVariable Long id) {
        log.debug("REST request to get VolunteerApplications : {}", id);
        Optional<VolunteerApplications> volunteerApplications = volunteerApplicationsRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(volunteerApplications);
    }

    @GetMapping("/check-volunteer-application/{hubUserId}/{vacancyId}")
    public Optional<Long> getVolunteerApplicationsFromHubUser(@PathVariable Long hubUserId, @PathVariable Long vacancyId) {
        log.debug("REST request to get Volunteer Applications made by Charity Hub User: {}");
        Optional<Long> volunteerApplications = volunteerApplicationsRepository.findByCharityHubUser(hubUserId, vacancyId);
        return volunteerApplications;
    }

    @GetMapping("/volunteer-applications/by-charity-admin/{charityAdminId}")
    public List<VolunteerApplications> getByCharityAdminId(@PathVariable Long charityAdminId) {
        List<VolunteerApplications> applications = volunteerApplicationsRepository.findByCharityAdminId(charityAdminId);
        return applications;
    }

    /**
     * {@code DELETE  /volunteer-applications/:id} : delete the "id" volunteerApplications.
     *
     * @param id the id of the volunteerApplications to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/volunteer-applications/{id}")
    public ResponseEntity<Void> deleteVolunteerApplications(@PathVariable Long id) {
        log.debug("REST request to delete VolunteerApplications : {}", id);
        volunteerApplicationsRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}

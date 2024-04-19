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
import team.bham.domain.Vacancies;
import team.bham.repository.VacanciesRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.Vacancies}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class VacanciesResource {

    private final Logger log = LoggerFactory.getLogger(VacanciesResource.class);

    private static final String ENTITY_NAME = "vacancies";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final VacanciesRepository vacanciesRepository;

    public VacanciesResource(VacanciesRepository vacanciesRepository) {
        this.vacanciesRepository = vacanciesRepository;
    }

    /**
     * {@code POST  /vacancies} : Create a new vacancies.
     *
     * @param vacancies the vacancies to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new vacancies, or with status {@code 400 (Bad Request)} if the vacancies has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/vacancies")
    public ResponseEntity<Vacancies> createVacancies(@RequestBody Vacancies vacancies) throws URISyntaxException {
        log.debug("REST request to save Vacancies : {}", vacancies);
        if (vacancies.getId() != null) {
            throw new BadRequestAlertException("A new vacancies cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Vacancies result = vacanciesRepository.save(vacancies);
        return ResponseEntity
            .created(new URI("/api/vacancies/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /vacancies/:id} : Updates an existing vacancies.
     *
     * @param id the id of the vacancies to save.
     * @param vacancies the vacancies to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated vacancies,
     * or with status {@code 400 (Bad Request)} if the vacancies is not valid,
     * or with status {@code 500 (Internal Server Error)} if the vacancies couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/vacancies/{id}")
    public ResponseEntity<Vacancies> updateVacancies(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Vacancies vacancies
    ) throws URISyntaxException {
        log.debug("REST request to update Vacancies : {}, {}", id, vacancies);
        if (vacancies.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, vacancies.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!vacanciesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Vacancies result = vacanciesRepository.save(vacancies);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, vacancies.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /vacancies/:id} : Partial updates given fields of an existing vacancies, field will ignore if it is null
     *
     * @param id the id of the vacancies to save.
     * @param vacancies the vacancies to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated vacancies,
     * or with status {@code 400 (Bad Request)} if the vacancies is not valid,
     * or with status {@code 404 (Not Found)} if the vacancies is not found,
     * or with status {@code 500 (Internal Server Error)} if the vacancies couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/vacancies/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Vacancies> partialUpdateVacancies(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Vacancies vacancies
    ) throws URISyntaxException {
        log.debug("REST request to partial update Vacancies partially : {}, {}", id, vacancies);
        if (vacancies.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, vacancies.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!vacanciesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Vacancies> result = vacanciesRepository
            .findById(vacancies.getId())
            .map(existingVacancies -> {
                if (vacancies.getVacancyTitle() != null) {
                    existingVacancies.setVacancyTitle(vacancies.getVacancyTitle());
                }
                if (vacancies.getVacancyDescription() != null) {
                    existingVacancies.setVacancyDescription(vacancies.getVacancyDescription());
                }
                if (vacancies.getVacancyStartDate() != null) {
                    existingVacancies.setVacancyStartDate(vacancies.getVacancyStartDate());
                }
                if (vacancies.getVacancyLogo() != null) {
                    existingVacancies.setVacancyLogo(vacancies.getVacancyLogo());
                }
                if (vacancies.getVacancyLogoContentType() != null) {
                    existingVacancies.setVacancyLogoContentType(vacancies.getVacancyLogoContentType());
                }
                if (vacancies.getVacancyDuration() != null) {
                    existingVacancies.setVacancyDuration(vacancies.getVacancyDuration());
                }
                if (vacancies.getVacancyLocation() != null) {
                    existingVacancies.setVacancyLocation(vacancies.getVacancyLocation());
                }

                return existingVacancies;
            })
            .map(vacanciesRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, vacancies.getId().toString())
        );
    }

    /**
     * {@code GET  /vacancies} : get all the vacancies.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of vacancies in body.
     */
    @GetMapping("/vacancies")
    public List<Vacancies> getAllVacancies(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Vacancies");
        if (eagerload) {
            return vacanciesRepository.findAllWithEagerRelationships();
        } else {
            return vacanciesRepository.findAll();
        }
    }

    /**
     * {@code GET  /vacancies/:id} : get the "id" vacancies.
     *
     * @param id the id of the vacancies to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the vacancies, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/vacancies/{id}")
    public ResponseEntity<Vacancies> getVacancies(@PathVariable Long id) {
        log.debug("REST request to get Vacancies : {}", id);
        Optional<Vacancies> vacancies = vacanciesRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(vacancies);
    }

    @GetMapping("/vacanciesForUser/{id}")
    public List<Vacancies> getVacanciesForUser(@PathVariable Long id) {
        List<Vacancies> vacancies = vacanciesRepository.findVacanciesFromCharityHubUser(id);
        if (vacancies.isEmpty()) {
            return vacanciesRepository.findAll();
        }
        return vacanciesRepository.getSimilarVacancies(vacancies);
    }

    @GetMapping("/vacanciesByCharity/{charityId}")
    public ResponseEntity<Vacancies> getVacanciesByCharityID(@PathVariable Long charityId) {
        log.debug("REST request to get Vacancies : {}", charityId);
        Optional<Vacancies> vacancies = vacanciesRepository.charityVacancies(charityId);
        return ResponseUtil.wrapOrNotFound(vacancies);
    }

    @GetMapping("/vacancies-volunteer-applications/{id}")
    public List<Vacancies> getVolunteerApplicationsFromCharityHubUser(@PathVariable Long id) {
        return vacanciesRepository.findVacanciesFromCharityHubUser(id);
    }

    /**
     * {@code DELETE  /vacancies/:id} : delete the "id" vacancies.
     *
     * @param id the id of the vacancies to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/vacancies/{id}")
    public ResponseEntity<Void> deleteVacancies(@PathVariable Long id) {
        log.debug("REST request to delete Vacancies : {}", id);
        vacanciesRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}

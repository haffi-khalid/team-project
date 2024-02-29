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
import team.bham.domain.Charity;
import team.bham.repository.CharityRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.Charity}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CharityResource {

    private final Logger log = LoggerFactory.getLogger(CharityResource.class);

    private static final String ENTITY_NAME = "charity";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CharityRepository charityRepository;

    public CharityResource(CharityRepository charityRepository) {
        this.charityRepository = charityRepository;
    }

    /**
     * {@code POST  /charities} : Create a new charity.
     *
     * @param charity the charity to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new charity, or with status {@code 400 (Bad Request)} if the charity has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/charities")
    public ResponseEntity<Charity> createCharity(@RequestBody Charity charity) throws URISyntaxException {
        log.debug("REST request to save Charity : {}", charity);
        if (charity.getId() != null) {
            throw new BadRequestAlertException("A new charity cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Charity result = charityRepository.save(charity);
        return ResponseEntity
            .created(new URI("/api/charities/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /charities/:id} : Updates an existing charity.
     *
     * @param id the id of the charity to save.
     * @param charity the charity to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated charity,
     * or with status {@code 400 (Bad Request)} if the charity is not valid,
     * or with status {@code 500 (Internal Server Error)} if the charity couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/charities/{id}")
    public ResponseEntity<Charity> updateCharity(@PathVariable(value = "id", required = false) final Long id, @RequestBody Charity charity)
        throws URISyntaxException {
        log.debug("REST request to update Charity : {}, {}", id, charity);
        if (charity.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, charity.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!charityRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Charity result = charityRepository.save(charity);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, charity.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /charities/:id} : Partial updates given fields of an existing charity, field will ignore if it is null
     *
     * @param id the id of the charity to save.
     * @param charity the charity to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated charity,
     * or with status {@code 400 (Bad Request)} if the charity is not valid,
     * or with status {@code 404 (Not Found)} if the charity is not found,
     * or with status {@code 500 (Internal Server Error)} if the charity couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/charities/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Charity> partialUpdateCharity(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Charity charity
    ) throws URISyntaxException {
        log.debug("REST request to partial update Charity partially : {}, {}", id, charity);
        if (charity.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, charity.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!charityRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Charity> result = charityRepository
            .findById(charity.getId())
            .map(existingCharity -> {
                if (charity.getName() != null) {
                    existingCharity.setName(charity.getName());
                }

                return existingCharity;
            })
            .map(charityRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, charity.getId().toString())
        );
    }

    /**
     * {@code GET  /charities} : get all the charities.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of charities in body.
     */
    @GetMapping("/charities")
    public List<Charity> getAllCharities() {
        log.debug("REST request to get all Charities");
        return charityRepository.findAll();
    }

    /**
     * {@code GET  /charities/:id} : get the "id" charity.
     *
     * @param id the id of the charity to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the charity, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/charities/{id}")
    public ResponseEntity<Charity> getCharity(@PathVariable Long id) {
        log.debug("REST request to get Charity : {}", id);
        Optional<Charity> charity = charityRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(charity);
    }

    /**
     * {@code DELETE  /charities/:id} : delete the "id" charity.
     *
     * @param id the id of the charity to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/charities/{id}")
    public ResponseEntity<Void> deleteCharity(@PathVariable Long id) {
        log.debug("REST request to delete Charity : {}", id);
        charityRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}

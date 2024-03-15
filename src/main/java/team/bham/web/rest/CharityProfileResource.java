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
import team.bham.domain.CharityProfile;
import team.bham.repository.CharityProfileRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.CharityProfile}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CharityProfileResource {

    private final Logger log = LoggerFactory.getLogger(CharityProfileResource.class);

    private static final String ENTITY_NAME = "charityProfile";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CharityProfileRepository charityProfileRepository;

    public CharityProfileResource(CharityProfileRepository charityProfileRepository) {
        this.charityProfileRepository = charityProfileRepository;
    }

    /**
     * {@code POST  /charity-profiles} : Create a new charityProfile.
     *
     * @param charityProfile the charityProfile to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new charityProfile, or with status {@code 400 (Bad Request)} if the charityProfile has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/charity-profiles")
    public ResponseEntity<CharityProfile> createCharityProfile(@RequestBody CharityProfile charityProfile) throws URISyntaxException {
        log.debug("REST request to save CharityProfile : {}", charityProfile);
        if (charityProfile.getId() != null) {
            throw new BadRequestAlertException("A new charityProfile cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CharityProfile result = charityProfileRepository.save(charityProfile);
        return ResponseEntity
            .created(new URI("/api/charity-profiles/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /charity-profiles/:id} : Updates an existing charityProfile.
     *
     * @param id the id of the charityProfile to save.
     * @param charityProfile the charityProfile to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated charityProfile,
     * or with status {@code 400 (Bad Request)} if the charityProfile is not valid,
     * or with status {@code 500 (Internal Server Error)} if the charityProfile couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/charity-profiles/{id}")
    public ResponseEntity<CharityProfile> updateCharityProfile(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CharityProfile charityProfile
    ) throws URISyntaxException {
        log.debug("REST request to update CharityProfile : {}, {}", id, charityProfile);
        if (charityProfile.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, charityProfile.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!charityProfileRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        CharityProfile result = charityProfileRepository.save(charityProfile);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, charityProfile.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /charity-profiles/:id} : Partial updates given fields of an existing charityProfile, field will ignore if it is null
     *
     * @param id the id of the charityProfile to save.
     * @param charityProfile the charityProfile to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated charityProfile,
     * or with status {@code 400 (Bad Request)} if the charityProfile is not valid,
     * or with status {@code 404 (Not Found)} if the charityProfile is not found,
     * or with status {@code 500 (Internal Server Error)} if the charityProfile couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/charity-profiles/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<CharityProfile> partialUpdateCharityProfile(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CharityProfile charityProfile
    ) throws URISyntaxException {
        log.debug("REST request to partial update CharityProfile partially : {}, {}", id, charityProfile);
        if (charityProfile.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, charityProfile.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!charityProfileRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<CharityProfile> result = charityProfileRepository
            .findById(charityProfile.getId())
            .map(existingCharityProfile -> {
                if (charityProfile.getCharityName() != null) {
                    existingCharityProfile.setCharityName(charityProfile.getCharityName());
                }
                if (charityProfile.getPurpose() != null) {
                    existingCharityProfile.setPurpose(charityProfile.getPurpose());
                }
                if (charityProfile.getAim() != null) {
                    existingCharityProfile.setAim(charityProfile.getAim());
                }
                if (charityProfile.getEmailAddress() != null) {
                    existingCharityProfile.setEmailAddress(charityProfile.getEmailAddress());
                }
                if (charityProfile.getLogo() != null) {
                    existingCharityProfile.setLogo(charityProfile.getLogo());
                }
                if (charityProfile.getLogoContentType() != null) {
                    existingCharityProfile.setLogoContentType(charityProfile.getLogoContentType());
                }
                if (charityProfile.getPictures() != null) {
                    existingCharityProfile.setPictures(charityProfile.getPictures());
                }
                if (charityProfile.getPicturesContentType() != null) {
                    existingCharityProfile.setPicturesContentType(charityProfile.getPicturesContentType());
                }

                return existingCharityProfile;
            })
            .map(charityProfileRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, charityProfile.getId().toString())
        );
    }

    /**
     * {@code GET  /charity-profiles} : get all the charityProfiles.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of charityProfiles in body.
     */
    @GetMapping("/charity-profiles")
    public List<CharityProfile> getAllCharityProfiles() {
        log.debug("REST request to get all CharityProfiles");
        return charityProfileRepository.findAll();
    }

    @GetMapping("/charity-name")
    public List<String> getAllVacancyCharityName() {
        log.debug("REST request to get all Charity Names in Vacancy");
        return charityProfileRepository.findAllVacancyCharityName();
    }

    @GetMapping("/charityId/{name}")
    public Optional<Long> getVacancyCharityId(@PathVariable String name) {
        log.debug("REST request to get Id for a Charity Name");
        Optional<Long> charityID = charityProfileRepository.findCharityId(name);
        return charityID;
    }

    /**
     * {@code GET  /charity-profiles/:id} : get the "id" charityProfile.
     *
     * @param id the id of the charityProfile to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the charityProfile, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/charity-profiles/{id}")
    public ResponseEntity<CharityProfile> getCharityProfile(@PathVariable Long id) {
        log.debug("REST request to get CharityProfile : {}", id);
        Optional<CharityProfile> charityProfile = charityProfileRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(charityProfile);
    }

    /**
     * {@code DELETE  /charity-profiles/:id} : delete the "id" charityProfile.
     *
     * @param id the id of the charityProfile to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/charity-profiles/{id}")
    public ResponseEntity<Void> deleteCharityProfile(@PathVariable Long id) {
        log.debug("REST request to delete CharityProfile : {}", id);
        charityProfileRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}

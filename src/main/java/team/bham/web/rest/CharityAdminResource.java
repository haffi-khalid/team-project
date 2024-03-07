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
import team.bham.domain.CharityAdmin;
import team.bham.repository.CharityAdminRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.CharityAdmin}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CharityAdminResource {

    private final Logger log = LoggerFactory.getLogger(CharityAdminResource.class);

    private static final String ENTITY_NAME = "charityAdmin";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CharityAdminRepository charityAdminRepository;

    public CharityAdminResource(CharityAdminRepository charityAdminRepository) {
        this.charityAdminRepository = charityAdminRepository;
    }

    /**
     * {@code POST  /charity-admins} : Create a new charityAdmin.
     *
     * @param charityAdmin the charityAdmin to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new charityAdmin, or with status {@code 400 (Bad Request)} if the charityAdmin has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/charity-admins")
    public ResponseEntity<CharityAdmin> createCharityAdmin(@RequestBody CharityAdmin charityAdmin) throws URISyntaxException {
        log.debug("REST request to save CharityAdmin : {}", charityAdmin);
        if (charityAdmin.getId() != null) {
            throw new BadRequestAlertException("A new charityAdmin cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CharityAdmin result = charityAdminRepository.save(charityAdmin);
        return ResponseEntity
            .created(new URI("/api/charity-admins/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /charity-admins/:id} : Updates an existing charityAdmin.
     *
     * @param id the id of the charityAdmin to save.
     * @param charityAdmin the charityAdmin to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated charityAdmin,
     * or with status {@code 400 (Bad Request)} if the charityAdmin is not valid,
     * or with status {@code 500 (Internal Server Error)} if the charityAdmin couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/charity-admins/{id}")
    public ResponseEntity<CharityAdmin> updateCharityAdmin(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CharityAdmin charityAdmin
    ) throws URISyntaxException {
        log.debug("REST request to update CharityAdmin : {}, {}", id, charityAdmin);
        if (charityAdmin.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, charityAdmin.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!charityAdminRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        CharityAdmin result = charityAdminRepository.save(charityAdmin);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, charityAdmin.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /charity-admins/:id} : Partial updates given fields of an existing charityAdmin, field will ignore if it is null
     *
     * @param id the id of the charityAdmin to save.
     * @param charityAdmin the charityAdmin to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated charityAdmin,
     * or with status {@code 400 (Bad Request)} if the charityAdmin is not valid,
     * or with status {@code 404 (Not Found)} if the charityAdmin is not found,
     * or with status {@code 500 (Internal Server Error)} if the charityAdmin couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/charity-admins/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<CharityAdmin> partialUpdateCharityAdmin(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CharityAdmin charityAdmin
    ) throws URISyntaxException {
        log.debug("REST request to partial update CharityAdmin partially : {}, {}", id, charityAdmin);
        if (charityAdmin.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, charityAdmin.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!charityAdminRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<CharityAdmin> result = charityAdminRepository
            .findById(charityAdmin.getId())
            .map(existingCharityAdmin -> {
                if (charityAdmin.getIsCharityAdmin() != null) {
                    existingCharityAdmin.setIsCharityAdmin(charityAdmin.getIsCharityAdmin());
                }

                return existingCharityAdmin;
            })
            .map(charityAdminRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, charityAdmin.getId().toString())
        );
    }

    /**
     * {@code GET  /charity-admins} : get all the charityAdmins.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of charityAdmins in body.
     */
    @GetMapping("/charity-admins")
    public List<CharityAdmin> getAllCharityAdmins(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all CharityAdmins");
        if (eagerload) {
            return charityAdminRepository.findAllWithEagerRelationships();
        } else {
            return charityAdminRepository.findAll();
        }
    }

    /**
     * {@code GET  /charity-admins/:id} : get the "id" charityAdmin.
     *
     * @param id the id of the charityAdmin to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the charityAdmin, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/charity-admins/{id}")
    public ResponseEntity<CharityAdmin> getCharityAdmin(@PathVariable Long id) {
        log.debug("REST request to get CharityAdmin : {}", id);
        Optional<CharityAdmin> charityAdmin = charityAdminRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(charityAdmin);
    }

    /**
     * {@code DELETE  /charity-admins/:id} : delete the "id" charityAdmin.
     *
     * @param id the id of the charityAdmin to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/charity-admins/{id}")
    public ResponseEntity<Void> deleteCharityAdmin(@PathVariable Long id) {
        log.debug("REST request to delete CharityAdmin : {}", id);
        charityAdminRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}

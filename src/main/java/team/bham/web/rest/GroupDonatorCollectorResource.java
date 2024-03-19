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
import team.bham.domain.GroupDonatorCollector;
import team.bham.repository.GroupDonatorCollectorRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.GroupDonatorCollector}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class GroupDonatorCollectorResource {

    private final Logger log = LoggerFactory.getLogger(GroupDonatorCollectorResource.class);

    private static final String ENTITY_NAME = "groupDonatorCollector";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final GroupDonatorCollectorRepository groupDonatorCollectorRepository;

    public GroupDonatorCollectorResource(GroupDonatorCollectorRepository groupDonatorCollectorRepository) {
        this.groupDonatorCollectorRepository = groupDonatorCollectorRepository;
    }

    /**
     * {@code POST  /group-donator-collectors} : Create a new groupDonatorCollector.
     *
     * @param groupDonatorCollector the groupDonatorCollector to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new groupDonatorCollector, or with status {@code 400 (Bad Request)} if the groupDonatorCollector has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/group-donator-collectors")
    public ResponseEntity<GroupDonatorCollector> createGroupDonatorCollector(@RequestBody GroupDonatorCollector groupDonatorCollector)
        throws URISyntaxException {
        log.debug("REST request to save GroupDonatorCollector : {}", groupDonatorCollector);
        if (groupDonatorCollector.getId() != null) {
            throw new BadRequestAlertException("A new groupDonatorCollector cannot already have an ID", ENTITY_NAME, "idexists");
        }
        GroupDonatorCollector result = groupDonatorCollectorRepository.save(groupDonatorCollector);
        return ResponseEntity
            .created(new URI("/api/group-donator-collectors/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /group-donator-collectors/:id} : Updates an existing groupDonatorCollector.
     *
     * @param id the id of the groupDonatorCollector to save.
     * @param groupDonatorCollector the groupDonatorCollector to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated groupDonatorCollector,
     * or with status {@code 400 (Bad Request)} if the groupDonatorCollector is not valid,
     * or with status {@code 500 (Internal Server Error)} if the groupDonatorCollector couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/group-donator-collectors/{id}")
    public ResponseEntity<GroupDonatorCollector> updateGroupDonatorCollector(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody GroupDonatorCollector groupDonatorCollector
    ) throws URISyntaxException {
        log.debug("REST request to update GroupDonatorCollector : {}, {}", id, groupDonatorCollector);
        if (groupDonatorCollector.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, groupDonatorCollector.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!groupDonatorCollectorRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        GroupDonatorCollector result = groupDonatorCollectorRepository.save(groupDonatorCollector);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, groupDonatorCollector.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /group-donator-collectors/:id} : Partial updates given fields of an existing groupDonatorCollector, field will ignore if it is null
     *
     * @param id the id of the groupDonatorCollector to save.
     * @param groupDonatorCollector the groupDonatorCollector to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated groupDonatorCollector,
     * or with status {@code 400 (Bad Request)} if the groupDonatorCollector is not valid,
     * or with status {@code 404 (Not Found)} if the groupDonatorCollector is not found,
     * or with status {@code 500 (Internal Server Error)} if the groupDonatorCollector couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/group-donator-collectors/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<GroupDonatorCollector> partialUpdateGroupDonatorCollector(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody GroupDonatorCollector groupDonatorCollector
    ) throws URISyntaxException {
        log.debug("REST request to partial update GroupDonatorCollector partially : {}, {}", id, groupDonatorCollector);
        if (groupDonatorCollector.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, groupDonatorCollector.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!groupDonatorCollectorRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<GroupDonatorCollector> result = groupDonatorCollectorRepository
            .findById(groupDonatorCollector.getId())
            .map(existingGroupDonatorCollector -> {
                if (groupDonatorCollector.getDonatorName() != null) {
                    existingGroupDonatorCollector.setDonatorName(groupDonatorCollector.getDonatorName());
                }
                if (groupDonatorCollector.getDonationAmount() != null) {
                    existingGroupDonatorCollector.setDonationAmount(groupDonatorCollector.getDonationAmount());
                }

                return existingGroupDonatorCollector;
            })
            .map(groupDonatorCollectorRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, groupDonatorCollector.getId().toString())
        );
    }

    /**
     * {@code GET  /group-donator-collectors} : get all the groupDonatorCollectors.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of groupDonatorCollectors in body.
     */
    @GetMapping("/group-donator-collectors")
    public List<GroupDonatorCollector> getAllGroupDonatorCollectors() {
        log.debug("REST request to get all GroupDonatorCollectors");
        return groupDonatorCollectorRepository.findAll();
    }

    /**
     * {@code GET  /group-donator-collectors/:id} : get the "id" groupDonatorCollector.
     *
     * @param id the id of the groupDonatorCollector to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the groupDonatorCollector, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/group-donator-collectors/{id}")
    public ResponseEntity<GroupDonatorCollector> getGroupDonatorCollector(@PathVariable Long id) {
        log.debug("REST request to get GroupDonatorCollector : {}", id);
        Optional<GroupDonatorCollector> groupDonatorCollector = groupDonatorCollectorRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(groupDonatorCollector);
    }

    /**
     * {@code DELETE  /group-donator-collectors/:id} : delete the "id" groupDonatorCollector.
     *
     * @param id the id of the groupDonatorCollector to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/group-donator-collectors/{id}")
    public ResponseEntity<Void> deleteGroupDonatorCollector(@PathVariable Long id) {
        log.debug("REST request to delete GroupDonatorCollector : {}", id);
        groupDonatorCollectorRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}

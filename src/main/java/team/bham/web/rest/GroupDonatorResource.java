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
import team.bham.domain.GroupDonator;
import team.bham.repository.GroupDonatorRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.GroupDonator}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class GroupDonatorResource {

    private final Logger log = LoggerFactory.getLogger(GroupDonatorResource.class);

    private static final String ENTITY_NAME = "groupDonator";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final GroupDonatorRepository groupDonatorRepository;

    public GroupDonatorResource(GroupDonatorRepository groupDonatorRepository) {
        this.groupDonatorRepository = groupDonatorRepository;
    }

    /**
     * {@code POST  /group-donators} : Create a new groupDonator.
     *
     * @param groupDonator the groupDonator to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new groupDonator, or with status {@code 400 (Bad Request)} if the groupDonator has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/group-donators")
    public ResponseEntity<GroupDonator> createGroupDonator(@RequestBody GroupDonator groupDonator) throws URISyntaxException {
        log.debug("REST request to save GroupDonator : {}", groupDonator);
        if (groupDonator.getId() != null) {
            throw new BadRequestAlertException("A new groupDonator cannot already have an ID", ENTITY_NAME, "idexists");
        }
        GroupDonator result = groupDonatorRepository.save(groupDonator);
        return ResponseEntity
            .created(new URI("/api/group-donators/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /group-donators/:id} : Updates an existing groupDonator.
     *
     * @param id the id of the groupDonator to save.
     * @param groupDonator the groupDonator to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated groupDonator,
     * or with status {@code 400 (Bad Request)} if the groupDonator is not valid,
     * or with status {@code 500 (Internal Server Error)} if the groupDonator couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/group-donators/{id}")
    public ResponseEntity<GroupDonator> updateGroupDonator(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody GroupDonator groupDonator
    ) throws URISyntaxException {
        log.debug("REST request to update GroupDonator : {}, {}", id, groupDonator);
        if (groupDonator.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, groupDonator.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!groupDonatorRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        GroupDonator result = groupDonatorRepository.save(groupDonator);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, groupDonator.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /group-donators/:id} : Partial updates given fields of an existing groupDonator, field will ignore if it is null
     *
     * @param id the id of the groupDonator to save.
     * @param groupDonator the groupDonator to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated groupDonator,
     * or with status {@code 400 (Bad Request)} if the groupDonator is not valid,
     * or with status {@code 404 (Not Found)} if the groupDonator is not found,
     * or with status {@code 500 (Internal Server Error)} if the groupDonator couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/group-donators/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<GroupDonator> partialUpdateGroupDonator(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody GroupDonator groupDonator
    ) throws URISyntaxException {
        log.debug("REST request to partial update GroupDonator partially : {}, {}", id, groupDonator);
        if (groupDonator.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, groupDonator.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!groupDonatorRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<GroupDonator> result = groupDonatorRepository
            .findById(groupDonator.getId())
            .map(existingGroupDonator -> {
                if (groupDonator.getGroupname() != null) {
                    existingGroupDonator.setGroupname(groupDonator.getGroupname());
                }
                if (groupDonator.getTotalCollectedAmount() != null) {
                    existingGroupDonator.setTotalCollectedAmount(groupDonator.getTotalCollectedAmount());
                }

                return existingGroupDonator;
            })
            .map(groupDonatorRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, groupDonator.getId().toString())
        );
    }

    /**
     * {@code GET  /group-donators} : get all the groupDonators.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of groupDonators in body.
     */
    @GetMapping("/group-donators")
    public List<GroupDonator> getAllGroupDonators() {
        log.debug("REST request to get all GroupDonators");
        return groupDonatorRepository.findAll();
    }

    /**
     * {@code GET  /group-donators/:id} : get the "id" groupDonator.
     *
     * @param id the id of the groupDonator to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the groupDonator, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/group-donators/{id}")
    public ResponseEntity<GroupDonator> getGroupDonator(@PathVariable Long id) {
        log.debug("REST request to get GroupDonator : {}", id);
        Optional<GroupDonator> groupDonator = groupDonatorRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(groupDonator);
    }

    /**
     * {@code DELETE  /group-donators/:id} : delete the "id" groupDonator.
     *
     * @param id the id of the groupDonator to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/group-donators/{id}")
    public ResponseEntity<Void> deleteGroupDonator(@PathVariable Long id) {
        log.debug("REST request to delete GroupDonator : {}", id);
        groupDonatorRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}

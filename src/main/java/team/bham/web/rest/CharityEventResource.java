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
import team.bham.domain.CharityEvent;
import team.bham.repository.CharityEventRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.CharityEvent}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CharityEventResource {

    private final Logger log = LoggerFactory.getLogger(CharityEventResource.class);

    private static final String ENTITY_NAME = "charityEvent";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CharityEventRepository charityEventRepository;

    public CharityEventResource(CharityEventRepository charityEventRepository) {
        this.charityEventRepository = charityEventRepository;
    }

    /**
     * {@code POST  /charity-events} : Create a new charityEvent.
     *
     * @param charityEvent the charityEvent to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new charityEvent, or with status {@code 400 (Bad Request)} if the charityEvent has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/charity-events")
    public ResponseEntity<CharityEvent> createCharityEvent(@RequestBody CharityEvent charityEvent) throws URISyntaxException {
        log.debug("REST request to save CharityEvent : {}", charityEvent);
        if (charityEvent.getId() != null) {
            throw new BadRequestAlertException("A new charityEvent cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CharityEvent result = charityEventRepository.save(charityEvent);
        return ResponseEntity
            .created(new URI("/api/charity-events/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /charity-events/:id} : Updates an existing charityEvent.
     *
     * @param id the id of the charityEvent to save.
     * @param charityEvent the charityEvent to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated charityEvent,
     * or with status {@code 400 (Bad Request)} if the charityEvent is not valid,
     * or with status {@code 500 (Internal Server Error)} if the charityEvent couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/charity-events/{id}")
    public ResponseEntity<CharityEvent> updateCharityEvent(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CharityEvent charityEvent
    ) throws URISyntaxException {
        log.debug("REST request to update CharityEvent : {}, {}", id, charityEvent);
        if (charityEvent.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, charityEvent.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!charityEventRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        CharityEvent result = charityEventRepository.save(charityEvent);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, charityEvent.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /charity-events/:id} : Partial updates given fields of an existing charityEvent, field will ignore if it is null
     *
     * @param id the id of the charityEvent to save.
     * @param charityEvent the charityEvent to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated charityEvent,
     * or with status {@code 400 (Bad Request)} if the charityEvent is not valid,
     * or with status {@code 404 (Not Found)} if the charityEvent is not found,
     * or with status {@code 500 (Internal Server Error)} if the charityEvent couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/charity-events/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<CharityEvent> partialUpdateCharityEvent(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CharityEvent charityEvent
    ) throws URISyntaxException {
        log.debug("REST request to partial update CharityEvent partially : {}, {}", id, charityEvent);
        if (charityEvent.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, charityEvent.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!charityEventRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<CharityEvent> result = charityEventRepository
            .findById(charityEvent.getId())
            .map(existingCharityEvent -> {
                if (charityEvent.getEventName() != null) {
                    existingCharityEvent.setEventName(charityEvent.getEventName());
                }
                if (charityEvent.getEventTimeDate() != null) {
                    existingCharityEvent.setEventTimeDate(charityEvent.getEventTimeDate());
                }
                if (charityEvent.getDescription() != null) {
                    existingCharityEvent.setDescription(charityEvent.getDescription());
                }
                if (charityEvent.getImages() != null) {
                    existingCharityEvent.setImages(charityEvent.getImages());
                }
                if (charityEvent.getImagesContentType() != null) {
                    existingCharityEvent.setImagesContentType(charityEvent.getImagesContentType());
                }
                if (charityEvent.getDuration() != null) {
                    existingCharityEvent.setDuration(charityEvent.getDuration());
                }

                return existingCharityEvent;
            })
            .map(charityEventRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, charityEvent.getId().toString())
        );
    }

    /**
     * {@code GET  /charity-events} : get all the charityEvents.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of charityEvents in body.
     */
    @GetMapping("/charity-events")
    public List<CharityEvent> getAllCharityEvents(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all CharityEvents");
        if (eagerload) {
            return charityEventRepository.findAllWithEagerRelationships();
        } else {
            return charityEventRepository.findAll();
        }
    }

    /**
     * {@code GET  /charity-events/:id} : get the "id" charityEvent.
     *
     * @param id the id of the charityEvent to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the charityEvent, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/charity-events/{id}")
    public ResponseEntity<CharityEvent> getCharityEvent(@PathVariable Long id) {
        log.debug("REST request to get CharityEvent : {}", id);
        Optional<CharityEvent> charityEvent = charityEventRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(charityEvent);
    }

    /**
     * {@code DELETE  /charity-events/:id} : delete the "id" charityEvent.
     *
     * @param id the id of the charityEvent to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/charity-events/{id}")
    public ResponseEntity<Void> deleteCharityEvent(@PathVariable Long id) {
        log.debug("REST request to delete CharityEvent : {}", id);
        charityEventRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}

package team.bham.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import team.bham.domain.SocialFeed;
import team.bham.repository.SocialFeedRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.SocialFeed}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class SocialFeedResource {

    private final Logger log = LoggerFactory.getLogger(SocialFeedResource.class);

    private static final String ENTITY_NAME = "socialFeed";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SocialFeedRepository socialFeedRepository;

    public SocialFeedResource(SocialFeedRepository socialFeedRepository) {
        this.socialFeedRepository = socialFeedRepository;
    }

    /**
     * {@code POST  /social-feeds} : Create a new socialFeed.
     *
     * @param socialFeed the socialFeed to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new socialFeed, or with status {@code 400 (Bad Request)} if the socialFeed has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/social-feeds")
    public ResponseEntity<SocialFeed> createSocialFeed(@Valid @RequestBody SocialFeed socialFeed) throws URISyntaxException {
        log.debug("REST request to save SocialFeed : {}", socialFeed);
        if (socialFeed.getId() != null) {
            throw new BadRequestAlertException("A new socialFeed cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SocialFeed result = socialFeedRepository.save(socialFeed);
        return ResponseEntity
            .created(new URI("/api/social-feeds/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /social-feeds/:id} : Updates an existing socialFeed.
     *
     * @param id the id of the socialFeed to save.
     * @param socialFeed the socialFeed to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated socialFeed,
     * or with status {@code 400 (Bad Request)} if the socialFeed is not valid,
     * or with status {@code 500 (Internal Server Error)} if the socialFeed couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/social-feeds/{id}")
    public ResponseEntity<SocialFeed> updateSocialFeed(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody SocialFeed socialFeed
    ) throws URISyntaxException {
        log.debug("REST request to update SocialFeed : {}, {}", id, socialFeed);
        if (socialFeed.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, socialFeed.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!socialFeedRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        SocialFeed result = socialFeedRepository.save(socialFeed);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, socialFeed.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /social-feeds/:id} : Partial updates given fields of an existing socialFeed, field will ignore if it is null
     *
     * @param id the id of the socialFeed to save.
     * @param socialFeed the socialFeed to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated socialFeed,
     * or with status {@code 400 (Bad Request)} if the socialFeed is not valid,
     * or with status {@code 404 (Not Found)} if the socialFeed is not found,
     * or with status {@code 500 (Internal Server Error)} if the socialFeed couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/social-feeds/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<SocialFeed> partialUpdateSocialFeed(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody SocialFeed socialFeed
    ) throws URISyntaxException {
        log.debug("REST request to partial update SocialFeed partially : {}, {}", id, socialFeed);
        if (socialFeed.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, socialFeed.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!socialFeedRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<SocialFeed> result = socialFeedRepository
            .findById(socialFeed.getId())
            .map(existingSocialFeed -> {
                if (socialFeed.getPlatform() != null) {
                    existingSocialFeed.setPlatform(socialFeed.getPlatform());
                }
                if (socialFeed.getLastUpdated() != null) {
                    existingSocialFeed.setLastUpdated(socialFeed.getLastUpdated());
                }

                return existingSocialFeed;
            })
            .map(socialFeedRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, socialFeed.getId().toString())
        );
    }

    /**
     * {@code GET  /social-feeds} : get all the socialFeeds.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of socialFeeds in body.
     */
    @GetMapping("/social-feeds")
    public List<SocialFeed> getAllSocialFeeds() {
        log.debug("REST request to get all SocialFeeds");
        return socialFeedRepository.findAll();
    }

    /**
     * {@code GET  /social-feeds/:id} : get the "id" socialFeed.
     *
     * @param id the id of the socialFeed to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the socialFeed, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/social-feeds/{id}")
    public ResponseEntity<SocialFeed> getSocialFeed(@PathVariable Long id) {
        log.debug("REST request to get SocialFeed : {}", id);
        Optional<SocialFeed> socialFeed = socialFeedRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(socialFeed);
    }

    /**
     * {@code DELETE  /social-feeds/:id} : delete the "id" socialFeed.
     *
     * @param id the id of the socialFeed to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/social-feeds/{id}")
    public ResponseEntity<Void> deleteSocialFeed(@PathVariable Long id) {
        log.debug("REST request to delete SocialFeed : {}", id);
        socialFeedRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}

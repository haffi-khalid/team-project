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
import team.bham.domain.ReviewComments;
import team.bham.repository.ReviewCommentsRepository;
import team.bham.security.SecurityUtils;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.ReviewComments}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ReviewCommentsResource {

    private final Logger log = LoggerFactory.getLogger(ReviewCommentsResource.class);

    private static final String ENTITY_NAME = "reviewComments";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ReviewCommentsRepository reviewCommentsRepository;

    public ReviewCommentsResource(ReviewCommentsRepository reviewCommentsRepository) {
        this.reviewCommentsRepository = reviewCommentsRepository;
    }

    /**
     * {@code POST  /review-comments} : Create a new reviewComments.
     *
     * @param reviewComments the reviewComments to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new reviewComments, or with status {@code 400 (Bad Request)} if the reviewComments has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    //    @PostMapping("/review-comments")
    //    public ResponseEntity<ReviewComments> createReviewComments(@RequestBody ReviewComments reviewComments) throws URISyntaxException {
    //        log.debug("REST request to save ReviewComments : {}", reviewComments);
    //        if (reviewComments.getId() != null) {
    //            throw new BadRequestAlertException("A new reviewComments cannot already have an ID", ENTITY_NAME, "idexists");
    //        }
    //        ReviewComments result = reviewCommentsRepository.save(reviewComments);
    //        return ResponseEntity
    //            .created(new URI("/api/review-comments/" + result.getId()))
    //            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
    //            .body(result);
    //    }

    @PostMapping("/review-comments")
    public ResponseEntity<ReviewComments> createReviewComments(@RequestBody ReviewComments reviewComments) throws URISyntaxException {
        log.debug("REST request to save ReviewComments : {}", reviewComments);

        if (reviewComments.getId() != null) {
            throw new BadRequestAlertException("A new reviewComments cannot already have an ID", ENTITY_NAME, "idexists");
        }

        // Retrieve the login of the currently logged-in user.
        String currentUserLogin = SecurityUtils
            .getCurrentUserLogin()
            .orElseThrow(() -> new BadRequestAlertException("Current user login not found", ENTITY_NAME, "userloginnotfound"));

        // Set the user login to the reviewComments.
        reviewComments.setLogin(currentUserLogin);

        ReviewComments result = reviewCommentsRepository.save(reviewComments);
        return ResponseEntity
            .created(new URI("/api/review-comments/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /review-comments/:id} : Updates an existing reviewComments.
     *
     * @param id the id of the reviewComments to save.
     * @param reviewComments the reviewComments to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated reviewComments,
     * or with status {@code 400 (Bad Request)} if the reviewComments is not valid,
     * or with status {@code 500 (Internal Server Error)} if the reviewComments couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/review-comments/{id}")
    public ResponseEntity<ReviewComments> updateReviewComments(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ReviewComments reviewComments
    ) throws URISyntaxException {
        log.debug("REST request to update ReviewComments : {}, {}", id, reviewComments);
        if (reviewComments.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, reviewComments.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!reviewCommentsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ReviewComments result = reviewCommentsRepository.save(reviewComments);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, reviewComments.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /review-comments/:id} : Partial updates given fields of an existing reviewComments, field will ignore if it is null
     *
     * @param id the id of the reviewComments to save.
     * @param reviewComments the reviewComments to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated reviewComments,
     * or with status {@code 400 (Bad Request)} if the reviewComments is not valid,
     * or with status {@code 404 (Not Found)} if the reviewComments is not found,
     * or with status {@code 500 (Internal Server Error)} if the reviewComments couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/review-comments/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ReviewComments> partialUpdateReviewComments(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ReviewComments reviewComments
    ) throws URISyntaxException {
        log.debug("REST request to partial update ReviewComments partially : {}, {}", id, reviewComments);
        if (reviewComments.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, reviewComments.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!reviewCommentsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ReviewComments> result = reviewCommentsRepository
            .findById(reviewComments.getId())
            .map(existingReviewComments -> {
                if (reviewComments.getParentID() != null) {
                    existingReviewComments.setParentID(reviewComments.getParentID());
                }
                if (reviewComments.getContent() != null) {
                    existingReviewComments.setContent(reviewComments.getContent());
                }
                if (reviewComments.getTimestamp() != null) {
                    existingReviewComments.setTimestamp(reviewComments.getTimestamp());
                }
                if (reviewComments.getStatus() != null) {
                    existingReviewComments.setStatus(reviewComments.getStatus());
                }

                return existingReviewComments;
            })
            .map(reviewCommentsRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, reviewComments.getId().toString())
        );
    }

    /**
     * {@code GET  /review-comments} : get all the reviewComments.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of reviewComments in body.
     */
    @GetMapping("/review-comments")
    public List<ReviewComments> getAllReviewComments() {
        log.debug("REST request to get all ReviewComments");
        return reviewCommentsRepository.findAll();
    }

    /**
     * {@code GET  /review-comments/:id} : get the "id" reviewComments.
     *
     * @param id the id of the reviewComments to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the reviewComments, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/review-comments/{id}")
    public ResponseEntity<ReviewComments> getReviewComments(@PathVariable Long id) {
        log.debug("REST request to get ReviewComments : {}", id);
        Optional<ReviewComments> reviewComments = reviewCommentsRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(reviewComments);
    }

    /**
     * {@code DELETE  /review-comments/:id} : delete the "id" reviewComments.
     *
     * @param id the id of the reviewComments to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/review-comments/{id}")
    public ResponseEntity<Void> deleteReviewComments(@PathVariable Long id) {
        log.debug("REST request to delete ReviewComments : {}", id);
        reviewCommentsRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}

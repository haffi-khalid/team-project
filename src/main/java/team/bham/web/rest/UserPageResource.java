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
import team.bham.domain.UserPage;
import team.bham.repository.UserPageRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.UserPage}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class UserPageResource {

    private final Logger log = LoggerFactory.getLogger(UserPageResource.class);

    private static final String ENTITY_NAME = "userPage";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UserPageRepository userPageRepository;

    public UserPageResource(UserPageRepository userPageRepository) {
        this.userPageRepository = userPageRepository;
    }

    /**
     * {@code POST  /user-pages} : Create a new userPage.
     *
     * @param userPage the userPage to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new userPage, or with status {@code 400 (Bad Request)} if the userPage has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/user-pages")
    public ResponseEntity<UserPage> createUserPage(@RequestBody UserPage userPage) throws URISyntaxException {
        log.debug("REST request to save UserPage : {}", userPage);
        if (userPage.getId() != null) {
            throw new BadRequestAlertException("A new userPage cannot already have an ID", ENTITY_NAME, "idexists");
        }
        UserPage result = userPageRepository.save(userPage);
        return ResponseEntity
            .created(new URI("/api/user-pages/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /user-pages/:id} : Updates an existing userPage.
     *
     * @param id the id of the userPage to save.
     * @param userPage the userPage to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userPage,
     * or with status {@code 400 (Bad Request)} if the userPage is not valid,
     * or with status {@code 500 (Internal Server Error)} if the userPage couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/user-pages/{id}")
    public ResponseEntity<UserPage> updateUserPage(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody UserPage userPage
    ) throws URISyntaxException {
        log.debug("REST request to update UserPage : {}, {}", id, userPage);
        if (userPage.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, userPage.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!userPageRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        UserPage result = userPageRepository.save(userPage);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, userPage.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /user-pages/:id} : Partial updates given fields of an existing userPage, field will ignore if it is null
     *
     * @param id the id of the userPage to save.
     * @param userPage the userPage to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userPage,
     * or with status {@code 400 (Bad Request)} if the userPage is not valid,
     * or with status {@code 404 (Not Found)} if the userPage is not found,
     * or with status {@code 500 (Internal Server Error)} if the userPage couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/user-pages/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<UserPage> partialUpdateUserPage(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody UserPage userPage
    ) throws URISyntaxException {
        log.debug("REST request to partial update UserPage partially : {}, {}", id, userPage);
        if (userPage.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, userPage.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!userPageRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<UserPage> result = userPageRepository
            .findById(userPage.getId())
            .map(existingUserPage -> {
                if (userPage.getProfilePicture() != null) {
                    existingUserPage.setProfilePicture(userPage.getProfilePicture());
                }
                if (userPage.getProfilePictureContentType() != null) {
                    existingUserPage.setProfilePictureContentType(userPage.getProfilePictureContentType());
                }
                if (userPage.getName() != null) {
                    existingUserPage.setName(userPage.getName());
                }
                if (userPage.getUserBio() != null) {
                    existingUserPage.setUserBio(userPage.getUserBio());
                }
                if (userPage.getVolunteerHours() != null) {
                    existingUserPage.setVolunteerHours(userPage.getVolunteerHours());
                }
                if (userPage.getReviewComment() != null) {
                    existingUserPage.setReviewComment(userPage.getReviewComment());
                }
                if (userPage.getCourse() != null) {
                    existingUserPage.setCourse(userPage.getCourse());
                }
                if (userPage.getSkills() != null) {
                    existingUserPage.setSkills(userPage.getSkills());
                }

                return existingUserPage;
            })
            .map(userPageRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, userPage.getId().toString())
        );
    }

    /**
     * {@code GET  /user-pages} : get all the userPages.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of userPages in body.
     */
    @GetMapping("/user-pages")
    public List<UserPage> getAllUserPages() {
        log.debug("REST request to get all UserPages");
        return userPageRepository.findAll();
    }

    /**
     * {@code GET  /user-pages/:id} : get the "id" userPage.
     *
     * @param id the id of the userPage to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the userPage, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/user-pages/{id}")
    public ResponseEntity<UserPage> getUserPage(@PathVariable Long id) {
        log.debug("REST request to get UserPage : {}", id);
        Optional<UserPage> userPage = userPageRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(userPage);
    }

    /**
     * {@code DELETE  /user-pages/:id} : delete the "id" userPage.
     *
     * @param id the id of the userPage to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/user-pages/{id}")
    public ResponseEntity<Void> deleteUserPage(@PathVariable Long id) {
        log.debug("REST request to delete UserPage : {}", id);
        userPageRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}

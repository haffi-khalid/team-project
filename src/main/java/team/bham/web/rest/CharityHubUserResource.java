package team.bham.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.security.Security;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import team.bham.domain.CharityHubUser;
import team.bham.domain.User;
import team.bham.domain.UserPage;
import team.bham.repository.CharityHubUserRepository;
import team.bham.repository.UserRepository;
import team.bham.security.SecurityUtils;
import team.bham.service.UserService;
import team.bham.service.UserService;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.CharityHubUser}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CharityHubUserResource {

    private final Logger log = LoggerFactory.getLogger(CharityHubUserResource.class);

    private static final String ENTITY_NAME = "charityHubUser";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CharityHubUserRepository charityHubUserRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    public CharityHubUserResource(
        CharityHubUserRepository charityHubUserRepository,
        UserRepository userRepository,
        UserService userService
    ) {
        this.charityHubUserRepository = charityHubUserRepository;
        this.userRepository = userRepository;
        this.userService = userService;
    }

    /**
     * {@code POST  /charity-hub-users} : Create a new charityHubUser.
     *
     * @param charityHubUser the charityHubUser to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new charityHubUser, or with status {@code 400 (Bad Request)} if the charityHubUser has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/charity-hub-users")
    public ResponseEntity<CharityHubUser> createCharityHubUser(@RequestBody CharityHubUser charityHubUser) throws URISyntaxException {
        log.debug("REST request to save CharityHubUser : {}", charityHubUser);
        if (charityHubUser.getId() != null) {
            throw new BadRequestAlertException("A new charityHubUser cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CharityHubUser result = charityHubUserRepository.save(charityHubUser);
        return ResponseEntity
            .created(new URI("/api/charity-hub-users/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /charity-hub-users/:id} : Updates an existing charityHubUser.
     *
     * @param id the id of the charityHubUser to save.
     * @param charityHubUser the charityHubUser to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated charityHubUser,
     * or with status {@code 400 (Bad Request)} if the charityHubUser is not valid,
     * or with status {@code 500 (Internal Server Error)} if the charityHubUser couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/charity-hub-users/{id}")
    public ResponseEntity<CharityHubUser> updateCharityHubUser(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CharityHubUser charityHubUser
    ) throws URISyntaxException {
        log.debug("REST request to update CharityHubUser : {}, {}", id, charityHubUser);
        if (charityHubUser.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, charityHubUser.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!charityHubUserRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        CharityHubUser result = charityHubUserRepository.save(charityHubUser);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, charityHubUser.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /charity-hub-users/:id} : Partial updates given fields of an existing charityHubUser, field will ignore if it is null
     *
     * @param id the id of the charityHubUser to save.
     * @param charityHubUser the charityHubUser to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated charityHubUser,
     * or with status {@code 400 (Bad Request)} if the charityHubUser is not valid,
     * or with status {@code 404 (Not Found)} if the charityHubUser is not found,
     * or with status {@code 500 (Internal Server Error)} if the charityHubUser couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/charity-hub-users/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<CharityHubUser> partialUpdateCharityHubUser(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CharityHubUser charityHubUser
    ) throws URISyntaxException {
        log.debug("REST request to partial update CharityHubUser partially : {}, {}", id, charityHubUser);
        if (charityHubUser.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, charityHubUser.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!charityHubUserRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<CharityHubUser> result = charityHubUserRepository
            .findById(charityHubUser.getId())
            .map(existingCharityHubUser -> {
                if (charityHubUser.getUsername() != null) {
                    existingCharityHubUser.setUsername(charityHubUser.getUsername());
                }
                if (charityHubUser.getEmail() != null) {
                    existingCharityHubUser.setEmail(charityHubUser.getEmail());
                }

                return existingCharityHubUser;
            })
            .map(charityHubUserRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, charityHubUser.getId().toString())
        );
    }

    /**
     * {@code GET  /charity-hub-users} : get all the charityHubUsers.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of charityHubUsers in body.
     */
    @GetMapping("/charity-hub-users")
    public List<CharityHubUser> getAllCharityHubUsers() {
        log.debug("REST request to get all CharityHubUsers");
        return charityHubUserRepository.findAll();
    }

    @GetMapping("/charity-hub-user")
    public ResponseEntity<CharityHubUser> getHubUser() {
        log.debug("REST request to get Charity Hub User From User");
        Optional<User> isUser = userService.getUserWithAuthorities();
        final User user = isUser.get();
        Optional<CharityHubUser> charityHubUser = charityHubUserRepository.findCharityHubUserByUser(user.getId());
        return ResponseUtil.wrapOrNotFound(charityHubUser);
    }

    /**
     * {@code GET  /charity-hub-users/:id} : get the "id" charityHubUser.
     *
     * @param id the id of the charityHubUser to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the charityHubUser, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/charity-hub-users/{id}")
    public ResponseEntity<CharityHubUser> getCharityHubUser(@PathVariable Long id) {
        log.debug("REST request to get CharityHubUser : {}", id);
        Optional<CharityHubUser> charityHubUser = charityHubUserRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(charityHubUser);
    }

    /**
     * {@code DELETE  /charity-hub-users/:id} : delete the "id" charityHubUser.
     *
     * @param id the id of the charityHubUser to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/charity-hub-users/{id}")
    public ResponseEntity<Void> deleteCharityHubUser(@PathVariable Long id) {
        log.debug("REST request to delete CharityHubUser : {}", id);
        charityHubUserRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}

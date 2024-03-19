package team.bham.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import team.bham.domain.Authentication;
import team.bham.repository.AuthenticationRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.Authentication}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class AuthenticationResource {

    private final Logger log = LoggerFactory.getLogger(AuthenticationResource.class);

    private static final String ENTITY_NAME = "authentication";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AuthenticationRepository authenticationRepository;

    public AuthenticationResource(AuthenticationRepository authenticationRepository) {
        this.authenticationRepository = authenticationRepository;
    }

    /**
     * {@code POST  /authentications} : Create a new authentication.
     *
     * @param authentication the authentication to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new authentication, or with status {@code 400 (Bad Request)} if the authentication has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/authentications")
    public ResponseEntity<Authentication> createAuthentication(@RequestBody Authentication authentication) throws URISyntaxException {
        log.debug("REST request to save Authentication : {}", authentication);
        if (authentication.getId() != null) {
            throw new BadRequestAlertException("A new authentication cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Authentication result = authenticationRepository.save(authentication);
        return ResponseEntity
            .created(new URI("/api/authentications/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /authentications/:id} : Updates an existing authentication.
     *
     * @param id the id of the authentication to save.
     * @param authentication the authentication to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated authentication,
     * or with status {@code 400 (Bad Request)} if the authentication is not valid,
     * or with status {@code 500 (Internal Server Error)} if the authentication couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/authentications/{id}")
    public ResponseEntity<Authentication> updateAuthentication(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Authentication authentication
    ) throws URISyntaxException {
        log.debug("REST request to update Authentication : {}, {}", id, authentication);
        if (authentication.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, authentication.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!authenticationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Authentication result = authenticationRepository.save(authentication);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, authentication.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /authentications/:id} : Partial updates given fields of an existing authentication, field will ignore if it is null
     *
     * @param id the id of the authentication to save.
     * @param authentication the authentication to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated authentication,
     * or with status {@code 400 (Bad Request)} if the authentication is not valid,
     * or with status {@code 404 (Not Found)} if the authentication is not found,
     * or with status {@code 500 (Internal Server Error)} if the authentication couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/authentications/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Authentication> partialUpdateAuthentication(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Authentication authentication
    ) throws URISyntaxException {
        log.debug("REST request to partial update Authentication partially : {}, {}", id, authentication);
        if (authentication.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, authentication.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!authenticationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Authentication> result = authenticationRepository
            .findById(authentication.getId())
            .map(existingAuthentication -> {
                if (authentication.getIsAuthenticated() != null) {
                    existingAuthentication.setIsAuthenticated(authentication.getIsAuthenticated());
                }

                return existingAuthentication;
            })
            .map(authenticationRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, authentication.getId().toString())
        );
    }

    /**
     * {@code GET  /authentications} : get all the authentications.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of authentications in body.
     */
    @GetMapping("/authentications")
    public List<Authentication> getAllAuthentications(@RequestParam(required = false) String filter) {
        if ("charityhubuser-is-null".equals(filter)) {
            log.debug("REST request to get all Authentications where charityHubUser is null");
            return StreamSupport
                .stream(authenticationRepository.findAll().spliterator(), false)
                .filter(authentication -> authentication.getCharityHubUser() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all Authentications");
        return authenticationRepository.findAll();
    }

    /**
     * {@code GET  /authentications/:id} : get the "id" authentication.
     *
     * @param id the id of the authentication to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the authentication, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/authentications/{id}")
    public ResponseEntity<Authentication> getAuthentication(@PathVariable Long id) {
        log.debug("REST request to get Authentication : {}", id);
        Optional<Authentication> authentication = authenticationRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(authentication);
    }

    /**
     * {@code DELETE  /authentications/:id} : delete the "id" authentication.
     *
     * @param id the id of the authentication to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/authentications/{id}")
    public ResponseEntity<Void> deleteAuthentication(@PathVariable Long id) {
        log.debug("REST request to delete Authentication : {}", id);
        authenticationRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}

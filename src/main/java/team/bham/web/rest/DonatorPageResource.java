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
import team.bham.domain.DonatorPage;
import team.bham.repository.DonatorPageRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.DonatorPage}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class DonatorPageResource {

    private final Logger log = LoggerFactory.getLogger(DonatorPageResource.class);

    private static final String ENTITY_NAME = "donatorPage";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DonatorPageRepository donatorPageRepository;

    public DonatorPageResource(DonatorPageRepository donatorPageRepository) {
        this.donatorPageRepository = donatorPageRepository;
    }

    /**
     * {@code POST  /donator-pages} : Create a new donatorPage.
     *
     * @param donatorPage the donatorPage to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new donatorPage, or with status {@code 400 (Bad Request)} if the donatorPage has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/donator-pages")
    public ResponseEntity<DonatorPage> createDonatorPage(@RequestBody DonatorPage donatorPage) throws URISyntaxException {
        log.debug("REST request to save DonatorPage : {}", donatorPage);
        if (donatorPage.getId() != null) {
            throw new BadRequestAlertException("A new donatorPage cannot already have an ID", ENTITY_NAME, "idexists");
        }
        DonatorPage result = donatorPageRepository.save(donatorPage);
        return ResponseEntity
            .created(new URI("/api/donator-pages/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /donator-pages/:id} : Updates an existing donatorPage.
     *
     * @param id the id of the donatorPage to save.
     * @param donatorPage the donatorPage to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated donatorPage,
     * or with status {@code 400 (Bad Request)} if the donatorPage is not valid,
     * or with status {@code 500 (Internal Server Error)} if the donatorPage couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/donator-pages/{id}")
    public ResponseEntity<DonatorPage> updateDonatorPage(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody DonatorPage donatorPage
    ) throws URISyntaxException {
        log.debug("REST request to update DonatorPage : {}, {}", id, donatorPage);
        if (donatorPage.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, donatorPage.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!donatorPageRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        DonatorPage result = donatorPageRepository.save(donatorPage);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, donatorPage.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /donator-pages/:id} : Partial updates given fields of an existing donatorPage, field will ignore if it is null
     *
     * @param id the id of the donatorPage to save.
     * @param donatorPage the donatorPage to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated donatorPage,
     * or with status {@code 400 (Bad Request)} if the donatorPage is not valid,
     * or with status {@code 404 (Not Found)} if the donatorPage is not found,
     * or with status {@code 500 (Internal Server Error)} if the donatorPage couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/donator-pages/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<DonatorPage> partialUpdateDonatorPage(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody DonatorPage donatorPage
    ) throws URISyntaxException {
        log.debug("REST request to partial update DonatorPage partially : {}, {}", id, donatorPage);
        if (donatorPage.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, donatorPage.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!donatorPageRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<DonatorPage> result = donatorPageRepository
            .findById(donatorPage.getId())
            .map(existingDonatorPage -> {
                if (donatorPage.getName() != null) {
                    existingDonatorPage.setName(donatorPage.getName());
                }
                if (donatorPage.getAnonymous() != null) {
                    existingDonatorPage.setAnonymous(donatorPage.getAnonymous());
                }
                if (donatorPage.getAmount() != null) {
                    existingDonatorPage.setAmount(donatorPage.getAmount());
                }
                if (donatorPage.getGroupDonation() != null) {
                    existingDonatorPage.setGroupDonation(donatorPage.getGroupDonation());
                }

                return existingDonatorPage;
            })
            .map(donatorPageRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, donatorPage.getId().toString())
        );
    }

    /**
     * {@code GET  /donator-pages} : get all the donatorPages.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of donatorPages in body.
     */
    @GetMapping("/donator-pages")
    public List<DonatorPage> getAllDonatorPages(@RequestParam(required = false) String filter) {
        if ("groupdonator-is-null".equals(filter)) {
            log.debug("REST request to get all DonatorPages where groupDonator is null");
            return StreamSupport
                .stream(donatorPageRepository.findAll().spliterator(), false)
                .filter(donatorPage -> donatorPage.getGroupDonator() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all DonatorPages");
        return donatorPageRepository.findAll();
    }

    /**
     * {@code GET  /donator-pages/:id} : get the "id" donatorPage.
     *
     * @param id the id of the donatorPage to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the donatorPage, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/donator-pages/{id}")
    public ResponseEntity<DonatorPage> getDonatorPage(@PathVariable Long id) {
        log.debug("REST request to get DonatorPage : {}", id);
        Optional<DonatorPage> donatorPage = donatorPageRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(donatorPage);
    }

    /**
     * {@code DELETE  /donator-pages/:id} : delete the "id" donatorPage.
     *
     * @param id the id of the donatorPage to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/donator-pages/{id}")
    public ResponseEntity<Void> deleteDonatorPage(@PathVariable Long id) {
        log.debug("REST request to delete DonatorPage : {}", id);
        donatorPageRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}

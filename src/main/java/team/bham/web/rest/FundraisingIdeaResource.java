package team.bham.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import team.bham.domain.FundraisingIdea;
import team.bham.repository.FundraisingIdeaRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.FundraisingIdea}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class FundraisingIdeaResource {

    private final Logger log = LoggerFactory.getLogger(FundraisingIdeaResource.class);

    private static final String ENTITY_NAME = "fundraisingIdea";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FundraisingIdeaRepository fundraisingIdeaRepository;

    public FundraisingIdeaResource(FundraisingIdeaRepository fundraisingIdeaRepository) {
        this.fundraisingIdeaRepository = fundraisingIdeaRepository;
    }

    /**
     * {@code POST  /fundraising-ideas} : Create a new fundraisingIdea.
     *
     * @param fundraisingIdea the fundraisingIdea to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new fundraisingIdea, or with status {@code 400 (Bad Request)} if the fundraisingIdea has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/fundraising-ideas")
    public ResponseEntity<FundraisingIdea> createFundraisingIdea(@RequestBody FundraisingIdea fundraisingIdea) throws URISyntaxException {
        log.debug("REST request to save FundraisingIdea : {}", fundraisingIdea);
        if (fundraisingIdea.getId() != null) {
            throw new BadRequestAlertException("A new fundraisingIdea cannot already have an ID", ENTITY_NAME, "idexists");
        }
        FundraisingIdea result = fundraisingIdeaRepository.save(fundraisingIdea);
        return ResponseEntity
            .created(new URI("/api/fundraising-ideas/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    //    @GetMapping("/api/fundraising-ideas/random")
    //    public ResponseEntity<FundraisingIdea> getRandomIdea(){
    //        FundraisingIdea randomIdea = fundraisingIdeaRepository.findSecondIdea();
    //        if(randomIdea == null){
    //            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    //        }
    //
    //        return ResponseEntity.ok().body(randomIdea);
    //    }

    @GetMapping("/random")
    public ResponseEntity<FundraisingIdea> getSecondIdea() {
        Optional<FundraisingIdea> secondIdea = fundraisingIdeaRepository.findSecondIdea();
        return secondIdea.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/search")
    public ResponseEntity<List<FundraisingIdea>> searchIdeas(@RequestBody FundraisingIdea idea) {
        List<FundraisingIdea> findResults = fundraisingIdeaRepository.getPreference(idea);
        return ResponseEntity.status(HttpStatus.OK).body(findResults);
    }

    /**
     * {@code PUT  /fundraising-ideas/:id} : Updates an existing fundraisingIdea.
     *
     * @param id the id of the fundraisingIdea to save.
     * @param fundraisingIdea the fundraisingIdea to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated fundraisingIdea,
     * or with status {@code 400 (Bad Request)} if the fundraisingIdea is not valid,
     * or with status {@code 500 (Internal Server Error)} if the fundraisingIdea couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/fundraising-ideas/{id}")
    public ResponseEntity<FundraisingIdea> updateFundraisingIdea(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody FundraisingIdea fundraisingIdea
    ) throws URISyntaxException {
        log.debug("REST request to update FundraisingIdea : {}, {}", id, fundraisingIdea);
        if (fundraisingIdea.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, fundraisingIdea.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!fundraisingIdeaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        FundraisingIdea result = fundraisingIdeaRepository.save(fundraisingIdea);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, fundraisingIdea.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /fundraising-ideas/:id} : Partial updates given fields of an existing fundraisingIdea, field will ignore if it is null
     *
     * @param id the id of the fundraisingIdea to save.
     * @param fundraisingIdea the fundraisingIdea to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated fundraisingIdea,
     * or with status {@code 400 (Bad Request)} if the fundraisingIdea is not valid,
     * or with status {@code 404 (Not Found)} if the fundraisingIdea is not found,
     * or with status {@code 500 (Internal Server Error)} if the fundraisingIdea couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/fundraising-ideas/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<FundraisingIdea> partialUpdateFundraisingIdea(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody FundraisingIdea fundraisingIdea
    ) throws URISyntaxException {
        log.debug("REST request to partial update FundraisingIdea partially : {}, {}", id, fundraisingIdea);
        if (fundraisingIdea.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, fundraisingIdea.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!fundraisingIdeaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<FundraisingIdea> result = fundraisingIdeaRepository
            .findById(fundraisingIdea.getId())
            .map(existingFundraisingIdea -> {
                if (fundraisingIdea.getIdeaName() != null) {
                    existingFundraisingIdea.setIdeaName(fundraisingIdea.getIdeaName());
                }
                if (fundraisingIdea.getIdeaDescription() != null) {
                    existingFundraisingIdea.setIdeaDescription(fundraisingIdea.getIdeaDescription());
                }
                if (fundraisingIdea.getNumberOfVolunteers() != null) {
                    existingFundraisingIdea.setNumberOfVolunteers(fundraisingIdea.getNumberOfVolunteers());
                }
                if (fundraisingIdea.getLocation() != null) {
                    existingFundraisingIdea.setLocation(fundraisingIdea.getLocation());
                }
                if (fundraisingIdea.getExpectedCost() != null) {
                    existingFundraisingIdea.setExpectedCost(fundraisingIdea.getExpectedCost());
                }
                if (fundraisingIdea.getExpectedAttendance() != null) {
                    existingFundraisingIdea.setExpectedAttendance(fundraisingIdea.getExpectedAttendance());
                }

                return existingFundraisingIdea;
            })
            .map(fundraisingIdeaRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, fundraisingIdea.getId().toString())
        );
    }

    /**
     * {@code GET  /fundraising-ideas} : get all the fundraisingIdeas.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of fundraisingIdeas in body.
     */
    @GetMapping("/fundraising-ideas")
    public List<FundraisingIdea> getAllFundraisingIdeas() {
        log.debug("REST request to get all FundraisingIdeas");
        return fundraisingIdeaRepository.findAll();
    }

    /**
     * {@code GET  /fundraising-ideas/:id} : get the "id" fundraisingIdea.
     *
     * @param id the id of the fundraisingIdea to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the fundraisingIdea, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/fundraising-ideas/{id}")
    public ResponseEntity<FundraisingIdea> getFundraisingIdea(@PathVariable Long id) {
        log.debug("REST request to get FundraisingIdea : {}", id);
        Optional<FundraisingIdea> fundraisingIdea = fundraisingIdeaRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(fundraisingIdea);
    }

    /**
     * {@code DELETE  /fundraising-ideas/:id} : delete the "id" fundraisingIdea.
     *
     * @param id the id of the fundraisingIdea to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/fundraising-ideas/{id}")
    public ResponseEntity<Void> deleteFundraisingIdea(@PathVariable Long id) {
        log.debug("REST request to delete FundraisingIdea : {}", id);
        fundraisingIdeaRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}

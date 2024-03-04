package team.bham.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import team.bham.IntegrationTest;
import team.bham.domain.Authentication;
import team.bham.repository.AuthenticationRepository;

/**
 * Integration tests for the {@link AuthenticationResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AuthenticationResourceIT {

    private static final Boolean DEFAULT_IS_AUTHENTICATED = false;
    private static final Boolean UPDATED_IS_AUTHENTICATED = true;

    private static final String ENTITY_API_URL = "/api/authentications";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AuthenticationRepository authenticationRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAuthenticationMockMvc;

    private Authentication authentication;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Authentication createEntity(EntityManager em) {
        Authentication authentication = new Authentication().isAuthenticated(DEFAULT_IS_AUTHENTICATED);
        return authentication;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Authentication createUpdatedEntity(EntityManager em) {
        Authentication authentication = new Authentication().isAuthenticated(UPDATED_IS_AUTHENTICATED);
        return authentication;
    }

    @BeforeEach
    public void initTest() {
        authentication = createEntity(em);
    }

    @Test
    @Transactional
    void createAuthentication() throws Exception {
        int databaseSizeBeforeCreate = authenticationRepository.findAll().size();
        // Create the Authentication
        restAuthenticationMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(authentication))
            )
            .andExpect(status().isCreated());

        // Validate the Authentication in the database
        List<Authentication> authenticationList = authenticationRepository.findAll();
        assertThat(authenticationList).hasSize(databaseSizeBeforeCreate + 1);
        Authentication testAuthentication = authenticationList.get(authenticationList.size() - 1);
        assertThat(testAuthentication.getIsAuthenticated()).isEqualTo(DEFAULT_IS_AUTHENTICATED);
    }

    @Test
    @Transactional
    void createAuthenticationWithExistingId() throws Exception {
        // Create the Authentication with an existing ID
        authentication.setId(1L);

        int databaseSizeBeforeCreate = authenticationRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAuthenticationMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(authentication))
            )
            .andExpect(status().isBadRequest());

        // Validate the Authentication in the database
        List<Authentication> authenticationList = authenticationRepository.findAll();
        assertThat(authenticationList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAuthentications() throws Exception {
        // Initialize the database
        authenticationRepository.saveAndFlush(authentication);

        // Get all the authenticationList
        restAuthenticationMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(authentication.getId().intValue())))
            .andExpect(jsonPath("$.[*].isAuthenticated").value(hasItem(DEFAULT_IS_AUTHENTICATED.booleanValue())));
    }

    @Test
    @Transactional
    void getAuthentication() throws Exception {
        // Initialize the database
        authenticationRepository.saveAndFlush(authentication);

        // Get the authentication
        restAuthenticationMockMvc
            .perform(get(ENTITY_API_URL_ID, authentication.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(authentication.getId().intValue()))
            .andExpect(jsonPath("$.isAuthenticated").value(DEFAULT_IS_AUTHENTICATED.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingAuthentication() throws Exception {
        // Get the authentication
        restAuthenticationMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingAuthentication() throws Exception {
        // Initialize the database
        authenticationRepository.saveAndFlush(authentication);

        int databaseSizeBeforeUpdate = authenticationRepository.findAll().size();

        // Update the authentication
        Authentication updatedAuthentication = authenticationRepository.findById(authentication.getId()).get();
        // Disconnect from session so that the updates on updatedAuthentication are not directly saved in db
        em.detach(updatedAuthentication);
        updatedAuthentication.isAuthenticated(UPDATED_IS_AUTHENTICATED);

        restAuthenticationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAuthentication.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAuthentication))
            )
            .andExpect(status().isOk());

        // Validate the Authentication in the database
        List<Authentication> authenticationList = authenticationRepository.findAll();
        assertThat(authenticationList).hasSize(databaseSizeBeforeUpdate);
        Authentication testAuthentication = authenticationList.get(authenticationList.size() - 1);
        assertThat(testAuthentication.getIsAuthenticated()).isEqualTo(UPDATED_IS_AUTHENTICATED);
    }

    @Test
    @Transactional
    void putNonExistingAuthentication() throws Exception {
        int databaseSizeBeforeUpdate = authenticationRepository.findAll().size();
        authentication.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAuthenticationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, authentication.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(authentication))
            )
            .andExpect(status().isBadRequest());

        // Validate the Authentication in the database
        List<Authentication> authenticationList = authenticationRepository.findAll();
        assertThat(authenticationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAuthentication() throws Exception {
        int databaseSizeBeforeUpdate = authenticationRepository.findAll().size();
        authentication.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAuthenticationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(authentication))
            )
            .andExpect(status().isBadRequest());

        // Validate the Authentication in the database
        List<Authentication> authenticationList = authenticationRepository.findAll();
        assertThat(authenticationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAuthentication() throws Exception {
        int databaseSizeBeforeUpdate = authenticationRepository.findAll().size();
        authentication.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAuthenticationMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(authentication)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Authentication in the database
        List<Authentication> authenticationList = authenticationRepository.findAll();
        assertThat(authenticationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAuthenticationWithPatch() throws Exception {
        // Initialize the database
        authenticationRepository.saveAndFlush(authentication);

        int databaseSizeBeforeUpdate = authenticationRepository.findAll().size();

        // Update the authentication using partial update
        Authentication partialUpdatedAuthentication = new Authentication();
        partialUpdatedAuthentication.setId(authentication.getId());

        partialUpdatedAuthentication.isAuthenticated(UPDATED_IS_AUTHENTICATED);

        restAuthenticationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAuthentication.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAuthentication))
            )
            .andExpect(status().isOk());

        // Validate the Authentication in the database
        List<Authentication> authenticationList = authenticationRepository.findAll();
        assertThat(authenticationList).hasSize(databaseSizeBeforeUpdate);
        Authentication testAuthentication = authenticationList.get(authenticationList.size() - 1);
        assertThat(testAuthentication.getIsAuthenticated()).isEqualTo(UPDATED_IS_AUTHENTICATED);
    }

    @Test
    @Transactional
    void fullUpdateAuthenticationWithPatch() throws Exception {
        // Initialize the database
        authenticationRepository.saveAndFlush(authentication);

        int databaseSizeBeforeUpdate = authenticationRepository.findAll().size();

        // Update the authentication using partial update
        Authentication partialUpdatedAuthentication = new Authentication();
        partialUpdatedAuthentication.setId(authentication.getId());

        partialUpdatedAuthentication.isAuthenticated(UPDATED_IS_AUTHENTICATED);

        restAuthenticationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAuthentication.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAuthentication))
            )
            .andExpect(status().isOk());

        // Validate the Authentication in the database
        List<Authentication> authenticationList = authenticationRepository.findAll();
        assertThat(authenticationList).hasSize(databaseSizeBeforeUpdate);
        Authentication testAuthentication = authenticationList.get(authenticationList.size() - 1);
        assertThat(testAuthentication.getIsAuthenticated()).isEqualTo(UPDATED_IS_AUTHENTICATED);
    }

    @Test
    @Transactional
    void patchNonExistingAuthentication() throws Exception {
        int databaseSizeBeforeUpdate = authenticationRepository.findAll().size();
        authentication.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAuthenticationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, authentication.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(authentication))
            )
            .andExpect(status().isBadRequest());

        // Validate the Authentication in the database
        List<Authentication> authenticationList = authenticationRepository.findAll();
        assertThat(authenticationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAuthentication() throws Exception {
        int databaseSizeBeforeUpdate = authenticationRepository.findAll().size();
        authentication.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAuthenticationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(authentication))
            )
            .andExpect(status().isBadRequest());

        // Validate the Authentication in the database
        List<Authentication> authenticationList = authenticationRepository.findAll();
        assertThat(authenticationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAuthentication() throws Exception {
        int databaseSizeBeforeUpdate = authenticationRepository.findAll().size();
        authentication.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAuthenticationMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(authentication))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Authentication in the database
        List<Authentication> authenticationList = authenticationRepository.findAll();
        assertThat(authenticationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAuthentication() throws Exception {
        // Initialize the database
        authenticationRepository.saveAndFlush(authentication);

        int databaseSizeBeforeDelete = authenticationRepository.findAll().size();

        // Delete the authentication
        restAuthenticationMockMvc
            .perform(delete(ENTITY_API_URL_ID, authentication.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Authentication> authenticationList = authenticationRepository.findAll();
        assertThat(authenticationList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

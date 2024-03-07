package team.bham.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import team.bham.IntegrationTest;
import team.bham.domain.CharityAdmin;
import team.bham.repository.CharityAdminRepository;

/**
 * Integration tests for the {@link CharityAdminResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class CharityAdminResourceIT {

    private static final Boolean DEFAULT_IS_CHARITY_ADMIN = false;
    private static final Boolean UPDATED_IS_CHARITY_ADMIN = true;

    private static final String ENTITY_API_URL = "/api/charity-admins";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CharityAdminRepository charityAdminRepository;

    @Mock
    private CharityAdminRepository charityAdminRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCharityAdminMockMvc;

    private CharityAdmin charityAdmin;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CharityAdmin createEntity(EntityManager em) {
        CharityAdmin charityAdmin = new CharityAdmin().isCharityAdmin(DEFAULT_IS_CHARITY_ADMIN);
        return charityAdmin;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CharityAdmin createUpdatedEntity(EntityManager em) {
        CharityAdmin charityAdmin = new CharityAdmin().isCharityAdmin(UPDATED_IS_CHARITY_ADMIN);
        return charityAdmin;
    }

    @BeforeEach
    public void initTest() {
        charityAdmin = createEntity(em);
    }

    @Test
    @Transactional
    void createCharityAdmin() throws Exception {
        int databaseSizeBeforeCreate = charityAdminRepository.findAll().size();
        // Create the CharityAdmin
        restCharityAdminMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(charityAdmin)))
            .andExpect(status().isCreated());

        // Validate the CharityAdmin in the database
        List<CharityAdmin> charityAdminList = charityAdminRepository.findAll();
        assertThat(charityAdminList).hasSize(databaseSizeBeforeCreate + 1);
        CharityAdmin testCharityAdmin = charityAdminList.get(charityAdminList.size() - 1);
        assertThat(testCharityAdmin.getIsCharityAdmin()).isEqualTo(DEFAULT_IS_CHARITY_ADMIN);
    }

    @Test
    @Transactional
    void createCharityAdminWithExistingId() throws Exception {
        // Create the CharityAdmin with an existing ID
        charityAdmin.setId(1L);

        int databaseSizeBeforeCreate = charityAdminRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCharityAdminMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(charityAdmin)))
            .andExpect(status().isBadRequest());

        // Validate the CharityAdmin in the database
        List<CharityAdmin> charityAdminList = charityAdminRepository.findAll();
        assertThat(charityAdminList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCharityAdmins() throws Exception {
        // Initialize the database
        charityAdminRepository.saveAndFlush(charityAdmin);

        // Get all the charityAdminList
        restCharityAdminMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(charityAdmin.getId().intValue())))
            .andExpect(jsonPath("$.[*].isCharityAdmin").value(hasItem(DEFAULT_IS_CHARITY_ADMIN.booleanValue())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllCharityAdminsWithEagerRelationshipsIsEnabled() throws Exception {
        when(charityAdminRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restCharityAdminMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(charityAdminRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllCharityAdminsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(charityAdminRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restCharityAdminMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(charityAdminRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getCharityAdmin() throws Exception {
        // Initialize the database
        charityAdminRepository.saveAndFlush(charityAdmin);

        // Get the charityAdmin
        restCharityAdminMockMvc
            .perform(get(ENTITY_API_URL_ID, charityAdmin.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(charityAdmin.getId().intValue()))
            .andExpect(jsonPath("$.isCharityAdmin").value(DEFAULT_IS_CHARITY_ADMIN.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingCharityAdmin() throws Exception {
        // Get the charityAdmin
        restCharityAdminMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingCharityAdmin() throws Exception {
        // Initialize the database
        charityAdminRepository.saveAndFlush(charityAdmin);

        int databaseSizeBeforeUpdate = charityAdminRepository.findAll().size();

        // Update the charityAdmin
        CharityAdmin updatedCharityAdmin = charityAdminRepository.findById(charityAdmin.getId()).get();
        // Disconnect from session so that the updates on updatedCharityAdmin are not directly saved in db
        em.detach(updatedCharityAdmin);
        updatedCharityAdmin.isCharityAdmin(UPDATED_IS_CHARITY_ADMIN);

        restCharityAdminMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCharityAdmin.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCharityAdmin))
            )
            .andExpect(status().isOk());

        // Validate the CharityAdmin in the database
        List<CharityAdmin> charityAdminList = charityAdminRepository.findAll();
        assertThat(charityAdminList).hasSize(databaseSizeBeforeUpdate);
        CharityAdmin testCharityAdmin = charityAdminList.get(charityAdminList.size() - 1);
        assertThat(testCharityAdmin.getIsCharityAdmin()).isEqualTo(UPDATED_IS_CHARITY_ADMIN);
    }

    @Test
    @Transactional
    void putNonExistingCharityAdmin() throws Exception {
        int databaseSizeBeforeUpdate = charityAdminRepository.findAll().size();
        charityAdmin.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCharityAdminMockMvc
            .perform(
                put(ENTITY_API_URL_ID, charityAdmin.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(charityAdmin))
            )
            .andExpect(status().isBadRequest());

        // Validate the CharityAdmin in the database
        List<CharityAdmin> charityAdminList = charityAdminRepository.findAll();
        assertThat(charityAdminList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCharityAdmin() throws Exception {
        int databaseSizeBeforeUpdate = charityAdminRepository.findAll().size();
        charityAdmin.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCharityAdminMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(charityAdmin))
            )
            .andExpect(status().isBadRequest());

        // Validate the CharityAdmin in the database
        List<CharityAdmin> charityAdminList = charityAdminRepository.findAll();
        assertThat(charityAdminList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCharityAdmin() throws Exception {
        int databaseSizeBeforeUpdate = charityAdminRepository.findAll().size();
        charityAdmin.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCharityAdminMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(charityAdmin)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the CharityAdmin in the database
        List<CharityAdmin> charityAdminList = charityAdminRepository.findAll();
        assertThat(charityAdminList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCharityAdminWithPatch() throws Exception {
        // Initialize the database
        charityAdminRepository.saveAndFlush(charityAdmin);

        int databaseSizeBeforeUpdate = charityAdminRepository.findAll().size();

        // Update the charityAdmin using partial update
        CharityAdmin partialUpdatedCharityAdmin = new CharityAdmin();
        partialUpdatedCharityAdmin.setId(charityAdmin.getId());

        partialUpdatedCharityAdmin.isCharityAdmin(UPDATED_IS_CHARITY_ADMIN);

        restCharityAdminMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCharityAdmin.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCharityAdmin))
            )
            .andExpect(status().isOk());

        // Validate the CharityAdmin in the database
        List<CharityAdmin> charityAdminList = charityAdminRepository.findAll();
        assertThat(charityAdminList).hasSize(databaseSizeBeforeUpdate);
        CharityAdmin testCharityAdmin = charityAdminList.get(charityAdminList.size() - 1);
        assertThat(testCharityAdmin.getIsCharityAdmin()).isEqualTo(UPDATED_IS_CHARITY_ADMIN);
    }

    @Test
    @Transactional
    void fullUpdateCharityAdminWithPatch() throws Exception {
        // Initialize the database
        charityAdminRepository.saveAndFlush(charityAdmin);

        int databaseSizeBeforeUpdate = charityAdminRepository.findAll().size();

        // Update the charityAdmin using partial update
        CharityAdmin partialUpdatedCharityAdmin = new CharityAdmin();
        partialUpdatedCharityAdmin.setId(charityAdmin.getId());

        partialUpdatedCharityAdmin.isCharityAdmin(UPDATED_IS_CHARITY_ADMIN);

        restCharityAdminMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCharityAdmin.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCharityAdmin))
            )
            .andExpect(status().isOk());

        // Validate the CharityAdmin in the database
        List<CharityAdmin> charityAdminList = charityAdminRepository.findAll();
        assertThat(charityAdminList).hasSize(databaseSizeBeforeUpdate);
        CharityAdmin testCharityAdmin = charityAdminList.get(charityAdminList.size() - 1);
        assertThat(testCharityAdmin.getIsCharityAdmin()).isEqualTo(UPDATED_IS_CHARITY_ADMIN);
    }

    @Test
    @Transactional
    void patchNonExistingCharityAdmin() throws Exception {
        int databaseSizeBeforeUpdate = charityAdminRepository.findAll().size();
        charityAdmin.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCharityAdminMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, charityAdmin.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(charityAdmin))
            )
            .andExpect(status().isBadRequest());

        // Validate the CharityAdmin in the database
        List<CharityAdmin> charityAdminList = charityAdminRepository.findAll();
        assertThat(charityAdminList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCharityAdmin() throws Exception {
        int databaseSizeBeforeUpdate = charityAdminRepository.findAll().size();
        charityAdmin.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCharityAdminMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(charityAdmin))
            )
            .andExpect(status().isBadRequest());

        // Validate the CharityAdmin in the database
        List<CharityAdmin> charityAdminList = charityAdminRepository.findAll();
        assertThat(charityAdminList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCharityAdmin() throws Exception {
        int databaseSizeBeforeUpdate = charityAdminRepository.findAll().size();
        charityAdmin.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCharityAdminMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(charityAdmin))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CharityAdmin in the database
        List<CharityAdmin> charityAdminList = charityAdminRepository.findAll();
        assertThat(charityAdminList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCharityAdmin() throws Exception {
        // Initialize the database
        charityAdminRepository.saveAndFlush(charityAdmin);

        int databaseSizeBeforeDelete = charityAdminRepository.findAll().size();

        // Delete the charityAdmin
        restCharityAdminMockMvc
            .perform(delete(ENTITY_API_URL_ID, charityAdmin.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<CharityAdmin> charityAdminList = charityAdminRepository.findAll();
        assertThat(charityAdminList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

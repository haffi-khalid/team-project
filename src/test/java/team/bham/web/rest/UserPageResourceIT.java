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
import org.springframework.util.Base64Utils;
import team.bham.IntegrationTest;
import team.bham.domain.UserPage;
import team.bham.repository.UserPageRepository;

/**
 * Integration tests for the {@link UserPageResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class UserPageResourceIT {

    private static final Integer DEFAULT_VOLUNTEER_HOURS = 1;
    private static final Integer UPDATED_VOLUNTEER_HOURS = 2;

    private static final String DEFAULT_USER_BIO = "AAAAAAAAAA";
    private static final String UPDATED_USER_BIO = "BBBBBBBBBB";

    private static final String DEFAULT_REVIEW_COMMENT = "AAAAAAAAAA";
    private static final String UPDATED_REVIEW_COMMENT = "BBBBBBBBBB";

    private static final String DEFAULT_COURSE = "AAAAAAAAAA";
    private static final String UPDATED_COURSE = "BBBBBBBBBB";

    private static final String DEFAULT_SKILLS = "AAAAAAAAAA";
    private static final String UPDATED_SKILLS = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/user-pages";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private UserPageRepository userPageRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restUserPageMockMvc;

    private UserPage userPage;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserPage createEntity(EntityManager em) {
        UserPage userPage = new UserPage()
            .volunteerHours(DEFAULT_VOLUNTEER_HOURS)
            .userBio(DEFAULT_USER_BIO)
            .reviewComment(DEFAULT_REVIEW_COMMENT)
            .course(DEFAULT_COURSE)
            .skills(DEFAULT_SKILLS);
        return userPage;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserPage createUpdatedEntity(EntityManager em) {
        UserPage userPage = new UserPage()
            .volunteerHours(UPDATED_VOLUNTEER_HOURS)
            .userBio(UPDATED_USER_BIO)
            .reviewComment(UPDATED_REVIEW_COMMENT)
            .course(UPDATED_COURSE)
            .skills(UPDATED_SKILLS);
        return userPage;
    }

    @BeforeEach
    public void initTest() {
        userPage = createEntity(em);
    }

    @Test
    @Transactional
    void createUserPage() throws Exception {
        int databaseSizeBeforeCreate = userPageRepository.findAll().size();
        // Create the UserPage
        restUserPageMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userPage)))
            .andExpect(status().isCreated());

        // Validate the UserPage in the database
        List<UserPage> userPageList = userPageRepository.findAll();
        assertThat(userPageList).hasSize(databaseSizeBeforeCreate + 1);
        UserPage testUserPage = userPageList.get(userPageList.size() - 1);
        assertThat(testUserPage.getVolunteerHours()).isEqualTo(DEFAULT_VOLUNTEER_HOURS);
        assertThat(testUserPage.getUserBio()).isEqualTo(DEFAULT_USER_BIO);
        assertThat(testUserPage.getReviewComment()).isEqualTo(DEFAULT_REVIEW_COMMENT);
        assertThat(testUserPage.getCourse()).isEqualTo(DEFAULT_COURSE);
        assertThat(testUserPage.getSkills()).isEqualTo(DEFAULT_SKILLS);
    }

    @Test
    @Transactional
    void createUserPageWithExistingId() throws Exception {
        // Create the UserPage with an existing ID
        userPage.setId(1L);

        int databaseSizeBeforeCreate = userPageRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restUserPageMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userPage)))
            .andExpect(status().isBadRequest());

        // Validate the UserPage in the database
        List<UserPage> userPageList = userPageRepository.findAll();
        assertThat(userPageList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllUserPages() throws Exception {
        // Initialize the database
        userPageRepository.saveAndFlush(userPage);

        // Get all the userPageList
        restUserPageMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(userPage.getId().intValue())))
            .andExpect(jsonPath("$.[*].volunteerHours").value(hasItem(DEFAULT_VOLUNTEER_HOURS)))
            .andExpect(jsonPath("$.[*].userBio").value(hasItem(DEFAULT_USER_BIO.toString())))
            .andExpect(jsonPath("$.[*].reviewComment").value(hasItem(DEFAULT_REVIEW_COMMENT.toString())))
            .andExpect(jsonPath("$.[*].course").value(hasItem(DEFAULT_COURSE)))
            .andExpect(jsonPath("$.[*].skills").value(hasItem(DEFAULT_SKILLS)));
    }

    @Test
    @Transactional
    void getUserPage() throws Exception {
        // Initialize the database
        userPageRepository.saveAndFlush(userPage);

        // Get the userPage
        restUserPageMockMvc
            .perform(get(ENTITY_API_URL_ID, userPage.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(userPage.getId().intValue()))
            .andExpect(jsonPath("$.volunteerHours").value(DEFAULT_VOLUNTEER_HOURS))
            .andExpect(jsonPath("$.userBio").value(DEFAULT_USER_BIO.toString()))
            .andExpect(jsonPath("$.reviewComment").value(DEFAULT_REVIEW_COMMENT.toString()))
            .andExpect(jsonPath("$.course").value(DEFAULT_COURSE))
            .andExpect(jsonPath("$.skills").value(DEFAULT_SKILLS));
    }

    @Test
    @Transactional
    void getNonExistingUserPage() throws Exception {
        // Get the userPage
        restUserPageMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingUserPage() throws Exception {
        // Initialize the database
        userPageRepository.saveAndFlush(userPage);

        int databaseSizeBeforeUpdate = userPageRepository.findAll().size();

        // Update the userPage
        UserPage updatedUserPage = userPageRepository.findById(userPage.getId()).get();
        // Disconnect from session so that the updates on updatedUserPage are not directly saved in db
        em.detach(updatedUserPage);
        updatedUserPage
            .volunteerHours(UPDATED_VOLUNTEER_HOURS)
            .userBio(UPDATED_USER_BIO)
            .reviewComment(UPDATED_REVIEW_COMMENT)
            .course(UPDATED_COURSE)
            .skills(UPDATED_SKILLS);

        restUserPageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedUserPage.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedUserPage))
            )
            .andExpect(status().isOk());

        // Validate the UserPage in the database
        List<UserPage> userPageList = userPageRepository.findAll();
        assertThat(userPageList).hasSize(databaseSizeBeforeUpdate);
        UserPage testUserPage = userPageList.get(userPageList.size() - 1);
        assertThat(testUserPage.getVolunteerHours()).isEqualTo(UPDATED_VOLUNTEER_HOURS);
        assertThat(testUserPage.getUserBio()).isEqualTo(UPDATED_USER_BIO);
        assertThat(testUserPage.getReviewComment()).isEqualTo(UPDATED_REVIEW_COMMENT);
        assertThat(testUserPage.getCourse()).isEqualTo(UPDATED_COURSE);
        assertThat(testUserPage.getSkills()).isEqualTo(UPDATED_SKILLS);
    }

    @Test
    @Transactional
    void putNonExistingUserPage() throws Exception {
        int databaseSizeBeforeUpdate = userPageRepository.findAll().size();
        userPage.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserPageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, userPage.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userPage))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserPage in the database
        List<UserPage> userPageList = userPageRepository.findAll();
        assertThat(userPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchUserPage() throws Exception {
        int databaseSizeBeforeUpdate = userPageRepository.findAll().size();
        userPage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserPageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userPage))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserPage in the database
        List<UserPage> userPageList = userPageRepository.findAll();
        assertThat(userPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamUserPage() throws Exception {
        int databaseSizeBeforeUpdate = userPageRepository.findAll().size();
        userPage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserPageMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userPage)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserPage in the database
        List<UserPage> userPageList = userPageRepository.findAll();
        assertThat(userPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateUserPageWithPatch() throws Exception {
        // Initialize the database
        userPageRepository.saveAndFlush(userPage);

        int databaseSizeBeforeUpdate = userPageRepository.findAll().size();

        // Update the userPage using partial update
        UserPage partialUpdatedUserPage = new UserPage();
        partialUpdatedUserPage.setId(userPage.getId());

        partialUpdatedUserPage.userBio(UPDATED_USER_BIO).skills(UPDATED_SKILLS);

        restUserPageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserPage.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUserPage))
            )
            .andExpect(status().isOk());

        // Validate the UserPage in the database
        List<UserPage> userPageList = userPageRepository.findAll();
        assertThat(userPageList).hasSize(databaseSizeBeforeUpdate);
        UserPage testUserPage = userPageList.get(userPageList.size() - 1);
        assertThat(testUserPage.getVolunteerHours()).isEqualTo(DEFAULT_VOLUNTEER_HOURS);
        assertThat(testUserPage.getUserBio()).isEqualTo(UPDATED_USER_BIO);
        assertThat(testUserPage.getReviewComment()).isEqualTo(DEFAULT_REVIEW_COMMENT);
        assertThat(testUserPage.getCourse()).isEqualTo(DEFAULT_COURSE);
        assertThat(testUserPage.getSkills()).isEqualTo(UPDATED_SKILLS);
    }

    @Test
    @Transactional
    void fullUpdateUserPageWithPatch() throws Exception {
        // Initialize the database
        userPageRepository.saveAndFlush(userPage);

        int databaseSizeBeforeUpdate = userPageRepository.findAll().size();

        // Update the userPage using partial update
        UserPage partialUpdatedUserPage = new UserPage();
        partialUpdatedUserPage.setId(userPage.getId());

        partialUpdatedUserPage
            .volunteerHours(UPDATED_VOLUNTEER_HOURS)
            .userBio(UPDATED_USER_BIO)
            .reviewComment(UPDATED_REVIEW_COMMENT)
            .course(UPDATED_COURSE)
            .skills(UPDATED_SKILLS);

        restUserPageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserPage.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUserPage))
            )
            .andExpect(status().isOk());

        // Validate the UserPage in the database
        List<UserPage> userPageList = userPageRepository.findAll();
        assertThat(userPageList).hasSize(databaseSizeBeforeUpdate);
        UserPage testUserPage = userPageList.get(userPageList.size() - 1);
        assertThat(testUserPage.getVolunteerHours()).isEqualTo(UPDATED_VOLUNTEER_HOURS);
        assertThat(testUserPage.getUserBio()).isEqualTo(UPDATED_USER_BIO);
        assertThat(testUserPage.getReviewComment()).isEqualTo(UPDATED_REVIEW_COMMENT);
        assertThat(testUserPage.getCourse()).isEqualTo(UPDATED_COURSE);
        assertThat(testUserPage.getSkills()).isEqualTo(UPDATED_SKILLS);
    }

    @Test
    @Transactional
    void patchNonExistingUserPage() throws Exception {
        int databaseSizeBeforeUpdate = userPageRepository.findAll().size();
        userPage.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserPageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, userPage.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userPage))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserPage in the database
        List<UserPage> userPageList = userPageRepository.findAll();
        assertThat(userPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchUserPage() throws Exception {
        int databaseSizeBeforeUpdate = userPageRepository.findAll().size();
        userPage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserPageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userPage))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserPage in the database
        List<UserPage> userPageList = userPageRepository.findAll();
        assertThat(userPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamUserPage() throws Exception {
        int databaseSizeBeforeUpdate = userPageRepository.findAll().size();
        userPage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserPageMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(userPage)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserPage in the database
        List<UserPage> userPageList = userPageRepository.findAll();
        assertThat(userPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteUserPage() throws Exception {
        // Initialize the database
        userPageRepository.saveAndFlush(userPage);

        int databaseSizeBeforeDelete = userPageRepository.findAll().size();

        // Delete the userPage
        restUserPageMockMvc
            .perform(delete(ENTITY_API_URL_ID, userPage.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<UserPage> userPageList = userPageRepository.findAll();
        assertThat(userPageList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

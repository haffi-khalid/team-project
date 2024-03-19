package team.bham.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static team.bham.web.rest.TestUtil.sameInstant;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
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
import org.springframework.util.Base64Utils;
import team.bham.IntegrationTest;
import team.bham.domain.CharityEvent;
import team.bham.repository.CharityEventRepository;

/**
 * Integration tests for the {@link CharityEventResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class CharityEventResourceIT {

    private static final String DEFAULT_EVENT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_EVENT_NAME = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_EVENT_TIME_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_EVENT_TIME_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final byte[] DEFAULT_IMAGES = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_IMAGES = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_IMAGES_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_IMAGES_CONTENT_TYPE = "image/png";

    private static final Integer DEFAULT_DURATION = 1;
    private static final Integer UPDATED_DURATION = 2;

    private static final String ENTITY_API_URL = "/api/charity-events";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CharityEventRepository charityEventRepository;

    @Mock
    private CharityEventRepository charityEventRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCharityEventMockMvc;

    private CharityEvent charityEvent;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CharityEvent createEntity(EntityManager em) {
        CharityEvent charityEvent = new CharityEvent()
            .eventName(DEFAULT_EVENT_NAME)
            .eventTimeDate(DEFAULT_EVENT_TIME_DATE)
            .description(DEFAULT_DESCRIPTION)
            .images(DEFAULT_IMAGES)
            .imagesContentType(DEFAULT_IMAGES_CONTENT_TYPE)
            .duration(DEFAULT_DURATION);
        return charityEvent;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CharityEvent createUpdatedEntity(EntityManager em) {
        CharityEvent charityEvent = new CharityEvent()
            .eventName(UPDATED_EVENT_NAME)
            .eventTimeDate(UPDATED_EVENT_TIME_DATE)
            .description(UPDATED_DESCRIPTION)
            .images(UPDATED_IMAGES)
            .imagesContentType(UPDATED_IMAGES_CONTENT_TYPE)
            .duration(UPDATED_DURATION);
        return charityEvent;
    }

    @BeforeEach
    public void initTest() {
        charityEvent = createEntity(em);
    }

    @Test
    @Transactional
    void createCharityEvent() throws Exception {
        int databaseSizeBeforeCreate = charityEventRepository.findAll().size();
        // Create the CharityEvent
        restCharityEventMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(charityEvent)))
            .andExpect(status().isCreated());

        // Validate the CharityEvent in the database
        List<CharityEvent> charityEventList = charityEventRepository.findAll();
        assertThat(charityEventList).hasSize(databaseSizeBeforeCreate + 1);
        CharityEvent testCharityEvent = charityEventList.get(charityEventList.size() - 1);
        assertThat(testCharityEvent.getEventName()).isEqualTo(DEFAULT_EVENT_NAME);
        assertThat(testCharityEvent.getEventTimeDate()).isEqualTo(DEFAULT_EVENT_TIME_DATE);
        assertThat(testCharityEvent.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testCharityEvent.getImages()).isEqualTo(DEFAULT_IMAGES);
        assertThat(testCharityEvent.getImagesContentType()).isEqualTo(DEFAULT_IMAGES_CONTENT_TYPE);
        assertThat(testCharityEvent.getDuration()).isEqualTo(DEFAULT_DURATION);
    }

    @Test
    @Transactional
    void createCharityEventWithExistingId() throws Exception {
        // Create the CharityEvent with an existing ID
        charityEvent.setId(1L);

        int databaseSizeBeforeCreate = charityEventRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCharityEventMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(charityEvent)))
            .andExpect(status().isBadRequest());

        // Validate the CharityEvent in the database
        List<CharityEvent> charityEventList = charityEventRepository.findAll();
        assertThat(charityEventList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCharityEvents() throws Exception {
        // Initialize the database
        charityEventRepository.saveAndFlush(charityEvent);

        // Get all the charityEventList
        restCharityEventMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(charityEvent.getId().intValue())))
            .andExpect(jsonPath("$.[*].eventName").value(hasItem(DEFAULT_EVENT_NAME)))
            .andExpect(jsonPath("$.[*].eventTimeDate").value(hasItem(sameInstant(DEFAULT_EVENT_TIME_DATE))))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].imagesContentType").value(hasItem(DEFAULT_IMAGES_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].images").value(hasItem(Base64Utils.encodeToString(DEFAULT_IMAGES))))
            .andExpect(jsonPath("$.[*].duration").value(hasItem(DEFAULT_DURATION)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllCharityEventsWithEagerRelationshipsIsEnabled() throws Exception {
        when(charityEventRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restCharityEventMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(charityEventRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllCharityEventsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(charityEventRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restCharityEventMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(charityEventRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getCharityEvent() throws Exception {
        // Initialize the database
        charityEventRepository.saveAndFlush(charityEvent);

        // Get the charityEvent
        restCharityEventMockMvc
            .perform(get(ENTITY_API_URL_ID, charityEvent.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(charityEvent.getId().intValue()))
            .andExpect(jsonPath("$.eventName").value(DEFAULT_EVENT_NAME))
            .andExpect(jsonPath("$.eventTimeDate").value(sameInstant(DEFAULT_EVENT_TIME_DATE)))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.imagesContentType").value(DEFAULT_IMAGES_CONTENT_TYPE))
            .andExpect(jsonPath("$.images").value(Base64Utils.encodeToString(DEFAULT_IMAGES)))
            .andExpect(jsonPath("$.duration").value(DEFAULT_DURATION));
    }

    @Test
    @Transactional
    void getNonExistingCharityEvent() throws Exception {
        // Get the charityEvent
        restCharityEventMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingCharityEvent() throws Exception {
        // Initialize the database
        charityEventRepository.saveAndFlush(charityEvent);

        int databaseSizeBeforeUpdate = charityEventRepository.findAll().size();

        // Update the charityEvent
        CharityEvent updatedCharityEvent = charityEventRepository.findById(charityEvent.getId()).get();
        // Disconnect from session so that the updates on updatedCharityEvent are not directly saved in db
        em.detach(updatedCharityEvent);
        updatedCharityEvent
            .eventName(UPDATED_EVENT_NAME)
            .eventTimeDate(UPDATED_EVENT_TIME_DATE)
            .description(UPDATED_DESCRIPTION)
            .images(UPDATED_IMAGES)
            .imagesContentType(UPDATED_IMAGES_CONTENT_TYPE)
            .duration(UPDATED_DURATION);

        restCharityEventMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCharityEvent.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCharityEvent))
            )
            .andExpect(status().isOk());

        // Validate the CharityEvent in the database
        List<CharityEvent> charityEventList = charityEventRepository.findAll();
        assertThat(charityEventList).hasSize(databaseSizeBeforeUpdate);
        CharityEvent testCharityEvent = charityEventList.get(charityEventList.size() - 1);
        assertThat(testCharityEvent.getEventName()).isEqualTo(UPDATED_EVENT_NAME);
        assertThat(testCharityEvent.getEventTimeDate()).isEqualTo(UPDATED_EVENT_TIME_DATE);
        assertThat(testCharityEvent.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testCharityEvent.getImages()).isEqualTo(UPDATED_IMAGES);
        assertThat(testCharityEvent.getImagesContentType()).isEqualTo(UPDATED_IMAGES_CONTENT_TYPE);
        assertThat(testCharityEvent.getDuration()).isEqualTo(UPDATED_DURATION);
    }

    @Test
    @Transactional
    void putNonExistingCharityEvent() throws Exception {
        int databaseSizeBeforeUpdate = charityEventRepository.findAll().size();
        charityEvent.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCharityEventMockMvc
            .perform(
                put(ENTITY_API_URL_ID, charityEvent.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(charityEvent))
            )
            .andExpect(status().isBadRequest());

        // Validate the CharityEvent in the database
        List<CharityEvent> charityEventList = charityEventRepository.findAll();
        assertThat(charityEventList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCharityEvent() throws Exception {
        int databaseSizeBeforeUpdate = charityEventRepository.findAll().size();
        charityEvent.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCharityEventMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(charityEvent))
            )
            .andExpect(status().isBadRequest());

        // Validate the CharityEvent in the database
        List<CharityEvent> charityEventList = charityEventRepository.findAll();
        assertThat(charityEventList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCharityEvent() throws Exception {
        int databaseSizeBeforeUpdate = charityEventRepository.findAll().size();
        charityEvent.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCharityEventMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(charityEvent)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the CharityEvent in the database
        List<CharityEvent> charityEventList = charityEventRepository.findAll();
        assertThat(charityEventList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCharityEventWithPatch() throws Exception {
        // Initialize the database
        charityEventRepository.saveAndFlush(charityEvent);

        int databaseSizeBeforeUpdate = charityEventRepository.findAll().size();

        // Update the charityEvent using partial update
        CharityEvent partialUpdatedCharityEvent = new CharityEvent();
        partialUpdatedCharityEvent.setId(charityEvent.getId());

        partialUpdatedCharityEvent.eventName(UPDATED_EVENT_NAME).eventTimeDate(UPDATED_EVENT_TIME_DATE);

        restCharityEventMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCharityEvent.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCharityEvent))
            )
            .andExpect(status().isOk());

        // Validate the CharityEvent in the database
        List<CharityEvent> charityEventList = charityEventRepository.findAll();
        assertThat(charityEventList).hasSize(databaseSizeBeforeUpdate);
        CharityEvent testCharityEvent = charityEventList.get(charityEventList.size() - 1);
        assertThat(testCharityEvent.getEventName()).isEqualTo(UPDATED_EVENT_NAME);
        assertThat(testCharityEvent.getEventTimeDate()).isEqualTo(UPDATED_EVENT_TIME_DATE);
        assertThat(testCharityEvent.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testCharityEvent.getImages()).isEqualTo(DEFAULT_IMAGES);
        assertThat(testCharityEvent.getImagesContentType()).isEqualTo(DEFAULT_IMAGES_CONTENT_TYPE);
        assertThat(testCharityEvent.getDuration()).isEqualTo(DEFAULT_DURATION);
    }

    @Test
    @Transactional
    void fullUpdateCharityEventWithPatch() throws Exception {
        // Initialize the database
        charityEventRepository.saveAndFlush(charityEvent);

        int databaseSizeBeforeUpdate = charityEventRepository.findAll().size();

        // Update the charityEvent using partial update
        CharityEvent partialUpdatedCharityEvent = new CharityEvent();
        partialUpdatedCharityEvent.setId(charityEvent.getId());

        partialUpdatedCharityEvent
            .eventName(UPDATED_EVENT_NAME)
            .eventTimeDate(UPDATED_EVENT_TIME_DATE)
            .description(UPDATED_DESCRIPTION)
            .images(UPDATED_IMAGES)
            .imagesContentType(UPDATED_IMAGES_CONTENT_TYPE)
            .duration(UPDATED_DURATION);

        restCharityEventMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCharityEvent.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCharityEvent))
            )
            .andExpect(status().isOk());

        // Validate the CharityEvent in the database
        List<CharityEvent> charityEventList = charityEventRepository.findAll();
        assertThat(charityEventList).hasSize(databaseSizeBeforeUpdate);
        CharityEvent testCharityEvent = charityEventList.get(charityEventList.size() - 1);
        assertThat(testCharityEvent.getEventName()).isEqualTo(UPDATED_EVENT_NAME);
        assertThat(testCharityEvent.getEventTimeDate()).isEqualTo(UPDATED_EVENT_TIME_DATE);
        assertThat(testCharityEvent.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testCharityEvent.getImages()).isEqualTo(UPDATED_IMAGES);
        assertThat(testCharityEvent.getImagesContentType()).isEqualTo(UPDATED_IMAGES_CONTENT_TYPE);
        assertThat(testCharityEvent.getDuration()).isEqualTo(UPDATED_DURATION);
    }

    @Test
    @Transactional
    void patchNonExistingCharityEvent() throws Exception {
        int databaseSizeBeforeUpdate = charityEventRepository.findAll().size();
        charityEvent.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCharityEventMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, charityEvent.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(charityEvent))
            )
            .andExpect(status().isBadRequest());

        // Validate the CharityEvent in the database
        List<CharityEvent> charityEventList = charityEventRepository.findAll();
        assertThat(charityEventList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCharityEvent() throws Exception {
        int databaseSizeBeforeUpdate = charityEventRepository.findAll().size();
        charityEvent.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCharityEventMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(charityEvent))
            )
            .andExpect(status().isBadRequest());

        // Validate the CharityEvent in the database
        List<CharityEvent> charityEventList = charityEventRepository.findAll();
        assertThat(charityEventList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCharityEvent() throws Exception {
        int databaseSizeBeforeUpdate = charityEventRepository.findAll().size();
        charityEvent.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCharityEventMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(charityEvent))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CharityEvent in the database
        List<CharityEvent> charityEventList = charityEventRepository.findAll();
        assertThat(charityEventList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCharityEvent() throws Exception {
        // Initialize the database
        charityEventRepository.saveAndFlush(charityEvent);

        int databaseSizeBeforeDelete = charityEventRepository.findAll().size();

        // Delete the charityEvent
        restCharityEventMockMvc
            .perform(delete(ENTITY_API_URL_ID, charityEvent.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<CharityEvent> charityEventList = charityEventRepository.findAll();
        assertThat(charityEventList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

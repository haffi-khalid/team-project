package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A CharityEvent.
 */
@Entity
@Table(name = "charity_event")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class CharityEvent implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "event_name")
    private String eventName;

    @Column(name = "event_time_date")
    private ZonedDateTime eventTimeDate;

    @Column(name = "description")
    private String description;

    @Lob
    @Column(name = "images")
    private byte[] images;

    @Column(name = "images_content_type")
    private String imagesContentType;

    @Column(name = "duration")
    private Integer duration;

    @OneToMany(mappedBy = "charityEvent")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "donatorPage", "charityEvent" }, allowSetters = true)
    private Set<GroupDonator> groupDonators = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(
        value = {
            "budgetPlanner",
            "charityProfile",
            "vacancies",
            "charityEvents",
            "fundraisingIdeas",
            "approvedVolunteers",
            "volunteerApplications",
        },
        allowSetters = true
    )
    private CharityAdmin charityAdmin;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public CharityEvent id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEventName() {
        return this.eventName;
    }

    public CharityEvent eventName(String eventName) {
        this.setEventName(eventName);
        return this;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public ZonedDateTime getEventTimeDate() {
        return this.eventTimeDate;
    }

    public CharityEvent eventTimeDate(ZonedDateTime eventTimeDate) {
        this.setEventTimeDate(eventTimeDate);
        return this;
    }

    public void setEventTimeDate(ZonedDateTime eventTimeDate) {
        this.eventTimeDate = eventTimeDate;
    }

    public String getDescription() {
        return this.description;
    }

    public CharityEvent description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public byte[] getImages() {
        return this.images;
    }

    public CharityEvent images(byte[] images) {
        this.setImages(images);
        return this;
    }

    public void setImages(byte[] images) {
        this.images = images;
    }

    public String getImagesContentType() {
        return this.imagesContentType;
    }

    public CharityEvent imagesContentType(String imagesContentType) {
        this.imagesContentType = imagesContentType;
        return this;
    }

    public void setImagesContentType(String imagesContentType) {
        this.imagesContentType = imagesContentType;
    }

    public Integer getDuration() {
        return this.duration;
    }

    public CharityEvent duration(Integer duration) {
        this.setDuration(duration);
        return this;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public Set<GroupDonator> getGroupDonators() {
        return this.groupDonators;
    }

    public void setGroupDonators(Set<GroupDonator> groupDonators) {
        if (this.groupDonators != null) {
            this.groupDonators.forEach(i -> i.setCharityEvent(null));
        }
        if (groupDonators != null) {
            groupDonators.forEach(i -> i.setCharityEvent(this));
        }
        this.groupDonators = groupDonators;
    }

    public CharityEvent groupDonators(Set<GroupDonator> groupDonators) {
        this.setGroupDonators(groupDonators);
        return this;
    }

    public CharityEvent addGroupDonator(GroupDonator groupDonator) {
        this.groupDonators.add(groupDonator);
        groupDonator.setCharityEvent(this);
        return this;
    }

    public CharityEvent removeGroupDonator(GroupDonator groupDonator) {
        this.groupDonators.remove(groupDonator);
        groupDonator.setCharityEvent(null);
        return this;
    }

    public CharityAdmin getCharityAdmin() {
        return this.charityAdmin;
    }

    public void setCharityAdmin(CharityAdmin charityAdmin) {
        this.charityAdmin = charityAdmin;
    }

    public CharityEvent charityAdmin(CharityAdmin charityAdmin) {
        this.setCharityAdmin(charityAdmin);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CharityEvent)) {
            return false;
        }
        return id != null && id.equals(((CharityEvent) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "CharityEvent{" +
            "id=" + getId() +
            ", eventName='" + getEventName() + "'" +
            ", eventTimeDate='" + getEventTimeDate() + "'" +
            ", description='" + getDescription() + "'" +
            ", images='" + getImages() + "'" +
            ", imagesContentType='" + getImagesContentType() + "'" +
            ", duration=" + getDuration() +
            "}";
    }
}

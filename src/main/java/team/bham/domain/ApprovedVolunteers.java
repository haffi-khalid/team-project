package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ApprovedVolunteers.
 */
@Entity
@Table(name = "approved_volunteers")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ApprovedVolunteers implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "volunteer_status")
    private Boolean volunteerStatus;

    @Column(name = "volunteer_hours_completed_in_charity")
    private Integer volunteerHoursCompletedInCharity;

    @Column(name = "current_event_volunteering_in")
    private String currentEventVolunteeringIn;

    @JsonIgnoreProperties(value = { "charityProfile", "approvedVolunteers", "userPage", "vacancies" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private VolunteerApplications volunteerApplications;

    @ManyToOne
    @JsonIgnoreProperties(value = { "user", "volunteerApplications", "reviewComments", "approvedVolunteers" }, allowSetters = true)
    private UserPage userPage;

    @ManyToOne
    @JsonIgnoreProperties(
        value = {
            "budgetPlanner",
            "socialFeed",
            "reviewComments",
            "donatorPages",
            "vacancies",
            "charityEvents",
            "fundraisingIdeas",
            "approvedVolunteers",
            "volunteerApplications",
        },
        allowSetters = true
    )
    private CharityProfile charityProfile;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ApprovedVolunteers id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getVolunteerStatus() {
        return this.volunteerStatus;
    }

    public ApprovedVolunteers volunteerStatus(Boolean volunteerStatus) {
        this.setVolunteerStatus(volunteerStatus);
        return this;
    }

    public void setVolunteerStatus(Boolean volunteerStatus) {
        this.volunteerStatus = volunteerStatus;
    }

    public Integer getVolunteerHoursCompletedInCharity() {
        return this.volunteerHoursCompletedInCharity;
    }

    public ApprovedVolunteers volunteerHoursCompletedInCharity(Integer volunteerHoursCompletedInCharity) {
        this.setVolunteerHoursCompletedInCharity(volunteerHoursCompletedInCharity);
        return this;
    }

    public void setVolunteerHoursCompletedInCharity(Integer volunteerHoursCompletedInCharity) {
        this.volunteerHoursCompletedInCharity = volunteerHoursCompletedInCharity;
    }

    public String getCurrentEventVolunteeringIn() {
        return this.currentEventVolunteeringIn;
    }

    public ApprovedVolunteers currentEventVolunteeringIn(String currentEventVolunteeringIn) {
        this.setCurrentEventVolunteeringIn(currentEventVolunteeringIn);
        return this;
    }

    public void setCurrentEventVolunteeringIn(String currentEventVolunteeringIn) {
        this.currentEventVolunteeringIn = currentEventVolunteeringIn;
    }

    public VolunteerApplications getVolunteerApplications() {
        return this.volunteerApplications;
    }

    public void setVolunteerApplications(VolunteerApplications volunteerApplications) {
        this.volunteerApplications = volunteerApplications;
    }

    public ApprovedVolunteers volunteerApplications(VolunteerApplications volunteerApplications) {
        this.setVolunteerApplications(volunteerApplications);
        return this;
    }

    public UserPage getUserPage() {
        return this.userPage;
    }

    public void setUserPage(UserPage userPage) {
        this.userPage = userPage;
    }

    public ApprovedVolunteers userPage(UserPage userPage) {
        this.setUserPage(userPage);
        return this;
    }

    public CharityProfile getCharityProfile() {
        return this.charityProfile;
    }

    public void setCharityProfile(CharityProfile charityProfile) {
        this.charityProfile = charityProfile;
    }

    public ApprovedVolunteers charityProfile(CharityProfile charityProfile) {
        this.setCharityProfile(charityProfile);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ApprovedVolunteers)) {
            return false;
        }
        return id != null && id.equals(((ApprovedVolunteers) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ApprovedVolunteers{" +
            "id=" + getId() +
            ", volunteerStatus='" + getVolunteerStatus() + "'" +
            ", volunteerHoursCompletedInCharity=" + getVolunteerHoursCompletedInCharity() +
            ", currentEventVolunteeringIn='" + getCurrentEventVolunteeringIn() + "'" +
            "}";
    }
}

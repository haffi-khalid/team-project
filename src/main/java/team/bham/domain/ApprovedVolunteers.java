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

    @ManyToOne
    @JsonIgnoreProperties(
        value = { "user", "userPage", "authentication", "volunteerApplications", "reviewComments", "approvedVolunteers" },
        allowSetters = true
    )
    private CharityHubUser charityHubUser;

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

    public CharityHubUser getCharityHubUser() {
        return this.charityHubUser;
    }

    public void setCharityHubUser(CharityHubUser charityHubUser) {
        this.charityHubUser = charityHubUser;
    }

    public ApprovedVolunteers charityHubUser(CharityHubUser charityHubUser) {
        this.setCharityHubUser(charityHubUser);
        return this;
    }

    public CharityAdmin getCharityAdmin() {
        return this.charityAdmin;
    }

    public void setCharityAdmin(CharityAdmin charityAdmin) {
        this.charityAdmin = charityAdmin;
    }

    public ApprovedVolunteers charityAdmin(CharityAdmin charityAdmin) {
        this.setCharityAdmin(charityAdmin);
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

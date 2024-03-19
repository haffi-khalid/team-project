package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import team.bham.domain.enumeration.ApplicationCategory;

/**
 * A VolunteerApplications.
 */
@Entity
@Table(name = "volunteer_applications")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class VolunteerApplications implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "time_stamp")
    private Instant timeStamp;

    @Enumerated(EnumType.STRING)
    @Column(name = "volunteer_status")
    private ApplicationCategory volunteerStatus;

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

    @JsonIgnoreProperties(value = { "volunteerApplications", "userPage", "charityProfile" }, allowSetters = true)
    @OneToOne(mappedBy = "volunteerApplications")
    private ApprovedVolunteers approvedVolunteers;

    @ManyToOne
    @JsonIgnoreProperties(value = { "user", "volunteerApplications", "reviewComments", "approvedVolunteers" }, allowSetters = true)
    private UserPage userPage;

    @ManyToOne
    @JsonIgnoreProperties(value = { "volunteerApplications", "charityProfile" }, allowSetters = true)
    private Vacancies vacancies;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public VolunteerApplications id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getTimeStamp() {
        return this.timeStamp;
    }

    public VolunteerApplications timeStamp(Instant timeStamp) {
        this.setTimeStamp(timeStamp);
        return this;
    }

    public void setTimeStamp(Instant timeStamp) {
        this.timeStamp = timeStamp;
    }

    public ApplicationCategory getVolunteerStatus() {
        return this.volunteerStatus;
    }

    public VolunteerApplications volunteerStatus(ApplicationCategory volunteerStatus) {
        this.setVolunteerStatus(volunteerStatus);
        return this;
    }

    public void setVolunteerStatus(ApplicationCategory volunteerStatus) {
        this.volunteerStatus = volunteerStatus;
    }

    public CharityProfile getCharityProfile() {
        return this.charityProfile;
    }

    public void setCharityProfile(CharityProfile charityProfile) {
        this.charityProfile = charityProfile;
    }

    public VolunteerApplications charityProfile(CharityProfile charityProfile) {
        this.setCharityProfile(charityProfile);
        return this;
    }

    public ApprovedVolunteers getApprovedVolunteers() {
        return this.approvedVolunteers;
    }

    public void setApprovedVolunteers(ApprovedVolunteers approvedVolunteers) {
        if (this.approvedVolunteers != null) {
            this.approvedVolunteers.setVolunteerApplications(null);
        }
        if (approvedVolunteers != null) {
            approvedVolunteers.setVolunteerApplications(this);
        }
        this.approvedVolunteers = approvedVolunteers;
    }

    public VolunteerApplications approvedVolunteers(ApprovedVolunteers approvedVolunteers) {
        this.setApprovedVolunteers(approvedVolunteers);
        return this;
    }

    public UserPage getUserPage() {
        return this.userPage;
    }

    public void setUserPage(UserPage userPage) {
        this.userPage = userPage;
    }

    public VolunteerApplications userPage(UserPage userPage) {
        this.setUserPage(userPage);
        return this;
    }

    public Vacancies getVacancies() {
        return this.vacancies;
    }

    public void setVacancies(Vacancies vacancies) {
        this.vacancies = vacancies;
    }

    public VolunteerApplications vacancies(Vacancies vacancies) {
        this.setVacancies(vacancies);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof VolunteerApplications)) {
            return false;
        }
        return id != null && id.equals(((VolunteerApplications) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "VolunteerApplications{" +
            "id=" + getId() +
            ", timeStamp='" + getTimeStamp() + "'" +
            ", volunteerStatus='" + getVolunteerStatus() + "'" +
            "}";
    }
}

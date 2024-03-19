package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Type;
import team.bham.domain.enumeration.LocationCategory;

/**
 * A FundraisingIdea.
 */
@Entity
@Table(name = "fundraising_idea")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class FundraisingIdea implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "idea_name")
    private String ideaName;

    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "idea_description")
    private String ideaDescription;

    @Column(name = "number_of_volunteers")
    private Integer numberOfVolunteers;

    @Enumerated(EnumType.STRING)
    @Column(name = "location")
    private LocationCategory location;

    @Column(name = "expected_cost")
    private Double expectedCost;

    @Column(name = "expected_attendance")
    private Integer expectedAttendance;

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

    public FundraisingIdea id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getIdeaName() {
        return this.ideaName;
    }

    public FundraisingIdea ideaName(String ideaName) {
        this.setIdeaName(ideaName);
        return this;
    }

    public void setIdeaName(String ideaName) {
        this.ideaName = ideaName;
    }

    public String getIdeaDescription() {
        return this.ideaDescription;
    }

    public FundraisingIdea ideaDescription(String ideaDescription) {
        this.setIdeaDescription(ideaDescription);
        return this;
    }

    public void setIdeaDescription(String ideaDescription) {
        this.ideaDescription = ideaDescription;
    }

    public Integer getNumberOfVolunteers() {
        return this.numberOfVolunteers;
    }

    public FundraisingIdea numberOfVolunteers(Integer numberOfVolunteers) {
        this.setNumberOfVolunteers(numberOfVolunteers);
        return this;
    }

    public void setNumberOfVolunteers(Integer numberOfVolunteers) {
        this.numberOfVolunteers = numberOfVolunteers;
    }

    public LocationCategory getLocation() {
        return this.location;
    }

    public FundraisingIdea location(LocationCategory location) {
        this.setLocation(location);
        return this;
    }

    public void setLocation(LocationCategory location) {
        this.location = location;
    }

    public Double getExpectedCost() {
        return this.expectedCost;
    }

    public FundraisingIdea expectedCost(Double expectedCost) {
        this.setExpectedCost(expectedCost);
        return this;
    }

    public void setExpectedCost(Double expectedCost) {
        this.expectedCost = expectedCost;
    }

    public Integer getExpectedAttendance() {
        return this.expectedAttendance;
    }

    public FundraisingIdea expectedAttendance(Integer expectedAttendance) {
        this.setExpectedAttendance(expectedAttendance);
        return this;
    }

    public void setExpectedAttendance(Integer expectedAttendance) {
        this.expectedAttendance = expectedAttendance;
    }

    public CharityProfile getCharityProfile() {
        return this.charityProfile;
    }

    public void setCharityProfile(CharityProfile charityProfile) {
        this.charityProfile = charityProfile;
    }

    public FundraisingIdea charityProfile(CharityProfile charityProfile) {
        this.setCharityProfile(charityProfile);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof FundraisingIdea)) {
            return false;
        }
        return id != null && id.equals(((FundraisingIdea) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "FundraisingIdea{" +
            "id=" + getId() +
            ", ideaName='" + getIdeaName() + "'" +
            ", ideaDescription='" + getIdeaDescription() + "'" +
            ", numberOfVolunteers=" + getNumberOfVolunteers() +
            ", location='" + getLocation() + "'" +
            ", expectedCost=" + getExpectedCost() +
            ", expectedAttendance=" + getExpectedAttendance() +
            "}";
    }
}

package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A UserPage.
 */
@Entity
@Table(name = "user_page")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class UserPage implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "volunteer_hours")
    private Double volunteerHours;

    @Column(name = "user_bio")
    private String userBio;

    @Column(name = "review_comment")
    private String reviewComment;

    @Column(name = "course")
    private String course;

    @Column(name = "skills")
    private String skills;

    @JsonIgnoreProperties(
        value = { "userPage", "authentication", "volunteerApplications", "reviewComments", "approvedVolunteers" },
        allowSetters = true
    )
    @OneToOne(mappedBy = "userPage")
    private CharityHubUser charityHubUser;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public UserPage id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getVolunteerHours() {
        return this.volunteerHours;
    }

    public UserPage volunteerHours(Double volunteerHours) {
        this.setVolunteerHours(volunteerHours);
        return this;
    }

    public void setVolunteerHours(Double volunteerHours) {
        this.volunteerHours = volunteerHours;
    }

    public String getUserBio() {
        return this.userBio;
    }

    public UserPage userBio(String userBio) {
        this.setUserBio(userBio);
        return this;
    }

    public void setUserBio(String userBio) {
        this.userBio = userBio;
    }

    public String getReviewComment() {
        return this.reviewComment;
    }

    public UserPage reviewComment(String reviewComment) {
        this.setReviewComment(reviewComment);
        return this;
    }

    public void setReviewComment(String reviewComment) {
        this.reviewComment = reviewComment;
    }

    public String getCourse() {
        return this.course;
    }

    public UserPage course(String course) {
        this.setCourse(course);
        return this;
    }

    public void setCourse(String course) {
        this.course = course;
    }

    public String getSkills() {
        return this.skills;
    }

    public UserPage skills(String skills) {
        this.setSkills(skills);
        return this;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public CharityHubUser getCharityHubUser() {
        return this.charityHubUser;
    }

    public void setCharityHubUser(CharityHubUser charityHubUser) {
        if (this.charityHubUser != null) {
            this.charityHubUser.setUserPage(null);
        }
        if (charityHubUser != null) {
            charityHubUser.setUserPage(this);
        }
        this.charityHubUser = charityHubUser;
    }

    public UserPage charityHubUser(CharityHubUser charityHubUser) {
        this.setCharityHubUser(charityHubUser);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserPage)) {
            return false;
        }
        return id != null && id.equals(((UserPage) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UserPage{" +
            "id=" + getId() +
            ", volunteerHours=" + getVolunteerHours() +
            ", userBio='" + getUserBio() + "'" +
            ", reviewComment='" + getReviewComment() + "'" +
            ", course='" + getCourse() + "'" +
            ", skills='" + getSkills() + "'" +
            "}";
    }
}

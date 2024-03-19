package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Type;

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

    @Lob
    @Column(name = "profile_picture")
    private byte[] profilePicture;

    @Column(name = "profile_picture_content_type")
    private String profilePictureContentType;

    @Column(name = "name")
    private String name;

    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "user_bio")
    private String userBio;

    @Column(name = "volunteer_hours")
    private Integer volunteerHours;

    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "review_comment")
    private String reviewComment;

    @Column(name = "course")
    private String course;

    @Column(name = "skills")
    private String skills;

    @OneToOne
    @JoinColumn(unique = true)
    private User user;

    @OneToMany(mappedBy = "userPage")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "charityProfile", "approvedVolunteers", "userPage", "vacancies" }, allowSetters = true)
    private Set<VolunteerApplications> volunteerApplications = new HashSet<>();

    @OneToMany(mappedBy = "userPage")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "userPage", "charityProfile" }, allowSetters = true)
    private Set<ReviewComments> reviewComments = new HashSet<>();

    @OneToMany(mappedBy = "userPage")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "volunteerApplications", "userPage", "charityProfile" }, allowSetters = true)
    private Set<ApprovedVolunteers> approvedVolunteers = new HashSet<>();

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

    public byte[] getProfilePicture() {
        return this.profilePicture;
    }

    public UserPage profilePicture(byte[] profilePicture) {
        this.setProfilePicture(profilePicture);
        return this;
    }

    public void setProfilePicture(byte[] profilePicture) {
        this.profilePicture = profilePicture;
    }

    public String getProfilePictureContentType() {
        return this.profilePictureContentType;
    }

    public UserPage profilePictureContentType(String profilePictureContentType) {
        this.profilePictureContentType = profilePictureContentType;
        return this;
    }

    public void setProfilePictureContentType(String profilePictureContentType) {
        this.profilePictureContentType = profilePictureContentType;
    }

    public String getName() {
        return this.name;
    }

    public UserPage name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
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

    public Integer getVolunteerHours() {
        return this.volunteerHours;
    }

    public UserPage volunteerHours(Integer volunteerHours) {
        this.setVolunteerHours(volunteerHours);
        return this;
    }

    public void setVolunteerHours(Integer volunteerHours) {
        this.volunteerHours = volunteerHours;
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

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public UserPage user(User user) {
        this.setUser(user);
        return this;
    }

    public Set<VolunteerApplications> getVolunteerApplications() {
        return this.volunteerApplications;
    }

    public void setVolunteerApplications(Set<VolunteerApplications> volunteerApplications) {
        if (this.volunteerApplications != null) {
            this.volunteerApplications.forEach(i -> i.setUserPage(null));
        }
        if (volunteerApplications != null) {
            volunteerApplications.forEach(i -> i.setUserPage(this));
        }
        this.volunteerApplications = volunteerApplications;
    }

    public UserPage volunteerApplications(Set<VolunteerApplications> volunteerApplications) {
        this.setVolunteerApplications(volunteerApplications);
        return this;
    }

    public UserPage addVolunteerApplications(VolunteerApplications volunteerApplications) {
        this.volunteerApplications.add(volunteerApplications);
        volunteerApplications.setUserPage(this);
        return this;
    }

    public UserPage removeVolunteerApplications(VolunteerApplications volunteerApplications) {
        this.volunteerApplications.remove(volunteerApplications);
        volunteerApplications.setUserPage(null);
        return this;
    }

    public Set<ReviewComments> getReviewComments() {
        return this.reviewComments;
    }

    public void setReviewComments(Set<ReviewComments> reviewComments) {
        if (this.reviewComments != null) {
            this.reviewComments.forEach(i -> i.setUserPage(null));
        }
        if (reviewComments != null) {
            reviewComments.forEach(i -> i.setUserPage(this));
        }
        this.reviewComments = reviewComments;
    }

    public UserPage reviewComments(Set<ReviewComments> reviewComments) {
        this.setReviewComments(reviewComments);
        return this;
    }

    public UserPage addReviewComments(ReviewComments reviewComments) {
        this.reviewComments.add(reviewComments);
        reviewComments.setUserPage(this);
        return this;
    }

    public UserPage removeReviewComments(ReviewComments reviewComments) {
        this.reviewComments.remove(reviewComments);
        reviewComments.setUserPage(null);
        return this;
    }

    public Set<ApprovedVolunteers> getApprovedVolunteers() {
        return this.approvedVolunteers;
    }

    public void setApprovedVolunteers(Set<ApprovedVolunteers> approvedVolunteers) {
        if (this.approvedVolunteers != null) {
            this.approvedVolunteers.forEach(i -> i.setUserPage(null));
        }
        if (approvedVolunteers != null) {
            approvedVolunteers.forEach(i -> i.setUserPage(this));
        }
        this.approvedVolunteers = approvedVolunteers;
    }

    public UserPage approvedVolunteers(Set<ApprovedVolunteers> approvedVolunteers) {
        this.setApprovedVolunteers(approvedVolunteers);
        return this;
    }

    public UserPage addApprovedVolunteers(ApprovedVolunteers approvedVolunteers) {
        this.approvedVolunteers.add(approvedVolunteers);
        approvedVolunteers.setUserPage(this);
        return this;
    }

    public UserPage removeApprovedVolunteers(ApprovedVolunteers approvedVolunteers) {
        this.approvedVolunteers.remove(approvedVolunteers);
        approvedVolunteers.setUserPage(null);
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
            ", profilePicture='" + getProfilePicture() + "'" +
            ", profilePictureContentType='" + getProfilePictureContentType() + "'" +
            ", name='" + getName() + "'" +
            ", userBio='" + getUserBio() + "'" +
            ", volunteerHours=" + getVolunteerHours() +
            ", reviewComment='" + getReviewComment() + "'" +
            ", course='" + getCourse() + "'" +
            ", skills='" + getSkills() + "'" +
            "}";
    }
}

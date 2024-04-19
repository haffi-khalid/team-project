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
 * A CharityHubUser.
 */
@Entity
@Table(name = "charity_hub_user")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class CharityHubUser implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "username")
    private String username;

    @Column(name = "email")
    private String email;

    @Column(name = "name")
    private String name;

    @Column(name = "volunteer_hours")
    private Integer volunteerHours;

    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "user_bio")
    private String userBio;

    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "review_comment")
    private String reviewComment;

    @Lob
    @Column(name = "images")
    private byte[] images;

    @Column(name = "images_content_type")
    private String imagesContentType;

    @Column(name = "course")
    private String course;

    @Column(name = "skills")
    private String skills;

    @OneToOne
    @JoinColumn(unique = true)
    private User user;

    @JsonIgnoreProperties(value = { "charityHubUser" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private UserPage userPage;

    @JsonIgnoreProperties(value = { "charityHubUser" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Authentication authentication;

    @OneToMany(mappedBy = "charityHubUser")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "charityAdmin", "charityHubUser", "vacancies" }, allowSetters = true)
    private Set<VolunteerApplications> volunteerApplications = new HashSet<>();

    @OneToMany(mappedBy = "charityHubUser")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "charityHubUser", "charityProfile" }, allowSetters = true)
    private Set<ReviewComments> reviewComments = new HashSet<>();

    @OneToMany(mappedBy = "charityHubUser")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "charityHubUser", "charityAdmin" }, allowSetters = true)
    private Set<ApprovedVolunteers> approvedVolunteers = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    // Getter and setter for volunteerHours
    public Integer getVolunteerHours() {
        return volunteerHours;
    }

    public void setVolunteerHours(Integer volunteerHours) {
        this.volunteerHours = volunteerHours;
    }

    // Getter and setter for userBio
    public String getUserBio() {
        return userBio;
    }

    public void setUserBio(String userBio) {
        this.userBio = userBio;
    }

    // Getter and setter for name
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    // Getter and setter for reviewComment
    public String getReviewComment() {
        return reviewComment;
    }

    public byte[] getImages() {
        return this.images;
    }

    public CharityHubUser images(byte[] images) {
        this.setImages(images);
        return this;
    }

    public void setImages(byte[] images) {
        this.images = images;
    }

    public String getImagesContentType() {
        return this.imagesContentType;
    }

    public CharityHubUser imagesContentType(String imagesContentType) {
        this.imagesContentType = imagesContentType;
        return this;
    }

    public void setImagesContentType(String imagesContentType) {
        this.imagesContentType = imagesContentType;
    }

    public void setReviewComment(String reviewComment) {
        this.reviewComment = reviewComment;
    }

    // Getter and setter for course
    public String getCourse() {
        return course;
    }

    public void setCourse(String course) {
        this.course = course;
    }

    // Getter and setter for skills
    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public Long getId() {
        return this.id;
    }

    public CharityHubUser id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return this.username;
    }

    public CharityHubUser username(String username) {
        this.setUsername(username);
        return this;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return this.email;
    }

    public CharityHubUser email(String email) {
        this.setEmail(email);
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public CharityHubUser user(User user) {
        this.setUser(user);
        return this;
    }

    public UserPage getUserPage() {
        return this.userPage;
    }

    public void setUserPage(UserPage userPage) {
        this.userPage = userPage;
    }

    public CharityHubUser userPage(UserPage userPage) {
        this.setUserPage(userPage);
        return this;
    }

    public Authentication getAuthentication() {
        return this.authentication;
    }

    public void setAuthentication(Authentication authentication) {
        this.authentication = authentication;
    }

    public CharityHubUser authentication(Authentication authentication) {
        this.setAuthentication(authentication);
        return this;
    }

    public Set<VolunteerApplications> getVolunteerApplications() {
        return this.volunteerApplications;
    }

    public void setVolunteerApplications(Set<VolunteerApplications> volunteerApplications) {
        if (this.volunteerApplications != null) {
            this.volunteerApplications.forEach(i -> i.setCharityHubUser(null));
        }
        if (volunteerApplications != null) {
            volunteerApplications.forEach(i -> i.setCharityHubUser(this));
        }
        this.volunteerApplications = volunteerApplications;
    }

    public CharityHubUser volunteerApplications(Set<VolunteerApplications> volunteerApplications) {
        this.setVolunteerApplications(volunteerApplications);
        return this;
    }

    public CharityHubUser addVolunteerApplications(VolunteerApplications volunteerApplications) {
        this.volunteerApplications.add(volunteerApplications);
        volunteerApplications.setCharityHubUser(this);
        return this;
    }

    public CharityHubUser removeVolunteerApplications(VolunteerApplications volunteerApplications) {
        this.volunteerApplications.remove(volunteerApplications);
        volunteerApplications.setCharityHubUser(null);
        return this;
    }

    public Set<ReviewComments> getReviewComments() {
        return this.reviewComments;
    }

    public void setReviewComments(Set<ReviewComments> reviewComments) {
        if (this.reviewComments != null) {
            this.reviewComments.forEach(i -> i.setCharityHubUser(null));
        }
        if (reviewComments != null) {
            reviewComments.forEach(i -> i.setCharityHubUser(this));
        }
        this.reviewComments = reviewComments;
    }

    public CharityHubUser reviewComments(Set<ReviewComments> reviewComments) {
        this.setReviewComments(reviewComments);
        return this;
    }

    public CharityHubUser addReviewComments(ReviewComments reviewComments) {
        this.reviewComments.add(reviewComments);
        reviewComments.setCharityHubUser(this);
        return this;
    }

    public CharityHubUser removeReviewComments(ReviewComments reviewComments) {
        this.reviewComments.remove(reviewComments);
        reviewComments.setCharityHubUser(null);
        return this;
    }

    public Set<ApprovedVolunteers> getApprovedVolunteers() {
        return this.approvedVolunteers;
    }

    public void setApprovedVolunteers(Set<ApprovedVolunteers> approvedVolunteers) {
        if (this.approvedVolunteers != null) {
            this.approvedVolunteers.forEach(i -> i.setCharityHubUser(null));
        }
        if (approvedVolunteers != null) {
            approvedVolunteers.forEach(i -> i.setCharityHubUser(this));
        }
        this.approvedVolunteers = approvedVolunteers;
    }

    public CharityHubUser approvedVolunteers(Set<ApprovedVolunteers> approvedVolunteers) {
        this.setApprovedVolunteers(approvedVolunteers);
        return this;
    }

    public CharityHubUser addApprovedVolunteers(ApprovedVolunteers approvedVolunteers) {
        this.approvedVolunteers.add(approvedVolunteers);
        approvedVolunteers.setCharityHubUser(this);
        return this;
    }

    public CharityHubUser removeApprovedVolunteers(ApprovedVolunteers approvedVolunteers) {
        this.approvedVolunteers.remove(approvedVolunteers);
        approvedVolunteers.setCharityHubUser(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CharityHubUser)) {
            return false;
        }
        return id != null && id.equals(((CharityHubUser) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return (
            "CharityHubUser{" +
            "id=" +
            id +
            ", username='" +
            username +
            '\'' +
            ", email='" +
            email +
            '\'' +
            ", name='" +
            name +
            '\'' +
            ", volunteerHours=" +
            volunteerHours +
            ", userBio='" +
            userBio +
            '\'' +
            ", reviewComment='" +
            reviewComment +
            '\'' +
            ", images='" +
            getImages() +
            "'" +
            ", imagesContentType='" +
            getImagesContentType() +
            "'" +
            ", course='" +
            course +
            '\'' +
            ", skills='" +
            skills +
            '\'' +
            '}'
        );
    }
}

package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Type;

/**
 * A ReviewComments.
 */
@Entity
@Table(name = "review_comments")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ReviewComments implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "parent_id")
    private Integer parentID;

    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "content")
    private String content;

    @Column(name = "timestamp")
    private Instant timestamp;

    @Column(name = "status")
    private String status;

    @ManyToOne
    @JsonIgnoreProperties(
        value = { "user", "userPage", "authentication", "volunteerApplications", "reviewComments", "approvedVolunteers" },
        allowSetters = true
    )
    private CharityHubUser charityHubUser;

    @ManyToOne
    @JsonIgnoreProperties(value = { "socialFeed", "reviewComments", "donatorPages", "vacancies", "charityEvents" }, allowSetters = true)
    private CharityProfile charityProfile;

    // New field for login
    @Column(name = "login")
    private String login;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ReviewComments id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getParentID() {
        return this.parentID;
    }

    public ReviewComments parentID(Integer parentID) {
        this.setParentID(parentID);
        return this;
    }

    public void setParentID(Integer parentID) {
        this.parentID = parentID;
    }

    public String getContent() {
        return this.content;
    }

    public ReviewComments content(String content) {
        this.setContent(content);
        return this;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Instant getTimestamp() {
        return this.timestamp;
    }

    public ReviewComments timestamp(Instant timestamp) {
        this.setTimestamp(timestamp);
        return this;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    public String getStatus() {
        return this.status;
    }

    public ReviewComments status(String status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public CharityHubUser getCharityHubUser() {
        return this.charityHubUser;
    }

    public void setCharityHubUser(CharityHubUser charityHubUser) {
        this.charityHubUser = charityHubUser;
    }

    public ReviewComments charityHubUser(CharityHubUser charityHubUser) {
        this.setCharityHubUser(charityHubUser);
        return this;
    }

    public CharityProfile getCharityProfile() {
        return this.charityProfile;
    }

    public void setCharityProfile(CharityProfile charityProfile) {
        this.charityProfile = charityProfile;
    }

    public ReviewComments charityProfile(CharityProfile charityProfile) {
        this.setCharityProfile(charityProfile);
        return this;
    }

    public String getLogin() {
        return this.login;
    }

    public ReviewComments login(String login) {
        this.setLogin(login);
        return this;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ReviewComments)) {
            return false;
        }
        return id != null && id.equals(((ReviewComments) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ReviewComments{" +
            "id=" + getId() +
            ", parentID=" + getParentID() +
            ", content='" + getContent() + "'" +
            ", timestamp='" + getTimestamp() + "'" +
            ", status='" + getStatus() + "'" +
            ", login='" + getLogin() + "'" +
            "}";
    }
}

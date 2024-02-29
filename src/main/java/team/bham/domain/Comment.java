package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Comment.
 */
@Entity
@Table(name = "comment")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Comment implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "parent_id")
    private Integer parentID;

    @Column(name = "content")
    private String content;

    @Column(name = "time_stamp")
    private Instant timeStamp;

    @Column(name = "status")
    private String status;

    @OneToMany(mappedBy = "commentID")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "parentIDS", "charityID", "userProfile", "commentID" }, allowSetters = true)
    private Set<Comment> parentIDS = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "socialFeeds", "charityIDS" }, allowSetters = true)
    private Charity charityID;

    @ManyToOne
    @JsonIgnoreProperties(value = { "comments" }, allowSetters = true)
    private UserProfile userProfile;

    @ManyToOne
    @JsonIgnoreProperties(value = { "parentIDS", "charityID", "userProfile", "commentID" }, allowSetters = true)
    private Comment commentID;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Comment id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getParentID() {
        return this.parentID;
    }

    public Comment parentID(Integer parentID) {
        this.setParentID(parentID);
        return this;
    }

    public void setParentID(Integer parentID) {
        this.parentID = parentID;
    }

    public String getContent() {
        return this.content;
    }

    public Comment content(String content) {
        this.setContent(content);
        return this;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Instant getTimeStamp() {
        return this.timeStamp;
    }

    public Comment timeStamp(Instant timeStamp) {
        this.setTimeStamp(timeStamp);
        return this;
    }

    public void setTimeStamp(Instant timeStamp) {
        this.timeStamp = timeStamp;
    }

    public String getStatus() {
        return this.status;
    }

    public Comment status(String status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Set<Comment> getParentIDS() {
        return this.parentIDS;
    }

    public void setParentIDS(Set<Comment> comments) {
        if (this.parentIDS != null) {
            this.parentIDS.forEach(i -> i.setCommentID(null));
        }
        if (comments != null) {
            comments.forEach(i -> i.setCommentID(this));
        }
        this.parentIDS = comments;
    }

    public Comment parentIDS(Set<Comment> comments) {
        this.setParentIDS(comments);
        return this;
    }

    public Comment addParentID(Comment comment) {
        this.parentIDS.add(comment);
        comment.setCommentID(this);
        return this;
    }

    public Comment removeParentID(Comment comment) {
        this.parentIDS.remove(comment);
        comment.setCommentID(null);
        return this;
    }

    public Charity getCharityID() {
        return this.charityID;
    }

    public void setCharityID(Charity charity) {
        this.charityID = charity;
    }

    public Comment charityID(Charity charity) {
        this.setCharityID(charity);
        return this;
    }

    public UserProfile getUserProfile() {
        return this.userProfile;
    }

    public void setUserProfile(UserProfile userProfile) {
        this.userProfile = userProfile;
    }

    public Comment userProfile(UserProfile userProfile) {
        this.setUserProfile(userProfile);
        return this;
    }

    public Comment getCommentID() {
        return this.commentID;
    }

    public void setCommentID(Comment comment) {
        this.commentID = comment;
    }

    public Comment commentID(Comment comment) {
        this.setCommentID(comment);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Comment)) {
            return false;
        }
        return id != null && id.equals(((Comment) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Comment{" +
            "id=" + getId() +
            ", parentID=" + getParentID() +
            ", content='" + getContent() + "'" +
            ", timeStamp='" + getTimeStamp() + "'" +
            ", status='" + getStatus() + "'" +
            "}";
    }
}

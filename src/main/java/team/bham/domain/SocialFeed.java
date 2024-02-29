package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A SocialFeed.
 */
@Entity
@Table(name = "social_feed")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class SocialFeed implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "platform", nullable = false)
    private String platform;

    @Column(name = "last_updated")
    private Instant lastUpdated;

    @OneToMany(mappedBy = "socialFeed")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "media", "socialFeed" }, allowSetters = true)
    private Set<Post> posts = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "socialFeeds", "charityIDS" }, allowSetters = true)
    private Charity charity;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public SocialFeed id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPlatform() {
        return this.platform;
    }

    public SocialFeed platform(String platform) {
        this.setPlatform(platform);
        return this;
    }

    public void setPlatform(String platform) {
        this.platform = platform;
    }

    public Instant getLastUpdated() {
        return this.lastUpdated;
    }

    public SocialFeed lastUpdated(Instant lastUpdated) {
        this.setLastUpdated(lastUpdated);
        return this;
    }

    public void setLastUpdated(Instant lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    public Set<Post> getPosts() {
        return this.posts;
    }

    public void setPosts(Set<Post> posts) {
        if (this.posts != null) {
            this.posts.forEach(i -> i.setSocialFeed(null));
        }
        if (posts != null) {
            posts.forEach(i -> i.setSocialFeed(this));
        }
        this.posts = posts;
    }

    public SocialFeed posts(Set<Post> posts) {
        this.setPosts(posts);
        return this;
    }

    public SocialFeed addPost(Post post) {
        this.posts.add(post);
        post.setSocialFeed(this);
        return this;
    }

    public SocialFeed removePost(Post post) {
        this.posts.remove(post);
        post.setSocialFeed(null);
        return this;
    }

    public Charity getCharity() {
        return this.charity;
    }

    public void setCharity(Charity charity) {
        this.charity = charity;
    }

    public SocialFeed charity(Charity charity) {
        this.setCharity(charity);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof SocialFeed)) {
            return false;
        }
        return id != null && id.equals(((SocialFeed) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "SocialFeed{" +
            "id=" + getId() +
            ", platform='" + getPlatform() + "'" +
            ", lastUpdated='" + getLastUpdated() + "'" +
            "}";
    }
}

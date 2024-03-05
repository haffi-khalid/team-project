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

    @Column(name = "last_updated")
    private Instant lastUpdated;

    @OneToMany(mappedBy = "socialFeed")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "socialFeed" }, allowSetters = true)
    private Set<Posts> posts = new HashSet<>();

    @JsonIgnoreProperties(value = { "socialFeed", "reviewComments", "donatorPages", "charityAdmin" }, allowSetters = true)
    @OneToOne(mappedBy = "socialFeed")
    private CharityProfile charityProfile;

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

    public Set<Posts> getPosts() {
        return this.posts;
    }

    public void setPosts(Set<Posts> posts) {
        if (this.posts != null) {
            this.posts.forEach(i -> i.setSocialFeed(null));
        }
        if (posts != null) {
            posts.forEach(i -> i.setSocialFeed(this));
        }
        this.posts = posts;
    }

    public SocialFeed posts(Set<Posts> posts) {
        this.setPosts(posts);
        return this;
    }

    public SocialFeed addPosts(Posts posts) {
        this.posts.add(posts);
        posts.setSocialFeed(this);
        return this;
    }

    public SocialFeed removePosts(Posts posts) {
        this.posts.remove(posts);
        posts.setSocialFeed(null);
        return this;
    }

    public CharityProfile getCharityProfile() {
        return this.charityProfile;
    }

    public void setCharityProfile(CharityProfile charityProfile) {
        if (this.charityProfile != null) {
            this.charityProfile.setSocialFeed(null);
        }
        if (charityProfile != null) {
            charityProfile.setSocialFeed(this);
        }
        this.charityProfile = charityProfile;
    }

    public SocialFeed charityProfile(CharityProfile charityProfile) {
        this.setCharityProfile(charityProfile);
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
            ", lastUpdated='" + getLastUpdated() + "'" +
            "}";
    }
}

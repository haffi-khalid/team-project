package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Charity.
 */
@Entity
@Table(name = "charity")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Charity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @OneToMany(mappedBy = "charity")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "posts", "charity" }, allowSetters = true)
    private Set<SocialFeed> socialFeeds = new HashSet<>();

    @OneToMany(mappedBy = "charityID")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "parentIDS", "charityID", "userProfile", "commentID" }, allowSetters = true)
    private Set<Comment> charityIDS = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Charity id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Charity name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<SocialFeed> getSocialFeeds() {
        return this.socialFeeds;
    }

    public void setSocialFeeds(Set<SocialFeed> socialFeeds) {
        if (this.socialFeeds != null) {
            this.socialFeeds.forEach(i -> i.setCharity(null));
        }
        if (socialFeeds != null) {
            socialFeeds.forEach(i -> i.setCharity(this));
        }
        this.socialFeeds = socialFeeds;
    }

    public Charity socialFeeds(Set<SocialFeed> socialFeeds) {
        this.setSocialFeeds(socialFeeds);
        return this;
    }

    public Charity addSocialFeed(SocialFeed socialFeed) {
        this.socialFeeds.add(socialFeed);
        socialFeed.setCharity(this);
        return this;
    }

    public Charity removeSocialFeed(SocialFeed socialFeed) {
        this.socialFeeds.remove(socialFeed);
        socialFeed.setCharity(null);
        return this;
    }

    public Set<Comment> getCharityIDS() {
        return this.charityIDS;
    }

    public void setCharityIDS(Set<Comment> comments) {
        if (this.charityIDS != null) {
            this.charityIDS.forEach(i -> i.setCharityID(null));
        }
        if (comments != null) {
            comments.forEach(i -> i.setCharityID(this));
        }
        this.charityIDS = comments;
    }

    public Charity charityIDS(Set<Comment> comments) {
        this.setCharityIDS(comments);
        return this;
    }

    public Charity addCharityID(Comment comment) {
        this.charityIDS.add(comment);
        comment.setCharityID(this);
        return this;
    }

    public Charity removeCharityID(Comment comment) {
        this.charityIDS.remove(comment);
        comment.setCharityID(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Charity)) {
            return false;
        }
        return id != null && id.equals(((Charity) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Charity{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}

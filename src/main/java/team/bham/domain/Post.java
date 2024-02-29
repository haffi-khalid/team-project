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
 * A Post.
 */
@Entity
@Table(name = "post")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Post implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "content")
    private String content;

    @Column(name = "timestamp")
    private Instant timestamp;

    @Column(name = "likes")
    private Integer likes;

    @Column(name = "shares")
    private Integer shares;

    @OneToMany(mappedBy = "post")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "post" }, allowSetters = true)
    private Set<Media> media = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "posts", "charity" }, allowSetters = true)
    private SocialFeed socialFeed;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Post id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContent() {
        return this.content;
    }

    public Post content(String content) {
        this.setContent(content);
        return this;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Instant getTimestamp() {
        return this.timestamp;
    }

    public Post timestamp(Instant timestamp) {
        this.setTimestamp(timestamp);
        return this;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    public Integer getLikes() {
        return this.likes;
    }

    public Post likes(Integer likes) {
        this.setLikes(likes);
        return this;
    }

    public void setLikes(Integer likes) {
        this.likes = likes;
    }

    public Integer getShares() {
        return this.shares;
    }

    public Post shares(Integer shares) {
        this.setShares(shares);
        return this;
    }

    public void setShares(Integer shares) {
        this.shares = shares;
    }

    public Set<Media> getMedia() {
        return this.media;
    }

    public void setMedia(Set<Media> media) {
        if (this.media != null) {
            this.media.forEach(i -> i.setPost(null));
        }
        if (media != null) {
            media.forEach(i -> i.setPost(this));
        }
        this.media = media;
    }

    public Post media(Set<Media> media) {
        this.setMedia(media);
        return this;
    }

    public Post addMedia(Media media) {
        this.media.add(media);
        media.setPost(this);
        return this;
    }

    public Post removeMedia(Media media) {
        this.media.remove(media);
        media.setPost(null);
        return this;
    }

    public SocialFeed getSocialFeed() {
        return this.socialFeed;
    }

    public void setSocialFeed(SocialFeed socialFeed) {
        this.socialFeed = socialFeed;
    }

    public Post socialFeed(SocialFeed socialFeed) {
        this.setSocialFeed(socialFeed);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Post)) {
            return false;
        }
        return id != null && id.equals(((Post) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Post{" +
            "id=" + getId() +
            ", content='" + getContent() + "'" +
            ", timestamp='" + getTimestamp() + "'" +
            ", likes=" + getLikes() +
            ", shares=" + getShares() +
            "}";
    }
}

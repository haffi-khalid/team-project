package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A CharityProfile.
 */
@Entity
@Table(name = "charity_profile")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class CharityProfile implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "charity_name")
    private String charityName;

    @Column(name = "purpose")
    private String purpose;

    @Column(name = "aim")
    private String aim;

    @Column(name = "email_address")
    private String emailAddress;

    @Lob
    @Column(name = "logo")
    private byte[] logo;

    @Column(name = "logo_content_type")
    private String logoContentType;

    @Lob
    @Column(name = "pictures")
    private byte[] pictures;

    @Column(name = "pictures_content_type")
    private String picturesContentType;

    @JsonIgnoreProperties(value = { "posts", "charityProfile" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private SocialFeed socialFeed;

    @OneToMany(mappedBy = "charityProfile")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "charityHubUser", "charityProfile" }, allowSetters = true)
    private Set<ReviewComments> reviewComments = new HashSet<>();

    @OneToMany(mappedBy = "charityProfile")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "groupDonator", "charityProfile" }, allowSetters = true)
    private Set<DonatorPage> donatorPages = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public CharityProfile id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCharityName() {
        return this.charityName;
    }

    public CharityProfile charityName(String charityName) {
        this.setCharityName(charityName);
        return this;
    }

    public void setCharityName(String charityName) {
        this.charityName = charityName;
    }

    public String getPurpose() {
        return this.purpose;
    }

    public CharityProfile purpose(String purpose) {
        this.setPurpose(purpose);
        return this;
    }

    public void setPurpose(String purpose) {
        this.purpose = purpose;
    }

    public String getAim() {
        return this.aim;
    }

    public CharityProfile aim(String aim) {
        this.setAim(aim);
        return this;
    }

    public void setAim(String aim) {
        this.aim = aim;
    }

    public String getEmailAddress() {
        return this.emailAddress;
    }

    public CharityProfile emailAddress(String emailAddress) {
        this.setEmailAddress(emailAddress);
        return this;
    }

    public void setEmailAddress(String emailAddress) {
        this.emailAddress = emailAddress;
    }

    public byte[] getLogo() {
        return this.logo;
    }

    public CharityProfile logo(byte[] logo) {
        this.setLogo(logo);
        return this;
    }

    public void setLogo(byte[] logo) {
        this.logo = logo;
    }

    public String getLogoContentType() {
        return this.logoContentType;
    }

    public CharityProfile logoContentType(String logoContentType) {
        this.logoContentType = logoContentType;
        return this;
    }

    public void setLogoContentType(String logoContentType) {
        this.logoContentType = logoContentType;
    }

    public byte[] getPictures() {
        return this.pictures;
    }

    public CharityProfile pictures(byte[] pictures) {
        this.setPictures(pictures);
        return this;
    }

    public void setPictures(byte[] pictures) {
        this.pictures = pictures;
    }

    public String getPicturesContentType() {
        return this.picturesContentType;
    }

    public CharityProfile picturesContentType(String picturesContentType) {
        this.picturesContentType = picturesContentType;
        return this;
    }

    public void setPicturesContentType(String picturesContentType) {
        this.picturesContentType = picturesContentType;
    }

    public SocialFeed getSocialFeed() {
        return this.socialFeed;
    }

    public void setSocialFeed(SocialFeed socialFeed) {
        this.socialFeed = socialFeed;
    }

    public CharityProfile socialFeed(SocialFeed socialFeed) {
        this.setSocialFeed(socialFeed);
        return this;
    }

    public Set<ReviewComments> getReviewComments() {
        return this.reviewComments;
    }

    public void setReviewComments(Set<ReviewComments> reviewComments) {
        if (this.reviewComments != null) {
            this.reviewComments.forEach(i -> i.setCharityProfile(null));
        }
        if (reviewComments != null) {
            reviewComments.forEach(i -> i.setCharityProfile(this));
        }
        this.reviewComments = reviewComments;
    }

    public CharityProfile reviewComments(Set<ReviewComments> reviewComments) {
        this.setReviewComments(reviewComments);
        return this;
    }

    public CharityProfile addReviewComments(ReviewComments reviewComments) {
        this.reviewComments.add(reviewComments);
        reviewComments.setCharityProfile(this);
        return this;
    }

    public CharityProfile removeReviewComments(ReviewComments reviewComments) {
        this.reviewComments.remove(reviewComments);
        reviewComments.setCharityProfile(null);
        return this;
    }

    public Set<DonatorPage> getDonatorPages() {
        return this.donatorPages;
    }

    public void setDonatorPages(Set<DonatorPage> donatorPages) {
        if (this.donatorPages != null) {
            this.donatorPages.forEach(i -> i.setCharityProfile(null));
        }
        if (donatorPages != null) {
            donatorPages.forEach(i -> i.setCharityProfile(this));
        }
        this.donatorPages = donatorPages;
    }

    public CharityProfile donatorPages(Set<DonatorPage> donatorPages) {
        this.setDonatorPages(donatorPages);
        return this;
    }

    public CharityProfile addDonatorPage(DonatorPage donatorPage) {
        this.donatorPages.add(donatorPage);
        donatorPage.setCharityProfile(this);
        return this;
    }

    public CharityProfile removeDonatorPage(DonatorPage donatorPage) {
        this.donatorPages.remove(donatorPage);
        donatorPage.setCharityProfile(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CharityProfile)) {
            return false;
        }
        return id != null && id.equals(((CharityProfile) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "CharityProfile{" +
            "id=" + getId() +
            ", charityName='" + getCharityName() + "'" +
            ", purpose='" + getPurpose() + "'" +
            ", aim='" + getAim() + "'" +
            ", emailAddress='" + getEmailAddress() + "'" +
            ", logo='" + getLogo() + "'" +
            ", logoContentType='" + getLogoContentType() + "'" +
            ", pictures='" + getPictures() + "'" +
            ", picturesContentType='" + getPicturesContentType() + "'" +
            "}";
    }
}

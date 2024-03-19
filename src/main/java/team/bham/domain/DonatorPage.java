package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A DonatorPage.
 */
@Entity
@Table(name = "donator_page")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class DonatorPage implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "anonymous")
    private Boolean anonymous;

    @Column(name = "amount")
    private Double amount;

    @Column(name = "group_donation")
    private Boolean groupDonation;

    @JsonIgnoreProperties(value = { "donatorPage", "groupDonatorCollector", "charityEvent" }, allowSetters = true)
    @OneToOne(mappedBy = "donatorPage")
    private GroupDonator groupDonator;

    @ManyToOne
    @JsonIgnoreProperties(
        value = {
            "budgetPlanner",
            "socialFeed",
            "reviewComments",
            "donatorPages",
            "vacancies",
            "charityEvents",
            "fundraisingIdeas",
            "approvedVolunteers",
            "volunteerApplications",
        },
        allowSetters = true
    )
    private CharityProfile charityProfile;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public DonatorPage id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public DonatorPage name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Boolean getAnonymous() {
        return this.anonymous;
    }

    public DonatorPage anonymous(Boolean anonymous) {
        this.setAnonymous(anonymous);
        return this;
    }

    public void setAnonymous(Boolean anonymous) {
        this.anonymous = anonymous;
    }

    public Double getAmount() {
        return this.amount;
    }

    public DonatorPage amount(Double amount) {
        this.setAmount(amount);
        return this;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public Boolean getGroupDonation() {
        return this.groupDonation;
    }

    public DonatorPage groupDonation(Boolean groupDonation) {
        this.setGroupDonation(groupDonation);
        return this;
    }

    public void setGroupDonation(Boolean groupDonation) {
        this.groupDonation = groupDonation;
    }

    public GroupDonator getGroupDonator() {
        return this.groupDonator;
    }

    public void setGroupDonator(GroupDonator groupDonator) {
        if (this.groupDonator != null) {
            this.groupDonator.setDonatorPage(null);
        }
        if (groupDonator != null) {
            groupDonator.setDonatorPage(this);
        }
        this.groupDonator = groupDonator;
    }

    public DonatorPage groupDonator(GroupDonator groupDonator) {
        this.setGroupDonator(groupDonator);
        return this;
    }

    public CharityProfile getCharityProfile() {
        return this.charityProfile;
    }

    public void setCharityProfile(CharityProfile charityProfile) {
        this.charityProfile = charityProfile;
    }

    public DonatorPage charityProfile(CharityProfile charityProfile) {
        this.setCharityProfile(charityProfile);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof DonatorPage)) {
            return false;
        }
        return id != null && id.equals(((DonatorPage) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "DonatorPage{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", anonymous='" + getAnonymous() + "'" +
            ", amount=" + getAmount() +
            ", groupDonation='" + getGroupDonation() + "'" +
            "}";
    }
}

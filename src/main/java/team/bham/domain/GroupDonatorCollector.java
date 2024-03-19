package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A GroupDonatorCollector.
 */
@Entity
@Table(name = "group_donator_collector")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class GroupDonatorCollector implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "donator_name")
    private String donatorName;

    @Column(name = "donation_amount")
    private Double donationAmount;

    @JsonIgnoreProperties(value = { "donatorPage", "groupDonatorCollector", "charityEvent" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private GroupDonator groupDonator;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public GroupDonatorCollector id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDonatorName() {
        return this.donatorName;
    }

    public GroupDonatorCollector donatorName(String donatorName) {
        this.setDonatorName(donatorName);
        return this;
    }

    public void setDonatorName(String donatorName) {
        this.donatorName = donatorName;
    }

    public Double getDonationAmount() {
        return this.donationAmount;
    }

    public GroupDonatorCollector donationAmount(Double donationAmount) {
        this.setDonationAmount(donationAmount);
        return this;
    }

    public void setDonationAmount(Double donationAmount) {
        this.donationAmount = donationAmount;
    }

    public GroupDonator getGroupDonator() {
        return this.groupDonator;
    }

    public void setGroupDonator(GroupDonator groupDonator) {
        this.groupDonator = groupDonator;
    }

    public GroupDonatorCollector groupDonator(GroupDonator groupDonator) {
        this.setGroupDonator(groupDonator);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof GroupDonatorCollector)) {
            return false;
        }
        return id != null && id.equals(((GroupDonatorCollector) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "GroupDonatorCollector{" +
            "id=" + getId() +
            ", donatorName='" + getDonatorName() + "'" +
            ", donationAmount=" + getDonationAmount() +
            "}";
    }
}

package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A GroupDonator.
 */
@Entity
@Table(name = "group_donator")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class GroupDonator implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "group_name")
    private String groupName;

    @Column(name = "total_collected_amount")
    private Double totalCollectedAmount;

    @JsonIgnoreProperties(value = { "groupDonator", "charityProfile" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private DonatorPage donatorPage;

    @JsonIgnoreProperties(value = { "groupDonator" }, allowSetters = true)
    @OneToOne(mappedBy = "groupDonator")
    private GroupDonatorCollector groupDonatorCollector;

    @ManyToOne
    @JsonIgnoreProperties(value = { "groupDonators", "charityProfile" }, allowSetters = true)
    private CharityEvent charityEvent;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public GroupDonator id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getGroupName() {
        return this.groupName;
    }

    public GroupDonator groupName(String groupName) {
        this.setGroupName(groupName);
        return this;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public Double getTotalCollectedAmount() {
        return this.totalCollectedAmount;
    }

    public GroupDonator totalCollectedAmount(Double totalCollectedAmount) {
        this.setTotalCollectedAmount(totalCollectedAmount);
        return this;
    }

    public void setTotalCollectedAmount(Double totalCollectedAmount) {
        this.totalCollectedAmount = totalCollectedAmount;
    }

    public DonatorPage getDonatorPage() {
        return this.donatorPage;
    }

    public void setDonatorPage(DonatorPage donatorPage) {
        this.donatorPage = donatorPage;
    }

    public GroupDonator donatorPage(DonatorPage donatorPage) {
        this.setDonatorPage(donatorPage);
        return this;
    }

    public GroupDonatorCollector getGroupDonatorCollector() {
        return this.groupDonatorCollector;
    }

    public void setGroupDonatorCollector(GroupDonatorCollector groupDonatorCollector) {
        if (this.groupDonatorCollector != null) {
            this.groupDonatorCollector.setGroupDonator(null);
        }
        if (groupDonatorCollector != null) {
            groupDonatorCollector.setGroupDonator(this);
        }
        this.groupDonatorCollector = groupDonatorCollector;
    }

    public GroupDonator groupDonatorCollector(GroupDonatorCollector groupDonatorCollector) {
        this.setGroupDonatorCollector(groupDonatorCollector);
        return this;
    }

    public CharityEvent getCharityEvent() {
        return this.charityEvent;
    }

    public void setCharityEvent(CharityEvent charityEvent) {
        this.charityEvent = charityEvent;
    }

    public GroupDonator charityEvent(CharityEvent charityEvent) {
        this.setCharityEvent(charityEvent);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof GroupDonator)) {
            return false;
        }
        return id != null && id.equals(((GroupDonator) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "GroupDonator{" +
            "id=" + getId() +
            ", groupName='" + getGroupName() + "'" +
            ", totalCollectedAmount=" + getTotalCollectedAmount() +
            "}";
    }
}

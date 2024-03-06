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

    @Column(name = "groupname")
    private String groupname;

    @Column(name = "total_collected_amount")
    private Double totalCollectedAmount;

    @JsonIgnoreProperties(value = { "groupDonator", "charityProfile" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private DonatorPage donatorPage;

    @ManyToOne
    @JsonIgnoreProperties(value = { "groupDonators", "charityAdmin" }, allowSetters = true)
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

    public String getGroupname() {
        return this.groupname;
    }

    public GroupDonator groupname(String groupname) {
        this.setGroupname(groupname);
        return this;
    }

    public void setGroupname(String groupname) {
        this.groupname = groupname;
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
            ", groupname='" + getGroupname() + "'" +
            ", totalCollectedAmount=" + getTotalCollectedAmount() +
            "}";
    }
}

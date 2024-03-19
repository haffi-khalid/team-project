package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Type;

/**
 * A BudgetPlanner.
 */
@Entity
@Table(name = "budget_planner")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class BudgetPlanner implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "charity_name")
    private String charityName;

    @Column(name = "total_balance")
    private Double totalBalance;

    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "upcoming_events")
    private String upcomingEvents;

    @Column(name = "target_amount")
    private Double targetAmount;

    @Column(name = "forecast_income")
    private Double forecastIncome;

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
    @OneToOne(mappedBy = "budgetPlanner")
    private CharityProfile charityProfile;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public BudgetPlanner id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCharityName() {
        return this.charityName;
    }

    public BudgetPlanner charityName(String charityName) {
        this.setCharityName(charityName);
        return this;
    }

    public void setCharityName(String charityName) {
        this.charityName = charityName;
    }

    public Double getTotalBalance() {
        return this.totalBalance;
    }

    public BudgetPlanner totalBalance(Double totalBalance) {
        this.setTotalBalance(totalBalance);
        return this;
    }

    public void setTotalBalance(Double totalBalance) {
        this.totalBalance = totalBalance;
    }

    public String getUpcomingEvents() {
        return this.upcomingEvents;
    }

    public BudgetPlanner upcomingEvents(String upcomingEvents) {
        this.setUpcomingEvents(upcomingEvents);
        return this;
    }

    public void setUpcomingEvents(String upcomingEvents) {
        this.upcomingEvents = upcomingEvents;
    }

    public Double getTargetAmount() {
        return this.targetAmount;
    }

    public BudgetPlanner targetAmount(Double targetAmount) {
        this.setTargetAmount(targetAmount);
        return this;
    }

    public void setTargetAmount(Double targetAmount) {
        this.targetAmount = targetAmount;
    }

    public Double getForecastIncome() {
        return this.forecastIncome;
    }

    public BudgetPlanner forecastIncome(Double forecastIncome) {
        this.setForecastIncome(forecastIncome);
        return this;
    }

    public void setForecastIncome(Double forecastIncome) {
        this.forecastIncome = forecastIncome;
    }

    public CharityProfile getCharityProfile() {
        return this.charityProfile;
    }

    public void setCharityProfile(CharityProfile charityProfile) {
        if (this.charityProfile != null) {
            this.charityProfile.setBudgetPlanner(null);
        }
        if (charityProfile != null) {
            charityProfile.setBudgetPlanner(this);
        }
        this.charityProfile = charityProfile;
    }

    public BudgetPlanner charityProfile(CharityProfile charityProfile) {
        this.setCharityProfile(charityProfile);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof BudgetPlanner)) {
            return false;
        }
        return id != null && id.equals(((BudgetPlanner) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "BudgetPlanner{" +
            "id=" + getId() +
            ", charityName='" + getCharityName() + "'" +
            ", totalBalance=" + getTotalBalance() +
            ", upcomingEvents='" + getUpcomingEvents() + "'" +
            ", targetAmount=" + getTargetAmount() +
            ", forecastIncome=" + getForecastIncome() +
            "}";
    }
}

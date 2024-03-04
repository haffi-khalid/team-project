package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A CharityAdmin.
 */
@Entity
@Table(name = "charity_admin")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class CharityAdmin implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "is_charity_admin")
    private Boolean isCharityAdmin;

    @JsonIgnoreProperties(value = { "charityAdmin" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private BudgetPlanner budgetPlanner;

    @JsonIgnoreProperties(value = { "socialFeed", "reviewComments", "donatorPages", "charityAdmin" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private CharityProfile charityProfile;

    @OneToMany(mappedBy = "charityAdmin")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "volunteerApplications", "charityAdmin" }, allowSetters = true)
    private Set<Vacancies> vacancies = new HashSet<>();

    @OneToMany(mappedBy = "charityAdmin")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "groupDonators", "charityAdmin" }, allowSetters = true)
    private Set<CharityEvent> charityEvents = new HashSet<>();

    @OneToMany(mappedBy = "charityAdmin")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "charityAdmin" }, allowSetters = true)
    private Set<FundraisingIdea> fundraisingIdeas = new HashSet<>();

    @OneToMany(mappedBy = "charityAdmin")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "charityHubUser", "charityAdmin" }, allowSetters = true)
    private Set<ApprovedVolunteers> approvedVolunteers = new HashSet<>();

    @OneToMany(mappedBy = "charityAdmin")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "charityAdmin", "charityHubUser", "vacancies" }, allowSetters = true)
    private Set<VolunteerApplications> volunteerApplications = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public CharityAdmin id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getIsCharityAdmin() {
        return this.isCharityAdmin;
    }

    public CharityAdmin isCharityAdmin(Boolean isCharityAdmin) {
        this.setIsCharityAdmin(isCharityAdmin);
        return this;
    }

    public void setIsCharityAdmin(Boolean isCharityAdmin) {
        this.isCharityAdmin = isCharityAdmin;
    }

    public BudgetPlanner getBudgetPlanner() {
        return this.budgetPlanner;
    }

    public void setBudgetPlanner(BudgetPlanner budgetPlanner) {
        this.budgetPlanner = budgetPlanner;
    }

    public CharityAdmin budgetPlanner(BudgetPlanner budgetPlanner) {
        this.setBudgetPlanner(budgetPlanner);
        return this;
    }

    public CharityProfile getCharityProfile() {
        return this.charityProfile;
    }

    public void setCharityProfile(CharityProfile charityProfile) {
        this.charityProfile = charityProfile;
    }

    public CharityAdmin charityProfile(CharityProfile charityProfile) {
        this.setCharityProfile(charityProfile);
        return this;
    }

    public Set<Vacancies> getVacancies() {
        return this.vacancies;
    }

    public void setVacancies(Set<Vacancies> vacancies) {
        if (this.vacancies != null) {
            this.vacancies.forEach(i -> i.setCharityAdmin(null));
        }
        if (vacancies != null) {
            vacancies.forEach(i -> i.setCharityAdmin(this));
        }
        this.vacancies = vacancies;
    }

    public CharityAdmin vacancies(Set<Vacancies> vacancies) {
        this.setVacancies(vacancies);
        return this;
    }

    public CharityAdmin addVacancies(Vacancies vacancies) {
        this.vacancies.add(vacancies);
        vacancies.setCharityAdmin(this);
        return this;
    }

    public CharityAdmin removeVacancies(Vacancies vacancies) {
        this.vacancies.remove(vacancies);
        vacancies.setCharityAdmin(null);
        return this;
    }

    public Set<CharityEvent> getCharityEvents() {
        return this.charityEvents;
    }

    public void setCharityEvents(Set<CharityEvent> charityEvents) {
        if (this.charityEvents != null) {
            this.charityEvents.forEach(i -> i.setCharityAdmin(null));
        }
        if (charityEvents != null) {
            charityEvents.forEach(i -> i.setCharityAdmin(this));
        }
        this.charityEvents = charityEvents;
    }

    public CharityAdmin charityEvents(Set<CharityEvent> charityEvents) {
        this.setCharityEvents(charityEvents);
        return this;
    }

    public CharityAdmin addCharityEvent(CharityEvent charityEvent) {
        this.charityEvents.add(charityEvent);
        charityEvent.setCharityAdmin(this);
        return this;
    }

    public CharityAdmin removeCharityEvent(CharityEvent charityEvent) {
        this.charityEvents.remove(charityEvent);
        charityEvent.setCharityAdmin(null);
        return this;
    }

    public Set<FundraisingIdea> getFundraisingIdeas() {
        return this.fundraisingIdeas;
    }

    public void setFundraisingIdeas(Set<FundraisingIdea> fundraisingIdeas) {
        if (this.fundraisingIdeas != null) {
            this.fundraisingIdeas.forEach(i -> i.setCharityAdmin(null));
        }
        if (fundraisingIdeas != null) {
            fundraisingIdeas.forEach(i -> i.setCharityAdmin(this));
        }
        this.fundraisingIdeas = fundraisingIdeas;
    }

    public CharityAdmin fundraisingIdeas(Set<FundraisingIdea> fundraisingIdeas) {
        this.setFundraisingIdeas(fundraisingIdeas);
        return this;
    }

    public CharityAdmin addFundraisingIdea(FundraisingIdea fundraisingIdea) {
        this.fundraisingIdeas.add(fundraisingIdea);
        fundraisingIdea.setCharityAdmin(this);
        return this;
    }

    public CharityAdmin removeFundraisingIdea(FundraisingIdea fundraisingIdea) {
        this.fundraisingIdeas.remove(fundraisingIdea);
        fundraisingIdea.setCharityAdmin(null);
        return this;
    }

    public Set<ApprovedVolunteers> getApprovedVolunteers() {
        return this.approvedVolunteers;
    }

    public void setApprovedVolunteers(Set<ApprovedVolunteers> approvedVolunteers) {
        if (this.approvedVolunteers != null) {
            this.approvedVolunteers.forEach(i -> i.setCharityAdmin(null));
        }
        if (approvedVolunteers != null) {
            approvedVolunteers.forEach(i -> i.setCharityAdmin(this));
        }
        this.approvedVolunteers = approvedVolunteers;
    }

    public CharityAdmin approvedVolunteers(Set<ApprovedVolunteers> approvedVolunteers) {
        this.setApprovedVolunteers(approvedVolunteers);
        return this;
    }

    public CharityAdmin addApprovedVolunteers(ApprovedVolunteers approvedVolunteers) {
        this.approvedVolunteers.add(approvedVolunteers);
        approvedVolunteers.setCharityAdmin(this);
        return this;
    }

    public CharityAdmin removeApprovedVolunteers(ApprovedVolunteers approvedVolunteers) {
        this.approvedVolunteers.remove(approvedVolunteers);
        approvedVolunteers.setCharityAdmin(null);
        return this;
    }

    public Set<VolunteerApplications> getVolunteerApplications() {
        return this.volunteerApplications;
    }

    public void setVolunteerApplications(Set<VolunteerApplications> volunteerApplications) {
        if (this.volunteerApplications != null) {
            this.volunteerApplications.forEach(i -> i.setCharityAdmin(null));
        }
        if (volunteerApplications != null) {
            volunteerApplications.forEach(i -> i.setCharityAdmin(this));
        }
        this.volunteerApplications = volunteerApplications;
    }

    public CharityAdmin volunteerApplications(Set<VolunteerApplications> volunteerApplications) {
        this.setVolunteerApplications(volunteerApplications);
        return this;
    }

    public CharityAdmin addVolunteerApplications(VolunteerApplications volunteerApplications) {
        this.volunteerApplications.add(volunteerApplications);
        volunteerApplications.setCharityAdmin(this);
        return this;
    }

    public CharityAdmin removeVolunteerApplications(VolunteerApplications volunteerApplications) {
        this.volunteerApplications.remove(volunteerApplications);
        volunteerApplications.setCharityAdmin(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CharityAdmin)) {
            return false;
        }
        return id != null && id.equals(((CharityAdmin) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "CharityAdmin{" +
            "id=" + getId() +
            ", isCharityAdmin='" + getIsCharityAdmin() + "'" +
            "}";
    }
}

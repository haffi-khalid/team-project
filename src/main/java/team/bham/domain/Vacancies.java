package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Type;
import team.bham.domain.enumeration.LocationCategory;

/**
 * A Vacancies.
 */
@Entity
@Table(name = "vacancies")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Vacancies implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "vacancy_title")
    private String vacancyTitle;

    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "vacancy_description")
    private String vacancyDescription;

    @Column(name = "vacancy_start_date")
    private LocalDate vacancyStartDate;

    @Lob
    @Column(name = "vacancy_logo")
    private byte[] vacancyLogo;

    @Column(name = "vacancy_logo_content_type")
    private String vacancyLogoContentType;

    @Column(name = "vacancy_duration")
    private Integer vacancyDuration;

    @Enumerated(EnumType.STRING)
    @Column(name = "vacancy_location")
    private LocationCategory vacancyLocation;

    @OneToMany(mappedBy = "vacancies")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "charityProfile", "approvedVolunteers", "userPage", "vacancies" }, allowSetters = true)
    private Set<VolunteerApplications> volunteerApplications = new HashSet<>();

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

    public Vacancies id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getVacancyTitle() {
        return this.vacancyTitle;
    }

    public Vacancies vacancyTitle(String vacancyTitle) {
        this.setVacancyTitle(vacancyTitle);
        return this;
    }

    public void setVacancyTitle(String vacancyTitle) {
        this.vacancyTitle = vacancyTitle;
    }

    public String getVacancyDescription() {
        return this.vacancyDescription;
    }

    public Vacancies vacancyDescription(String vacancyDescription) {
        this.setVacancyDescription(vacancyDescription);
        return this;
    }

    public void setVacancyDescription(String vacancyDescription) {
        this.vacancyDescription = vacancyDescription;
    }

    public LocalDate getVacancyStartDate() {
        return this.vacancyStartDate;
    }

    public Vacancies vacancyStartDate(LocalDate vacancyStartDate) {
        this.setVacancyStartDate(vacancyStartDate);
        return this;
    }

    public void setVacancyStartDate(LocalDate vacancyStartDate) {
        this.vacancyStartDate = vacancyStartDate;
    }

    public byte[] getVacancyLogo() {
        return this.vacancyLogo;
    }

    public Vacancies vacancyLogo(byte[] vacancyLogo) {
        this.setVacancyLogo(vacancyLogo);
        return this;
    }

    public void setVacancyLogo(byte[] vacancyLogo) {
        this.vacancyLogo = vacancyLogo;
    }

    public String getVacancyLogoContentType() {
        return this.vacancyLogoContentType;
    }

    public Vacancies vacancyLogoContentType(String vacancyLogoContentType) {
        this.vacancyLogoContentType = vacancyLogoContentType;
        return this;
    }

    public void setVacancyLogoContentType(String vacancyLogoContentType) {
        this.vacancyLogoContentType = vacancyLogoContentType;
    }

    public Integer getVacancyDuration() {
        return this.vacancyDuration;
    }

    public Vacancies vacancyDuration(Integer vacancyDuration) {
        this.setVacancyDuration(vacancyDuration);
        return this;
    }

    public void setVacancyDuration(Integer vacancyDuration) {
        this.vacancyDuration = vacancyDuration;
    }

    public LocationCategory getVacancyLocation() {
        return this.vacancyLocation;
    }

    public Vacancies vacancyLocation(LocationCategory vacancyLocation) {
        this.setVacancyLocation(vacancyLocation);
        return this;
    }

    public void setVacancyLocation(LocationCategory vacancyLocation) {
        this.vacancyLocation = vacancyLocation;
    }

    public Set<VolunteerApplications> getVolunteerApplications() {
        return this.volunteerApplications;
    }

    public void setVolunteerApplications(Set<VolunteerApplications> volunteerApplications) {
        if (this.volunteerApplications != null) {
            this.volunteerApplications.forEach(i -> i.setVacancies(null));
        }
        if (volunteerApplications != null) {
            volunteerApplications.forEach(i -> i.setVacancies(this));
        }
        this.volunteerApplications = volunteerApplications;
    }

    public Vacancies volunteerApplications(Set<VolunteerApplications> volunteerApplications) {
        this.setVolunteerApplications(volunteerApplications);
        return this;
    }

    public Vacancies addVolunteerApplications(VolunteerApplications volunteerApplications) {
        this.volunteerApplications.add(volunteerApplications);
        volunteerApplications.setVacancies(this);
        return this;
    }

    public Vacancies removeVolunteerApplications(VolunteerApplications volunteerApplications) {
        this.volunteerApplications.remove(volunteerApplications);
        volunteerApplications.setVacancies(null);
        return this;
    }

    public CharityProfile getCharityProfile() {
        return this.charityProfile;
    }

    public void setCharityProfile(CharityProfile charityProfile) {
        this.charityProfile = charityProfile;
    }

    public Vacancies charityProfile(CharityProfile charityProfile) {
        this.setCharityProfile(charityProfile);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Vacancies)) {
            return false;
        }
        return id != null && id.equals(((Vacancies) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Vacancies{" +
            "id=" + getId() +
            ", vacancyTitle='" + getVacancyTitle() + "'" +
            ", vacancyDescription='" + getVacancyDescription() + "'" +
            ", vacancyStartDate='" + getVacancyStartDate() + "'" +
            ", vacancyLogo='" + getVacancyLogo() + "'" +
            ", vacancyLogoContentType='" + getVacancyLogoContentType() + "'" +
            ", vacancyDuration=" + getVacancyDuration() +
            ", vacancyLocation='" + getVacancyLocation() + "'" +
            "}";
    }
}

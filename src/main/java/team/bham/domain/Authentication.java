package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Authentication.
 */
@Entity
@Table(name = "authentication")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Authentication implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "is_authenticated")
    private Boolean isAuthenticated;

    @JsonIgnoreProperties(
        value = { "user", "userPage", "authentication", "volunteerApplications", "reviewComments", "approvedVolunteers" },
        allowSetters = true
    )
    @OneToOne(mappedBy = "authentication")
    private CharityHubUser charityHubUser;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Authentication id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getIsAuthenticated() {
        return this.isAuthenticated;
    }

    public Authentication isAuthenticated(Boolean isAuthenticated) {
        this.setIsAuthenticated(isAuthenticated);
        return this;
    }

    public void setIsAuthenticated(Boolean isAuthenticated) {
        this.isAuthenticated = isAuthenticated;
    }

    public CharityHubUser getCharityHubUser() {
        return this.charityHubUser;
    }

    public void setCharityHubUser(CharityHubUser charityHubUser) {
        if (this.charityHubUser != null) {
            this.charityHubUser.setAuthentication(null);
        }
        if (charityHubUser != null) {
            charityHubUser.setAuthentication(this);
        }
        this.charityHubUser = charityHubUser;
    }

    public Authentication charityHubUser(CharityHubUser charityHubUser) {
        this.setCharityHubUser(charityHubUser);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Authentication)) {
            return false;
        }
        return id != null && id.equals(((Authentication) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Authentication{" +
            "id=" + getId() +
            ", isAuthenticated='" + getIsAuthenticated() + "'" +
            "}";
    }
}

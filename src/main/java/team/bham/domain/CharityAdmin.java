package team.bham.domain;

import java.io.Serializable;
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

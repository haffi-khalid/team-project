package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class VacanciesTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Vacancies.class);
        Vacancies vacancies1 = new Vacancies();
        vacancies1.setId(1L);
        Vacancies vacancies2 = new Vacancies();
        vacancies2.setId(vacancies1.getId());
        assertThat(vacancies1).isEqualTo(vacancies2);
        vacancies2.setId(2L);
        assertThat(vacancies1).isNotEqualTo(vacancies2);
        vacancies1.setId(null);
        assertThat(vacancies1).isNotEqualTo(vacancies2);
    }
}

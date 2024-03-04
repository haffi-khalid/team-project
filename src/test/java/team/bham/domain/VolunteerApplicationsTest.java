package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class VolunteerApplicationsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(VolunteerApplications.class);
        VolunteerApplications volunteerApplications1 = new VolunteerApplications();
        volunteerApplications1.setId(1L);
        VolunteerApplications volunteerApplications2 = new VolunteerApplications();
        volunteerApplications2.setId(volunteerApplications1.getId());
        assertThat(volunteerApplications1).isEqualTo(volunteerApplications2);
        volunteerApplications2.setId(2L);
        assertThat(volunteerApplications1).isNotEqualTo(volunteerApplications2);
        volunteerApplications1.setId(null);
        assertThat(volunteerApplications1).isNotEqualTo(volunteerApplications2);
    }
}

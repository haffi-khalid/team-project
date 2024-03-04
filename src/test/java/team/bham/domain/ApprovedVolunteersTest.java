package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class ApprovedVolunteersTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ApprovedVolunteers.class);
        ApprovedVolunteers approvedVolunteers1 = new ApprovedVolunteers();
        approvedVolunteers1.setId(1L);
        ApprovedVolunteers approvedVolunteers2 = new ApprovedVolunteers();
        approvedVolunteers2.setId(approvedVolunteers1.getId());
        assertThat(approvedVolunteers1).isEqualTo(approvedVolunteers2);
        approvedVolunteers2.setId(2L);
        assertThat(approvedVolunteers1).isNotEqualTo(approvedVolunteers2);
        approvedVolunteers1.setId(null);
        assertThat(approvedVolunteers1).isNotEqualTo(approvedVolunteers2);
    }
}

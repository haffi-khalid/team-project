package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class CharityAdminTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CharityAdmin.class);
        CharityAdmin charityAdmin1 = new CharityAdmin();
        charityAdmin1.setId(1L);
        CharityAdmin charityAdmin2 = new CharityAdmin();
        charityAdmin2.setId(charityAdmin1.getId());
        assertThat(charityAdmin1).isEqualTo(charityAdmin2);
        charityAdmin2.setId(2L);
        assertThat(charityAdmin1).isNotEqualTo(charityAdmin2);
        charityAdmin1.setId(null);
        assertThat(charityAdmin1).isNotEqualTo(charityAdmin2);
    }
}

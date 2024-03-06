package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class DonatorPageTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(DonatorPage.class);
        DonatorPage donatorPage1 = new DonatorPage();
        donatorPage1.setId(1L);
        DonatorPage donatorPage2 = new DonatorPage();
        donatorPage2.setId(donatorPage1.getId());
        assertThat(donatorPage1).isEqualTo(donatorPage2);
        donatorPage2.setId(2L);
        assertThat(donatorPage1).isNotEqualTo(donatorPage2);
        donatorPage1.setId(null);
        assertThat(donatorPage1).isNotEqualTo(donatorPage2);
    }
}

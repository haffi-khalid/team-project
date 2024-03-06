package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class CharityProfileTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CharityProfile.class);
        CharityProfile charityProfile1 = new CharityProfile();
        charityProfile1.setId(1L);
        CharityProfile charityProfile2 = new CharityProfile();
        charityProfile2.setId(charityProfile1.getId());
        assertThat(charityProfile1).isEqualTo(charityProfile2);
        charityProfile2.setId(2L);
        assertThat(charityProfile1).isNotEqualTo(charityProfile2);
        charityProfile1.setId(null);
        assertThat(charityProfile1).isNotEqualTo(charityProfile2);
    }
}

package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class CharityHubUserTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CharityHubUser.class);
        CharityHubUser charityHubUser1 = new CharityHubUser();
        charityHubUser1.setId(1L);
        CharityHubUser charityHubUser2 = new CharityHubUser();
        charityHubUser2.setId(charityHubUser1.getId());
        assertThat(charityHubUser1).isEqualTo(charityHubUser2);
        charityHubUser2.setId(2L);
        assertThat(charityHubUser1).isNotEqualTo(charityHubUser2);
        charityHubUser1.setId(null);
        assertThat(charityHubUser1).isNotEqualTo(charityHubUser2);
    }
}

package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class AuthenticationTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Authentication.class);
        Authentication authentication1 = new Authentication();
        authentication1.setId(1L);
        Authentication authentication2 = new Authentication();
        authentication2.setId(authentication1.getId());
        assertThat(authentication1).isEqualTo(authentication2);
        authentication2.setId(2L);
        assertThat(authentication1).isNotEqualTo(authentication2);
        authentication1.setId(null);
        assertThat(authentication1).isNotEqualTo(authentication2);
    }
}

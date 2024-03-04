package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class UserPageTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(UserPage.class);
        UserPage userPage1 = new UserPage();
        userPage1.setId(1L);
        UserPage userPage2 = new UserPage();
        userPage2.setId(userPage1.getId());
        assertThat(userPage1).isEqualTo(userPage2);
        userPage2.setId(2L);
        assertThat(userPage1).isNotEqualTo(userPage2);
        userPage1.setId(null);
        assertThat(userPage1).isNotEqualTo(userPage2);
    }
}

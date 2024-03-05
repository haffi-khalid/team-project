package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class FundraisingIdeaTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(FundraisingIdea.class);
        FundraisingIdea fundraisingIdea1 = new FundraisingIdea();
        fundraisingIdea1.setId(1L);
        FundraisingIdea fundraisingIdea2 = new FundraisingIdea();
        fundraisingIdea2.setId(fundraisingIdea1.getId());
        assertThat(fundraisingIdea1).isEqualTo(fundraisingIdea2);
        fundraisingIdea2.setId(2L);
        assertThat(fundraisingIdea1).isNotEqualTo(fundraisingIdea2);
        fundraisingIdea1.setId(null);
        assertThat(fundraisingIdea1).isNotEqualTo(fundraisingIdea2);
    }
}

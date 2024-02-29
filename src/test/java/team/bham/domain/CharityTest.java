package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class CharityTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Charity.class);
        Charity charity1 = new Charity();
        charity1.setId(1L);
        Charity charity2 = new Charity();
        charity2.setId(charity1.getId());
        assertThat(charity1).isEqualTo(charity2);
        charity2.setId(2L);
        assertThat(charity1).isNotEqualTo(charity2);
        charity1.setId(null);
        assertThat(charity1).isNotEqualTo(charity2);
    }
}

package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class CharityEventTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CharityEvent.class);
        CharityEvent charityEvent1 = new CharityEvent();
        charityEvent1.setId(1L);
        CharityEvent charityEvent2 = new CharityEvent();
        charityEvent2.setId(charityEvent1.getId());
        assertThat(charityEvent1).isEqualTo(charityEvent2);
        charityEvent2.setId(2L);
        assertThat(charityEvent1).isNotEqualTo(charityEvent2);
        charityEvent1.setId(null);
        assertThat(charityEvent1).isNotEqualTo(charityEvent2);
    }
}

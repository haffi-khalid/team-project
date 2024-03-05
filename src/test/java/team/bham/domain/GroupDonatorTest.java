package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class GroupDonatorTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(GroupDonator.class);
        GroupDonator groupDonator1 = new GroupDonator();
        groupDonator1.setId(1L);
        GroupDonator groupDonator2 = new GroupDonator();
        groupDonator2.setId(groupDonator1.getId());
        assertThat(groupDonator1).isEqualTo(groupDonator2);
        groupDonator2.setId(2L);
        assertThat(groupDonator1).isNotEqualTo(groupDonator2);
        groupDonator1.setId(null);
        assertThat(groupDonator1).isNotEqualTo(groupDonator2);
    }
}

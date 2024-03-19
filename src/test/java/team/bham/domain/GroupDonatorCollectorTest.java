package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class GroupDonatorCollectorTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(GroupDonatorCollector.class);
        GroupDonatorCollector groupDonatorCollector1 = new GroupDonatorCollector();
        groupDonatorCollector1.setId(1L);
        GroupDonatorCollector groupDonatorCollector2 = new GroupDonatorCollector();
        groupDonatorCollector2.setId(groupDonatorCollector1.getId());
        assertThat(groupDonatorCollector1).isEqualTo(groupDonatorCollector2);
        groupDonatorCollector2.setId(2L);
        assertThat(groupDonatorCollector1).isNotEqualTo(groupDonatorCollector2);
        groupDonatorCollector1.setId(null);
        assertThat(groupDonatorCollector1).isNotEqualTo(groupDonatorCollector2);
    }
}

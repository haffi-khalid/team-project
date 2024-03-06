package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class SocialFeedTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SocialFeed.class);
        SocialFeed socialFeed1 = new SocialFeed();
        socialFeed1.setId(1L);
        SocialFeed socialFeed2 = new SocialFeed();
        socialFeed2.setId(socialFeed1.getId());
        assertThat(socialFeed1).isEqualTo(socialFeed2);
        socialFeed2.setId(2L);
        assertThat(socialFeed1).isNotEqualTo(socialFeed2);
        socialFeed1.setId(null);
        assertThat(socialFeed1).isNotEqualTo(socialFeed2);
    }
}

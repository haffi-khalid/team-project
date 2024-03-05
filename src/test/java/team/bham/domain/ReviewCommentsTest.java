package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class ReviewCommentsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ReviewComments.class);
        ReviewComments reviewComments1 = new ReviewComments();
        reviewComments1.setId(1L);
        ReviewComments reviewComments2 = new ReviewComments();
        reviewComments2.setId(reviewComments1.getId());
        assertThat(reviewComments1).isEqualTo(reviewComments2);
        reviewComments2.setId(2L);
        assertThat(reviewComments1).isNotEqualTo(reviewComments2);
        reviewComments1.setId(null);
        assertThat(reviewComments1).isNotEqualTo(reviewComments2);
    }
}

package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class BudgetPlannerTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(BudgetPlanner.class);
        BudgetPlanner budgetPlanner1 = new BudgetPlanner();
        budgetPlanner1.setId(1L);
        BudgetPlanner budgetPlanner2 = new BudgetPlanner();
        budgetPlanner2.setId(budgetPlanner1.getId());
        assertThat(budgetPlanner1).isEqualTo(budgetPlanner2);
        budgetPlanner2.setId(2L);
        assertThat(budgetPlanner1).isNotEqualTo(budgetPlanner2);
        budgetPlanner1.setId(null);
        assertThat(budgetPlanner1).isNotEqualTo(budgetPlanner2);
    }
}

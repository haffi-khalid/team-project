package team.bham.repository;

import java.util.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import team.bham.domain.Vacancies;

/**
 * Spring Data JPA repository for the Vacancies entity.
 */
@Repository
public interface VacanciesRepository extends JpaRepository<Vacancies, Long> {
    default Optional<Vacancies> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Vacancies> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Vacancies> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    default List<Vacancies> getSimilarVacancies(List<Vacancies> userVacancies) {
        List<Vacancies> vacanciesList = findAll();
        double magnitudeForVacancyVector = 0.0;
        double magnitudeForUserVector = 0.0;
        double dotProduct = 0.0;
        List<Vacancies> similarVacancies = new ArrayList<>();
        Map<Long, Double> vacancyIdAndCosinePair = new HashMap<>();
        for (int i = 0; i < vacanciesList.size(); i++) {
            if (userVacancies.contains(vacanciesList.get(i))) {
                vacanciesList.remove(vacanciesList.get(i));
                i--;
            }
            if (vacanciesList.isEmpty()) {
                return similarVacancies;
            }
        }
        for (int i = 0; i < vacanciesList.size(); i++) {
            for (int j = 0; j < userVacancies.size(); j++) {
                Map<String, Integer> vacancyVector = createVector(vacanciesList.get(i).getVacancyDescription());
                Map<String, Integer> userVector = createVector(userVacancies.get(j).getVacancyDescription());
                for (String vacancyVectorKey : vacancyVector.keySet()) {
                    if (userVector.containsKey(vacancyVectorKey)) {
                        dotProduct += vacancyVector.get(vacancyVectorKey) * userVector.get(vacancyVectorKey);
                    }
                    magnitudeForVacancyVector += Math.pow(vacancyVector.get(vacancyVectorKey), 2);
                }
                for (String userVacancyVectorKey : userVector.keySet()) {
                    magnitudeForUserVector += Math.pow(userVector.get(userVacancyVectorKey), 2);
                }
                magnitudeForVacancyVector = Math.sqrt(magnitudeForVacancyVector);
                magnitudeForUserVector = Math.sqrt(magnitudeForUserVector);
                vacancyIdAndCosinePair.put(vacanciesList.get(i).getId(), dotProduct / (magnitudeForVacancyVector * magnitudeForUserVector));
            }
        }
        for (Map.Entry<Long, Double> set : vacancyIdAndCosinePair.entrySet()) {
            if (set.getValue() > 0.8 && !similarVacancies.contains(findVacancy(set.getKey()))) {
                similarVacancies.add(findVacancy(set.getKey()));
            }
        }

        return similarVacancies;
    }

    default Map<String, Integer> createVector(String text) {
        Map<String, Integer> vector = new HashMap<>();
        String[] words = text.toLowerCase().split(" ");
        for (String word : words) {
            vector.put(word, vector.getOrDefault(word, 0) + 1);
        }
        return vector;
    }

    @Query(
        value = "select distinct vacancies from Vacancies vacancies left join fetch vacancies.charityProfile",
        countQuery = "select count(distinct vacancies) from Vacancies vacancies"
    )
    Page<Vacancies> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct vacancies from Vacancies vacancies left join fetch vacancies.charityProfile")
    List<Vacancies> findAllWithToOneRelationships();

    @Query("select vacancies from Vacancies vacancies left join fetch vacancies.charityProfile where vacancies.id =:id")
    Optional<Vacancies> findOneWithToOneRelationships(@Param("id") Long id);

    @Query("select vacancies from Vacancies vacancies where vacancies.charityProfile.id =:id")
    Optional<Vacancies> charityVacancies(@Param("id") Long id);

    @Query(
        "select distinct vacancies from Vacancies vacancies left join VolunteerApplications volunteerApplications on vacancies.id=volunteerApplications.vacancies.id where vacancies.id = volunteerApplications.vacancies.id and volunteerApplications.charityHubUser.id=:id"
    )
    List<Vacancies> findVacanciesFromCharityHubUser(@Param("id") Long id);

    @Query("select distinct vacancies from Vacancies vacancies where vacancies.id=:id")
    Vacancies findVacancy(@Param("id") Long id);
}

package team.bham.repository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import team.bham.domain.FundraisingIdea;
import team.bham.domain.enumeration.LocationCategory;

public class IdeaSimilarityFinder {

    // Method to calculate cosine similarity between two vectors
    private double cosineSimilarity(double[] vectorA, double[] vectorB) {
        double dotProduct = 0.0;
        double normA = 0.0;
        double normB = 0.0;
        for (int i = 0; i < vectorA.length; i++) {
            dotProduct += vectorA[i] * vectorB[i];
            normA += Math.pow(vectorA[i], 2);
            normB += Math.pow(vectorB[i], 2);
        }
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }

    public List<FundraisingIdea> findSimilarIdeas(FundraisingIdea givenIdea, List<FundraisingIdea> ideasInDatabase) {
        List<FundraisingIdea> similarIdeas = new ArrayList<>();

        double[] givenVector = convertToVector(givenIdea);

        for (FundraisingIdea idea : ideasInDatabase) {
            // Convert each idea to a vector representation
            double[] ideaVector = convertToVector(idea);
            // Calculate cosine similarity between given idea and current idea in the database
            double similarity = cosineSimilarity(givenVector, ideaVector);
            if (similarity > 0.9) { // Adjust the threshold value as needed
                similarIdeas.add(idea);
            }
        }

        return similarIdeas;
    }

    private double[] convertToVector(FundraisingIdea idea) {
        double[] vector = new double[4];
        vector[0] = idea.getNumberOfVolunteers();
        vector[1] = idea.getLocation().ordinal();

        if (idea.getLocation().toString().equals("NULL")) {
            vector[2] = 0;
        } else {
            vector[2] = idea.getExpectedCost();
        }

        vector[3] = idea.getExpectedAttendance();
        return vector;
    }

    // Example usage
    public static void main(String[] args) {
        IdeaSimilarityFinder finder = new IdeaSimilarityFinder();
        FundraisingIdea givenIdea = new FundraisingIdea();
        givenIdea.setExpectedCost(1000.0);
        //givenIdea.setLocation(team.bham.domain.enumeration.LocationCategory.valueOf("INPERSON"));
        givenIdea.setNumberOfVolunteers(50);

        List<FundraisingIdea> ideasInDatabase = new ArrayList<>();
        List<FundraisingIdea> similarIdeas = finder.findSimilarIdeas(givenIdea, ideasInDatabase);
        for (FundraisingIdea idea : similarIdeas) {
            System.out.println("Similar Idea: " + idea);
        }
    }
}

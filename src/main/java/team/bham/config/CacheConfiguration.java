package team.bham.config;

import java.time.Duration;
import org.ehcache.config.builders.*;
import org.ehcache.jsr107.Eh107Configuration;
import org.hibernate.cache.jcache.ConfigSettings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.cache.JCacheManagerCustomizer;
import org.springframework.boot.autoconfigure.orm.jpa.HibernatePropertiesCustomizer;
import org.springframework.boot.info.BuildProperties;
import org.springframework.boot.info.GitProperties;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.context.annotation.*;
import tech.jhipster.config.JHipsterProperties;
import tech.jhipster.config.cache.PrefixedKeyGenerator;

@Configuration
@EnableCaching
public class CacheConfiguration {

    private GitProperties gitProperties;
    private BuildProperties buildProperties;
    private final javax.cache.configuration.Configuration<Object, Object> jcacheConfiguration;

    public CacheConfiguration(JHipsterProperties jHipsterProperties) {
        JHipsterProperties.Cache.Ehcache ehcache = jHipsterProperties.getCache().getEhcache();

        jcacheConfiguration =
            Eh107Configuration.fromEhcacheCacheConfiguration(
                CacheConfigurationBuilder
                    .newCacheConfigurationBuilder(Object.class, Object.class, ResourcePoolsBuilder.heap(ehcache.getMaxEntries()))
                    .withExpiry(ExpiryPolicyBuilder.timeToLiveExpiration(Duration.ofSeconds(ehcache.getTimeToLiveSeconds())))
                    .build()
            );
    }

    @Bean
    public HibernatePropertiesCustomizer hibernatePropertiesCustomizer(javax.cache.CacheManager cacheManager) {
        return hibernateProperties -> hibernateProperties.put(ConfigSettings.CACHE_MANAGER, cacheManager);
    }

    @Bean
    public JCacheManagerCustomizer cacheManagerCustomizer() {
        return cm -> {
            createCache(cm, team.bham.repository.UserRepository.USERS_BY_LOGIN_CACHE);
            createCache(cm, team.bham.repository.UserRepository.USERS_BY_EMAIL_CACHE);
            createCache(cm, team.bham.domain.User.class.getName());
            createCache(cm, team.bham.domain.Authority.class.getName());
            createCache(cm, team.bham.domain.User.class.getName() + ".authorities");
            createCache(cm, team.bham.domain.CharityHubUser.class.getName());
            createCache(cm, team.bham.domain.CharityHubUser.class.getName() + ".volunteerApplications");
            createCache(cm, team.bham.domain.CharityHubUser.class.getName() + ".reviewComments");
            createCache(cm, team.bham.domain.CharityHubUser.class.getName() + ".approvedVolunteers");
            createCache(cm, team.bham.domain.UserPage.class.getName());
            createCache(cm, team.bham.domain.ReviewComments.class.getName());
            createCache(cm, team.bham.domain.VolunteerApplications.class.getName());
            createCache(cm, team.bham.domain.SocialFeed.class.getName());
            createCache(cm, team.bham.domain.SocialFeed.class.getName() + ".posts");
            createCache(cm, team.bham.domain.Posts.class.getName());
            createCache(cm, team.bham.domain.GroupDonator.class.getName());
            createCache(cm, team.bham.domain.CharityProfile.class.getName());
            createCache(cm, team.bham.domain.CharityProfile.class.getName() + ".reviewComments");
            createCache(cm, team.bham.domain.CharityProfile.class.getName() + ".donatorPages");
            createCache(cm, team.bham.domain.CharityProfile.class.getName() + ".vacancies");
            createCache(cm, team.bham.domain.CharityProfile.class.getName() + ".charityEvents");
            createCache(cm, team.bham.domain.CharityAdmin.class.getName());
            createCache(cm, team.bham.domain.CharityAdmin.class.getName() + ".fundraisingIdeas");
            createCache(cm, team.bham.domain.CharityAdmin.class.getName() + ".approvedVolunteers");
            createCache(cm, team.bham.domain.CharityAdmin.class.getName() + ".volunteerApplications");
            createCache(cm, team.bham.domain.DonatorPage.class.getName());
            createCache(cm, team.bham.domain.CharityEvent.class.getName());
            createCache(cm, team.bham.domain.CharityEvent.class.getName() + ".groupDonators");
            createCache(cm, team.bham.domain.FundraisingIdea.class.getName());
            createCache(cm, team.bham.domain.Vacancies.class.getName());
            createCache(cm, team.bham.domain.Vacancies.class.getName() + ".volunteerApplications");
            createCache(cm, team.bham.domain.BudgetPlanner.class.getName());
            createCache(cm, team.bham.domain.ApprovedVolunteers.class.getName());
            createCache(cm, team.bham.domain.Authentication.class.getName());
            createCache(cm, team.bham.domain.UserPage.class.getName() + ".volunteerApplications");
            createCache(cm, team.bham.domain.UserPage.class.getName() + ".reviewComments");
            createCache(cm, team.bham.domain.UserPage.class.getName() + ".approvedVolunteers");
            createCache(cm, team.bham.domain.CharityProfile.class.getName() + ".fundraisingIdeas");
            createCache(cm, team.bham.domain.CharityProfile.class.getName() + ".approvedVolunteers");
            createCache(cm, team.bham.domain.CharityProfile.class.getName() + ".volunteerApplications");
            createCache(cm, team.bham.domain.GroupDonatorCollector.class.getName());
            // jhipster-needle-ehcache-add-entry
        };
    }

    private void createCache(javax.cache.CacheManager cm, String cacheName) {
        javax.cache.Cache<Object, Object> cache = cm.getCache(cacheName);
        if (cache != null) {
            cache.clear();
        } else {
            cm.createCache(cacheName, jcacheConfiguration);
        }
    }

    @Autowired(required = false)
    public void setGitProperties(GitProperties gitProperties) {
        this.gitProperties = gitProperties;
    }

    @Autowired(required = false)
    public void setBuildProperties(BuildProperties buildProperties) {
        this.buildProperties = buildProperties;
    }

    @Bean
    public KeyGenerator keyGenerator() {
        return new PrefixedKeyGenerator(this.gitProperties, this.buildProperties);
    }
}

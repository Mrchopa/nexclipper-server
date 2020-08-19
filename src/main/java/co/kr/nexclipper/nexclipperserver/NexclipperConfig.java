package co.kr.nexclipper.nexclipperserver;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeansException;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.ComponentScan.Filter;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.FilterType;
import org.springframework.data.auditing.DateTimeProvider;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import co.kr.nexclipper.nexclipperserver.account.AccountService;
import co.kr.nexclipper.nexclipperserver.klevr.KlevrProperties;
import co.kr.nexcloud.framework.security.CommonPrincipal;
import co.kr.nexcloud.framework.web.RequestParameterLoggingInterceptor;
import co.kr.nexcloud.users.UserJoinHandler;
import co.kr.nexcloud.users.UsersApplication;
import nz.net.ultraq.thymeleaf.LayoutDialect;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;

@Configuration
@ComponentScan(basePackages = {"co.kr.nexclipper", "co.kr.nexcloud"}, excludeFilters = @Filter(type = FilterType.ASSIGNABLE_TYPE, value = UsersApplication.class))
@EnableJpaRepositories(basePackages = {"co.kr.nexcloud", "co.kr.nexclipper"})
@EntityScan(basePackages = {"co.kr.nexcloud", "co.kr.nexclipper"})
@EnableConfigurationProperties(value = KlevrProperties.class)
@EnableFeignClients(basePackages = {"co.kr.nexclipper"})
@EnableJpaAuditing(dateTimeProviderRef = "auditingDateTimeProvider")
public class NexclipperConfig implements ApplicationContextAware, WebMvcConfigurer, AuditorAware<Long> {
	public static final Logger LOG = LoggerFactory.getLogger(NexclipperConfig.class);
	
	ApplicationContext context;
	
	@Override
	public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
		LOG.debug("init NexclipperConfig");
		this.context = applicationContext;
	}
	
	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		registry.addInterceptor(new RequestParameterLoggingInterceptor());
	}
	
	@Override
	public void addArgumentResolvers(List<HandlerMethodArgumentResolver> argumentResolvers) {
		LOG.info("addArgumentResolvers - nothing");
	}
	
	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		registry.addResourceHandler("/webjars/**",
									"/img/**",
									"/css/**",
									"/js/**")
				.addResourceLocations(
									"classpath:/META-INF/resources/webjars/",
									"classpath:/templates/img/",
									"classpath:/templates/css/",
									"classpath:/templates/js/");
	}
	
	@Bean
	public UserJoinHandler userJoinHandler(AccountService service) {
		return (user) -> {
			LOG.debug("handler called for Join user. - [{}]", user);
			
			service.renewAccountsApiKey(user.getId());
		};
	}
	
	@Bean
	public Docket docket() {
		return new Docket(DocumentationType.SWAGGER_2)
				.groupName("NexClipper-api")
				.useDefaultResponseMessages(true)
				.apiInfo(apiInfo())
				.select().apis(RequestHandlerSelectors.basePackage("co.kr.nexclipper")).paths(PathSelectors.any())
				.build();
	}
	
	private ApiInfo apiInfo() {
		return new ApiInfoBuilder().title("NexClipper API")
				.description("NexCloud NexClipper API documentation")
				.termsOfServiceUrl("http://nexclipper.io")
				.build();
	}

	@Override
	public Optional<Long> getCurrentAuditor() {
		LOG.debug("Auditor called");
		
		CommonPrincipal principal = CommonPrincipal.getPrincipal();
		Optional<Long> optional = Optional.ofNullable(principal != null ? principal.getId() : null);
		optional.orElse(0L);
		return optional;
	}
	
	@Bean
	public LayoutDialect layoutDialect() {
		return new LayoutDialect();
	}
	
	@Bean
	public DateTimeProvider auditingDateTimeProvider() {
		return () -> Optional.of(ZonedDateTime.now());
	}
}

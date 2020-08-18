package co.kr.nexclipper.nexclipperserver;

import java.util.List;

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
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import co.kr.nexclipper.nexclipperserver.account.AccountService;
import co.kr.nexclipper.nexclipperserver.klevr.KlevrProperties;
import co.kr.nexcloud.framework.web.RequestParameterLoggingInterceptor;
import co.kr.nexcloud.users.UserJoinHandler;
import co.kr.nexcloud.users.UsersApplication;
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
public class NexclipperConfig implements ApplicationContextAware, WebMvcConfigurer {
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
	
	@Bean
	public UserJoinHandler userJoinHandler(AccountService service) {
		return (user) -> {
			LOG.debug("handler called for Join user.");
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
}

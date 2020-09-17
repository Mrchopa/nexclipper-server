package co.kr.nexclipper.nexclipperserver;

import java.net.URLEncoder;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.apache.tomcat.util.http.LegacyCookieProcessor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.boot.web.servlet.server.ConfigurableServletWebServerFactory;
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
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.support.WebBindingInitializer;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import co.kr.nexclipper.nexclipperserver.account.AccountService;
import co.kr.nexclipper.nexclipperserver.controller.converter.EnumParameterConverter;
import co.kr.nexclipper.nexclipperserver.controller.data.KlevrEventType;
import co.kr.nexclipper.nexclipperserver.klevr.KlevrProperties;
import co.kr.nexclipper.nexclipperserver.remote.RemoteProperties;
import co.kr.nexcloud.framework.commons.util.StackTraceUtils;
import co.kr.nexcloud.framework.commons.util.ToStringUtils;
import co.kr.nexcloud.framework.security.CommonPrincipal;
import co.kr.nexcloud.framework.web.HttpRuntimeException;
import co.kr.nexcloud.framework.web.RequestParameterLoggingInterceptor;
import co.kr.nexcloud.users.OAuthLoginPostHandler;
import co.kr.nexcloud.users.OAuthLoginPreHandler;
import co.kr.nexcloud.users.UserJoinHandler;
import co.kr.nexcloud.users.UsersApplication;
import io.swagger.annotations.Api;
import nz.net.ultraq.thymeleaf.LayoutDialect;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;

@Configuration
@ComponentScan(basePackages = {"co.kr.nexclipper", "co.kr.nexcloud"}, excludeFilters = @Filter(type = FilterType.ASSIGNABLE_TYPE, value = UsersApplication.class))
@EnableJpaRepositories(basePackages = {"co.kr.nexcloud", "co.kr.nexclipper"})
@EntityScan(basePackages = {"co.kr.nexcloud", "co.kr.nexclipper"})
@EnableConfigurationProperties(value = {KlevrProperties.class, RemoteProperties.class})
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
	public void addCorsMappings(CorsRegistry registry) {
		registry.addMapping("/**").allowedMethods("*");
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
									"classpath:/img/",
									"classpath:/css/",
									"classpath:/js/");
	}
	
	@Bean
	public UserJoinHandler userJoinHandler(AccountService service) {
		return (user) -> {
			LOG.debug("handler called for Join user. - [{}]", user);
			
			service.renewAccountsApiKey(user.getId());
		};
	}
	
	@Bean
	public OAuthLoginPreHandler loginPreHandler(
			AccountService service,
			@Value("${nc.users.login.handler.redirect-url}") String redirectUrl) {
		return (request, response, authentication, exception) -> {
			try {
				if(exception != null) {
					if(LOG.isDebugEnabled()) {
						response.sendRedirect(redirectUrl
								+"?loginSuccess=false&message="+URLEncoder.encode("OAuth authentication failed.", "UTF-8")
								+"&detail="+URLEncoder.encode(getErrorDetail(exception), "UTF-8"));
					}
					else {
						response.sendRedirect(redirectUrl+"?loginSuccess=false&message="+URLEncoder.encode("OAuth authentication failed.", "UTF-8"));
					}
				}
				else {
					OAuth2User user = null;
					
					try {
						user = (OAuth2User)authentication.getPrincipal();
						service.addAccessLog((String)user.getAttribute("email"));
					} catch(Exception ex) {
						if(user != null)
							LOG.warn("access logging failed - [{}]", ToStringUtils.toString(user), ex);
						else 
							LOG.warn("access logging failed - [null]", ex);
					}
				}
			} catch(Exception e) {
				LOG.error(e.getMessage(), e);
				
				throw new HttpRuntimeException(500, e.getMessage(), e);
			}
		};
	}
	
	@Bean
	public OAuthLoginPostHandler loginPostHandler(@Value("${nc.users.login.handler.redirect-url}") String redirectUrl) {
		return (request, response, user, exception) -> {
			LOG.debug("redirect url : [{}]", redirectUrl);
			
			try {
				if(exception != null) {
					if(LOG.isDebugEnabled()) {
						response.sendRedirect(redirectUrl
								+"?loginSuccess=false&message="+URLEncoder.encode(exception.getMessage(), "UTF-8")
								+"&detail="+URLEncoder.encode(getErrorDetail(exception), "UTF-8"));
					}
					else {
						response.sendRedirect(redirectUrl+"?loginSuccess=false&message="+URLEncoder.encode(exception.getMessage(), "UTF-8"));
					}
				}
				else {
					response.sendRedirect(redirectUrl+"?new="+user.isFirstLogin()+"&loginSuccess=true");
				}
			} catch(Exception e) {
				LOG.error(e.getMessage(), e);
				
				throw new HttpRuntimeException(500, e.getMessage(), e);
			}
		};
	}
	
	private String getErrorDetail(Exception e) {
		String detail = StackTraceUtils.getString(e);
		
		if(detail.length() > 1000) {
			detail = detail.substring(0, 1000);
		}
		
		return detail;
	}
	
	@Bean
	public Docket docket() {
		String version ="v1";
		
		return new Docket(DocumentationType.SWAGGER_2)
				.groupName("NexClipper-api")
				.useDefaultResponseMessages(true)
				.groupName(version)
				.apiInfo(apiInfo(version))
				.select().apis(RequestHandlerSelectors.withClassAnnotation(Api.class))//.basePackage("co.kr.nexclipper")).paths(PathSelectors.any())
				.build();
	}
	
	private ApiInfo apiInfo(String version) {
		return new ApiInfoBuilder().title("NexClipper API")
				.description("NexCloud NexClipper API documentation")
				.termsOfServiceUrl("http://console.nexclipper.io")
				.version(version)
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
		return () -> Optional.of(LocalDateTime.now());
	}
	
	/**
	 * <pre>
	 * Tomcat8 부터 Cookie Header를 파싱하는 기본 CookieProcessor가 RFC6265를 기반으로 하고 Domain값 맨 앞자리에 "."을 붙일 경우 "."을 제거하고 파싱하게 된다.
	 * Spring Boot에서 Embeded Tomcat을 사용 할 경우 복수의 Micro Service에서  동일한 도메인으로 쿠키가 발행되어야 하므로 Parsing 방식을 Legacy로 변경한다.
	 * 별도의 Tomcat을 사용 할 경우 <CookieProcessor className=
	"org.apache.tomcat.util.http.LegacyCookieProcessor" /> 를 context.xml에 추가한다.
	 * </pre>
	 * 
	 * @return
	 */
	@Bean
	public WebServerFactoryCustomizer<ConfigurableServletWebServerFactory> tomcatCustomizer() {
		return factory -> {
			if (factory instanceof TomcatServletWebServerFactory) {
				TomcatServletWebServerFactory tomcat = (TomcatServletWebServerFactory) factory;
				tomcat.addContextCustomizers(context -> context.setCookieProcessor(new LegacyCookieProcessor()));
			}
		};
	}
	
	@Bean
	public WebBindingInitializer webBindingInitializer() {
		return (binder) -> {
			binder.registerCustomEditor(KlevrEventType.class, new EnumParameterConverter<KlevrEventType>(KlevrEventType.class));
		};
	}
}

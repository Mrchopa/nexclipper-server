package co.kr.nexclipper.nexclipperserver;

import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.util.Locale;
import java.util.TimeZone;

import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
import org.springframework.cloud.openfeign.FeignFormatterRegistrar;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.format.datetime.standard.DateTimeFormatterRegistrar;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import feign.Response;
import feign.codec.ErrorDecoder;

@Configuration
public class FeignConfig implements Jackson2ObjectMapperBuilderCustomizer {

	@Override
	public void customize(Jackson2ObjectMapperBuilder jacksonObjectMapperBuilder) {
		jacksonObjectMapperBuilder
	        .featuresToEnable(DeserializationFeature.READ_UNKNOWN_ENUM_VALUES_AS_NULL)
	        .featuresToDisable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
	        .timeZone(TimeZone.getDefault())
	        .modulesToInstall(new JavaTimeModule())
	        .locale(Locale.getDefault())
	        .simpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
	}
	
	@Bean
    public FeignFormatterRegistrar localDateFeignFormatterRegister() {
        return registry -> {
            DateTimeFormatterRegistrar registrar = new DateTimeFormatterRegistrar();
            registrar.setUseIsoFormat(true);
            registrar.registerFormatters(registry);
        };
    }
	
	@Bean
    public FeignErrorDecode decoder() {
        return new FeignErrorDecode();
    }
	
	static public class FeignErrorDecode implements ErrorDecoder {
		private static final Logger LOG = LoggerFactory.getLogger(FeignErrorDecode.class);

		@Override
		public Exception decode(String methodKey, Response response) {
			LOG.debug("failed remote call - {}[{}], requestUrl : [{}], requestBody : [{}], responseBody : [{}]", 
					methodKey, response.status(), response.request().url(), getRequestBody(response), getResponseBody(response));
			
			throw new RuntimeException(String.format("failed remote call - {}[{}], requestUrl : [{}], responseHeader : [{}]", 
					methodKey, response.status(), response.request().url(), response.headers()));
		}
		
		private String getRequestBody(Response response) {
	        if (response.request().body() == null) {
	            return "";
	        }

	        try {
	            return new String(response.request().body(), StandardCharsets.UTF_8.name());
	        } catch (UnsupportedEncodingException e) {
	            LOG.error(String.format("feign request body converting error - response: %s", response), e);
	            return "";
	        }
	    }

	    private String getResponseBody(Response response) {
	        if (response.body() == null) {
	            return "";
	        }

	        try (InputStream responseBodyStream = response.body().asInputStream()) {
	            return IOUtils.toString(responseBodyStream, StandardCharsets.UTF_8.name());

	        } catch (IOException e) {
	            LOG.error(String.format("feign response body converting error - response: %s", response), e);
	            return "";
	        }
	    }
		
	}
}

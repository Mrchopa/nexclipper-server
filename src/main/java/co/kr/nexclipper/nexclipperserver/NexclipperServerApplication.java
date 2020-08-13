package co.kr.nexclipper.nexclipperserver;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@EnableAutoConfiguration
public class NexclipperServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(NexclipperServerApplication.class, args);
//		SpringApplication app = new SpringApplication(NexclipperServerApplication.class);
//		app.setWebApplicationType(WebApplicationType.REACTIVE);
//		app.run(args);
	}

}

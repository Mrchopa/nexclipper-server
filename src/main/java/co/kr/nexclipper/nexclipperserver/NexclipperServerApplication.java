package co.kr.nexclipper.nexclipperserver;

import java.util.TimeZone;

import javax.annotation.PostConstruct;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@EnableAutoConfiguration
public class NexclipperServerApplication {
	public static void main(String[] args) {
		SpringApplication.run(NexclipperServerApplication.class, args);
	}

	@PostConstruct
	public void setUp() {
		TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
	}
}

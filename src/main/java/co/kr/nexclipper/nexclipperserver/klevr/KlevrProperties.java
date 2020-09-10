package co.kr.nexclipper.nexclipperserver.klevr;

import java.util.Map;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "nc.klevr")
public class KlevrProperties {
	public static final String COMMAND_AGENT_INSTALL = "agent-install";
	
	private Map<String, String> command;

	public Map<String, String> getCommand() {
		return command;
	}
	
	public String getCommand(String key) {
		return command.get(key);
	}

	public void setCommand(Map<String, String> command) {
		this.command = command;
	}
}

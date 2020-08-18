package co.kr.nexclipper.nexclipperserver.remote;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import co.kr.nexclipper.nexclipperserver.remote.data.AgentGroup;

@FeignClient(value="klevr", url="${nc.remote.klevr.url}")
public interface KlevrClient {
	@PostMapping("/inner/groups")
//	@Headers("Content-Type: application/json")
	public void addGroup(AgentGroup group);
	
	@PostMapping("/inner/groups/{groupId}/apikey")
	public void addApiKey(@PathVariable("groupId") Long groupId, String apiKey);
}

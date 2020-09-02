package co.kr.nexclipper.nexclipperserver.remote.klevr;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import co.kr.nexclipper.nexclipperserver.remote.klevr.data.AgentGroup;
import co.kr.nexclipper.nexclipperserver.remote.klevr.data.KlevrAgent;

@FeignClient(value="klevr", url="${nc.remote.klevr.inner-url}")
public interface KlevrClient {
	@PostMapping("/inner/groups")
//	@Headers("Content-Type: application/json")
	public void addGroup(AgentGroup group);
	
	@PostMapping("/inner/groups/{groupId}/apikey")
	public void addApiKey(@PathVariable("groupId") Long groupId, String apiKey);
	
	@GetMapping("/inner/groups/{groupId}/agents")
	public List<KlevrAgent> getAgents(@PathVariable("groupId") Long groupId);
	
	@GetMapping("/inner/groups/{groupId}/primary")
	public KlevrAgent getPrimaryAgentKey(@PathVariable("groupId") Long groupId);
}

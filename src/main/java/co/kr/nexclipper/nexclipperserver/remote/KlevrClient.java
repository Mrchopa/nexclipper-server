package co.kr.nexclipper.nexclipperserver.remote;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;

import co.kr.nexclipper.nexclipperserver.account.AccountsZone;
import feign.Headers;

@FeignClient(value="klevr", url="${nc.remote.klevr.url}")
public interface KlevrClient {
	@PostMapping("/inner/groups")
	@Headers("Content-Type: application/json")
//	@Body("{body}")
	public void addGroup(AccountsZone group);
}

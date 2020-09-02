package co.kr.nexclipper.nexclipperserver.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import co.kr.nexclipper.nexclipperserver.RequestPathConstants;
import co.kr.nexclipper.nexclipperserver.account.AccountService;
import co.kr.nexclipper.nexclipperserver.account.entity.AccountsZone;
import co.kr.nexclipper.nexclipperserver.account.repository.AccountsZoneRepository;
import co.kr.nexclipper.nexclipperserver.klevr.KlevrService;
import co.kr.nexclipper.nexclipperserver.remote.klevr.data.KlevrAgent;
import co.kr.nexcloud.framework.security.CommonPrincipal;
import io.swagger.annotations.ApiOperation;

@RestController
@RequestMapping(RequestPathConstants.ZONES)
public class ZoneController {
	private static final Logger LOG = LoggerFactory.getLogger(ZoneController.class);
	
	@Autowired
	private AccountsZoneRepository zoneRepo;
	
	@Autowired
	private AccountService service;
	
	@Autowired
	private KlevrService klevrService;
	
	@GetMapping
	@ApiOperation(value = "전체 ZONE을 반환한다.")
	public List<AccountsZone> getZones(CommonPrincipal principal) {
		return zoneRepo.findAllByUserId(principal.getId());
	}
	
	@PostMapping
	@ApiOperation(value="ZONE을 생성한다.")
	public void addZone(@RequestBody AccountsZone zone) {
		service.createAccountsZone(zone);
	}
	
	@GetMapping("/commands/agent-install")
	@ApiOperation(value = "ZONE에 agent 설치 명령어를 반환한다.")
	public String getAgentInstallCommand(CommonPrincipal principal, @RequestParam Long zoneId) {
		return service.getAgentInstallCommand(principal.getId(), zoneId);
	}
	
	@GetMapping("/{zoneId}/agents")
	@ApiOperation(value = "ZONE의 agent 목록을 반환한다.")
	public List<KlevrAgent> getAgents(@PathVariable Long zoneId) {
		return klevrService.getAgentList(zoneId);
	}
	
	@GetMapping("/{zoneId}/agents/primary")
	@ApiOperation(value = "ZONE의 primary agent 반환한다.")
	public KlevrAgent getPrimaryAgent(@PathVariable Long zoneId) {
		return klevrService.getPrimaryAgent(zoneId);
	}
}

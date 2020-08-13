package co.kr.nexclipper.nexclipperserver.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import co.kr.nexclipper.nexclipperserver.RequestPathConstants;
import co.kr.nexclipper.nexclipperserver.account.AccountService;
import co.kr.nexclipper.nexclipperserver.account.AccountsZone;
import co.kr.nexclipper.nexclipperserver.account.AccountsZoneRepository;
import co.kr.nexcloud.framework.security.CommonPrincipal;
import co.kr.nexcloud.framework.web.HttpRuntimeException;
import io.micrometer.core.instrument.util.StringUtils;
import io.swagger.annotations.ApiOperation;

@RestController
@RequestMapping(RequestPathConstants.ZONES)
public class ZoneController {
	private static final Logger LOG = LoggerFactory.getLogger(ZoneController.class);
	
	@Autowired
	private AccountsZoneRepository zoneRepo;
	
	@Autowired
	private AccountService service;
	
	@GetMapping
	@ApiOperation(value = "전체 ZONE을 반환한다.")
	public List<AccountsZone> getZones() {
		return zoneRepo.findAllByUserId(CommonPrincipal.getPrincipal().getId());
	}
	
	@PostMapping
	@ApiOperation(value="ZONE을 생성한다.")
	public void addZone(@RequestBody AccountsZone zone) {
		service.createAccountsZone(zone);
	}
}

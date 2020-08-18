package co.kr.nexclipper.nexclipperserver.account;

import javax.transaction.Transactional;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import co.kr.nexclipper.nexclipperserver.remote.KlevrClient;
import co.kr.nexclipper.nexclipperserver.remote.data.AgentGroup;
import co.kr.nexcloud.framework.security.CommonPrincipal;
import co.kr.nexcloud.framework.web.HttpRuntimeException;

@Service
public class AccountService {
	private static final Logger LOG = LoggerFactory.getLogger(AccountService.class);
	
	@Autowired
	private AccountsZoneRepository zoneRepo;
	
	
	@Autowired
	private KlevrClient klevr;

	@Transactional
	public AccountsZone createAccountsZone(AccountsZone zone) {
		zone.setUserId(CommonPrincipal.getPrincipal().getId());
		
		LOG.debug("{}, {}", zone.getName(), zone.getPlatform());
		
		if(StringUtils.isEmpty(zone.getName())) throw new HttpRuntimeException(400, "Required fields are missing - name");
		if(StringUtils.isEmpty(zone.getPlatform())) throw new HttpRuntimeException(400, "Required fields are missing - platform");
		
		zoneRepo.saveAndFlush(zone);
		
		LOG.debug("persist zone : [{}]", zone);
		
		AgentGroup group = new AgentGroup(zone);
		
		klevr.addGroup(group);
		
		// TODO: API KEY 등록 구
//		klevr.addApiKey(zone.getId(), )
		
		return zone;
	}
}

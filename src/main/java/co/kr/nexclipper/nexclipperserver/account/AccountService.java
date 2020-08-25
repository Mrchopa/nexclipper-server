package co.kr.nexclipper.nexclipperserver.account;

import java.util.UUID;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import co.kr.nexclipper.nexclipperserver.account.entity.AccountsZone;
import co.kr.nexclipper.nexclipperserver.account.entity.ApiKeys;
import co.kr.nexclipper.nexclipperserver.account.repository.AccountsZoneRepository;
import co.kr.nexclipper.nexclipperserver.account.repository.ApiKeysRepository;
import co.kr.nexclipper.nexclipperserver.klevr.KlevrProperties;
import co.kr.nexclipper.nexclipperserver.remote.KlevrClient;
import co.kr.nexclipper.nexclipperserver.remote.RemoteProperties;
import co.kr.nexclipper.nexclipperserver.remote.data.AgentGroup;
import co.kr.nexcloud.framework.security.CommonPrincipal;
import co.kr.nexcloud.framework.web.HttpRuntimeException;

@Service
public class AccountService {
	private static final Logger LOG = LoggerFactory.getLogger(AccountService.class);
	
	@Autowired
	private AccountsZoneRepository zoneRepo;
	
	@Autowired
	private ApiKeysRepository apiKeyRepo;
	
	@Autowired
	private KlevrClient klevrClient;
	
	@Autowired
	private KlevrProperties klevrProp;
	
	@Autowired
	private RemoteProperties remoteProp;

	@Transactional
	public AccountsZone createAccountsZone(AccountsZone zone) {
		zone.setUserId(CommonPrincipal.getPrincipal().getId());
		
		LOG.debug("{}, {}", zone.getName(), zone.getPlatform());
		
		if(StringUtils.isEmpty(zone.getName())) throw new HttpRuntimeException(400, "Required fields are missing - name");
		if(StringUtils.isEmpty(zone.getPlatform())) throw new HttpRuntimeException(400, "Required fields are missing - platform");
		
		zoneRepo.saveAndFlush(zone);
		
		LOG.debug("persist zone : [{}]", zone);
		
		AgentGroup group = new AgentGroup(zone);
		
		// klevr 그룹 생성
		klevrClient.addGroup(group);
		
		// klevr API-Key 등록
		klevrClient.addApiKey(zone.getId(), apiKeyRepo.getOne(CommonPrincipal.getPrincipal().getId()).getApiKey());
		
		return zone;
	}
	
	@Transactional(noRollbackFor = DataIntegrityViolationException.class)
	public void renewAccountsApiKey(Long userId) {
		String apiKey = UUID.randomUUID().toString().replaceAll("-", "");
		
		ApiKeys a = new ApiKeys();
		a.setUserId(userId);
		a.setApiKey(apiKey);
		
		apiKeyRepo.saveAndFlush(a);
	}
	
	public String getAgentInstallCommand(Long userId, Long zoneId) {
		String apiKey = apiKeyRepo.getOne(userId).getApiKey();
		AccountsZone zone = zoneRepo.findById(zoneId).orElseThrow(() -> new HttpRuntimeException(404, "does not exist ZONE for ID - " + zoneId));
		
		String command = klevrProp.getCommand(KlevrProperties.COMMAND_AGENT_INSTALL)
									.replace("{API_KEY}", apiKey)
									.replace("{PLATFORM}", zone.getPlatform())
									.replace("{KLEVR_URL}", remoteProp.getKlevrOuterUrl())
									.replace("{ZONE_ID}", zone.getId().toString());
									
		LOG.debug("agent install command : [{}]", command);
		
		return command;
	}
}

package co.kr.nexclipper.nexclipperserver.klevr;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import co.kr.nexclipper.nexclipperserver.account.entity.AccountsZone;
import co.kr.nexclipper.nexclipperserver.account.repository.AccountsZoneRepository;
import co.kr.nexclipper.nexclipperserver.controller.data.KlevrEventDto;
import co.kr.nexclipper.nexclipperserver.controller.data.KlevrEventType;
import co.kr.nexclipper.nexclipperserver.remote.klevr.KlevrClient;
import co.kr.nexclipper.nexclipperserver.remote.klevr.data.AgentGroup;
import co.kr.nexclipper.nexclipperserver.remote.klevr.data.KlevrAgent;

@Service
public class KlevrService {
	private static final Logger LOG = LoggerFactory.getLogger(KlevrService.class);
	
	@Autowired
	private KlevrClient klevrClient;
	
	@Autowired
	private AccountsZoneRepository zoneRepo;
	
	public List<KlevrAgent> getAgentList(Long groupId) {
		return klevrClient.getAgents(groupId);
	}
	
	public KlevrAgent getPrimaryAgent(Long groupId) {
		return klevrClient.getPrimaryAgentKey(groupId);
	}
	
	public void createAgentGroup(AgentGroup group, String apiKey) {
		// klevr 그룹 생성
		klevrClient.addGroup(group);
		
		// klevr API-Key 등록
		klevrClient.addApiKey(group.getId(), apiKey);
	}
	
	@Transactional
	public void handleEvent(List<KlevrEventDto> eventList) {
		eventList.forEach(e -> {
			if(KlevrEventType.AGENT_CONNECT == e.getEventType()) handleAgentConnect(e);
			else if(KlevrEventType.AGENT_DISCONNECT == e.getEventType()) handleAgentDisconnect(e);
			else if(KlevrEventType.PRIMARY_INIT == e.getEventType()) handlePrimaryInit(e);
			else if(KlevrEventType.PRIMARY_CHANGED == e.getEventType()) handlePrimaryChanged(e);
			else if(KlevrEventType.TASK_CALLBACK == e.getEventType()) handleTaskCallback(e);
			else LOG.error("Does not exist KlevrEventType - [{}]", e);
		});
	}
	
	private void handleAgentConnect(KlevrEventDto event) {
		
	}
	
	private void handleAgentDisconnect(KlevrEventDto event) {
		
	}
	
	private void handlePrimaryInit(KlevrEventDto event) {
		LOG.debug("primary init event handle : [{}]", event);
		AccountsZone zone = zoneRepo.getOne(event.getGroupId());
		zone.setInit(true);
		zone.setDashboardUrl(event.getResult());
		
		zoneRepo.save(zone);
	}
	
	private void handlePrimaryChanged(KlevrEventDto event) {
		
	}
	
	private void handleTaskCallback(KlevrEventDto event) {
		
	}
}

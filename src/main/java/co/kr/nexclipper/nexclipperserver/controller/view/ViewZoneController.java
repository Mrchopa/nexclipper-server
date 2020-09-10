package co.kr.nexclipper.nexclipperserver.controller.view;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import co.kr.nexclipper.nexclipperserver.RequestPathConstants;
import co.kr.nexclipper.nexclipperserver.TemplatePathConstants;
import co.kr.nexclipper.nexclipperserver.account.entity.AccountsZone;
import co.kr.nexclipper.nexclipperserver.controller.AccountController;
import co.kr.nexclipper.nexclipperserver.controller.ZoneController;
import co.kr.nexclipper.nexclipperserver.remote.RemoteProperties;
import co.kr.nexclipper.nexclipperserver.remote.klevr.data.KlevrAgent;
import co.kr.nexcloud.framework.security.CommonPrincipal;

@Controller
@RequestMapping(RequestPathConstants.VIEW_ZONES)
public class ViewZoneController {
	public static final Logger LOG = LoggerFactory.getLogger(ViewZoneController.class);
	
	@Autowired
	private ZoneController restZone;
	
	@Autowired
	private AccountController restAccount;
	
	@Autowired
	private RemoteProperties remoteProp;
	
	@GetMapping("")
	public String getZones(Model model, CommonPrincipal principal) {
		Map<Long, List<KlevrAgent>> agentMap = new HashMap<>();
		Map<Long, KlevrAgent> primaryMap = new HashMap<>();
		List<AccountsZone> zoneList = restZone.getZones(principal);
		
		zoneList.forEach(z -> {
			agentMap.put(z.getId(), restZone.getAgents(z.getId()));
			primaryMap.put(z.getId(), restZone.getPrimaryAgent(z.getId()));
		});
		
		model.addAttribute("list", zoneList);
		model.addAttribute("agentMap", agentMap);
		model.addAttribute("primaryMap", primaryMap);
		model.addAttribute("myAccount", restAccount.getMyAccount(principal));
		model.addAttribute("klevrUrl", remoteProp.getKlevrOuterUrl());
		
		LOG.debug("{}", restAccount.getMyAccount(principal));
		
		return TemplatePathConstants.ZONE_VIEW;
	}
	
	@PostMapping("")
	public String addZone(@ModelAttribute AccountsZone zone) {
		restZone.addZone(zone);
		
		return "redirect:" + RequestPathConstants.VIEW_ZONES;
	}
}

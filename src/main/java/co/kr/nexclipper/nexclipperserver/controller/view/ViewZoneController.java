package co.kr.nexclipper.nexclipperserver.controller.view;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import co.kr.nexclipper.nexclipperserver.RequestPathConstants;
import co.kr.nexclipper.nexclipperserver.TemplatePathConstants;
import co.kr.nexclipper.nexclipperserver.account.entity.AccountsZone;
import co.kr.nexclipper.nexclipperserver.controller.ZoneController;

@Controller
@RequestMapping(RequestPathConstants.VIEW_ZONES)
public class ViewZoneController {
	public static final Logger LOG = LoggerFactory.getLogger(ViewZoneController.class);
	
	@Autowired
	ZoneController restZone;
	
	@GetMapping("")
	public String getZones(Model model) {
		model.addAttribute("list", restZone.getZones());
		
		return TemplatePathConstants.ZONE_VIEW;
	}
	
	@PostMapping("")
	public String addZone(@ModelAttribute AccountsZone zone) {
		restZone.addZone(zone);
		
		return "redirect:" + RequestPathConstants.VIEW_ZONES;
	}
}

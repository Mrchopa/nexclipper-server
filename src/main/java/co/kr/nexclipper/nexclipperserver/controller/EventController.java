package co.kr.nexclipper.nexclipperserver.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import co.kr.nexclipper.nexclipperserver.RequestPathConstants;
import co.kr.nexclipper.nexclipperserver.controller.data.KlevrEventDto;
import co.kr.nexclipper.nexclipperserver.klevr.KlevrService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

@RestController
@RequestMapping(RequestPathConstants.EVENTS)
@Api(value = "이벤트와 관련한 서비스를 처리하는 API 컨트롤러")
public class EventController {
	private static final Logger LOG = LoggerFactory.getLogger(EventController.class);
	
	@Autowired
	private KlevrService klevrService;
	
//	@InitBinder
//	public void dataBinding(WebDataBinder binder) {
//		binder.registerCustomEditor(KlevrEventType.class, new EnumParameterConverter<KlevrEventType>(KlevrEventType.class));
//	}
	
	@PostMapping("/klevr")
	@ApiOperation(value = "Klevr 이벤트 리스트를 수신한다.")
	public void receiveKlevrEvents(
			@ApiParam(required = true, value = "이벤트 리스트") @RequestBody List<KlevrEventDto> events) {
		LOG.debug("size : [{}], content[0] : [{}]", events.size(), events.size() > 0 ? events.get(0) : "");
		
		klevrService.handleEvent(events);
	}
	
}

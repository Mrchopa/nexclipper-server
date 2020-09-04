package co.kr.nexclipper.nexclipperserver.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import co.kr.nexclipper.nexclipperserver.RequestPathConstants;
import co.kr.nexclipper.nexclipperserver.account.entity.ApiKeys;
import co.kr.nexclipper.nexclipperserver.account.repository.ApiKeysRepository;
import co.kr.nexclipper.nexclipperserver.controller.data.AccountDto;
import co.kr.nexcloud.framework.security.CommonPrincipal;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

@RestController
@RequestMapping(RequestPathConstants.ZONES)
@Api(value = "계정과 관련한 서비스를 처리하는 API 컨트롤러")
public class AccountController {
	private static final Logger LOG = LoggerFactory.getLogger(AccountController.class);
	
	@Autowired
	private ApiKeysRepository apiKeyRepo;
	
	@GetMapping("/my")
	@ApiOperation(value = "내 계정 정보를 반환한다.")
	public AccountDto getMyAccount(
			@ApiParam(hidden = true, readOnly = true) CommonPrincipal principal) {
		ApiKeys apiKey = apiKeyRepo.getOne(principal.getId());
		
		AccountDto dto = new AccountDto();
		
		BeanUtils.copyProperties(apiKey.getUser(), dto);
		dto.setApiKey(apiKey.getApiKey());
		
		LOG.debug("dto : [{}]", dto.toString());
		
		return dto;
	}
}

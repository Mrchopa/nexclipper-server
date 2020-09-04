package co.kr.nexclipper.nexclipperserver.account;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

@ApiModel("플랫폼 열거형")
public enum Platform {
	@ApiModelProperty("baremetal 환경")
	baremetal,
	@ApiModelProperty("kubernetes 환경")
	kubernetes,
	@ApiModelProperty("AWS 환경")
	AWS;
	
	public static Platform toPlatform(String str) {
		return Platform.valueOf(str);
	}
}

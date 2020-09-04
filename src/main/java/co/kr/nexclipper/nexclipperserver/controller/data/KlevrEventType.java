package co.kr.nexclipper.nexclipperserver.controller.data;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

@ApiModel(description = "Klever에서 발생하는 이벤트 타입")
public enum KlevrEventType {
	@ApiModelProperty("Agent가 접속됨(new or inactive -> active)")
	AGENT_CONNECT,
	@ApiModelProperty("Agent 연결이 끊김(active -> inactive")
	AGENT_DISCONNECT,
	@ApiModelProperty("Primary agent의 초기화 작업이 완료됨")
	PRIMARY_INIT,
	@ApiModelProperty("Primary agent가 변경됨")
	PRIMARY_CHANGED,
	@ApiModelProperty("TASK 수행 결과가 callback됨")
	TASK_CALLBACK
}

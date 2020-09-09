package co.kr.nexclipper.nexclipperserver.controller.data;

import java.io.Serializable;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import co.kr.nexcloud.framework.commons.util.ToStringUtils;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

@ApiModel(description = "Klevr에서 발생한 event를 전달하는 DTO")
public class KlevrEventDto implements Serializable {
	private static final long serialVersionUID = 3100906367196260634L;

	@ApiModelProperty(value = "Klevr에서 발생한 event type")
	private KlevrEventType eventType;
	
	@ApiModelProperty(value = "agent ID")
	private Long agentId;
	
	@ApiModelProperty(value = "account zone ID")
	private Long groupId;
	
	@ApiModelProperty(value = "이벤트가 발생한 시간 (UTC)")
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern="yyyy-MM-dd'T'HH:mm:ss.SSSSSS'Z'")
	private LocalDateTime eventTime;
	
	@ApiModelProperty(value = "이벤트 발생 결과")
	private String result;
	
	@ApiModelProperty(value = "이벤트 발생시 출력된 로그")
	private String log;

	public KlevrEventType getEventType() {
		return eventType;
	}

//	public void setEventType(KlevrEventType eventType) {
//		this.eventType = eventType;
//	}
	
	public void setEventType(KlevrEventType eventType) {
		this.eventType = eventType;
	}

	public Long getAgentId() {
		return agentId;
	}

	public void setAgentId(Long agentId) {
		this.agentId = agentId;
	}

	public Long getGroupId() {
		return groupId;
	}

	public void setGroupId(Long groupId) {
		this.groupId = groupId;
	}

	public LocalDateTime getEventTime() {
		return eventTime;
	}

	public void setEventTime(LocalDateTime eventTime) {
		this.eventTime = eventTime;
	}

	public String getResult() {
		return result;
	}

	public void setResult(String result) {
		this.result = result;
	}

	public String getLog() {
		return log;
	}

	public void setLog(String log) {
		this.log = log;
	}
	
	@Override
	public String toString() {
		return ToStringUtils.toString(this);
	}
}

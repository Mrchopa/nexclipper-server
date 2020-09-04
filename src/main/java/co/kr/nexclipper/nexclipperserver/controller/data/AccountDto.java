package co.kr.nexclipper.nexclipperserver.controller.data;

import java.io.Serializable;
import java.time.LocalDateTime;

import co.kr.nexcloud.framework.commons.util.ToStringUtils;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

@ApiModel("계정 정보 DTO")
public class AccountDto implements Serializable {
	private static final long serialVersionUID = -9201932630452101965L;
	
	@ApiModelProperty("계정 ID")
	private Long id;
	
	@ApiModelProperty("계정 이름(nickname)")
	private String name;

	@ApiModelProperty("이메일")
	private String email;

	@ApiModelProperty("사용자 이름")
	private String firstName;

	@ApiModelProperty("사용자 성")
	private String lastName;

	@ApiModelProperty("핸드폰")
	private String mobile;

	@ApiModelProperty("사진")
	private String photo;

	@ApiModelProperty("생성일")
	private LocalDateTime createdAt;

	@ApiModelProperty("수정일")
	private LocalDateTime updatedAt;

	@ApiModelProperty("계정 API key")
	private String apiKey;
	
	@Override
	public String toString() {
		return ToStringUtils.toString(this);
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	public String getPhoto() {
		return photo;
	}

	public void setPhoto(String photo) {
		this.photo = photo;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(LocalDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}

	public String getApiKey() {
		return apiKey;
	}

	public void setApiKey(String apiKey) {
		this.apiKey = apiKey;
	}
}
